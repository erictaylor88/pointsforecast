import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface BonusRow {
  id: string;
  issuer_id: string;
  partner_id: string;
  bonus_percentage: number;
  start_date: string;
  end_date: string | null;
  is_targeted: boolean;
}

interface PredictionReasoning {
  interval_analysis: {
    median_days: number;
    mean_days: number;
    min_days: number;
    max_days: number;
    stddev_days: number;
  };
  seasonality: {
    monthly_frequency: number[];
    current_month_score: number;
  };
  magnitude_trend: {
    direction: "increasing" | "decreasing" | "stable";
    recent_avg: number;
    historical_avg: number;
  };
  active_bonus: boolean;
  data_points: number;
  last_bonus_date: string | null;
  last_bonus_percentage: number | null;
}

// ── Helpers ──────────────────────────────────────────────

function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
  return Math.round(Math.sqrt(variance));
}

// ── Prediction Logic ────────────────────────────────────

function computePrediction(
  bonuses: BonusRow[],
  today: Date
) {
  const sorted = [...bonuses].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const todayStr = today.toISOString().split("T")[0];
  const currentMonth = today.getMonth();

  // ── 1. Recurrence intervals ──
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(daysBetween(sorted[i - 1].start_date, sorted[i].start_date));
  }

  const medianInterval = median(intervals);
  const meanInterval = mean(intervals);
  const minInterval = intervals.length > 0 ? Math.min(...intervals) : 0;
  const maxInterval = intervals.length > 0 ? Math.max(...intervals) : 0;
  const stddevInterval = stddev(intervals);

  // ── 2. Days since last bonus ──
  const lastBonus = sorted[sorted.length - 1];
  const lastEndDate = lastBonus.end_date || lastBonus.start_date;
  const daysSinceLast = daysBetween(lastEndDate, todayStr);

  // ── 3. Active bonus check ──
  const isActive = sorted.some((b) => {
    const end = b.end_date || b.start_date;
    return b.start_date <= todayStr && end >= todayStr;
  });

  // ── 4. Seasonality ──
  const monthCounts = new Array(12).fill(0);
  for (const b of sorted) {
    const month = new Date(b.start_date).getMonth();
    monthCounts[month]++;
  }
  const maxMonthCount = Math.max(...monthCounts, 1);
  const monthlyFrequency = monthCounts.map(
    (c: number) => Math.round((c / maxMonthCount) * 100) / 100
  );
  const nextMonth = (currentMonth + 1) % 12;
  const seasonalityScore =
    Math.round(
      ((monthlyFrequency[currentMonth] + monthlyFrequency[nextMonth]) / 2) * 100
    ) / 100;

  // ── 5. Magnitude trend ──
  const percentages = sorted.map((b) => b.bonus_percentage);
  const recentCount = Math.max(1, Math.ceil(percentages.length / 3));
  const recentAvg = mean(percentages.slice(-recentCount));
  const historicalAvg = mean(percentages);
  let direction: "increasing" | "decreasing" | "stable" = "stable";
  if (recentAvg > historicalAvg * 1.1) direction = "increasing";
  else if (recentAvg < historicalAvg * 0.9) direction = "decreasing";

  // ── 6. Predicted bonus range ──
  const sortedPcts = [...percentages].sort((a, b) => a - b);
  const predictedMin = sortedPcts[0];
  const predictedMax = sortedPcts[sortedPcts.length - 1];

  // ── 7. Confidence ──
  const dataPoints = sorted.length;
  let confidence: "high" | "medium" | "low";
  if (dataPoints >= 8) confidence = "high";
  else if (dataPoints >= 4) confidence = "medium";
  else confidence = "low";

  // ── 8. Probability calculation ──
  let prob30d: number;
  let prob60d: number;

  if (isActive) {
    // Hard override: active bonus = no new bonus expected in 30d
    prob30d = 0;
    prob60d = 0.05;
  } else if (medianInterval === 0) {
    prob30d = 0.5;
    prob60d = 0.6;
  } else {
    // Sigmoid: probability rises as daysSinceLast approaches/exceeds medianInterval
    const spread = Math.max(stddevInterval, medianInterval * 0.3, 30);
    const overdue30 = (daysSinceLast + 15 - medianInterval) / spread;
    const overdue60 = (daysSinceLast + 45 - medianInterval) / spread;

    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    let base30 = sigmoid(overdue30);
    let base60 = sigmoid(overdue60);

    // Seasonality modifier (±20%)
    const seasonalMod = 1 + (seasonalityScore - 0.5) * 0.4;
    base30 *= seasonalMod;
    base60 *= seasonalMod;

    // Bayesian confidence dampening toward base rates
    const baseRate30d = 0.3;
    const baseRate60d = 0.4;
    const confWeight = Math.min(dataPoints / 10, 1);
    prob30d = base30 * confWeight + baseRate30d * (1 - confWeight);
    prob60d = base60 * confWeight + baseRate60d * (1 - confWeight);

    // Clamp to [0.02, 0.95]
    prob30d = Math.max(0.02, Math.min(0.95, prob30d));
    prob60d = Math.max(0.02, Math.min(0.95, prob60d));
  }

  // Round to 2 decimal places
  prob30d = Math.round(prob30d * 100) / 100;
  prob60d = Math.round(Math.max(prob60d, prob30d) * 100) / 100;

  // ── Build reasoning ──
  const reasoning: PredictionReasoning = {
    interval_analysis: {
      median_days: medianInterval,
      mean_days: meanInterval,
      min_days: minInterval,
      max_days: maxInterval,
      stddev_days: stddevInterval,
    },
    seasonality: {
      monthly_frequency: monthlyFrequency,
      current_month_score: seasonalityScore,
    },
    magnitude_trend: {
      direction,
      recent_avg: recentAvg,
      historical_avg: historicalAvg,
    },
    active_bonus: isActive,
    data_points: dataPoints,
    last_bonus_date: lastEndDate,
    last_bonus_percentage: lastBonus.bonus_percentage,
  };

  return {
    probability_30d: prob30d,
    probability_60d: prob60d,
    predicted_bonus_min: predictedMin,
    predicted_bonus_max: predictedMax,
    median_interval_days: medianInterval,
    days_since_last: Math.max(0, daysSinceLast),
    total_historical_bonuses: dataPoints,
    seasonality_score: seasonalityScore,
    confidence,
    reasoning,
  };
}

// ── Main Handler ────────────────────────────────────────

Deno.serve(async (_req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const today = new Date();

    // Fetch all bonuses
    const { data: bonuses, error: bonusError } = await supabase
      .from("bonuses")
      .select(
        "id, issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted"
      )
      .order("start_date", { ascending: true });

    if (bonusError)
      throw new Error(`Failed to fetch bonuses: ${bonusError.message}`);
    if (!bonuses || bonuses.length === 0) {
      return new Response(
        JSON.stringify({ message: "No bonus data found", predictions: 0 }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Group bonuses by issuer-partner pair
    const grouped = new Map<string, BonusRow[]>();
    for (const b of bonuses) {
      const key = `${b.issuer_id}|${b.partner_id}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(b as BonusRow);
    }

    // Compute predictions for pairs with >= 2 bonuses
    const predictions: Array<Record<string, unknown>> = [];
    let skipped = 0;

    for (const [key, pairBonuses] of grouped) {
      if (pairBonuses.length < 2) {
        skipped++;
        continue;
      }

      const [issuerId, partnerId] = key.split("|");
      const result = computePrediction(pairBonuses, today);

      predictions.push({
        issuer_id: issuerId,
        partner_id: partnerId,
        ...result,
        computed_at: today.toISOString(),
      });
    }

    // Upsert predictions
    if (predictions.length > 0) {
      const { error: upsertError } = await supabase
        .from("predictions")
        .upsert(predictions, { onConflict: "issuer_id,partner_id" });

      if (upsertError)
        throw new Error(`Failed to upsert predictions: ${upsertError.message}`);
    }

    const summary = {
      message: "Predictions computed successfully",
      computed_at: today.toISOString(),
      total_pairs: grouped.size,
      predictions_written: predictions.length,
      pairs_skipped_insufficient_data: skipped,
    };

    console.log(JSON.stringify(summary));

    return new Response(JSON.stringify(summary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Prediction engine error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
