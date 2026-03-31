import type { Metadata } from "next";
import { PreferencesForm } from "@/components/dashboard/PreferencesForm";

export const metadata: Metadata = {
  title: "Alert Preferences",
  description: "Customize which transfer bonus alerts you receive from PointsForecast.",
  robots: { index: false, follow: false },
};

export default async function PreferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="w-full border-b border-border-subtle bg-bg-surface/80">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
          <a href="/" className="font-display text-h1 text-text-primary hover:opacity-80 transition-opacity">
            PointsForecast
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <h1 className="font-display text-display text-text-primary mb-2">
          Alert Preferences
        </h1>
        <p className="text-body text-text-secondary mb-8">
          Choose which transfer bonus alerts matter to you. We&apos;ll only email you about the programs and partners you select.
        </p>

        {email ? (
          <PreferencesForm email={email.trim().toLowerCase()} />
        ) : (
          <div className="text-center py-16">
            <p className="text-body-medium text-text-secondary mb-2">No email provided.</p>
            <p className="text-caption text-text-tertiary mb-6">
              Use the link from your PointsForecast alert email to access your preferences.
            </p>
            <a href="/" className="inline-block px-5 py-2.5 bg-chase text-white rounded-lg font-display text-[14px] font-medium hover:bg-chase/90 transition-colors">
              Back to Dashboard
            </a>
          </div>
        )}
      </main>

      <footer className="border-t border-border-subtle">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6">
          <p className="text-caption text-text-tertiary">
            <a href="/" className="hover:text-text-secondary transition-colors">← Back to Dashboard</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
