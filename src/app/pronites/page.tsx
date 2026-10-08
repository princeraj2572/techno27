import { Reveal } from "@/components/motion";
import { Band, Marquee, PageHero, PageShell, TicketCta, display, serif } from "@/components/indie";
import { PRONITES } from "@/data/dummy";

export const metadata = { title: "Pronites | Techno-aiMBiAtion 2027" };

const FRONTS = [
  { grad: "from-[#ff6a00] to-[#a1001a]", emoji: "🎸" },
  { grad: "from-[#6d28d9] to-[#0f0029]", emoji: "🎧" },
  { grad: "from-[#f5c928] to-[#c8421f]", emoji: "🎆" },
];

export default function PronitesPage() {
  return (
    <PageShell>
      <PageHero tone="indigo" title="Pronites" sub="The nights that light up the campus" ghost="After dark" />

      <Reveal><Band tone="indigo" halftone className="!pt-4">
        <p className="mb-8 max-w-xl text-xl text-[#f5edd8]/85">
          When the competitions end, the stage lights up. Hover (or tap) a card to meet the act.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {PRONITES.map((n, i) => (
            <div key={n.n} tabIndex={0} className="flip h-96 outline-none">
              <div className="flip-inner h-full w-full">
                <div className={`flip-face flex flex-col justify-between rounded-2xl border-2 border-black bg-gradient-to-br ${FRONTS[i].grad} p-6 shadow-[6px_6px_0_0_#000]`}>
                  <span className="self-start rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#f5c928]">Flip ↻</span>
                  <div>
                    <p className="text-7xl">{FRONTS[i].emoji}</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-black/70">Night {n.n}</p>
                    <p className={`text-3xl text-white leading-tight ${display.className}`}>{n.title}</p>
                    <p className="mt-2 text-lg font-bold uppercase tracking-wide text-white/90">{n.artist}</p>
                  </div>
                </div>
                <div className="flip-face flip-back flex flex-col justify-between rounded-2xl border-2 border-[#f5c928] bg-black p-6 shadow-[6px_6px_0_0_#f5c928]">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5c928]">Night {n.n} · {n.genre}</p>
                  <div>
                    <p className={`text-3xl text-[#f5edd8] ${serif.className}`}>{n.artist}</p>
                    <p className="mt-2 text-lg text-[#f5edd8]/80 leading-snug">{n.desc}</p>
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-[#ff4d4d]">
                    <p>{n.date}</p>
                    <p>{n.time} · {n.venue}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-white/50">Sample lineup — artists and dates are placeholders.</p>
      </Band></Reveal>

      <Marquee className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.3em] text-sm py-1.5" text="Live ● Loud ● Unforgettable ● " speed={45} />
      <TicketCta title="Don't miss the nights" text="Register to get your pass and be first to know the lineup." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
