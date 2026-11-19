/* Hand-built SVG food illustrations in the brand palette. Swap for transparent PNG photos in /public/images any time. */

import { logo } from "./logoData";

type P = { className?: string };

const C = {
  cobalt: "#1f3a93",
  deep: "#132563",
  azure: "#3d66e0",
  cream: "#f4eee4",
  foam: "#e6d3b8",
  latte: "#c8956a",
  walnut: "#7a4e33",
  velvet: "#a8262f",
  ink: "#0e1530",
};

export function Mark({ className = "", stroke = C.cream }: P & { stroke?: string }) {
  // Coffee-bean / leaf monogram, a nod to the line-art mark in the reference
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M32 6c14 6 20 20 14 34S24 60 14 52 10 26 18 16 28 4 32 6z" />
      <path d="M30 10c-6 12 10 22 0 44" />
    </svg>
  );
}

export function Cup({ className = "" }: P) {
  return (
    <svg viewBox="0 0 220 280" className={className} aria-hidden>
      <defs>
        <linearGradient id="cup-shade" x1="0" x2="1">
          <stop offset="0" stopColor={C.deep} />
          <stop offset="0.35" stopColor={C.azure} />
          <stop offset="0.7" stopColor={C.cobalt} />
          <stop offset="1" stopColor={C.deep} />
        </linearGradient>
        <radialGradient id="foam" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#f3e2c8" />
          <stop offset="0.7" stopColor={C.latte} />
          <stop offset="1" stopColor={C.walnut} />
        </radialGradient>
      </defs>
      <path d="M22 46 L198 46 L176 262 Q174 274 160 274 L60 274 Q46 274 44 262 Z" fill="url(#cup-shade)" />
      {/* sleeve */}
      <path d="M34 120 L186 120 L178 196 L42 196 Z" fill={C.cream} />
      {/* logotype on the sleeve */}
      <g transform={`translate(${110 - (logo.width * 0.17) / 2} 136) scale(0.17)`}>
        <g fill={C.cobalt}>
          {logo.glyphs.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path transform={`translate(${logo.heart.x} ${logo.heart.y}) scale(${logo.heart.scale})`} d={logo.heartPath} fill={C.velvet} />
      </g>
      <text x="110" y="182" textAnchor="middle" fontFamily="var(--font-satoshi), sans-serif" fontWeight="700" fontSize="8" fill={C.cobalt} letterSpacing="2.5">
        COFFEE · BAKERY
      </text>
      {/* lid rim + foam */}
      <ellipse cx="110" cy="46" rx="90" ry="22" fill={C.cream} />
      <ellipse cx="110" cy="46" rx="80" ry="17" fill="url(#foam)" />
      {/* latte art rosetta */}
      <g fill="#f8eedd" opacity="0.95">
        <ellipse cx="110" cy="48" rx="30" ry="9" />
        <ellipse cx="110" cy="44" rx="22" ry="6" fill={C.latte} />
        <ellipse cx="110" cy="42" rx="16" ry="4.5" />
        <ellipse cx="110" cy="39.5" rx="9" ry="2.6" fill={C.latte} />
        <path d="M110 30 v26" stroke="#f8eedd" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

export function IcedCup({ className = "" }: P) {
  return (
    <svg viewBox="0 0 160 220" className={className} aria-hidden>
      <path d="M112 8 L92 70" stroke={C.cream} strokeWidth="8" strokeLinecap="round" />
      <path d="M20 50 H140 L126 206 Q125 214 116 214 H44 Q35 214 34 206 Z" fill={C.cream} opacity="0.25" />
      <path d="M26 92 H134 L126 206 Q125 214 116 214 H44 Q35 214 34 206 Z" fill={C.walnut} />
      <path d="M26 92 H134 L131 118 H29 Z" fill={C.foam} />
      {[[50, 140], [86, 160], [64, 180], [100, 132]].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="20" height="20" rx="4" fill={C.cream} opacity="0.35" transform={`rotate(15 ${x} ${y})`} />
      ))}
      <rect x="14" y="40" width="132" height="14" rx="7" fill={C.cream} />
    </svg>
  );
}

export function Cookie({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="88" fill="#b67a49" />
      <circle cx="100" cy="100" r="88" fill="none" stroke={C.walnut} strokeWidth="6" opacity="0.5" />
      <path d="M40 70 Q70 50 100 62 T160 70" stroke="#d9a272" strokeWidth="10" fill="none" opacity="0.6" strokeLinecap="round" />
      {[[62, 80, 14], [120, 60, 11], [140, 112, 15], [90, 120, 12], [58, 140, 10], [112, 152, 13], [96, 88, 8], [150, 150, 8]].map(([x, y, r]) => (
        <path key={`${x}-${y}`} d={`M${x - r} ${y} q${r} -${r * 1.4} ${r * 2} 0 q-${r} ${r * 0.9} -${r * 2} 0z`} fill="#3b2318" />
      ))}
      {[[78, 60], [130, 92], [70, 112], [128, 136]].map(([x, y]) => (
        <circle key={`s${x}`} cx={x} cy={y} r="2.4" fill={C.cream} />
      ))}
    </svg>
  );
}

export function Cake({ className = "" }: P) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden>
      {/* top */}
      <path d="M20 70 L200 30 L224 66 L44 110 Z" fill={C.cream} />
      {/* side layers */}
      <path d="M44 110 L224 66 L224 168 L44 190 Z" fill={C.velvet} />
      <path d="M44 132 L224 98 L224 110 L44 146 Z" fill={C.cream} />
      <path d="M44 162 L224 132 L224 144 L44 176 Z" fill={C.cream} />
      {/* front face */}
      <path d="M20 70 L44 110 L44 190 L20 160 Z" fill="#861c24" />
      {/* crumbs on top */}
      {[[90, 62], [120, 54], [150, 50], [110, 70], [170, 60]].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="4" fill={C.velvet} />
      ))}
      <path d="M150 40 q14 -26 30 -6 q-10 14 -30 6z" fill={C.cream} stroke={C.foam} strokeWidth="2" />
    </svg>
  );
}

export function Croissant({ className = "" }: P) {
  return (
    <svg viewBox="0 0 220 140" className={className} aria-hidden>
      <path d="M10 100 Q30 40 110 30 Q190 40 210 100 Q170 80 150 92 Q130 60 110 62 Q90 60 70 92 Q50 80 10 100Z" fill="#d79a52" />
      <path d="M70 92 Q90 60 110 62 Q130 60 150 92 Q130 120 110 122 Q90 120 70 92Z" fill="#c4823d" />
      {[[110, 62, 110, 122], [92, 70, 84, 112], [128, 70, 136, 112], [60, 70, 50, 96], [160, 70, 170, 96]].map(([a, b, c, d]) => (
        <path key={`${a}${b}`} d={`M${a} ${b} Q${(a + c) / 2 + 6} ${(b + d) / 2} ${c} ${d}`} stroke={C.walnut} strokeWidth="3" fill="none" opacity="0.6" />
      ))}
    </svg>
  );
}

export function Bun({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="80" fill="#c98a4b" />
      <path d="M100 100 m-10 0 a10 10 0 1 1 20 0 a22 22 0 1 1 -42 0 a34 34 0 1 1 66 0 a46 46 0 1 1 -90 0 a58 58 0 1 1 112 0" fill="none" stroke={C.walnut} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      {[[70, 60], [130, 70], [140, 130], [60, 130], [100, 150], [96, 52]].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="7" height="5" rx="1.5" fill={C.cream} />
      ))}
    </svg>
  );
}

export function Burrito({ className = "" }: P) {
  return (
    <svg viewBox="0 0 220 140" className={className} aria-hidden>
      <rect x="20" y="30" width="180" height="84" rx="42" fill="#e8c88f" />
      <path d="M160 30 a42 42 0 0 1 0 84 a30 42 0 0 1 0 -84z" fill="#d4ad6c" />
      <ellipse cx="160" cy="72" rx="22" ry="34" fill="#f2d36b" />
      <circle cx="152" cy="62" r="8" fill="#7cae5a" />
      <circle cx="166" cy="84" r="7" fill={C.velvet} />
      <path d="M50 44 Q80 70 60 104 M90 34 Q118 70 98 110" stroke="#c99a58" strokeWidth="4" fill="none" opacity="0.6" />
    </svg>
  );
}

export function Bean({ className = "" }: P) {
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden>
      <ellipse cx="20" cy="28" rx="17" ry="25" fill="#3b2318" />
      <path d="M20 5 Q10 28 20 51" stroke="#6b4430" strokeWidth="3.5" fill="none" />
    </svg>
  );
}

export function Lamp({ className = "" }: P) {
  return (
    <svg viewBox="0 0 120 420" className={className} aria-hidden>
      <path d="M60 0 V320" stroke={C.ink} strokeWidth="2" />
      <path d="M22 380 Q24 330 60 322 Q96 330 98 380 Z" fill={C.ink} />
      <ellipse cx="60" cy="380" rx="38" ry="7" fill="#f6c46f" />
    </svg>
  );
}

export const foodArt = { cup: Cup, iced: IcedCup, croissant: Croissant, cookie: Cookie, cake: Cake, bun: Bun, burrito: Burrito };
