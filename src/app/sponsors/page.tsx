import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";
import { SPONSOR_TIERS } from "@/data/dummy";

export const metadata = { title: "Sponsors | Techno-aiMBiAtion 2027" };

const TILE: Record<string, { box: string; mark: string; name: string }> = {
  xl: { box: "w-full max-w-sm p-6", mark: "h-20 w-20 text-4xl", name: "text-2xl" },
  lg: { box: "w-full max-w-xs p-5", mark: "h-16 w-16 text-3xl", name: "text-xl" },
  md: { box: "w-40 p-4", mark: "h-14 w-14 text-2xl", name: "text-lg" },
  sm: { box: "w-36 p-3", mark: "h-12 w-12 text-xl", name: "text-base" },
  xs: { box: "w-32 p-3", mark: "h-10 w-10 text-lg", name: "text-sm" },
};

export default function SponsorsPage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="SPONSORS"
          sub="Partner • Support • Grow"
          text="The brands and organisations that make Techno-aiMBiAtion possible."
        />
      </SceneHeader>

      <section className="max-w-5xl mx-auto px-6 py-14 space-y-12">
        {SPONSOR_TIERS.map((t) => {
          const s = TILE[t.size];
          return (
            <div key={t.name}>
              <h2 className={`text-center text-2xl font-bold mb-5 text-[#7a0c14] ${serif.className}`}>{t.name}</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {t.sponsors.map((sp) => (
                  <div
                    key={sp.name}
                    className={`${s.box} flex flex-col items-center justify-center gap-2 rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 text-center shadow-[0_8px_18px_-12px_rgba(110,11,18,0.5)]`}
                  >
                    <span
                      className={`${s.mark} flex items-center justify-center rounded-full font-bold text-white ${serif.className}`}
                      style={{ backgroundColor: sp.color }}
                    >
                      {sp.name[0]}
                    </span>
                    <span className={`${s.name} font-bold leading-tight ${serif.className}`}>{sp.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#1c0b09]/55">{sp.field}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <p className="text-center text-xs text-[#1c0b09]/50">Sample sponsors — all brands are fictional.</p>
      </section>

      <CtaBand
        title="Partner with us"
        text="Reach thousands of students, creators and innovators. Get in touch to become a sponsor."
        href="/contact"
        label="Contact us"
      />
    </PageShell>
  );
}
