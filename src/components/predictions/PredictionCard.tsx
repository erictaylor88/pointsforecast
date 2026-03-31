"use client";

import { useState } from "react";
import type { PredictionWithDetails } from "@/lib/types";
import { ProbabilityGauge } from "@/components/ui/ProbabilityGauge";
import { IssuerBadge } from "@/components/ui/IssuerBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { SeasonalityHeatmap } from "@/components/ui/SeasonalityHeatmap";

interface PredictionCardProps {
  prediction: PredictionWithDetails;
}

const issuerBorderColors: Record<string, string> = {
  "chase-ur": "border-l-chase",
  "amex-mr": "border-l-amex",
  "capital-one": "border-l-capital-one",
};

function formatDays(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 365) return `${days}d`;
  const months = Math.round(days / 30);
  return `${months}mo`;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const borderColor =
    issuerBorderColors[prediction.issuer.slug] ?? "border-l-border-default";

  const { reasoning } = prediction;
  const currentMonth = new Date().getMonth();

  return (
    <div
      className={`
        bg-bg-surface border border-border-default rounded-card shadow-card
        border-l-4 ${borderColor}
        transition-shadow duration-200 ease-out
        hover:shadow-card-hover hover:-translate-y-px
      `}
    >
      {/* Main card content */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left p-4 sm:p-6 cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Probability gauge — desktop */}
          <div className="flex-shrink-0 hidden sm:flex flex-col items-center">
            <ProbabilityGauge probability={prediction.probability_30d} />
            <span className="text-[10px] text-text-tertiary mt-1 tracking-wide">
              30-DAY
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row: partner + issuer */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-h2 text-text-primary truncate">
                {prediction.partner.short_name}
              </h3>
              <IssuerBadge
                slug={prediction.issuer.slug}
                shortName={prediction.issuer.short_name}
              />
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 sm:gap-4 mt-3">
              {/* Mobile gauge */}
              <div className="sm:hidden flex-shrink-0 flex flex-col items-center">
                <ProbabilityGauge
                  probability={prediction.probability_30d}
                  size={48}
                />
                <span className="text-[9px] text-text-tertiary mt-0.5 tracking-wide">
                  30-DAY
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                {/* Predicted range */}
                {prediction.predicted_bonus_min > 0 && (
                  <div>
                    <span className="text-caption text-text-tertiary block leading-tight">
                      Expected
                    </span>
                    <span className="font-mono text-data-sm text-text-primary">
                      {prediction.predicted_bonus_min === prediction.predicted_bonus_max
                        ? `${prediction.predicted_bonus_min}%`
                        : `${prediction.predicted_bonus_min}–${prediction.predicted_bonus_max}%`}
                    </span>
                  </div>
                )}

                {/* Days since last */}
                <div>
                  <span className="text-caption text-text-tertiary block leading-tight">
                    Last bonus
                  </span>
                  <span className="font-mono text-data-sm text-text-primary">
                    {prediction.days_since_last > 0
                      ? `${formatDays(prediction.days_since_last)} ago`
                      : "Active now"}
                  </span>
                </div>

                {/* Median interval */}
                <div>
                  <span className="text-caption text-text-tertiary block leading-tight">
                    Avg interval
                  </span>
                  <span className="font-mono text-data-sm text-text-primary">
                    {formatDays(prediction.median_interval_days)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: confidence + data points + expand hint */}
            <div className="flex items-center gap-2 sm:gap-3 mt-3">
              <ConfidenceBadge confidence={prediction.confidence} />
              <span className="text-caption text-text-tertiary">
                {prediction.total_historical_bonuses} bonus
                {prediction.total_historical_bonuses !== 1 ? "es" : ""}
              </span>
              <span className="ml-auto text-caption text-text-tertiary flex items-center gap-1">
                <span className="hidden xs:inline">
                  {expanded ? "Hide" : "Show"} reasoning
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded reasoning panel — animated */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="bg-bg-subtle rounded-lg p-3 sm:p-4 border border-border-subtle space-y-4">
              <h4 className="font-display text-h3 text-text-primary">
                Why this forecast
              </h4>

              {/* Interval analysis */}
              <div>
                <span className="text-label text-text-secondary block mb-1">
                  Recurrence Pattern
                </span>
                <p className="text-body text-text-primary">
                  This pair averages a bonus every{" "}
                  <span className="font-mono font-medium">
                    {Math.round(reasoning.interval_analysis.mean_days)}
                  </span>{" "}
                  days (median{" "}
                  <span className="font-mono font-medium">
                    {reasoning.interval_analysis.median_days}
                  </span>
                  ). Range:{" "}
                  <span className="font-mono">
                    {reasoning.interval_analysis.min_days}
                  </span>
                  –
                  <span className="font-mono">
                    {reasoning.interval_analysis.max_days}
                  </span>{" "}
                  days between bonuses. It&apos;s been{" "}
                  <span className="font-mono font-medium">
                    {prediction.days_since_last}
                  </span>{" "}
                  days since the last one ended.
                </p>
              </div>

              {/* Seasonality */}
              <div>
                <span className="text-label text-text-secondary block mb-2">
                  Seasonality (bonuses by month)
                </span>
                <div className="overflow-x-auto -mx-1 px-1">
                  <SeasonalityHeatmap
                    monthlyFrequency={reasoning.seasonality.monthly_frequency}
                    currentMonth={currentMonth}
                  />
                </div>
                <p className="text-caption text-text-tertiary mt-1.5">
                  Current month score:{" "}
                  <span className="font-mono">
                    {Math.round(reasoning.seasonality.current_month_score * 100)}%
                  </span>
                  {reasoning.seasonality.current_month_score > 0.5
                    ? " — historically active month"
                    : reasoning.seasonality.current_month_score > 0.2
                      ? " — moderate historical activity"
                      : " — lower historical activity"}
                </p>
              </div>

              {/* Magnitude trend */}
              <div>
                <span className="text-label text-text-secondary block mb-1">
                  Bonus Size Trend
                </span>
                <p className="text-body text-text-primary">
                  Recent average:{" "}
                  <span className="font-mono font-medium">
                    {Math.round(reasoning.magnitude_trend.recent_avg)}%
                  </span>
                  . Historical average:{" "}
                  <span className="font-mono font-medium">
                    {Math.round(reasoning.magnitude_trend.historical_avg)}%
                  </span>
                  .{" "}
                  {reasoning.magnitude_trend.direction === "increasing"
                    ? "Bonuses have been trending larger."
                    : reasoning.magnitude_trend.direction === "decreasing"
                      ? "Bonuses have been trending smaller."
                      : "Bonus sizes have been relatively stable."}
                </p>
              </div>

              {/* 60-day outlook */}
              <div className="pt-2 border-t border-border-subtle">
                <span className="text-caption text-text-tertiary">
                  60-day outlook:{" "}
                  <span className="font-mono font-medium text-text-secondary">
                    {Math.round(prediction.probability_60d * 100)}%
                  </span>{" "}
                  likelihood
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
