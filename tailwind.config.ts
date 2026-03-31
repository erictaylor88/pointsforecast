import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FAFAF8",
          surface: "#FFFFFF",
          subtle: "#F3F2EE",
          muted: "#E8E6E1",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B6B6B",
          tertiary: "#9B9B9B",
        },
        border: {
          default: "#E2E0DB",
          subtle: "#EEECE8",
        },
        chase: {
          DEFAULT: "#0F3D8C",
          light: "#E8EEF7",
        },
        amex: {
          DEFAULT: "#006FCF",
          light: "#E5F0FA",
        },
        "capital-one": {
          DEFAULT: "#D03027",
          light: "#FBEAEA",
        },
        citi: {
          DEFAULT: "#003B70",
          light: "#E5EBF5",
        },
        signal: {
          high: "#16A34A",
          "high-bg": "#DCFCE7",
          medium: "#CA8A04",
          "medium-bg": "#FEF9C3",
          low: "#9B9B9B",
          "low-bg": "#F3F2EE",
          active: "#7C3AED",
          "active-bg": "#EDE9FE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: [
          "32px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "24px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h2: [
          "20px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h3: [
          "16px",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "500" },
        ],
        body: [
          "15px",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-medium": [
          "15px",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "500" },
        ],
        label: [
          "13px",
          { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        caption: [
          "12px",
          { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        data: [
          "28px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "data-sm": [
          "16px",
          { lineHeight: "1.3", letterSpacing: "0", fontWeight: "400" },
        ],
      },
      borderRadius: {
        card: "12px",
      },
      maxWidth: {
        content: "1120px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.06)",
      },
      keyframes: {
        "pulse-urgency": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "pulse-urgency": "pulse-urgency 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
