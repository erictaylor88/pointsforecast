import { getSupabase } from "@/lib/supabase";
import type {
  Issuer,
  PredictionWithDetails,
  BonusWithDetails,
} from "@/lib/types";

export async function getIssuers(): Promise<Issuer[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("issuers")
    .select("id, name, short_name, slug, currency_name, created_at")
    .order("short_name");

  if (error) {
    console.error("Error fetching issuers:", error);
    return [];
  }
  return data ?? [];
}

export async function getPredictions(): Promise<PredictionWithDetails[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
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

  if (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }

  // Supabase returns joined data as objects, type-cast accordingly
  return (data as unknown as PredictionWithDetails[]) ?? [];
}

export async function getActiveBonuses(): Promise<BonusWithDetails[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
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

  if (error) {
    console.error("Error fetching active bonuses:", error);
    return [];
  }

  return (data as unknown as BonusWithDetails[]) ?? [];
}
