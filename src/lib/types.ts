// Database types — generated from schema, keep in sync with migrations

export type Database = {
  public: {
    Tables: {
      issuers: {
        Row: Issuer;
        Insert: Omit<Issuer, "id" | "created_at">;
        Update: Partial<Omit<Issuer, "id" | "created_at">>;
      };
      partners: {
        Row: Partner;
        Insert: Omit<Partner, "id" | "created_at">;
        Update: Partial<Omit<Partner, "id" | "created_at">>;
      };
      bonuses: {
        Row: Bonus;
        Insert: Omit<Bonus, "id" | "created_at">;
        Update: Partial<Omit<Bonus, "id" | "created_at">>;
      };
      predictions: {
        Row: Prediction;
        Insert: Omit<Prediction, "id">;
        Update: Partial<Omit<Prediction, "id">>;
      };
    };
  };
};

export interface Issuer {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  currency_name: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  type: "airline" | "hotel";
  alliance: string | null;
  created_at: string;
}

export interface Bonus {
  id: string;
  issuer_id: string;
  partner_id: string;
  bonus_percentage: number;
  start_date: string;
  end_date: string | null;
  is_targeted: boolean;
  source: string | null;
  notes: string | null;
  created_at: string;
}

export interface Prediction {
  id: string;
  issuer_id: string;
  partner_id: string;
  probability_30d: number;
  probability_60d: number;
  predicted_bonus_min: number;
  predicted_bonus_max: number;
  median_interval_days: number;
  days_since_last: number;
  total_historical_bonuses: number;
  seasonality_score: number;
  confidence: "high" | "medium" | "low";
  reasoning: PredictionReasoning;
  computed_at: string;
}

export interface PredictionReasoning {
  interval_analysis: {
    median_days: number;
    mean_days: number;
    min_days: number;
    max_days: number;
    stddev_days: number;
  };
  seasonality: {
    monthly_frequency: number[]; // 12 values, index 0 = Jan
    current_month_score: number; // 0-1
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

// Joined types for the frontend
export interface PredictionWithDetails extends Prediction {
  issuer: Issuer;
  partner: Partner;
}

export interface BonusWithDetails extends Bonus {
  issuer: Issuer;
  partner: Partner;
}
