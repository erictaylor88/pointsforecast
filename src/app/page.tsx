import { Dashboard } from "@/components/dashboard/Dashboard";
import { getIssuers, getPredictions, getActiveBonuses } from "@/lib/data";

// Revalidate every 60 seconds — predictions update daily but bonuses could change
export const revalidate = 60;

function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "PointsForecast",
        url: "https://pointsforecast.com",
        description:
          "Data-driven predictions for credit card transfer bonuses. See which Chase, Amex, and Capital One transfer bonuses are likely coming next.",
      },
      {
        "@type": "WebApplication",
        name: "PointsForecast",
        url: "https://pointsforecast.com",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Predict upcoming credit card transfer bonuses using historical data analysis. Covers Chase Ultimate Rewards, Amex Membership Rewards, and Capital One Miles.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function Home() {
  const [issuers, predictions, activeBonuses] = await Promise.all([
    getIssuers(),
    getPredictions(),
    getActiveBonuses(),
  ]);

  // Get the most recent computation timestamp
  const computedAt =
    predictions.length > 0 ? predictions[0].computed_at : null;

  // Check if we got data (env vars may not be set yet)
  const hasData = issuers.length > 0;

  if (!hasData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-primary">
        <JsonLd />
        <div className="text-center max-w-lg px-6">
          <h1 className="font-display text-display text-text-primary mb-3">
            PointsForecast
          </h1>
          <p className="font-body text-body text-text-secondary mb-8">
            Predict upcoming credit card transfer bonuses using historical data
            analysis. Know when to transfer — and when to wait.
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-chase-light text-chase text-label uppercase">
              Chase
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amex-light text-amex text-label uppercase">
              Amex
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-capital-one-light text-capital-one text-label uppercase">
              Capital One
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-citi-light text-citi text-label uppercase">
              Citi
            </span>
          </div>
          <p className="text-caption text-text-tertiary mt-10">
            Connecting to data source — set environment variables to go live.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <JsonLd />
      <Dashboard
        issuers={issuers}
        predictions={predictions}
        activeBonuses={activeBonuses}
        computedAt={computedAt}
      />
    </>
  );
}
