import Image from "next/image";
import Link from "next/link";
import { Marquee, PageShell, body, devanagari, display, serif } from "@/components/indie";
import { Reveal } from "@/components/indie/motion";
import { JUNOON_ACTS, JUNOON_NIGHTS } from "@/data/dummy";

export const metadata = { title: "Junoon '27 | Techno-aiMBiAtion 2027" };

// Mood photography (AI-generated stand-ins, no real artists): one per night.
const NIGHT_PHOTOS = ["/images/junoon/night-1.jpg", "/images/junoon/night-2.jpg", "/images/junoon/night-3.jpg"];
const NIGHT_COLORS = ["#f5c928", "#ff2d8a", "#ff6a00"];

// Stage lights over the hero photo: [left %, colour, sweep s, delay s, direction]
const BEAMS: [number, string, number, number, 1 | -1][] = [
  [12, "#ff2d8a", 7, 0, 1],
  [38, "#f5c928", 9, -2, -1],
  [64, "#7c3aed", 8, -1, 1],
  [88, "#ff6a00", 10, -3, -1],
];

const EQ = Array.from({ length: 56 }, (_, i) => ({ dur: 0.7 + ((i * 37) % 9) / 10, delay: -((i * 53) % 13) / 10, h: 40 + ((i * 29) % 60) }));

// Support acts spread across the nights, poster-style.
const SUPPORT = JUNOON_ACTS.filter((a) => !JUNOON_NIGHTS.some((n) => n.artist === a.name));
const BILL = JUNOON_NIGHTS.map((n, i) => ({ night: n, support: SUPPORT.filter((_, j) => j % JUNOON_NIGHTS.length === i) }));

const CSS = `
  .jn-kb { animation: jn-kb 24s ease-in-out infinite alternate; }
  @keyframes jn-kb { from { transform: scale(1); } to { transform: scale(1.08) translateY(-1%); } }
  .jn-beam { position: absolute; top: -8%; width: 30vw; max-width: 460px; height: 110%; transform-origin: 50% 0; mix-blend-mode: screen; opacity: .5; will-change: transform;
    clip-path: polygon(47% 0, 53% 0, 100% 100%, 0 100%);
    animation: jn-sweep var(--dur) cubic-bezier(0.77, 0, 0.175, 1) var(--delay) infinite alternate; }
  @keyframes jn-sweep { from { transform: translateX(-50%) rotate(calc(var(--dir) * -20deg)); } to { transform: translateX(-50%) rotate(calc(var(--dir) * 20deg)); } }
  .jn-eq { transform-origin: 50% 100%; animation: jn-eq var(--dur) ease-in-out var(--delay) infinite alternate; }
  @keyframes jn-eq { from { transform: scaleY(.15); } to { transform: scaleY(1); } }
  /* Neon-sign logotype: tubes are a white core with pink glow; the sign flickers gently now and then (opacity only). */
  .jn-neon { color: #fff4fa; -webkit-text-stroke: 1px #ffd1ea;
    text-shadow: 0 0 4px #fff, 0 0 12px #ff2d8a, 0 0 28px #ff2d8a, 0 0 56px #ff2d8a, 0 0 90px rgba(255,45,138,.6);
    animation: jn-flicker 7s linear infinite; }
  @keyframes jn-flicker { 0%, 3%, 5%, 61%, 63%, 100% { opacity: 1; } 4% { opacity: .55; } 62% { opacity: .75; } }
  .jn-hindi { background: linear-gradient(180deg, #fff2b8, #f5c928 50%, #e08a00); -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 22px rgba(245,201,40,.45)); }
  .jn-ring { animation: jn-ring 18s linear infinite; }
  @keyframes jn-ring { to { transform: rotate(360deg); } }
  .jn-holo { background: conic-gradient(from var(--a, 0deg), #ff2d8a, #f5c928, #3b82f6, #7c3aed, #ff2d8a); animation: jn-holo 8s linear infinite; }
  @property --a { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
  @keyframes jn-holo { to { --a: 360deg; } }
  .jn-card img { transition: transform .6s cubic-bezier(0.23, 1, 0.32, 1); }
  @media (hover: hover) and (pointer: fine) { .jn-card:hover img { transform: scale(1.06); } }
  @media (prefers-reduced-motion: reduce) {
    .jn-kb, .jn-beam, .jn-eq, .jn-holo, .jn-neon, .jn-ring { animation: none; }
    .jn-beam { transform: translateX(-50%) rotate(calc(var(--dir) * 10deg)); }
  }
`;

const short = (d: string) => d.replace(/, 2027$/, ""); // "Thu, Feb 18"

export default function JunoonPage() {
  return (
    <PageShell>
      <style>{CSS}</style>

      {/* date / venue ticker, like real festival sites */}
      <Marquee className="bg-[#f5c928] text-black font-bold uppercase tracking-[0.25em] text-sm py-1.5" text={`Junoon '27 ✦ ${JUNOON_NIGHTS.length} nights ✦ ${JUNOON_NIGHTS[0].venue}, OPJU Raigarh ✦ Techno-aiMBiAtion 2027 ✦ `} speed={40} />

      {/* ---------- Hero: the crowd ---------- */}
      <section className="relative isolate flex min-h-[calc(100svh-6rem)] items-end overflow-hidden bg-black">
        <Image src="/images/junoon/hero.jpg" alt="" fill priority sizes="100vw" className="jn-kb object-cover object-center" />
        <div aria-hidden className="absolute inset-0">
          {BEAMS.map(([left, color, dur, delay, dir]) => (
            <div key={left} className="jn-beam" style={{ left: `${left}%`, background: `linear-gradient(180deg, ${color}aa 0%, ${color}22 50%, transparent 85%)`, ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${delay}s`, ["--dir" as string]: dir }} />
          ))}
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.55)_0%,rgba(0,0,0,.1)_35%,rgba(0,0,0,.55)_70%,#05030a_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#f5edd8]/80 sm:text-sm">Techno-aiMBiAtion &apos;27 presents</p>
          <h1 className="relative mt-4 mb-8 inline-block pr-20 sm:mb-10 sm:pr-40" aria-label="Junoon '27">
            {/* Devanagari in gold behind, neon English on top */}
            <span aria-hidden className={`jn-hindi absolute -bottom-[0.45em] right-16 z-10 -rotate-6 select-none text-[10vw] leading-none sm:right-36 sm:text-[5.5rem] ${devanagari.className}`}>जुनून</span>
            <span aria-hidden className={`jn-neon relative block text-[19vw] font-bold uppercase leading-[0.8] tracking-[0.04em] sm:text-[11rem] ${body.className}`}>Junoon</span>
            {/* '27 badge with circling text */}
            <span aria-hidden className="absolute right-0 top-1/2 h-20 w-20 -translate-y-1/2 sm:h-36 sm:w-36">
              <svg viewBox="0 0 100 100" className="jn-ring absolute inset-0 h-full w-full">
                <defs><path id="jn-ring-path" d="M50 50 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
                <text fill="#f5c928" fontSize="9.5" fontWeight="700" letterSpacing="2.4"><textPath href="#jn-ring-path">LIVE · LOUD · UNFORGETTABLE ·</textPath></text>
              </svg>
              <span className={`absolute inset-[22%] flex items-center justify-center rounded-full border-2 border-[#f5c928] bg-black/60 text-2xl text-[#f5c928] sm:text-4xl ${serif.className}`}>&apos;27</span>
            </span>
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-xl text-xl font-semibold leading-snug text-[#f5edd8] sm:text-2xl">
              Three nights. One stage. The lights drop, the bass hits and the whole campus sings back.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signup" className="border-2 border-black bg-[#f5c928] px-7 py-3 text-lg font-bold uppercase tracking-widest text-black shadow-[0_0_30px_rgba(245,201,40,.45),4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5">Get your pass</Link>
              <a href="#lineup" className="border-2 border-[#f5edd8]/70 bg-black/30 px-7 py-3 text-lg font-bold uppercase tracking-widest text-[#f5edd8] backdrop-blur-sm transition-colors hover:border-[#f5c928] hover:text-[#f5c928]">Lineup ↓</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Equalizer ---------- */}
      <div aria-hidden className="flex h-14 items-end gap-[3px] overflow-hidden bg-[#05030a] px-1">
        {EQ.map((b, i) => (
          <span key={i} className="jn-eq flex-1 rounded-t-sm" style={{ height: `${b.h}%`, background: "linear-gradient(0deg, #ff2d8a, #f5c928)", ["--dur" as string]: `${b.dur}s`, ["--delay" as string]: `${b.delay}s` }} />
        ))}
      </div>

      {/* ---------- Poster lineup (day columns, headliner on top) ---------- */}
      <section id="lineup" className="relative scroll-mt-20 overflow-hidden bg-[#0a0612] py-20">
        <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#f5edd8 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.5em] text-[#ff2d8a]">Live on the main stage</p>
              <h2 className={`mt-2 text-6xl leading-none text-transparent sm:text-8xl ${display.className}`} style={{ WebkitTextStroke: "2px #f5c928" }}>The Lineup</h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-[#f5c928]/25">
            {BILL.map(({ night, support }, i) => (
              <Reveal key={night.n}>
                <div className={`text-center md:px-6 ${body.className}`}>
                  <span className="inline-block px-3 py-1 text-sm font-bold uppercase tracking-[0.3em] text-black" style={{ background: NIGHT_COLORS[i] }}>
                    Night {night.n} · {short(night.date)}
                  </span>
                  <p className="mt-5 text-5xl font-bold uppercase leading-[0.9] text-[#f5edd8] lg:text-6xl">{night.artist}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em]" style={{ color: NIGHT_COLORS[i] }}>{night.genre}</p>
                  <div className="mx-auto my-5 h-px w-16 bg-[#f5edd8]/25" />
                  {support.map((a) => (
                    <p key={a.name} className="text-2xl font-bold uppercase leading-tight text-[#f5edd8]/80">{a.name}</p>
                  ))}
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-[#f5edd8]/50">{night.time} · {night.venue}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-14 text-center text-xs uppercase tracking-widest text-white/40">Sample lineup — artists and dates are placeholders.</p>
        </div>
      </section>

      {/* ---------- Crossed tapes ---------- */}
      <div aria-hidden className="relative h-40 overflow-hidden bg-[#05030a]">
        <Marquee className="absolute left-[-5%] top-12 w-[110%] -rotate-3 border-black bg-[#f5edd8] py-2 text-lg font-bold uppercase tracking-[0.3em] text-black" text="Live ● Loud ● Unforgettable ● Junoon '27 ● " speed={40} />
        <Marquee className="absolute left-[-5%] top-16 w-[110%] rotate-3 border-black bg-[#ff2d8a] py-2 text-lg font-bold uppercase tracking-[0.3em] text-black" text="Three nights ● One stage ● Main Ground ● " speed={50} reverse />
      </div>

      {/* ---------- The nights (photo cards) ---------- */}
      <section className="bg-[#05030a] pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {JUNOON_NIGHTS.map((n, i) => (
            <Reveal key={n.n}>
              <article className="jn-card group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-black">
                <Image src={NIGHT_PHOTOS[i]} alt={`${n.title} mood`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,transparent_30%,rgba(0,0,0,.85)_75%,#000_100%)]" />
                <span className={`absolute left-5 top-4 text-6xl leading-none text-white/90 ${display.className}`} style={{ textShadow: `0 0 24px ${NIGHT_COLORS[i]}` }}>{n.n}</span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.35em]" style={{ color: NIGHT_COLORS[i] }}>{n.title}</p>
                  <p className={`mt-1 text-3xl leading-tight text-white ${serif.className}`}>{n.artist}</p>
                  <p className="mt-1 text-base text-white/75">{n.desc}</p>
                  <p className="mt-3 border-t border-white/15 pt-3 text-xs font-bold uppercase tracking-widest text-white/80">{n.date} · {n.time}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- All-access pass ---------- */}
      <section className="relative overflow-hidden bg-[#05030a] pb-20">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 40%, rgba(245,201,40,.16), transparent 55%)" }} />
        <Reveal>
          <div className="relative mx-auto max-w-md px-6">
            <div aria-hidden className="mx-auto h-16 w-10 border-x-[6px] border-[#ff2d8a]" />
            <div className="jn-holo rounded-2xl border-2 border-black p-[3px] shadow-[8px_8px_0_0_#000]">
              <div className="rounded-[14px] bg-[#0a0612] p-7 text-center">
                <div aria-hidden className="mx-auto -mt-2 mb-5 h-3 w-16 rounded-full bg-[#2a2433]" />
                <p className="text-xs font-bold uppercase tracking-[0.5em] text-[#f5edd8]/60">Techno-aiMBiAtion &apos;27</p>
                <p className={`mt-2 text-5xl leading-none text-[#f5c928] ${display.className}`}>ALL ACCESS</p>
                <p className={`mt-1 text-3xl text-[#ff2d8a] ${serif.className}`}>Junoon nights</p>
                <p className="mt-5 text-lg leading-snug text-[#f5edd8]/80">Register to get your pass and be first to know the lineup.</p>
                <Link href="/auth/signup" className="mt-6 inline-block border-2 border-black bg-[#f5c928] px-7 py-3 text-lg font-bold uppercase tracking-widest text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5">Register now</Link>
                <div aria-hidden className="mt-6 flex h-10 items-stretch justify-center gap-[3px] opacity-70">
                  {Array.from({ length: 34 }, (_, i) => <span key={i} className="bg-[#f5edd8]" style={{ width: [1, 2, 1, 3, 1, 2][i % 6] }} />)}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
