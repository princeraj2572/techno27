import { Band, BlockButton, PageShell, serif } from "@/components/indie";

export const metadata = { title: "Sponsors | Techno-aiMBiAtion 2027" };

// PLACEHOLDER tiers/slots — replace with real sponsors and logos.
const TIERS = [
  { name: "Title Sponsor", role: "Title partner", slots: 1, tile: "h-40 w-full max-w-sm" },
  { name: "Co-Powered By", role: "Co-powered by", slots: 2, tile: "h-36 w-full max-w-xs" },
  { name: "Gold Partners", role: "Gold partner", slots: 4, tile: "h-28 w-40" },
  { name: "Silver Partners", role: "Silver partner", slots: 6, tile: "h-24 w-36" },
  { name: "Associate Partners", role: "Associate", slots: 8, tile: "h-20 w-32" },
];

export default function SponsorsPage() {
  return (
    <PageShell>
      <Band tone="orange" mandala className="!pb-20">
        <h1 className="text-5xl sm:text-7xl font-bold uppercase leading-none text-black">Sponsors</h1>
        <p className="mt-2 text-xl font-semibold text-black/80">The brands and partners powering Techno-aiMBiAtion &apos;27.</p>

        <div className="mt-12 space-y-12">
          {TIERS.map((t) => (
            <div key={t.name}>
              <h2 className={`mb-4 text-center text-2xl text-black ${serif.className}`}>{t.name}</h2>
              <div className="flex flex-wrap justify-center gap-5">
                {Array.from({ length: t.slots }).map((_, i) => (
                  <div
                    key={i}
                    className={`${t.tile} flex flex-col items-center justify-center rounded-xl border-2 border-black bg-[#ffd9c4] shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1`}
                  >
                    <span className="text-xl font-bold uppercase tracking-widest text-black/40">Logo</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">{t.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-black/60">Sponsors will be announced soon.</p>
      </Band>

      <Band tone="black">
        <div className="text-center space-y-4">
          <h2 className={`text-4xl sm:text-5xl text-[#f5c928] ${serif.className}`}>Partner with us</h2>
          <p className="mx-auto max-w-xl text-xl text-[#f5edd8]/80">Reach thousands of students, creators and innovators. Get in touch to become a sponsor.</p>
          <BlockButton href="/contact" tone="mustard">Contact us</BlockButton>
        </div>
      </Band>
    </PageShell>
  );
}
