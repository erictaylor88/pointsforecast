"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type {
  Issuer,
  PredictionWithDetails,
  BonusWithDetails,
} from "@/lib/types";
import { IssuerFilter } from "@/components/dashboard/IssuerFilter";
import { LiveBonusCard } from "@/components/dashboard/LiveBonusCard";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { EmailSignup } from "@/components/dashboard/EmailSignup";

interface DashboardProps {
  issuers: Issuer[];
  predictions: PredictionWithDetails[];
  activeBonuses: BonusWithDetails[];
  computedAt: string | null;
}

type SortMode = "probability" | "soonest" | "recent";

function parseHashIssuers(
  hash: string,
  issuers: Issuer[]
): Set<string> | null {
  if (!hash) return null;
  const slugs = hash
    .replace("#", "")
    .split(",")
    .filter(Boolean);
  if (slugs.length === 0) return null;
  const ids = slugs
    .map((slug) => issuers.find((i) => i.slug === slug)?.id)
    .filter(Boolean) as string[];
  return ids.length > 0 ? new Set(ids) : null;
}

export function Dashboard({
  issuers,
  predictions,
  activeBonuses,
  computedAt,
}: DashboardProps) {
  // Initialize from URL hash or default to all
  const [activeIssuers, setActiveIssuers] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const fromHash = parseHashIssuers(window.location.hash, issuers);
      if (fromHash) return fromHash;
    }
    return new Set(issuers.map((i) => i.id));
  });
  const [sortMode, setSortMode] = useState<SortMode>("probability");

  // Sync URL hash when filter changes
  useEffect(() => {
    const allActive = activeIssuers.size === issuers.length;
    if (allActive) {
      history.replaceState(null, "", window.location.pathname);
    } else {
      const slugs = issuers
        .filter((i) => activeIssuers.has(i.id))
        .map((i) => i.slug)
        .join(",");
      history.replaceState(null, "", `#${slugs}`);
    }
  }, [activeIssuers, issuers]);

  const handleToggle = useCallback((issuerId: string) => {
    setActiveIssuers((prev) => {
      const next = new Set(prev);
      if (next.has(issuerId)) {
        // Don't allow deselecting all
        if (next.size > 1) {
          next.delete(issuerId);
        }
      } else {
        next.add(issuerId);
      }
      return next;
    });
  }, []);

  const filteredBonuses = useMemo(
    () => activeBonuses.filter((b) => activeIssuers.has(b.issuer_id)),
    [activeBonuses, activeIssuers]
  );

  const filteredPredictions = useMemo(() => {
    const filtered = predictions.filter(
      (p) => activeIssuers.has(p.issuer_id) && !p.reasoning.active_bonus
    );

    return [...filtered].sort((a, b) => {
      switch (sortMode) {
        case "probability":
          return b.probability_30d - a.probability_30d;
        case "soonest":
          // Lower (days_since_last / median_interval) ratio = less overdue
          // Higher ratio = more overdue = sooner expected
          const ratioA =
            a.median_interval_days > 0
              ? a.days_since_last / a.median_interval_days
              : 0;
          const ratioB =
            b.median_interval_days > 0
              ? b.days_since_last / b.median_interval_days
              : 0;
          return ratioB - ratioA;
        case "recent":
          return a.days_since_last - b.days_since_last;
        default:
          return 0;
      }
    });
  }, [predictions, activeIssuers, sortMode]);

  const hasActiveBonuses = filteredBonuses.length > 0;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="w-full border-b border-border-subtle bg-bg-surface/80 backdrop-blur-sm">
        <div className="max-w-content mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-display text-text-primary">
                PointsForecast
              </h1>
              <p className="text-body text-text-secondary mt-0.5 hidden sm:block">
                Know when to transfer — and when to wait.
              </p>
            </div>
            <IssuerFilter
              issuers={issuers}
              activeIssuers={activeIssuers}
              onToggle={handleToggle}
            />
          </div>
        </div>
      </header>

      <main className="max-w-content mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
        {/* Live Bonuses Section */}
        {hasActiveBonuses && (
          <section className="mb-10 sm:mb-12">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <h2 className="font-display text-h1 text-text-primary">
                Active Bonuses
              </h2>
              <span className="inline-flex items-center h-5 px-2 rounded bg-signal-active-bg text-signal-active text-caption font-medium">
                {filteredBonuses.length}
              </span>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBonuses.map((bonus) => (
                <LiveBonusCard key={bonus.id} bonus={bonus} />
              ))}
            </div>
          </section>
        )}

        {/* Subtle divider between sections */}
        {hasActiveBonuses && (
          <div className="border-t border-border-subtle mb-8 sm:mb-10" />
        )}

        {/* Forecast Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h2 className="font-display text-h1 text-text-primary">
              Forecast
            </h2>
            {filteredPredictions.length > 0 && (
              <span className="inline-flex items-center h-5 px-2 rounded bg-bg-subtle text-text-secondary text-caption font-medium">
                {filteredPredictions.length}
              </span>
            )}

            {/* Sort control — dropdown on mobile, segmented on desktop */}
            <div className="sm:ml-auto">
              {/* Mobile dropdown */}
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="sm:hidden w-full h-9 px-3 rounded-lg bg-bg-subtle border border-border-default text-caption text-text-primary appearance-none cursor-pointer"
              >
                <option value="probability">Highest likelihood</option>
                <option value="soonest">Most overdue</option>
                <option value="recent">Most recent</option>
              </select>

              {/* Desktop segmented control */}
              <div className="hidden sm:flex items-center gap-1 bg-bg-subtle rounded-lg p-0.5">
              {[
                { key: "probability" as SortMode, label: "Highest likelihood" },
                { key: "soonest" as SortMode, label: "Most overdue" },
                { key: "recent" as SortMode, label: "Most recent" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortMode(key)}
                  className={`
                    px-3 py-1.5 rounded-md text-caption transition-all duration-150 cursor-pointer
                    ${
                      sortMode === key
                        ? "bg-bg-surface text-text-primary shadow-sm"
                        : "text-text-tertiary hover:text-text-secondary"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
              </div>
            </div>
          </div>

          {filteredPredictions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPredictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-subtle mb-4">
                <svg className="w-6 h-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
              </div>
              <p className="text-body-medium text-text-secondary">
                No forecasts match your filters.
              </p>
              <p className="text-caption text-text-tertiary mt-1">
                Try selecting a different issuer above.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Email Signup */}
      <section className="border-t border-border-subtle mt-12">
        <div className="max-w-content mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-12">
          <EmailSignup />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle">
        <div className="max-w-content mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-caption text-text-tertiary">
            <span>
              Predictions updated{" "}
              {computedAt
                ? new Date(computedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              Based on {predictions.length} issuer–partner pairs across{" "}
              {issuers.length} programs
            </span>
          </div>
          <p className="text-caption text-text-tertiary mt-2">
            Historical data sourced from public records. Predictions are
            statistical estimates, not guarantees. Transfer bonus availability is
            determined by each issuer.
          </p>
        </div>
      </footer>
    </div>
  );
}
