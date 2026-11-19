// Usage: node scripts/logo/generate.cjs .   (run from the coffee-truck folder)
// Emits site assets for the chosen logotype (Option A "Café Round").
const opentype = require("opentype.js");
const fs = require("fs");
const path = require("path");

const PROJECT = process.argv[2];
const font = opentype.loadSync(path.join(__dirname, "font", "fredoka-700.ttf"));

function layout(text, size, { rtl = false, tracking = 0, ox = 0, oy = 0 } = {}) {
  const seq = rtl ? [...text].reverse() : [...text];
  const scale = size / font.unitsPerEm;
  let x = 0;
  const glyphs = [];
  for (const ch of seq) {
    const g = font.charToGlyph(ch);
    const p = g.getPath(x + ox, oy, size);
    if (ch !== " ") glyphs.push({ d: p.toPathData(2), bb: p.getBoundingBox() });
    x += g.advanceWidth * scale + tracking;
  }
  const bb = {
    x1: Math.min(...glyphs.map((g) => g.bb.x1)),
    x2: Math.max(...glyphs.map((g) => g.bb.x2)),
    y1: Math.min(...glyphs.map((g) => g.bb.y1)),
    y2: Math.max(...glyphs.map((g) => g.bb.y2)),
  };
  return { glyphs, bb, width: x - tracking };
}

const HEART = "M0 -6C-4 -15 -20 -14 -20 -2C-20 8 -8 14 0 22C8 14 20 8 20 -2C20 -14 4 -15 0 -6Z";

/* Wordmark, normalised so its ink box starts at (0,0). Heart sits above the rightmost letter (א). */
const word = layout("אהבות קטנות", 120, { rtl: true, tracking: 2 });
const pad = 4;
const dx = -word.bb.x1 + pad;
const heartScale = 1.15;
const last = word.glyphs[word.glyphs.length - 1].bb;
const heartX = last.x2 - 8 + dx;
const heartTop = word.bb.y1 - 8 - 15 * heartScale; // top of heart shape
const dy = -Math.min(word.bb.y1, heartTop) + pad;
const glyphs = layout("אהבות קטנות", 120, { rtl: true, tracking: 2, ox: dx, oy: dy }).glyphs.map((g) => g.d);
const heart = { x: +heartX.toFixed(2), y: +(word.bb.y1 - 8 + dy).toFixed(2), scale: heartScale };
const wordW = Math.ceil(Math.max(word.bb.x2 + dx, heartX + 20 * heartScale) + pad);
const wordH = Math.ceil(word.bb.y2 + dy + pad);

/* Tagline under the wordmark */
const sub = layout("COFFEE & BAKERY · ON WHEELS", 20, { tracking: 6 });
const subW = sub.width;

const ts = `// Generated from Fredoka Bold outlines — do not edit by hand. Regenerate with: node scripts/logo/generate.cjs .
export const logo = {
  /** Wordmark "אהבות קטנות", one path per glyph in visual (left→right) order */
  glyphs: ${JSON.stringify(glyphs, null, 2)},
  heart: ${JSON.stringify(heart)},
  heartPath: ${JSON.stringify(HEART)},
  width: ${wordW},
  height: ${wordH},
  tagline: {
    glyphs: ${JSON.stringify(sub.glyphs.map((g) => g.d))},
    width: ${subW.toFixed(2)},
    ascent: ${(-sub.bb.y1).toFixed(2)},
  },
} as const;
`;
fs.writeFileSync(path.join(PROJECT, "src/components/art/logoData.ts"), ts);

/* Static SVG files for download / social / print */
const heartEl = (fill) =>
  `<path transform="translate(${heart.x} ${heart.y}) scale(${heart.scale})" d="${HEART}" fill="${fill}"/>`;
const wordEl = (fill) => `<g fill="${fill}">${glyphs.map((d) => `<path d="${d}"/>`).join("")}</g>`;

const full = (fg, accent, bg) => {
  const gap = 46, lineGap = 20, lineLen = 50;
  const W = Math.ceil(Math.max(wordW, subW + 2 * (lineGap + lineLen)) + 80);
  const H = wordH + gap + 20 + 80;
  const ox = (W - wordW) / 2, oy = 40;
  const sx = (W - subW) / 2, sy = oy + wordH + gap;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${
    bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : ""
  }<g transform="translate(${ox.toFixed(1)} ${oy})">${wordEl(fg)}${heartEl(accent)}</g><path d="M${(sx - lineGap - lineLen).toFixed(1)} ${sy - 7}h${lineLen}M${(sx + subW + lineGap).toFixed(1)} ${sy - 7}h${lineLen}" stroke="${fg}" stroke-opacity=".5" stroke-width="2"/><g fill="${fg}" transform="translate(${sx.toFixed(1)} ${sy})">${sub.glyphs
    .map((g) => `<path d="${g.d}"/>`)
    .join("")}</g></svg>`;
};
const wordOnly = (fg, accent) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wordW} ${wordH}" width="${wordW}" height="${wordH}">${wordEl(fg)}${heartEl(accent)}</svg>`;

const brandDir = path.join(PROJECT, "public/brand");
fs.mkdirSync(brandDir, { recursive: true });
fs.writeFileSync(path.join(brandDir, "logo-cream-on-cobalt.svg"), full("#f4eee4", "#f2b65a", "#1f3a93"));
fs.writeFileSync(path.join(brandDir, "logo-cobalt-on-cream.svg"), full("#1f3a93", "#a8262f", "#f4eee4"));
fs.writeFileSync(path.join(brandDir, "logo-cobalt.svg"), full("#1f3a93", "#a8262f"));
fs.writeFileSync(path.join(brandDir, "wordmark-cobalt.svg"), wordOnly("#1f3a93", "#a8262f"));
fs.writeFileSync(path.join(brandDir, "wordmark-cream.svg"), wordOnly("#f4eee4", "#f2b65a"));

/* Favicon / app icon: the letter א with the heart, on a cobalt rounded square */
const alef = font.charToGlyph("א").getPath(0, 0, 300);
const ab = alef.getBoundingBox();
const S = 512;
const ax = (S - (ab.x2 - ab.x1)) / 2 - ab.x1 - 18;
const ay = (S - (ab.y2 - ab.y1)) / 2 - ab.y1 + 36;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" rx="116" fill="#1f3a93"/><path d="${font.charToGlyph("א").getPath(ax, ay, 300).toPathData(2)}" fill="#f4eee4"/><path transform="translate(${(ab.x2 + ax + 8).toFixed(1)} ${(ab.y1 + ay - 10).toFixed(1)}) scale(3.1)" d="${HEART}" fill="#f2b65a"/></svg>`;
fs.writeFileSync(path.join(PROJECT, "src/app/icon.svg"), icon);

console.log({ wordW, wordH, glyphs: glyphs.length, subW: subW.toFixed(1) });
