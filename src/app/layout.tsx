import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Frank_Ruhl_Libre, Fredoka, Heebo, Instrument_Serif } from "next/font/google";
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

/* Hebrew site fonts. Display: Fredoka, the logotype's family. Body: Heebo. Accent: Frank Ruhl Libre. */
const fredoka = Fredoka({
  variable: "--font-hebrew",
  weight: ["500", "600", "700"],
  subsets: ["hebrew", "latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  weight: ["400", "500", "700"],
  subsets: ["hebrew", "latin"],
});

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  weight: ["500", "700"],
  subsets: ["hebrew", "latin"],
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
    <html lang="he" dir="rtl" className={`${clash.variable} ${satoshi.variable} ${instrument.variable} ${fredoka.variable} ${heebo.variable} ${frank.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
