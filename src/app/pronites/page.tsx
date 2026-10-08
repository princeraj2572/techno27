import { EventIcon } from "@/components/event-icons";
import { CtaBand, PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";

export const metadata = { title: "Pronites | Techno-aiMBiAtion 2027" };

// PLACEHOLDER lineup — replace with the real artists and dates.
const NIGHTS = [
  { n: "Night 01", title: "Opening Night", iconKey: "music", desc: "Live performances to kick off the fest.", artist: "Artist to be announced" },
  { n: "Night 02", title: "Beats & Bass", iconKey: "mic", desc: "The big headline act of the festival.", artist: "Artist to be announced" },
  { n: "Night 03", title: "Closing Night", iconKey: "flame", desc: "A grand finale under the open sky.", artist: "Artist to be announced" },
];

export default function PronitesPage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="PRONITES"
          sub="Music • Lights • Energy"
          text="When the competitions end, the stage lights up. Evenings of live music, performances and unforgettable moments."
        />
      </SceneHeader>

      <section className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {NIGHTS.map((n) => (
          <div key={n.n} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-6 text-center shadow-[0_8px_20px_-12px_rgba(110,11,18,0.5)]">
            <span className="inline-block rounded-full bg-[#7a0c14] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">{n.n}</span>
            <div className="mx-auto my-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#fde3c6] to-[#fbf3e6] border border-[#c9a27a]/50">
              <EventIcon name={n.iconKey} className="h-9 w-9 text-[#7a0c14]" />
            </div>
            <h3 className={`text-2xl font-bold ${serif.className}`}>{n.title}</h3>
            <p className="mt-2 text-[#1c0b09]/75 leading-snug">{n.desc}</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#9b111e]">{n.artist}</p>
          </div>
        ))}
      </section>
      <p className="-mt-6 pb-12 text-center text-xs text-[#1c0b09]/50">Lineup and dates will be announced soon.</p>

      <CtaBand title="Don't miss the nights" text="Register to get your pass and be first to know the lineup." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
