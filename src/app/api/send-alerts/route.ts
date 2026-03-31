import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase";
import { buildAlertEmail } from "@/lib/email-template";
import type { PredictionWithDetails, BonusWithDetails } from "@/lib/types";

const BATCH_SIZE = 50; // Resend batch limit
const MIN_PROBABILITY_THRESHOLD = 0.3; // Only send if there are predictions above 30%
const FROM_ADDRESS = "alerts@pointsforecast.com"; // Update after domain verification

export async function GET(request: NextRequest) {
  // Verify cron secret — protects against unauthorized triggers
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 503 }
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    // Fetch predictions with partner/issuer details
    const { data: predictions, error: predErr } = await supabase
      .from("predictions")
      .select(
        `
        id, issuer_id, partner_id,
        probability_30d, probability_60d,
        predicted_bonus_min, predicted_bonus_max,
        median_interval_days, days_since_last,
        total_historical_bonuses, seasonality_score,
        confidence, reasoning, computed_at,
        issuer:issuers!inner(id, name, short_name, slug, currency_name, created_at),
        partner:partners!inner(id, name, short_name, slug, type, alliance, created_at)
      `
      )
      .eq("partner.type", "airline")
      .order("probability_30d", { ascending: false });

    if (predErr) {
      console.error("Error fetching predictions:", predErr);
      return NextResponse.json(
        { error: "Failed to fetch predictions" },
        { status: 500 }
      );
    }

    const allPredictions = (predictions as unknown as PredictionWithDetails[]) ?? [];

    // Check if there's anything worth sending
    const highProbCount = allPredictions.filter(
      (p) => !p.reasoning.active_bonus && p.probability_30d > MIN_PROBABILITY_THRESHOLD
    ).length;

    // Fetch active bonuses
    const today = new Date().toISOString().split("T")[0];
    const { data: bonuses, error: bonusErr } = await supabase
      .from("bonuses")
      .select(
        `
        id, issuer_id, partner_id,
        bonus_percentage, start_date, end_date,
        is_targeted, source, notes, created_at,
        issuer:issuers!inner(id, name, short_name, slug, currency_name, created_at),
        partner:partners!inner(id, name, short_name, slug, type, alliance, created_at)
      `
      )
      .lte("start_date", today)
      .or(`end_date.gte.${today},end_date.is.null`)
      .order("bonus_percentage", { ascending: false });

    if (bonusErr) {
      console.error("Error fetching bonuses:", bonusErr);
    }

    const activeBonuses = (bonuses as unknown as BonusWithDetails[]) ?? [];

    // If nothing interesting to report, skip sending
    if (highProbCount === 0 && activeBonuses.length === 0) {
      return NextResponse.json({
        sent: 0,
        skipped: true,
        reason: "No predictions above threshold and no active bonuses",
      });
    }

    // Fetch confirmed subscribers with preferences
    // Cast needed: email_subscribers type doesn't fully satisfy supabase-js generics
    const { data: rawSubscribers, error: subErr } = await supabase
      .from("email_subscribers")
      .select("id, email, issuer_preferences")
      .eq("confirmed" as never, true);

    const subscribers = rawSubscribers as { id: string; email: string; issuer_preferences: { issuers?: string[]; partners?: string[] } | null }[] | null;

    if (subErr) {
      console.error("Error fetching subscribers:", subErr);
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        sent: 0,
        skipped: true,
        reason: "No confirmed subscribers",
      });
    }

    // Send emails in batches
    const resend = new Resend(resendKey);
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const sends = batch.map(async (subscriber) => {
        // Filter predictions and bonuses by subscriber preferences
        const prefs = subscriber.issuer_preferences;
        const issuerFilter = prefs?.issuers?.length ? new Set(prefs.issuers) : null;
        const partnerFilter = prefs?.partners?.length ? new Set(prefs.partners) : null;

        const subPredictions = allPredictions.filter((p) => {
          if (issuerFilter && !issuerFilter.has(p.issuer.slug)) return false;
          if (partnerFilter && !partnerFilter.has(p.partner.slug)) return false;
          return true;
        });

        const subBonuses = activeBonuses.filter((b) => {
          if (issuerFilter && !issuerFilter.has(b.issuer.slug)) return false;
          if (partnerFilter && !partnerFilter.has(b.partner.slug)) return false;
          return true;
        });

        // Skip if nothing relevant for this subscriber
        const relevantPredictions = subPredictions.filter(
          (p) => !p.reasoning.active_bonus && p.probability_30d > MIN_PROBABILITY_THRESHOLD
        );
        if (relevantPredictions.length === 0 && subBonuses.length === 0) {
          return true; // Not a failure, just skipped
        }

        const { subject, html } = buildAlertEmail({
          predictions: subPredictions,
          activeBonuses: subBonuses,
          subscriberEmail: subscriber.email,
        });

        try {
          await resend.emails.send({
            from: `PointsForecast <${FROM_ADDRESS}>`,
            to: subscriber.email,
            subject,
            html,
          });
          return true;
        } catch (err) {
          console.error(`Failed to send to ${subscriber.email}:`, err);
          return false;
        }
      });

      const results = await Promise.all(sends);
      totalSent += results.filter(Boolean).length;
      totalFailed += results.filter((r) => !r).length;
    }

    return NextResponse.json({
      sent: totalSent,
      failed: totalFailed,
      activeBonuses: activeBonuses.length,
      predictions: highProbCount,
    });
  } catch (err) {
    console.error("Send alerts error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
