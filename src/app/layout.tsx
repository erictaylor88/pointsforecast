import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

const dmSans = localFont({
  src: "../../public/fonts/dm-sans-latin-variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "500 700",
});

const inter = localFont({
  src: "../../public/fonts/inter-latin-variable.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "400 600",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/jetbrains-mono-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/jetbrains-mono-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PointsForecast — Predict Credit Card Transfer Bonuses",
  description:
    "See which credit card transfer bonuses are likely coming next. Data-driven predictions for Chase, Amex, and Capital One transfer partners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
