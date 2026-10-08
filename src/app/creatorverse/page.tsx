import { Band, BlockButton, Marquee, PageShell, TicketCta, display } from "@/components/indie";

export const metadata = { title: "Creatorverse | Techno-aiMBiAtion 2027" };

// PLACEHOLDER programme — replace with the real Creatorverse steps and perks.
const STEPS = [
  { n: "01", title: "Pick your craft", back: "Photography, film, design or writing — choose what you love.", bg: "bg-[#ffc107]" },
  { n: "02", title: "Make it", back: "Create something that captures the spirit of the fest.", bg: "bg-[#ff6a00]" },
  { n: "03", title: "Tag it right", back: "Share your work with the official festival tags.", bg: "bg-[#ff2d8a]" },
  { n: "04", title: "Get featured", back: "The best pieces are showcased across the festival.", bg: "bg-[#7c3aed] text-white" },
  { n: "05", title: "Stay in the loop", back: "Join the creator community for updates and perks.", bg: "bg-[#3b82f6] text-white" },
];

export default function CreatorversePage() {
  return (
    <PageShell>
      <Band tone="pink" halftone className="!py-14">
        <p className="text-sm font-bold uppercase tracking-[0.3em]">Creatorverse</p>
        <h1 className="mt-3 leading-[0.88]">
          <span className="block text-7xl sm:text-9xl font-bold uppercase indie-outline-dark">Make</span>
          <span className="block text-7xl sm:text-9xl font-bold uppercase text-black">Share</span>
          <span className="block text-7xl sm:text-9xl font-bold uppercase indie-outline-dark">Shine</span>
        </h1>
        <p className="mt-6 max-w-xl text-2xl font-semibold leading-snug">
          A platform to showcase your creativity at the fest. Whether you create to entertain, inspire or simply express yourself — this is your stage.
        </p>
        <div className="mt-6"><BlockButton href="/auth/signup">Register</BlockButton></div>
      </Band>

      <Band tone="cream" className="!px-4">
        <h2 className={`text-4xl sm:text-5xl text-black mb-8 px-2 ${display.className}`}>What&apos;s your job?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} tabIndex={0} className="flip h-56 outline-none">
              <div className="flip-inner h-full w-full">
                <div className={`flip-face flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-black ${s.bg} p-4 text-center shadow-[5px_5px_0_0_#000]`}>
                  <span className="rounded-full border border-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Step {s.n}</span>
                  <span className="text-2xl font-bold uppercase leading-tight">{s.title}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-70">Flip ↻</span>
                </div>
                <div className="flip-face flip-back flex items-center justify-center rounded-xl border-2 border-black bg-black p-4 text-center shadow-[5px_5px_0_0_#000]">
                  <span className="text-lg font-semibold leading-snug text-[#f5edd8]">{s.back}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Band>

      <Marquee className="bg-white text-black font-bold uppercase tracking-widest text-lg py-1.5" text="Perks & rewards ✦ Features ✦ Merch ✦ Community ✦ " speed={40} />

      {/* the road */}
      <div aria-hidden className="grid grid-cols-3 h-72 overflow-hidden border-b-2 border-black">
        <div className="bg-[#f5edd8] flex items-end justify-center pb-6">
          <span className="rounded bg-[#fad68e] border border-black/30 px-4 py-1 text-xs font-bold uppercase tracking-widest">Community connect</span>
        </div>
        <div className="relative bg-[#2a1f17] border-x-4 border-[#f5edd8]">
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 border-l-4 border-dashed border-[#f5edd8]/80" />
          <div className="indie-drive absolute left-1/2 top-0 h-24 w-12 -translate-x-1/2 rounded-xl border-2 border-black bg-[#f5c928] shadow-[3px_3px_0_0_#000]">
            <div className="mx-1 mt-2 h-5 rounded-sm bg-[#1a2a44]" />
          </div>
        </div>
        <div className="bg-[#ff2d8a] indie-halftone" />
      </div>

      <TicketCta title="Got something to show?" text="Register and join the creator community at Techno-aiMBiAtion." href="/auth/signup" label="Register now" />
    </PageShell>
  );
}
