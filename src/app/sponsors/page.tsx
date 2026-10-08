import { Reveal } from "@/components/motion";
import { Band, BlockButton, PageShell, serif } from "@/components/indie";
import { SPONSOR_TIERS } from "@/data/dummy";

export const metadata = { title: "Sponsors | Techno-aiMBiAtion 2027" };

const TILE: Record<string, { box: string; mark: string; name: string }> = {
  xl: { box: "w-full max-w-sm p-6", mark: "h-20 w-20 text-4xl", name: "text-3xl" },
  lg: { box: "w-full max-w-xs p-5", mark: "h-16 w-16 text-3xl", name: "text-2xl" },
  md: { box: "w-40 p-4", mark: "h-14 w-14 text-2xl", name: "text-xl" },
  sm: { box: "w-36 p-3", mark: "h-12 w-12 text-xl", name: "text-lg" },
  xs: { box: "w-32 p-3", mark: "h-10 w-10 text-lg", name: "text-base" },
};

export default function SponsorsPage() {
  return (
    <PageShell>
      <Reveal><Band tone="orange" mandala className="!pb-20">
        <h1 className="text-5xl sm:text-7xl font-bold uppercase leading-none text-black">Sponsors</h1>
        <p className="mt-2 text-xl font-semibold text-black/80">The brands and partners powering Techno-aiMBiAtion &apos;27.</p>

        <div className="mt-12 space-y-12">
          {SPONSOR_TIERS.map((t) => {
            const s = TILE[t.size];
            return (
              <div key={t.name}>
                <h2 className={`mb-4 text-center text-2xl text-black ${serif.className}`}>{t.name}</h2>
                <div className="flex flex-wrap justify-center gap-5">
                  {t.sponsors.map((sp) => (
                    <div
                      key={sp.name}
                      className={`${s.box} flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#ffd9c4] text-center shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1`}
                    >
                      <span
                        className={`${s.mark} flex items-center justify-center rounded-full border-2 border-black font-bold text-white ${serif.className}`}
                        style={{ backgroundColor: sp.color }}
                      >
                        {sp.name[0]}
                      </span>
                      <span className={`${s.name} font-bold leading-tight text-black`}>{sp.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">{t.role} · {sp.field}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-black/60">Sample sponsors — all brands are fictional.</p>
      </Band></Reveal>

      <Reveal><Band tone="black">
        <div className="text-center space-y-4">
          <h2 className={`text-4xl sm:text-5xl text-[#f5c928] ${serif.className}`}>Partner with us</h2>
          <p className="mx-auto max-w-xl text-xl text-[#f5edd8]/80">Reach thousands of students, creators and innovators. Get in touch to become a sponsor.</p>
          <BlockButton href="/contact" tone="mustard">Contact us</BlockButton>
        </div>
      </Band></Reveal>
    </PageShell>
  );
}
