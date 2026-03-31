export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary">
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
        </div>
        <p className="text-caption text-text-tertiary mt-10">
          Coming soon — building the data foundation.
        </p>
      </div>
    </main>
  );
}
