import { logo } from "./logoData";

type Props = {
  className?: string;
  /** Letter color */
  color?: string;
  /** Heart accent color */
  accent?: string;
  /** Show "COFFEE & BAKERY · ON WHEELS" under the wordmark */
  tagline?: boolean;
  /** Extra class on each letter path (used for animation hooks) */
  glyphClassName?: string;
  heartClassName?: string;
  title?: string;
};

const TAG_GAP = 46;
const TAG_SIZE_PAD = 8;

/** The "אהבות קטנות" logotype, drawn from outlined letter paths so it never depends on a loaded font. */
export default function Logotype({
  className = "",
  color = "currentColor",
  accent = "#f2b65a",
  tagline = false,
  glyphClassName = "",
  heartClassName = "",
  title = "אהבות קטנות",
}: Props) {
  const { glyphs, heart, heartPath, width, height, tagline: tag } = logo;
  const vbH = tagline ? height + TAG_GAP + TAG_SIZE_PAD : height;
  const tagX = (width - tag.width) / 2;
  const tagY = height + TAG_GAP - TAG_SIZE_PAD;

  return (
    <svg viewBox={`0 0 ${width} ${vbH}`} className={className} role="img" aria-label={title} overflow="visible">
      <g fill={color}>
        {glyphs.map((d, i) => (
          <path key={i} d={d} className={glyphClassName} />
        ))}
      </g>
      <g transform={`translate(${heart.x} ${heart.y}) scale(${heart.scale})`}>
        <path d={heartPath} fill={accent} className={heartClassName} style={{ transformBox: "fill-box", transformOrigin: "50% 80%" }} />
      </g>
      {tagline && (
        <>
          <path
            d={`M${tagX - 70} ${tagY - 7}h50M${tagX + tag.width + 20} ${tagY - 7}h50`}
            stroke={color}
            strokeOpacity={0.5}
            strokeWidth={2}
          />
          <g fill={color} transform={`translate(${tagX} ${tagY})`}>
            {tag.glyphs.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </>
      )}
    </svg>
  );
}
