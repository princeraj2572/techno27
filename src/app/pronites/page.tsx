import { Band, Marquee, PageHero, PageShell, TicketCta, display, serif } from "@/components/indie";

export const metadata = { title: "Pronites | Techno-aiMBiAtion 2027" };

// PLACEHOLDER lineup — replace with the real artists and dates.
const NIGHTS = [
  { n: "01", title: "Opening Night", desc: "Live performances to kick off the fest.", front: "from-[#ff6a00] to-[#a1001a]", emoji: "🎸" },
  { n: "02", title: "Beats & Bass", desc: "The big headline act of the festival.", front: "from-[#6d28d9] to-[#0f0029]", emoji: "🎧" },
  { n: "03", title: "Closing Night", desc: "A grand finale under the open sky.", front: "from-[#f5c928] to-[#c8421f]", emoji: "🎆" },
];

export default function PronitesPage() {
  return (
    <PageShell>
      <PageHero tone="indigo" title="Pronites" sub="The nights that light up the campus" ghost="After dark" />

      <Band tone="indigo" halftone className="!pt-4">
        <p className="mb-8 max-w-xl text-xl text-[#f5edd8]/85">
          When the competitions end, the stage lights up. Hover (or tap) a card to flip it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {NIGHTS.map((n) => (
            <div key={n.n} tabIndex={0} className="flip h-80 outline-none">
              <div className="flip-inner h-full w-full">
                <div className={`flip-face flex flex-col justify-between rounded-2xl border-2 border-black bg-gradient-to-br ${n.front} p-6 shadow-[6px_6px_0_0_#000]`}>
                  <span className="self-start rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#f5c928]">Flip ↻</span>
                  <div>
                    <p className="text-7xl">{n.emoji}</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-black/70">Night {n.n}</p>
                    <p className={`text-3xl text-white leading-tight ${display.className}`}>{n.title}</p>
                  </div>
                </div>
                <div className="flip-face flip-back flex flex-col justify-between rounded-2xl border-2 border-[#f5c928] bg-black p-6 shadow-[6px_6px_0_0_#f5c928]">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5c928]">Night {n.n}</p>
                  <div>
                    <p className={`text-3xl text-[#f5edd8] ${serif.className}`}>Artist TBA</p>
                    <p className="mt-2 text-lg text-[#f5edd8]/80 leading-snug">{n.desc}</p>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#ff4d4d]">Date · Venue · TBA</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-white/50">Lineup and dates will be announced soon.</p>
      </Band>

      <Marquee className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.3em] text-sm py-1.5" text="Live ● Loud ● Unforgettable ● " speed={45} />
      <TicketCta title="Don't miss the nights" text="Register to get your pass and be first to know the lineup." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
