import type { ReactNode } from "react";
import Link from "next/link";
import { Barlow_Condensed, Dela_Gothic_One } from "next/font/google";

// Shared retro "indie" theme (Rendezvous-IITD inspired) for the public pages.
export const display = Dela_Gothic_One({ weight: "400", subsets: ["latin"] });
export const body = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"] });

export const CARD = "bg-[#f5edd8] text-[#1a0505] border-2 border-black shadow-[4px_4px_0_0_#000]";
export const TITLE_SHADOW = { textShadow: "3px 3px 0 #7a1c1c" };

export const ACCENTS = ["bg-[#f5c928]", "bg-[#ff6a00]", "bg-[#ffb10f]", "bg-[#c8421f]"];

export function IndieStyles() {
  return (
    <style>{`
      @keyframes indie-spin { to { transform: rotate(360deg); } }
      @keyframes indie-marquee { to { transform: translateX(-50%); } }
      @keyframes indie-wobble { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(-2deg); } }
      @keyframes indie-tonearm { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
      .indie-marquee { animation: indie-marquee 30s linear infinite; }
      .indie-spin { animation: indie-spin 10s linear infinite; }
      .indie-wobble { animation: indie-wobble 2.4s ease-in-out infinite; }
      .indie-tonearm { animation: indie-tonearm 4s ease-in-out infinite; transform-origin: 84px 14px; }
      @media (prefers-reduced-motion: reduce) {
        .indie-marquee, .indie-spin, .indie-wobble, .indie-tonearm { animation: none; }
      }
    `}</style>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main
      className={`min-h-screen bg-[#4a0e0e] text-[#f5edd8] overflow-x-hidden ${body.className}`}
      style={{
        backgroundImage: "radial-gradient(rgba(245,237,216,0.07) 1px, transparent 1px), linear-gradient(180deg, #3a0808 0%, #4a0e0e 35%, #5a1212 100%)",
        backgroundSize: "6px 6px, 100% 100%",
      }}
    >
      <IndieStyles />
      {children}
    </main>
  );
}

export function Marquee({ text, className, speed = 30, reverse = false }: { text: string; className: string; speed?: number; reverse?: boolean }) {
  return (
    <div className={`overflow-hidden border-y-2 border-black ${className}`}>
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

export function PageHeader({ kicker, title, subtitle }: { kicker: string; title: ReactNode; subtitle?: string }) {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center md:text-left space-y-5">
      <p className="inline-block bg-[#ff6a00] text-black text-sm font-bold uppercase tracking-[0.25em] px-3 py-1 border-2 border-black -rotate-1">
        {kicker}
      </p>
      <h1
        className={`text-4xl sm:text-6xl text-[#f5c928] leading-[1.05] break-words ${display.className}`}
        style={{ textShadow: "4px 4px 0 #7a1c1c" }}
      >
        {title}
      </h1>
      {subtitle && <p className="max-w-2xl text-xl text-[#f5edd8]/80 leading-snug mx-auto md:mx-0">{subtitle}</p>}
    </section>
  );
}

export function TicketCta({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-20">
      <div className="relative bg-[#f5c928] text-black border-2 border-black shadow-[6px_6px_0_0_#000] rounded-2xl overflow-hidden">
        <span aria-hidden className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#4a0e0e] border-2 border-black" />
        <span aria-hidden className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#4a0e0e] border-2 border-black" />
        <div className="px-8 py-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">Admit one · All access</p>
          <h2 className={`text-3xl leading-tight ${display.className}`}>{title}</h2>
          <p className="text-lg leading-snug">{text}</p>
          <Link
            href={href}
            className="inline-block bg-black text-[#f5c928] hover:bg-[#ff6a00] hover:text-black transition-colors px-7 py-2.5 text-lg font-bold uppercase tracking-wider rounded-full"
          >
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
