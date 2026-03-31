"use client";

import type { Issuer } from "@/lib/types";

interface IssuerFilterProps {
  issuers: Issuer[];
  activeIssuers: Set<string>;
  onToggle: (issuerId: string) => void;
}

const issuerColors: Record<string, { active: string; inactive: string }> = {
  "chase-ur": {
    active: "bg-chase text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-chase hover:text-chase",
  },
  "amex-mr": {
    active: "bg-amex text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-amex hover:text-amex",
  },
  "capital-one": {
    active: "bg-capital-one text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-capital-one hover:text-capital-one",
  },
};

export function IssuerFilter({
  issuers,
  activeIssuers,
  onToggle,
}: IssuerFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
      {issuers.map((issuer) => {
        const isActive = activeIssuers.has(issuer.id);
        const colors = issuerColors[issuer.slug] ?? {
          active: "bg-text-primary text-white",
          inactive: "border-border-default bg-bg-surface text-text-secondary",
        };

        return (
          <button
            key={issuer.id}
            onClick={() => onToggle(issuer.id)}
            className={`
              inline-flex items-center h-9 px-4 rounded-full
              text-label uppercase tracking-wider
              border transition-all duration-150
              shrink-0 cursor-pointer focus-ring
              ${isActive ? `${colors.active} border-transparent` : colors.inactive}
            `}
            aria-pressed={isActive}
          >
            {issuer.short_name}
          </button>
        );
      })}
    </div>
  );
}
