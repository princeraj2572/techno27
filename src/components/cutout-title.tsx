import { blockHindi } from "@/components/indie";

// Heavy "cut-out" lettering: every Latin letter is tilted and nudged a little, on a hard offset shadow,
// with an optional Hindi word in the same typeface (like a mixed-script film title).
// Offsets are fixed lists (not random) so server and browser render identically.

const ROT = [-5, 3, -2, 5, -4, 2, -3, 4];
const DY = [0, 5, -4, 3, -5, 2, -3, 4];
const SCALE = [1, 0.92, 1.07, 0.95, 1.05, 0.9, 1.03, 0.97];

function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {[...text].map((ch, i) => {
        const k = (i + offset) % ROT.length;
        return (
          <span
            key={i}
            aria-hidden
            className="inline-block"
            style={{ transform: `translateY(${DY[k]}px) rotate(${ROT[k]}deg) scale(${SCALE[k]})` }}
          >
            {ch}
          </span>
        );
      })}
    </>
  );
}

const SIZES = {
  md: { latin: "text-[4rem] leading-[1.05] sm:text-[6.2rem]", hindi: "text-[2.9rem] leading-[1.2] sm:text-[4.4rem]" },
  hero: { latin: "text-[3rem] leading-[1.02] sm:text-[4.9rem]", hindi: "text-[2.2rem] leading-[1.2] sm:text-[3.4rem]" },
} as const;

export function CutoutTitle({
  latin,
  hindi,
  color = "#ffd21f",
  lineColors,
  shadow = "#050f2e",
  size = "md",
  as: Tag = "h2",
  className = "",
}: {
  latin: string | string[]; // an array puts each entry on its own line
  hindi?: string;
  color?: string;
  lineColors?: string[]; // optional colour per Latin line
  shadow?: string;
  size?: keyof typeof SIZES;
  as?: "h1" | "h2";
  className?: string;
}) {
  const lines = Array.isArray(latin) ? latin : [latin];
  const z = SIZES[size];
  const textShadow = `3px 3px 0 ${shadow}, 6px 6px 0 ${shadow}`;
  return (
    <Tag
      aria-label={[...lines, hindi].filter(Boolean).join(" ")}
      className={`flex flex-wrap items-end gap-x-4 gap-y-1 ${blockHindi.className} ${className}`}
      style={{ color, textShadow }}
    >
      {lines.length === 1 ? (
        <span className={`${z.latin} tracking-tight`}><Letters text={lines[0]} /></span>
      ) : (
        <span className="block w-full">
          {lines.map((l, i) => (
            <span key={i} className={`block ${z.latin} tracking-tight`} style={lineColors?.[i] ? { color: lineColors[i] } : undefined}>
              <Letters text={l} offset={i * 3} />
            </span>
          ))}
        </span>
      )}
      {hindi && (
        // Devanagari letters join into clusters, so the word is kept whole (only tilted), not split per letter.
        <span aria-hidden className={`-rotate-2 pb-1 ${z.hindi}`}>{hindi}</span>
      )}
    </Tag>
  );
}
