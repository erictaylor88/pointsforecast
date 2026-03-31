import type { BonusWithDetails } from "@/lib/types";
import { IssuerBadge } from "@/components/ui/IssuerBadge";

interface LiveBonusCardProps {
  bonus: BonusWithDetails;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysRemaining(endDate: string | null): { text: string; urgent: boolean; critical: boolean } | null {
  if (!endDate) return null;
  const end = new Date(endDate + "T23:59:59");
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return { text: "Ends today", urgent: true, critical: true };
  if (diff === 1) return { text: "1 day left", urgent: true, critical: true };
  if (diff <= 3) return { text: `${diff} days left`, urgent: true, critical: false };
  return { text: `${diff} days left`, urgent: false, critical: false };
}

export function LiveBonusCard({ bonus }: LiveBonusCardProps) {
  const remaining = daysRemaining(bonus.end_date);

  return (
    <div className="relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-bg-surface border border-border-default rounded-card shadow-card overflow-hidden">
      {/* Purple left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal-active" />

      {/* Bonus percentage — inline display */}
      <div className="flex-shrink-0 flex items-baseline gap-0.5">
        <span className="font-mono text-data text-signal-active leading-none">
          +{bonus.bonus_percentage}
        </span>
        <span className="font-mono text-[14px] text-signal-active">%</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-h3 text-text-primary truncate">
            {bonus.partner.short_name}
          </span>
          <IssuerBadge
            slug={bonus.issuer.slug}
            shortName={bonus.issuer.short_name}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {remaining && (
            <span
              className={`text-caption font-medium inline-flex items-center gap-1.5 ${
                remaining.urgent
                  ? "text-signal-medium"
                  : "text-text-secondary"
              }`}
            >
              {remaining.critical && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse-urgency absolute inline-flex h-full w-full rounded-full bg-signal-medium opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-medium" />
                </span>
              )}
              {remaining.text}
            </span>
          )}
          {bonus.end_date && (
            <span className="text-caption text-text-tertiary">
              · Ends {formatDate(bonus.end_date)}
            </span>
          )}
          {bonus.is_targeted && (
            <span className="text-caption text-text-tertiary">· Targeted</span>
          )}
        </div>
      </div>

      {/* LIVE badge */}
      <span className="inline-flex items-center h-6 px-2.5 rounded-md bg-signal-active-bg text-signal-active text-caption uppercase tracking-wider shrink-0 font-medium">
        Live
      </span>
    </div>
  );
}
