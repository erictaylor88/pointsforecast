"use client";

import { useState, useMemo } from "react";
import type {
  Issuer,
  PredictionWithDetails,
  BonusWithDetails,
} from "@/lib/types";
import { IssuerFilter } from "@/components/dashboard/IssuerFilter";
import { LiveBonusCard } from "@/components/dashboard/LiveBonusCard";
import { PredictionCard } from "@/components/predictions/PredictionCard";

interface DashboardProps {
  issuers: Issuer[];
  predictions: PredictionWithDetails[];
  activeBonuses: BonusWithDetails[];
  computedAt: string | null;
}

type SortMode = "probability" | "soonest" | "recent";

export function Dashboard({
  issuers,
  predictions,
  activeBonuses,
  computedAt,
}: DashboardProps) {
  // Start with all issuers active
  const [activeIssuers, setActiveIssuers] = useState<Set<string>>(
    () => new Set(issuers.map((i) => i.id))
  );
  const [sortMode, setSortMode] = useState<SortMode>("probability");

  const handleToggle = (issuerId: string) => {
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
  };

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
            <div className="flex-1">
              <h1 className="font-display text-display text-text-primary">
                PointsForecast
              </h1>
              <p className="text-body text-text-secondary mt-1">
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

        {/* Forecast Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h2 className="font-display text-h1 text-text-primary">
              Forecast
            </h2>

            {/* Sort control */}
            <div className="sm:ml-auto flex items-center gap-1 bg-bg-subtle rounded-lg p-0.5">
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

          {filteredPredictions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPredictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-body-medium text-text-secondary">
                No forecasts match your filters.
              </p>
              <p className="text-caption text-text-tertiary mt-1">
                Try selecting an issuer above.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-12">
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
