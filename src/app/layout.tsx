import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Fredoka, Instrument_Serif } from "next/font/google";
import "./globals.css";

const clash = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "../fonts/Clash-Display-500.woff2", weight: "500" },
    { path: "../fonts/Clash-Display-600.woff2", weight: "600" },
    { path: "../fonts/Clash-Display-700.woff2", weight: "700" },
  ],
});

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500" },
    { path: "../fonts/Satoshi-700.woff2", weight: "700" },
  ],
});

// Hebrew fallback (same family as the logotype) for any Hebrew text set in the UI fonts.
const fredoka = Fredoka({
  variable: "--font-hebrew",
  weight: ["500", "600"],
  subsets: ["hebrew"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "אהבות קטנות",
};

export const viewport: Viewport = {
  themeColor: "#1f3a93",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${instrument.variable} ${fredoka.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
