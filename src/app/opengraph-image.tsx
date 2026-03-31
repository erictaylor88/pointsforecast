import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "PointsForecast — Data-driven transfer bonus predictions for Chase, Amex, and Capital One";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAF8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            display: "flex",
          }}
        >
          <div style={{ flex: 1, background: "#0F3D8C" }} />
          <div style={{ flex: 1, background: "#006FCF" }} />
          <div style={{ flex: 1, background: "#D03027" }} />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          PointsForecast
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#6B6B6B",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          Predict upcoming credit card transfer bonuses using historical data
          analysis
        </div>

        {/* Issuer pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { name: "CHASE", bg: "#E8EEF7", color: "#0F3D8C" },
            { name: "AMEX", bg: "#E5F0FA", color: "#006FCF" },
            { name: "CAPITAL ONE", bg: "#FBEAEA", color: "#D03027" },
          ].map((issuer) => (
            <div
              key={issuer.name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 24px",
                borderRadius: "999px",
                background: issuer.bg,
                color: issuer.color,
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              {issuer.name}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#9B9B9B",
          }}
        >
          pointsforecast.com — Know when to transfer, and when to wait
        </div>
      </div>
    ),
    { ...size }
  );
}
