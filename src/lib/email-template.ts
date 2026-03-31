import type { PredictionWithDetails, BonusWithDetails } from "./types";

const SITE_URL = "https://pointsforecast.vercel.app";

function confidenceColor(confidence: string): string {
  switch (confidence) {
    case "high":
      return "#16A34A";
    case "medium":
      return "#CA8A04";
    default:
      return "#9B9B9B";
  }
}

function formatDays(days: number): string {
  if (days < 365) return `${days}d`;
  const months = Math.round(days / 30);
  return `${months}mo`;
}

function buildActiveBonusRow(bonus: BonusWithDetails): string {
  const endDate = bonus.end_date
    ? new Date(bonus.end_date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Ongoing";

  return `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8;">
        <strong style="color: #1A1A1A;">${bonus.partner.short_name}</strong>
        <span style="display: inline-block; margin-left: 6px; padding: 1px 6px; border-radius: 4px; background: #EDE9FE; color: #7C3AED; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em;">${bonus.issuer.short_name}</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8; text-align: center;">
        <span style="color: #7C3AED; font-weight: 600; font-size: 16px;">+${bonus.bonus_percentage}%</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8; text-align: right; color: #6B6B6B; font-size: 13px;">
        Ends ${endDate}
      </td>
    </tr>
  `;
}

function buildPredictionRow(prediction: PredictionWithDetails): string {
  const prob = Math.round(prediction.probability_30d * 100);
  const confColor = confidenceColor(prediction.confidence);
  const range =
    prediction.predicted_bonus_min === prediction.predicted_bonus_max
      ? `${prediction.predicted_bonus_min}%`
      : `${prediction.predicted_bonus_min}–${prediction.predicted_bonus_max}%`;

  return `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8;">
        <strong style="color: #1A1A1A;">${prediction.partner.short_name}</strong>
        <span style="display: inline-block; margin-left: 6px; padding: 1px 6px; border-radius: 4px; background: #F3F2EE; color: #6B6B6B; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em;">${prediction.issuer.short_name}</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8; text-align: center;">
        <span style="font-family: 'JetBrains Mono', 'SF Mono', monospace; font-weight: 600; font-size: 18px; color: #1A1A1A;">${prob}%</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8; text-align: center; font-size: 13px; color: #6B6B6B;">
        ${range}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #EEECE8; text-align: right;">
        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: ${confColor}; background: ${prediction.confidence === "high" ? "#DCFCE7" : prediction.confidence === "medium" ? "#FEF9C3" : "#F3F2EE"};">${prediction.confidence}</span>
      </td>
    </tr>
  `;
}

export function buildAlertEmail({
  predictions,
  activeBonuses,
  subscriberEmail,
}: {
  predictions: PredictionWithDetails[];
  activeBonuses: BonusWithDetails[];
  subscriberEmail: string;
}): { subject: string; html: string } {
  const topPredictions = predictions
    .filter((p) => !p.reasoning.active_bonus && p.probability_30d > 0.3)
    .sort((a, b) => b.probability_30d - a.probability_30d)
    .slice(0, 8);

  const hasActive = activeBonuses.length > 0;
  const topProb = topPredictions[0]
    ? Math.round(topPredictions[0].probability_30d * 100)
    : 0;

  const subject = hasActive
    ? `${activeBonuses.length} live transfer bonus${activeBonuses.length !== 1 ? "es" : ""} + ${topPredictions.length} forecasted`
    : `Top forecast: ${topPredictions[0]?.partner.short_name ?? "Transfer bonuses"} at ${topProb}% likelihood`;

  const activeBonusSection = hasActive
    ? `
      <div style="margin-bottom: 32px;">
        <h2 style="font-family: 'DM Sans', system-ui, sans-serif; font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 12px 0;">
          🟣 Live Bonuses
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E2E0DB; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #F3F2EE;">
              <th style="padding: 8px 16px; text-align: left; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Partner</th>
              <th style="padding: 8px 16px; text-align: center; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Bonus</th>
              <th style="padding: 8px 16px; text-align: right; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Ends</th>
            </tr>
          </thead>
          <tbody>
            ${activeBonuses.map(buildActiveBonusRow).join("")}
          </tbody>
        </table>
      </div>
    `
    : "";

  const predictionsSection =
    topPredictions.length > 0
      ? `
      <div style="margin-bottom: 32px;">
        <h2 style="font-family: 'DM Sans', system-ui, sans-serif; font-size: 18px; font-weight: 600; color: #1A1A1A; margin: 0 0 12px 0;">
          📊 Top Forecasts (30-day)
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E2E0DB; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #F3F2EE;">
              <th style="padding: 8px 16px; text-align: left; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Partner</th>
              <th style="padding: 8px 16px; text-align: center; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Likelihood</th>
              <th style="padding: 8px 16px; text-align: center; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Expected</th>
              <th style="padding: 8px 16px; text-align: right; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #6B6B6B;">Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${topPredictions.map(buildPredictionRow).join("")}
          </tbody>
        </table>
      </div>
    `
      : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PointsForecast Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <h1 style="font-family: 'DM Sans', system-ui, sans-serif; font-size: 24px; font-weight: 700; color: #1A1A1A; margin: 0; letter-spacing: -0.01em;">PointsForecast</h1>
              <p style="font-size: 14px; color: #6B6B6B; margin: 4px 0 0 0;">Your transfer bonus forecast — updated daily at 6 AM UTC</p>
            </td>
          </tr>

          <!-- Main content card -->
          <tr>
            <td style="background: #FFFFFF; border: 1px solid #E2E0DB; border-radius: 12px; padding: 24px;">
              ${activeBonusSection}
              ${predictionsSection}

              <!-- CTA -->
              <div style="text-align: center; padding-top: 8px;">
                <a href="${SITE_URL}" style="display: inline-block; padding: 12px 28px; background: #0F3D8C; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">View Full Dashboard</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="font-size: 12px; color: #9B9B9B; margin: 0;">
                Predictions are statistical estimates based on historical data, not guarantees.
              </p>
              <p style="font-size: 12px; color: #9B9B9B; margin: 8px 0 0 0;">
                <a href="${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #9B9B9B; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}
