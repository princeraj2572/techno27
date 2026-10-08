import type { Sponsor } from "@/data/dummy";
import { patternStyle, type PatternKind } from "@/data/event-themes";
import { serif } from "@/components/indie";

export type StampSize = "xl" | "lg" | "md" | "sm" | "xs";

const SIZES: Record<StampSize, { w: string; aspect: string; name: string; mono: string; logoBox: string; pad: string }> = {
  xl: { w: "w-72", aspect: "aspect-[3/4]", name: "text-3xl", mono: "text-7xl", logoBox: "h-36", pad: "p-4" },
  lg: { w: "w-60", aspect: "aspect-[3/4]", name: "text-2xl", mono: "text-6xl", logoBox: "h-28", pad: "p-4" },
  md: { w: "w-52", aspect: "aspect-[4/5]", name: "text-xl", mono: "text-5xl", logoBox: "h-24", pad: "p-3.5" },
  sm: { w: "w-44", aspect: "aspect-[4/5]", name: "text-lg", mono: "text-4xl", logoBox: "h-20", pad: "p-3" },
  xs: { w: "w-40", aspect: "aspect-[4/5]", name: "text-base", mono: "text-3xl", logoBox: "h-16", pad: "p-3" },
};

// A sponsor as a postage stamp: name on top, a framed logo space in the middle, tier at the bottom.
// Pass sponsor.logo to replace the dashed placeholder with the real logo.
export function SponsorStamp({
  sponsor,
  role,
  size,
  pattern,
}: {
  sponsor: Sponsor;
  role: string;
  size: StampSize;
  pattern: PatternKind;
}) {
  const z = SIZES[size];
  const body = (
    <div className={`stamp-shadow ${z.w}`}>
      <div className={`stamp-cut bg-[#fde9bd] ${z.pad}`}>
        <div className="bg-white p-1">
          <div
            className={`relative flex ${z.aspect} flex-col items-center justify-between overflow-hidden px-3 py-3 text-center text-white`}
            style={{ background: `linear-gradient(165deg, ${sponsor.color} 0%, ${sponsor.color}dd 55%, #1a0f08 170%)` }}
          >
            <div aria-hidden className="absolute inset-0 opacity-[0.22]" style={patternStyle(pattern, "#ffffff")} />

            <div className="relative">
              <h3 className={`${z.name} font-extrabold uppercase leading-[0.95] tracking-tight [text-shadow:0_2px_0_rgba(0,0,0,0.25)]`}>{sponsor.name}</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.3em] text-white/85">{sponsor.field}</p>
            </div>

            <div className={`relative flex w-full ${z.logoBox} items-center justify-center`}>
              {sponsor.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sponsor.logo} alt={`${sponsor.name} logo`} className="h-full w-full bg-white/95 object-contain p-2" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-white/70 bg-black/10">
                  <span className={`${z.mono} leading-none ${serif.className}`}>{sponsor.name[0]}</span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/80">Logo</span>
                </div>
              )}
            </div>

            <span className="relative border-2 border-black bg-[#f5c928] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black shadow-[2px_2px_0_0_#000]">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return sponsor.url ? (
    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="group block transition-transform hover:-translate-y-1.5 hover:-rotate-1">{body}</a>
  ) : (
    <div className="group transition-transform hover:-translate-y-1.5 hover:-rotate-1">{body}</div>
  );
}
