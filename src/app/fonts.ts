import localFont from "next/font/local";
import {
  Amatic_SC,
  Assistant,
  David_Libre,
  Frank_Ruhl_Libre,
  Fredoka,
  Heebo,
  Instrument_Serif,
  Karantina,
  Rubik,
  Secular_One,
  Suez_One,
  Varela_Round,
} from "next/font/google";

/* Latin fonts (used by the English admin). */
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

const instrument = Instrument_Serif({ variable: "--font-instrument", weight: "400", style: "italic", subsets: ["latin"] });

/* Variable fonts (no `weight` list) load their whole weight range, so the admin's weight picker works.
   Hebrew site defaults. Display: Fredoka, the logotype's family. Body: Heebo. Accent: Frank Ruhl Libre. */
const fredoka = Fredoka({ variable: "--font-hebrew", subsets: ["hebrew", "latin"] });
const heebo = Heebo({ variable: "--font-heebo", subsets: ["hebrew", "latin"] });
const frank = Frank_Ruhl_Libre({ variable: "--font-frank", subsets: ["hebrew", "latin"] });

/* Extra choices for the per-block font pickers in /admin (see src/lib/content/fonts.ts).
   Not preloaded: a browser only downloads one when a section uses it.
   (next/font needs literal options here, so they are written out for each font.) */
const rubik = Rubik({ variable: "--font-rubik", subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const assistant = Assistant({ variable: "--font-assistant", subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const varela = Varela_Round({ variable: "--font-varela", weight: "400", subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const secular = Secular_One({ variable: "--font-secular", weight: "400", subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const suez = Suez_One({ variable: "--font-suez", weight: "400", subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const david = David_Libre({ variable: "--font-david", weight: ["400", "500", "700"], subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const amatic = Amatic_SC({ variable: "--font-amatic", weight: ["400", "700"], subsets: ["hebrew", "latin"], preload: false, display: "swap" });
const karantina = Karantina({ variable: "--font-karantina", weight: ["400", "700"], subsets: ["hebrew", "latin"], preload: false, display: "swap" });

/** Class names that define every font's CSS variable; put on <html>. */
export const fontVariables = [clash, satoshi, instrument, fredoka, heebo, frank, rubik, assistant, varela, secular, suez, david, amatic, karantina]
  .map((f) => f.variable)
  .join(" ");
