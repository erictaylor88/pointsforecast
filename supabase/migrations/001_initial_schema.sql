-- PointsForecast: Initial Schema
-- Tables: issuers, partners, bonuses, predictions
-- Created: 2026-03-30

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- ISSUERS — Credit card programs that offer transfer bonuses
-- ============================================================
create table public.issuers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  short_name text not null,
  slug text not null unique,
  currency_name text not null,
  created_at timestamptz not null default now()
);

comment on table public.issuers is 'Credit card programs that offer transfer bonuses (Chase UR, Amex MR, etc.)';

-- ============================================================
-- PARTNERS — Airlines and hotels that receive transferred points
-- ============================================================
create table public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  short_name text not null,
  slug text not null unique,
  type text not null check (type in ('airline', 'hotel')),
  alliance text,
  created_at timestamptz not null default now()
);

comment on table public.partners is 'Airlines and hotels that receive transferred points';

-- ============================================================
-- BONUSES — Every historical transfer bonus event
-- ============================================================
create table public.bonuses (
  id uuid primary key default uuid_generate_v4(),
  issuer_id uuid not null references public.issuers(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  bonus_percentage integer not null check (bonus_percentage > 0),
  start_date date not null,
  end_date date,
  is_targeted boolean not null default false,
  source text,
  notes text,
  created_at timestamptz not null default now()
);

comment on table public.bonuses is 'Every historical transfer bonus event';

-- Indexes for common query patterns
create index idx_bonuses_issuer on public.bonuses(issuer_id);
create index idx_bonuses_partner on public.bonuses(partner_id);
create index idx_bonuses_issuer_partner on public.bonuses(issuer_id, partner_id);
create index idx_bonuses_start_date on public.bonuses(start_date desc);
create index idx_bonuses_end_date on public.bonuses(end_date desc nulls first);

-- ============================================================
-- PREDICTIONS — Cached output from the prediction engine
-- ============================================================
create table public.predictions (
  id uuid primary key default uuid_generate_v4(),
  issuer_id uuid not null references public.issuers(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  probability_30d numeric not null check (probability_30d >= 0 and probability_30d <= 1),
  probability_60d numeric not null check (probability_60d >= 0 and probability_60d <= 1),
  predicted_bonus_min integer not null,
  predicted_bonus_max integer not null,
  median_interval_days integer not null,
  days_since_last integer not null,
  total_historical_bonuses integer not null,
  seasonality_score numeric not null check (seasonality_score >= 0 and seasonality_score <= 1),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  reasoning jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now(),
  -- One prediction per issuer-partner pair (upsert on recompute)
  unique(issuer_id, partner_id)
);

comment on table public.predictions is 'Cached prediction engine output, recomputed daily';

create index idx_predictions_issuer on public.predictions(issuer_id);
create index idx_predictions_probability on public.predictions(probability_30d desc);
create index idx_predictions_computed on public.predictions(computed_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- All tables are read-only for anon users (public dashboard).
-- Write access is restricted to service_role (Edge Functions, admin).
-- ============================================================

alter table public.issuers enable row level security;
alter table public.partners enable row level security;
alter table public.bonuses enable row level security;
alter table public.predictions enable row level security;

-- Anon read access
create policy "Allow public read on issuers"
  on public.issuers for select
  to anon, authenticated
  using (true);

create policy "Allow public read on partners"
  on public.partners for select
  to anon, authenticated
  using (true);

create policy "Allow public read on bonuses"
  on public.bonuses for select
  to anon, authenticated
  using (true);

create policy "Allow public read on predictions"
  on public.predictions for select
  to anon, authenticated
  using (true);

-- Service role has full access by default (bypasses RLS)
-- No additional policies needed for writes
