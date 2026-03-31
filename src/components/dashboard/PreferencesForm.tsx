"use client";

import { useState, useEffect, useCallback } from "react";

interface IssuerOption {
  id: string;
  short_name: string;
  slug: string;
}

interface PartnerOption {
  id: string;
  short_name: string;
  slug: string;
  type: string;
}

interface Preferences {
  issuers: string[];
  partners: string[];
}

type LoadState = "loading" | "loaded" | "error" | "not-found";
type SaveState = "idle" | "saving" | "saved" | "error";

// Issuer slug → brand color classes
const issuerColors: Record<string, { active: string; inactive: string }> = {
  "chase-ur": {
    active: "bg-chase text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-chase/40",
  },
  "amex-mr": {
    active: "bg-amex text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-amex/40",
  },
  "capital-one": {
    active: "bg-capital-one text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-capital-one/40",
  },
  "citi-typ": {
    active: "bg-citi text-white",
    inactive: "border-border-default bg-bg-surface text-text-secondary hover:border-citi/40",
  },
};

export function PreferencesForm({ email }: { email: string }) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [issuers, setIssuers] = useState<IssuerOption[]>([]);
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [selectedIssuers, setSelectedIssuers] = useState<Set<string>>(new Set());
  const [selectedPartners, setSelectedPartners] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/preferences?email=${encodeURIComponent(email)}`);
        if (res.status === 404) {
          setLoadState("not-found");
          return;
        }
        if (!res.ok) {
          setLoadState("error");
          return;
        }
        const data = await res.json();
        setIssuers(data.issuers);
        setPartners(data.partners);

        const prefs: Preferences = data.preferences;
        // Empty arrays = all selected
        setSelectedIssuers(
          new Set(prefs.issuers?.length ? prefs.issuers : data.issuers.map((i: IssuerOption) => i.slug))
        );
        setSelectedPartners(
          new Set(prefs.partners?.length ? prefs.partners : [])
        );
        setLoadState("loaded");
      } catch {
        setLoadState("error");
      }
    }
    load();
  }, [email]);

  const toggleIssuer = useCallback((slug: string) => {
    setSelectedIssuers((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    setSaveState("idle");
  }, []);

  const togglePartner = useCallback((slug: string) => {
    setSelectedPartners((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    setSaveState("idle");
  }, []);

  const allIssuersSelected = selectedIssuers.size === issuers.length || selectedIssuers.size === 0;
  const noPartnersFiltered = selectedPartners.size === 0;

  const handleSave = useCallback(async () => {
    setSaveState("saving");
    setSaveMessage("");

    // If all issuers selected, save empty array (= all)
    const issuerSlugs = allIssuersSelected ? [] : Array.from(selectedIssuers);
    const partnerSlugs = noPartnersFiltered ? [] : Array.from(selectedPartners);

    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          preferences: { issuers: issuerSlugs, partners: partnerSlugs },
        }),
      });

      if (res.ok) {
        setSaveState("saved");
        setSaveMessage("Preferences saved!");
      } else {
        const data = await res.json();
        setSaveState("error");
        setSaveMessage(data.error || "Failed to save.");
      }
    } catch {
      setSaveState("error");
      setSaveMessage("Network error. Please try again.");
    }
  }, [email, selectedIssuers, selectedPartners, allIssuersSelected, noPartnersFiltered]);

  if (loadState === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-6 h-6 animate-spin text-text-tertiary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (loadState === "not-found") {
    return (
      <div className="text-center py-16">
        <p className="text-body-medium text-text-secondary mb-2">Subscriber not found.</p>
        <p className="text-caption text-text-tertiary mb-6">
          This email isn&apos;t subscribed to PointsForecast alerts yet.
        </p>
        <a href="/" className="inline-block px-5 py-2.5 bg-chase text-white rounded-lg font-display text-[14px] font-medium hover:bg-chase/90 transition-colors">
          Subscribe on Dashboard
        </a>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="text-center py-16">
        <p className="text-body-medium text-text-secondary mb-2">Something went wrong.</p>
        <p className="text-caption text-text-tertiary">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Issuers */}
      <div>
        <h2 className="font-display text-h2 text-text-primary mb-1">
          Which programs do you hold?
        </h2>
        <p className="text-caption text-text-secondary mb-4">
          We&apos;ll only send alerts for bonuses from these issuers.{" "}
          {allIssuersSelected && (
            <span className="text-text-tertiary">All selected = alerts for everything.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {issuers.map((issuer) => {
            const isActive = selectedIssuers.has(issuer.slug);
            const colors = issuerColors[issuer.slug] ?? {
              active: "bg-text-primary text-white",
              inactive: "border-border-default bg-bg-surface text-text-secondary",
            };
            return (
              <button
                key={issuer.slug}
                onClick={() => toggleIssuer(issuer.slug)}
                className={`
                  h-9 px-4 rounded-full text-label uppercase tracking-wider transition-all duration-150 cursor-pointer
                  ${isActive ? colors.active : `border ${colors.inactive}`}
                `}
                aria-pressed={isActive}
              >
                {issuer.short_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partners */}
      <div>
        <h2 className="font-display text-h2 text-text-primary mb-1">
          Specific airlines (optional)
        </h2>
        <p className="text-caption text-text-secondary mb-4">
          Filter alerts to specific transfer partners. Leave all unchecked to get alerts for every airline.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {partners.map((partner) => {
            const isActive = selectedPartners.has(partner.slug);
            return (
              <button
                key={partner.slug}
                onClick={() => togglePartner(partner.slug)}
                className={`
                  h-9 px-3 rounded-lg text-[13px] font-body font-medium transition-all duration-150 cursor-pointer text-left
                  ${
                    isActive
                      ? "bg-bg-muted text-text-primary border border-text-primary/20"
                      : "border border-border-default bg-bg-surface text-text-secondary hover:border-border-default/80"
                  }
                `}
                aria-pressed={isActive}
              >
                {partner.short_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary + Save */}
      <div className="border-t border-border-subtle pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-caption text-text-tertiary">
            {allIssuersSelected ? "All issuers" : `${selectedIssuers.size} issuer${selectedIssuers.size !== 1 ? "s" : ""}`}
            {" · "}
            {noPartnersFiltered ? "All airlines" : `${selectedPartners.size} airline${selectedPartners.size !== 1 ? "s" : ""}`}
            {" · "}
            <span className="text-text-secondary">{email}</span>
          </div>
          <div className="flex items-center gap-3">
            {saveState === "saved" && (
              <span className="text-caption text-signal-high font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {saveMessage}
              </span>
            )}
            {saveState === "error" && (
              <span className="text-caption text-signal-medium">{saveMessage}</span>
            )}
            <button
              onClick={handleSave}
              disabled={saveState === "saving" || selectedIssuers.size === 0}
              className="h-10 px-6 bg-chase text-white rounded-lg font-display text-[14px] font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-chase/90 transition-colors"
            >
              {saveState === "saving" ? "Saving…" : "Save Preferences"}
            </button>
          </div>
        </div>
        {selectedIssuers.size === 0 && (
          <p className="text-caption text-signal-medium mt-2">
            Select at least one issuer to receive alerts.
          </p>
        )}
      </div>
    </div>
  );
}
