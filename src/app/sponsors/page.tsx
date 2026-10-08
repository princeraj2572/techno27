import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";

export const metadata = { title: "Sponsors | Techno-aiMBiAtion 2027" };

// PLACEHOLDER tiers/slots — replace with real sponsors and logos.
const TIERS = [
  { name: "Title Sponsor", slots: 1, size: "h-32" },
  { name: "Gold Partners", slots: 3, size: "h-24" },
  { name: "Silver Partners", slots: 4, size: "h-20" },
  { name: "Associate Partners", slots: 6, size: "h-16" },
];

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
        {TIERS.map((t) => (
          <div key={t.name}>
            <h2 className={`text-center text-2xl font-bold mb-5 text-[#7a0c14] ${serif.className}`}>{t.name}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: t.slots }).map((_, i) => (
                <div
                  key={i}
                  className={`${t.size} w-40 sm:w-52 rounded-xl border-2 border-dashed border-[#c9a27a] bg-[#fffaf0]/70 flex items-center justify-center text-xs uppercase tracking-[0.25em] text-[#1c0b09]/40`}
                >
                  Logo here
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-center text-xs text-[#1c0b09]/50">Sponsors will be announced soon.</p>
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
