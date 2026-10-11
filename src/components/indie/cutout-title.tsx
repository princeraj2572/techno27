import { blockHindi } from "@/components/indie";

// Heavy "cut-out" lettering: every Latin letter is tilted and nudged a little, on a hard offset shadow,
// with a Hindi word in the same typeface beside it (like a mixed-script film title).
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

export function CutoutTitle({
  latin,
  hindi,
  color = "#ffd21f",
  shadow = "#050f2e",
  className = "",
}: {
  latin: string;
  hindi?: string;
  color?: string;
  shadow?: string;
  className?: string;
}) {
  const textShadow = `3px 3px 0 ${shadow}, 6px 6px 0 ${shadow}`;
  return (
    <h2 aria-label={hindi ? `${latin} ${hindi}` : latin} className={`flex flex-wrap items-end gap-x-4 gap-y-1 ${blockHindi.className} ${className}`} style={{ color, textShadow }}>
      <span className="text-[4rem] leading-[1.05] tracking-tight sm:text-[6.2rem]">
        <Letters text={latin} />
      </span>
      {hindi && (
        // Devanagari letters join into clusters, so the word is kept whole (only tilted), not split per letter.
        <span aria-hidden className="-rotate-3 pb-1 text-[2.9rem] leading-[1.2] sm:text-[4.4rem]">{hindi}</span>
      )}
    </h2>
  );
}
