# Prompt: Awwwards-style coffee food truck website (Next.js)

Copy everything below the line into Claude.

---

You are a senior creative developer who builds Awwwards "Site of the Day"-level websites. Build a complete, production-ready marketing website for **Roam Roast**, a premium **coffee food truck** (espresso, cold brew, pastries, desserts). Use the art direction, palette and fonts below. Don't use generic templates: every section needs a deliberate layout, motion and typography.

## Tech stack
- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** (theme tokens in `@theme` inside `globals.css`). The project already exists in this folder. Before writing code, read `AGENTS.md` and the bundled docs in `node_modules/next/dist/docs/`. `cacheComponents` is enabled, so anything time-based (`new Date()`) must run on the client inside `useEffect`.
- **GSAP + ScrollTrigger** (`@gsap/react` `useGSAP`) for scroll choreography, and **Lenis** for smooth scrolling, synced to the GSAP ticker.
- **Framer Motion** only for small UI state transitions (menu open, tabs, form states).
- `next/font/local` for self-hosted custom fonts (see Typography) and `next/image` for all imagery.
- No UI kits. All components are hand-built.

## Color palette (from the reference image: a cobalt-blue café wall, cream logo, warm wood, latte foam)
Define these as Tailwind v4 theme tokens:

| Token | Hex | Use |
|---|---|---|
| `cobalt` | `#1F3A93` | Primary brand color, main section backgrounds, hero |
| `cobalt-deep` | `#132563` | Footer, dark sections, overlays, text on cream |
| `ink` | `#0E1530` | Darkest text, preloader background |
| `azure` | `#3D66E0` | Accent shapes, hover states, highlighted words, links |
| `cream` | `#F4EEE4` | Logo/type color on blue, light section backgrounds |
| `foam` | `#E6D3B8` | Cards, subtle fills, borders on cream |
| `latte` | `#C8956A` | Warm accent: prices, small labels, latte-art details |
| `walnut` | `#7A4E33` | Wood tones, secondary warm text |
| `velvet` | `#A8262F` | Rare highlight: "Signature" badges, red-velvet dessert accent. Use sparingly |
| `amber` | `#F2B65A` | Pendant-lamp glow: cursor glow, "Open now" pulse, focus rings |

Rules: blue dominates, cream is the type color on blue, warm tones are accents only. Keep contrast at WCAG AA or better.

## Typography (custom, self-hosted)
Download the free fonts and place the `.woff2` files in `src/fonts/`:
- **Display:** *Clash Display* (Fontshare), weights 500/600/700. Use it for huge headlines, set tight (`leading-[0.85]`, `tracking-[-0.03em]`) at fluid sizes like `clamp(3.5rem, 11vw, 12rem)`.
- **Body/UI:** *Satoshi* (Fontshare), weights 400/500/700.
- **Accent:** *Instrument Serif Italic* (Google Fonts). Use it for one or two emotional words per headline (e.g. "Simple ingredients, *extraordinary* taste"), mixed into the Clash Display line.
- Use uppercase, letter-spaced (`tracking-[0.25em]`) Satoshi for eyebrows and labels, the way the reference shows "BAKERY & COFFEE".

## Awwwards-level interactions (required)
1. **Preloader:** an `ink` screen with a 0→100 counter and a coffee cup that fills with liquid. It splits and reveals the hero with a clip-path wipe. Show it once per session.
2. **Smooth scroll** with Lenis, plus a **custom cursor**: a small cream dot and a larger trailing ring. The ring grows and shows a label ("View", "Drag", "Order") over interactive elements. Disable both on touch devices.
3. **Split-text reveals:** headlines animate in line by line, each line masked and rising from `yPercent: 100`.
4. **Magnetic buttons**, plus links whose underline draws from the left on hover.
5. **Infinite marquee** of menu words, with speed and direction tied to scroll velocity.
6. **Parallax layers:** coffee cup, cookie, cake slice and coffee beans float at different scroll speeds, as in the reference composition.
7. **Pinned horizontal-scroll menu section:** drink cards slide sideways while the section is pinned.
8. **Image reveals:** clip-path or scale-down reveal for every image on enter.
9. **Grain/noise overlay** across the whole site, plus soft radial `amber` lamp glows on blue sections.
10. Respect `prefers-reduced-motion`. When it's set, disable Lenis, parallax and split animations and show content immediately.

## Sections
1. **Nav:** logo wordmark left, links center, and on the right an "Open now · [location]" pill with a pulsing amber dot. The nav hides on scroll down and shows on scroll up. On mobile, a full-screen cobalt menu with large staggered Clash Display links.
2. **Hero (cobalt):** a giant "ROAM ROAST" wordmark in cream with a small "COFFEE · BAKERY · ON WHEELS" line under it. A floating coffee cup with latte art in the center, with a cookie and a red-velvet slice around it. Show the line "Simple ingredients, *extraordinary* taste." and three icon chips: Bakery / Coffee / Desserts, separated by thin vertical rules as in the reference. Add a scroll indicator.
3. **Marquee band** (cream on `cobalt-deep`).
4. **Intro / manifesto:** a large paragraph that reveals word by word on scroll (opacity 0.15 → 1), with a few inline rounded images placed between words.
5. **Menu:** a pinned horizontal scroll with tabs for Espresso / Cold Bar / Bites / Desserts. Each card shows the item, a short description, a price in `latte` and badges ("Signature" in `velvet`, "Vegan"). Cards tilt slightly on hover.
6. **Find the Truck:** a weekly schedule in which today's row is highlighted automatically (computed on the client), live open/closed status, and a stylized SVG city map with an animated truck pin.
7. **Story / numbers:** a split layout with oversized count-up stats (cups served, years, local roaster miles) and an image collage.
8. **Gallery:** a draggable masonry or infinite-loop strip of truck and coffee photos.
9. **Events & catering:** booking form fields are name, email, date, guests, event type and message. Validate each field, show a success state with a Framer Motion animation, and add a `TODO` to wire the form to an API route.
10. **Footer (cobalt-deep):** a huge cream wordmark that reveals as the footer slides up from under the page (sticky-reveal effect), plus contact info, social links, opening hours and a back-to-top magnetic button.

## Content
Write all the copy: short, confident and warm. The menu includes Espresso, Cortado, Flat White, Oat Latte, Honey Lavender Latte (Signature), Cold Brew, Nitro Cold Brew, Espresso Tonic, Matcha Cloud, Butter Croissant, Cardamom Bun, Chocolate Chip Cookie, Red Velvet Cake (Signature), Breakfast Burrito. Use realistic prices. Keep all data in `src/lib/data.ts`.

Imagery: use Unsplash photos through `next/image` (add the host to `images.remotePatterns`), or clearly marked placeholders in `/public/images` that I can swap. Food cut-outs (cup, cookie, cake) should be transparent PNGs, or tasteful SVG stand-ins.

## Quality bar
- Fully responsive from 360px to 1920px+, with layouts redesigned for mobile rather than just stacked.
- Lighthouse scores of 90+ for performance and accessibility. Use semantic HTML, alt text, visible focus states and keyboard-accessible tabs and menus.
- Animations use only `transform` and `opacity`, and every GSAP/Lenis instance is cleaned up on unmount.
- Organize code into `src/components/sections/*`, `src/components/ui/*` (Cursor, MagneticButton, SplitText, Marquee) and `src/lib/*`.
- Add SEO metadata, Open Graph tags and favicons in the brand colors.
- When finished, run `npm run build` and fix every error and warning. Then start the dev server, check each section on desktop and at mobile width, and report what you verified.
