import type { ReactNode } from "react";
import Link from "next/link";
import { Abril_Fatface, Barlow_Condensed, Dela_Gothic_One, Lora } from "next/font/google";

// Retro "indie" theme, inspired by the Rendezvous IITD site's structure:
// full-bleed colour bands, torn paper edges, mandala + halftone texture,
// pinned notes, flip cards and a retro radio / departures board.
export const display = Dela_Gothic_One({ weight: "400", subsets: ["latin"] });
export const body = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"] });
export const serif = Abril_Fatface({ weight: "400", subsets: ["latin"] });
export const paper = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export const CARD = "bg-[#f5edd8] text-[#1a0505] border-2 border-black shadow-[4px_4px_0_0_#000]";
export const TITLE_SHADOW = { textShadow: "3px 3px 0 #7a1c1c" };
export const ACCENTS = ["bg-[#f5c928]", "bg-[#ff6a00]", "bg-[#ffb10f]", "bg-[#c8421f]"];

export function IndieStyles() {
  return (
    <style>{`
      @keyframes indie-spin { to { transform: rotate(360deg); } }
      @keyframes indie-spin-rev { to { transform: rotate(-360deg); } }
      @keyframes indie-marquee { to { transform: translateX(-50%); } }
      @keyframes indie-wobble { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(-2deg); } }
      @keyframes indie-tonearm { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
      @keyframes indie-drive { from { transform: translateY(-30%); } to { transform: translateY(130%); } }
      @keyframes indie-train { from { transform: translateX(-60%); } to { transform: translateX(110%); } }
      @keyframes indie-float { 0%,100% { transform: translateY(0) rotate(var(--r, -4deg)); } 50% { transform: translateY(-10px) rotate(calc(var(--r, -4deg) + 3deg)); } }
      @keyframes indie-pop { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
      @keyframes indie-shine { from { background-position: -200% 0; } to { background-position: 200% 0; } }
      @keyframes indie-rise { 0% { opacity: 0; transform: translateY(110%); } 20% { opacity: 1; } 100% { opacity: 1; transform: translateY(0); } }
      @keyframes indie-cloud { from { transform: translateY(0); } to { transform: translateY(-0.8vw); } }
      @keyframes indie-metro { from { transform: translateX(-60vw); } to { transform: translateX(115vw); } }
      @keyframes indie-bob { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 7px); } }
      @keyframes indie-vup { from { transform: translateY(0); } to { transform: translateY(-50%); } }
      @keyframes indie-vdown { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      @keyframes indie-qshake { 0%,100% { transform: rotate(0); } 15% { transform: rotate(-14deg); } 30% { transform: rotate(12deg); } 45% { transform: rotate(-9deg); } 60% { transform: rotate(6deg); } 75% { transform: rotate(0); } }
      @keyframes indie-splash-out { to { transform: translateY(-100%); visibility: hidden; } }
      @keyframes indie-blink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
      .indie-marquee { animation: indie-marquee 30s linear infinite; }
      .indie-spin { animation: indie-spin 10s linear infinite; }
      .indie-spin-slow { animation: indie-spin 40s linear infinite; }
      .indie-spin-rev { animation: indie-spin-rev 60s linear infinite; }
      .indie-wobble { animation: indie-wobble 2.4s ease-in-out infinite; }
      .indie-tonearm { animation: indie-tonearm 4s ease-in-out infinite; transform-origin: 84px 14px; }
      .indie-drive { animation: indie-drive 6s linear infinite; }
      .indie-train { animation: indie-train 18s linear infinite; }
      .indie-blink { animation: indie-blink 1.2s steps(2) infinite; }
      .indie-rise { animation: indie-rise 3s cubic-bezier(.16,1,.3,1) both; }
      .indie-cloud { animation: indie-cloud 3s ease-in-out infinite alternate; }
      .indie-metro { animation: indie-metro 16s linear infinite; }
      .indie-bob { animation: indie-bob 2.2s ease-in-out infinite; }
      .indie-vup { animation: indie-vup 24s linear infinite; }
      .indie-vdown { animation: indie-vdown 28s linear infinite; }
      .indie-qshake { animation: indie-qshake 2s ease-in-out infinite; transform-origin: 50% 80%; }
      .indie-vfade { -webkit-mask-image: linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent); mask-image: linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent); }

      .splash { position: fixed; inset: 0; z-index: 100; background: #4a0e0e; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; transition: transform .75s cubic-bezier(.7,0,.3,1); animation: indie-splash-out .01s linear 6s forwards; }
      .splash.out { transform: translateY(-100%); }

      /* Postage-stamp edge: scalloped holes cut along all four sides */
      .stamp-cut {
        -webkit-mask:
          radial-gradient(circle 7px at 50% 0, transparent 98%, #000) 0 0 / 22px 100% repeat-x,
          radial-gradient(circle 7px at 50% 100%, transparent 98%, #000) 0 0 / 22px 100% repeat-x,
          radial-gradient(circle 7px at 0 50%, transparent 98%, #000) 0 0 / 100% 22px repeat-y,
          radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) 0 0 / 100% 22px repeat-y;
        -webkit-mask-composite: source-in;
        mask:
          radial-gradient(circle 7px at 50% 0, transparent 98%, #000) 0 0 / 22px 100% repeat-x,
          radial-gradient(circle 7px at 50% 100%, transparent 98%, #000) 0 0 / 22px 100% repeat-x,
          radial-gradient(circle 7px at 0 50%, transparent 98%, #000) 0 0 / 100% 22px repeat-y,
          radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) 0 0 / 100% 22px repeat-y;
        mask-composite: intersect;
      }
      .stamp-shadow { filter: drop-shadow(5px 6px 0 rgba(0,0,0,.5)); transition: transform .25s ease, filter .25s ease; }
      .group:hover .stamp-shadow { transform: translateY(-6px) rotate(-1.2deg); filter: drop-shadow(9px 11px 0 rgba(0,0,0,.5)); }
      .stamp-scene svg { transition: transform .5s ease; }
      .group:hover .stamp-scene svg { transform: scale(1.06); }

      /* Pinned "drawer" sections that slide over one another (large screens only) */
      @media (min-width: 768px) and (min-height: 760px) {
        .panel { position: sticky; top: 0; min-height: 100vh; display: flex; align-items: center; }
        .panel > .panel-inner { width: 100%; }
      }
      .indie-float { animation: indie-float 5s ease-in-out infinite; }
      .indie-pop { animation: indie-pop .5s ease both; }
      .indie-shine { background-image: linear-gradient(110deg, transparent 40%, rgba(255,255,255,.55) 50%, transparent 60%); background-size: 200% 100%; animation: indie-shine 3.2s linear infinite; }
      .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
      .reveal.in { opacity: 1; transform: none; }

      .indie-mandala {
        background-image:
          radial-gradient(circle at 50% 50%, transparent 0 7px, rgba(0,0,0,.16) 7px 9px, transparent 9px 17px, rgba(0,0,0,.12) 17px 19px, transparent 19px 27px, rgba(0,0,0,.1) 27px 29px, transparent 29px),
          radial-gradient(rgba(0,0,0,.18) 1px, transparent 1px);
        background-size: 64px 64px, 5px 5px;
      }
      .indie-halftone {
        background-image: radial-gradient(circle, rgba(0,0,0,.28) 22%, transparent 24%);
        background-size: 16px 16px;
      }
      .indie-outline { color: transparent; -webkit-text-stroke: 2px #fff; text-shadow: 4px 4px 0 #c1121f; }
      .indie-outline-dark { color: transparent; -webkit-text-stroke: 3px #000; }
      .indie-hscroll { scrollbar-width: thin; scrollbar-color: #f5c928 transparent; }
      .indie-stamp { border: 5px dotted #000; background: #f5edd8; }
      .indie-grille { background-image: radial-gradient(#2a1a10 1.6px, transparent 1.7px); background-size: 9px 9px; background-color: #b9a88c; }

      .flip { perspective: 1000px; }
      .flip-inner { position: relative; transition: transform .6s; transform-style: preserve-3d; }
      .flip:hover .flip-inner, .flip:focus-within .flip-inner, .flip.is-flipped .flip-inner { transform: rotateY(180deg); }
      .flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .flip-back { transform: rotateY(180deg); }

      @media (prefers-reduced-motion: reduce) {
        .indie-marquee, .indie-spin, .indie-spin-slow, .indie-spin-rev, .indie-wobble, .indie-tonearm,
        .indie-drive, .indie-train, .indie-blink, .indie-float, .indie-pop, .indie-shine,
        .indie-rise, .indie-cloud, .indie-metro, .indie-bob, .indie-vup, .indie-vdown, .indie-qshake { animation: none; }
        .splash { display: none; }
        .stamp-shadow, .stamp-scene svg { transition: none; }
        .reveal { opacity: 1; transform: none; transition: none; }
        .flip-inner { transition: none; }
      }
    `}</style>
  );
}

export function PageShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <main
      className={`min-h-screen bg-[#4a0e0e] text-[#f5edd8] overflow-x-clip ${body.className}`}
      style={{
        backgroundImage: "radial-gradient(rgba(245,237,216,0.07) 1px, transparent 1px), linear-gradient(180deg, #3a0808 0%, #4a0e0e 35%, #5a1212 100%)",
        backgroundSize: "6px 6px, 100% 100%",
      }}
    >
      <IndieStyles />
      {children}
      {footer && <SiteFooter />}
    </main>
  );
}

export function Marquee({ text, className, speed = 30, reverse = false, style }: { text: string; className: string; speed?: number; reverse?: boolean; style?: React.CSSProperties }) {
  return (
    <div className={`overflow-hidden border-y-2 border-black ${className}`} style={style}>
      <div
        className="indie-marquee flex w-max whitespace-nowrap"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((n) => (
          <span key={n} className="pr-8">{text.repeat(6)}</span>
        ))}
      </div>
    </div>
  );
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl sm:text-4xl text-[#f5edd8] ${display.className} ${className}`} style={TITLE_SHADOW}>
      {children}
    </h2>
  );
}

// ---- Line-art mandala backdrop (orange field, brown petals, beads, dotted texture) ----

function Petals({ n, r, w, fill = "none" }: { n: number; r: number; w: number; fill?: string }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <path
          key={i}
          fill={fill}
          transform={`rotate(${(360 / n) * i})`}
          d={`M0,${-r} C${w},${-r * 0.72} ${w},${-r * 0.3} 0,0 C${-w},${-r * 0.3} ${-w},${-r * 0.72} 0,${-r} Z`}
        />
      ))}
    </>
  );
}

function Beads({ n, r, size }: { n: number; r: number; size: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (Math.PI * 2 * i) / n;
        return <circle key={i} cx={Math.round(Math.cos(a) * r * 100) / 100} cy={Math.round(Math.sin(a) * r * 100) / 100} r={size} />;
      })}
    </>
  );
}

function Mandala({ cx, cy, s, rot = 0 }: { cx: number; cy: number; s: number; rot?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
      <Petals n={12} r={330} w={100} fill="rgba(160,50,0,0.10)" />
      <Petals n={12} r={250} w={74} />
      <Beads n={40} r={350} size={7} />
      <Beads n={28} r={285} size={5} />
      <Petals n={8} r={170} w={56} fill="rgba(160,50,0,0.10)" />
      <Beads n={20} r={190} size={5} />
      <Petals n={16} r={90} w={20} />
      <circle r={62} />
      <circle r={42} />
      <circle r={14} fill="rgba(160,50,0,0.35)" />
    </g>
  );
}

export function MandalaArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke="#a8400b" strokeWidth="3" strokeLinejoin="round" opacity="0.55">
        <Mandala cx={1380} cy={120} s={1.15} rot={8} />
        <Mandala cx={140} cy={820} s={1.0} rot={-12} />
        <Mandala cx={820} cy={470} s={0.55} rot={20} />
        <Mandala cx={1560} cy={860} s={0.6} rot={0} />
        <Mandala cx={90} cy={60} s={0.5} rot={14} />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(120,30,0,0.38) 1px, transparent 1.3px)", backgroundSize: "6px 6px" }} />
    </div>
  );
}

// ---- Full-bleed colour bands ----

const BAND_TONES = {
  crimson: "bg-[#a1001a] text-[#f5edd8]",
  indigo: "bg-[#0f0029] text-[#f5edd8]",
  blue: "bg-[#0b2a6b] text-[#f5edd8]",
  cream: "bg-[#f5edd8] text-[#1a0505]",
  parchment: "bg-[#fad68e] text-[#1a0505]",
  orange: "bg-[#f65f00] text-black",
  amber: "bg-[#e8851a] text-black",
  maroon: "bg-[#4a0e0e] text-[#f5edd8]",
  black: "bg-black text-[#f5edd8]",
  pink: "bg-[#ff2d8a] text-black",
} as const;
export type BandTone = keyof typeof BAND_TONES;

export function Band({
  tone, zigzag, mandala = false, halftone = false, ghost, panel = false, art = false, className = "", children,
}: {
  tone: BandTone;
  zigzag?: string;
  mandala?: boolean;
  halftone?: boolean;
  ghost?: string;
  panel?: boolean;
  art?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden ${panel ? "panel" : ""} ${BAND_TONES[tone]} ${mandala ? "indie-mandala" : ""} ${halftone ? "indie-halftone" : ""}`}>
      {art && <MandalaArt />}
      {zigzag && (
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-5 z-10"
          style={{
            background: `linear-gradient(135deg, ${zigzag} 25%, transparent 25%) -10px 0/20px 20px, linear-gradient(225deg, ${zigzag} 25%, transparent 25%) -10px 0/20px 20px`,
          }}
        />
      )}
      {ghost && (
        <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex flex-col justify-around overflow-hidden opacity-[0.09]">
          {[0, 1, 2, 3].map((r) => (
            <p key={r} className={`whitespace-nowrap text-7xl sm:text-8xl font-bold uppercase ${r % 2 ? "-ml-40" : "-ml-10"}`}>
              {`${ghost} · `.repeat(6)}
            </p>
          ))}
        </div>
      )}
      <div className={`panel-inner relative max-w-5xl mx-auto px-6 ${zigzag ? "pt-20 pb-16" : "py-16"} ${className}`}>{children}</div>
    </section>
  );
}

// Page hero: coloured band with a big outlined title (like the Events / Schedule / Sponsors pages).
export function PageHero({
  tone = "crimson", title, sub, outline = false, ghost, art = false, children,
}: {
  tone?: BandTone;
  title: string;
  sub?: string;
  outline?: boolean;
  ghost?: string;
  art?: boolean;
  children?: ReactNode;
}) {
  const light = tone === "orange" || tone === "amber" || tone === "parchment";
  return (
    <Band tone={tone} art={art} mandala={tone !== "blue" && !art} ghost={ghost ?? `${title} `} className="!py-12 sm:!py-16">
      <h1
        className={`text-5xl sm:text-7xl leading-[0.95] ${outline ? "indie-outline" : light ? "text-[#a1001a]" : "text-[#f5c928]"} ${serif.className}`}
        style={outline ? undefined : { textShadow: light ? "3px 3px 0 rgba(255,236,200,0.8)" : "4px 4px 0 #5a0010" }}
      >
        {title}
      </h1>
      {sub && <p className={`mt-3 text-2xl sm:text-3xl font-bold uppercase ${light ? "text-black" : "text-[#f5edd8]"}`}>{sub}</p>}
      {children && <div className="mt-6">{children}</div>}
    </Band>
  );
}

// Pinned paper note with tape.
export function Note({
  tag, date, title, children, tilt = "-rotate-2",
}: { tag: string; date?: string; title: string; children: ReactNode; tilt?: string }) {
  return (
    <article className={`relative bg-[#f5edd8] text-[#1a0505] p-5 pt-6 shadow-[3px_4px_0_0_rgba(0,0,0,0.45)] ${tilt} hover:rotate-0 hover:-translate-y-1 transition-all`}>
      <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#d9b36a]/80 border border-black/20 rotate-2" />
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-[#7a1c1c] text-[#f5edd8] text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5">{tag}</span>
        {date && <span className="text-xs font-semibold uppercase tracking-wider text-black/50">{date}</span>}
      </div>
      <h3 className="text-xl font-bold uppercase leading-tight tracking-wide">{title}</h3>
      <div className={`mt-2 text-sm leading-relaxed text-black/70 italic border-t border-black/15 pt-2 ${paper.className}`}>{children}</div>
    </article>
  );
}

// Square black button (as on the reference site).
export function BlockButton({ href, children, tone = "black" }: { href: string; children: ReactNode; tone?: "black" | "cream" | "mustard" }) {
  const tones = {
    black: "bg-black text-white hover:bg-[#f5c928] hover:text-black",
    cream: "bg-[#f5edd8] text-black hover:bg-[#f5c928]",
    mustard: "bg-[#f5c928] text-black border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5",
  };
  return (
    <Link href={href} className={`inline-block px-8 py-3 text-lg font-bold uppercase tracking-widest transition ${tones[tone]}`}>
      {children}
    </Link>
  );
}

// Big decorative record.
export function Vinyl({ className = "", label = "TRX'27", slow = false }: { className?: string; label?: string; slow?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g className={slow ? "indie-spin-slow" : "indie-spin"} style={{ transformOrigin: "50px 50px" }}>
        <circle cx="50" cy="50" r="48" fill="#1a0505" stroke="#000" strokeWidth="1.5" />
        {[42, 37, 32, 27, 22].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#7a1c1c" strokeWidth="0.7" />
        ))}
        <circle cx="50" cy="50" r="15" fill="#f5c928" stroke="#000" strokeWidth="1.5" />
        <text x="50" y="52" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1a0505">{label}</text>
        <circle cx="50" cy="50" r="1.6" fill="#000" />
      </g>
    </svg>
  );
}

// The big black wheel with rotating words (home hero).
export function Wheel({ className = "" }: { className?: string }) {
  const words = "EVENTS • SCHEDULE • JUNOON • CREATORVERSE • SPONSORS • ";
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="98" fill="#2e2e2e" stroke="#000" strokeWidth="2" />
      <defs>
        <path id="wheel-outer" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
        <path id="wheel-mid" d="M100,100 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
      </defs>
      <g className="indie-spin-slow" style={{ transformOrigin: "100px 100px" }}>
        <text fill="#fff" fontSize="17" fontWeight="800" letterSpacing="2.5">
          <textPath href="#wheel-outer">{words}</textPath>
        </text>
      </g>
      <g className="indie-spin-rev" style={{ transformOrigin: "100px 100px" }}>
        <text fill="#f5edd8" fontSize="14" fontWeight="700" letterSpacing="2">
          <textPath href="#wheel-mid">{"ENTRY PASS • TRX27 • QR PASS • "}</textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="34" fill="#7a1c1c" stroke="#000" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="9" fill="#1a0505" />
    </svg>
  );
}

export function TicketCta({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="relative bg-[#f5c928] text-black border-2 border-black shadow-[6px_6px_0_0_#000] rounded-2xl overflow-hidden">
        <span aria-hidden className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#4a0e0e] border-2 border-black" />
        <span aria-hidden className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#4a0e0e] border-2 border-black" />
        <div className="px-8 py-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">Admit one · All access</p>
          <h2 className={`text-3xl leading-tight ${display.className}`}>{title}</h2>
          <p className="text-lg leading-snug">{text}</p>
          <BlockButton href={href}>{label}</BlockButton>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-black text-[#f5edd8]">
      <div className="max-w-5xl mx-auto px-6 py-10 grid sm:grid-cols-2 gap-8">
        <div className="flex items-start gap-3">
          <svg viewBox="0 0 100 100" className="h-12 w-12 shrink-0" aria-hidden>
            <circle cx="50" cy="50" r="46" fill="#7a1c1c" stroke="#f5c928" strokeWidth="4" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="#000" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="11" fill="#f5c928" />
          </svg>
          <div>
            <p className={`text-2xl text-[#f5c928] ${serif.className}`}>Techno-aiMBiAtion &apos;27</p>
            <p className="text-sm uppercase tracking-widest text-[#f5edd8]/70">Where innovation meets culture</p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-sm font-bold uppercase tracking-widest text-[#f5c928] mb-2">Contact us</p>
          <p className="text-[#f5edd8]/80">O.P. Jindal University, Raigarh</p>
          <Link href="/contact" className="text-[#f5edd8]/80 underline hover:text-[#f5c928]">Meet the team</Link>
        </div>
      </div>
      <div className="border-t border-white/15 py-3 text-center text-xs uppercase tracking-widest text-[#f5edd8]/50">
        © 2027 Techno-aiMBiAtion · All rights reserved
      </div>
    </footer>
  );
}
