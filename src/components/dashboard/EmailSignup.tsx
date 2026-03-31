"use client";

import { useState, useCallback } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || state === "submitting") return;

      setState("submitting");
      setMessage("");

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await res.json();

        if (res.ok) {
          setState("success");
          setMessage(data.message || "You're in!");
          setEmail("");
        } else {
          setState("error");
          setMessage(data.error || "Something went wrong.");
        }
      } catch {
        setState("error");
        setMessage("Network error. Please try again.");
      }
    },
    [email, state]
  );

  return (
    <div className="max-w-md">
      <h3 className="font-display text-h3 text-text-primary mb-1">
        Get prediction alerts
      </h3>
      <p className="text-caption text-text-secondary mb-4">
        We&apos;ll email you when high-probability transfer bonuses are
        forecasted for your issuers.
      </p>

      {state === "success" ? (
        <div className="flex items-center gap-2 h-11 px-4 rounded-lg bg-signal-high-bg text-signal-high text-body-medium transition-all duration-300">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span>{message}</span>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="you@email.com"
              required
              aria-label="Email address for prediction alerts"
              className="flex-1 h-11 px-4 bg-bg-surface border border-border-default rounded-lg text-body text-text-primary placeholder:text-text-tertiary outline-none focus:border-chase focus:ring-1 focus:ring-chase transition-colors"
              disabled={state === "submitting"}
            />
            <button
              type="submit"
              disabled={state === "submitting" || !email.trim()}
              className="h-11 px-5 bg-chase text-white rounded-lg font-display text-[14px] font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-chase/90 transition-colors"
            >
              {state === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Subscribing…</span>
                </span>
              ) : (
                "Get Alerts"
              )}
            </button>
          </form>
          {state === "error" && message && (
            <p className="text-caption text-signal-medium mt-2">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}
