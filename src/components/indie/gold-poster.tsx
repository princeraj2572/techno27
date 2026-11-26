// The "gold poster" look shared by the home hero, the auth pages and the logged-in form pages:
// sunburst rays with a warm glow, halftone dots and paper grain, cream admission-ticket cards with ink outlines.
import type { ReactNode } from "react";
import Link from "next/link";
import { display } from "@/components/indie";
import { mono } from "@/components/home/fonts";
import { Burst, Sparkle } from "@/components/home/hero-art";

export const INK = "#1c1812";
export const CREAM = "#f3e8cf";

/** The one card style for app pages: white, 3px ink outline, rounded, ink drop shadow. Never nest one inside another;
 *  blocks inside a card use INSET instead (tinted, no outline). */
export const CARD_UI = "rounded-2xl border-[3px] border-[#1c1812] bg-white shadow-[0_4px_0_#1c1812]";
/** Same frame for coloured notice cards; add your own bg-*. */
export const NOTE_UI = "rounded-2xl border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]";
export const INSET = "rounded-xl bg-[#f6efdf]";
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

/** Full-bleed sunburst behind a `relative` parent; `at` is the rays' centre. */
export function GoldBackdrop({ at = "50% 38%", sparkles = true }: { at?: string; sparkles?: boolean }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#f2b31c]" />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `repeating-conic-gradient(from 0deg at ${at}, #f5c928 0deg 7deg, #e9a11a 7deg 14deg)` }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at ${at}, rgba(255,236,170,.8), transparent 42%)` }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 indie-halftone opacity-[0.12]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: NOISE }} />
      {sparkles && (
        <>
          <Sparkle fill="#ff2d8a" className="pointer-events-none absolute left-[9%] top-[18%] hidden h-6 w-6 sm:block" />
          <Sparkle fill="#0e7c7b" className="pointer-events-none absolute bottom-[12%] right-[10%] hidden h-5 w-5 sm:block" />
        </>
      )}
    </>
  );
}

/** Cream letters with an ink outline and drop, like the home hero's lettering. */
export function TicketTitle({ children, className = "", as: Tag = "h1" }: { children: ReactNode; className?: string; as?: "h1" | "h2" }) {
  return (
    <Tag className={`${display.className} ${className}`} style={{ color: CREAM, WebkitTextStroke: `2px ${INK}`, paintOrder: "stroke fill", textShadow: `0 4px 0 ${INK}` }}>
      {children}
    </Tag>
  );
}

/** "ADMIT ONE ……… tag" strip at the top of a ticket. `dark` for use on ink panels. */
export function TicketHeader({ right, dark = false }: { right?: string; dark?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`text-[10px] tracking-[0.3em] lg:text-xs ${dark ? "text-[#f5c928]" : "text-[#ef5a1c]"} ${mono.className}`}>ADMIT ONE</span>
      {right && (
        <span className={`truncate text-[10px] uppercase tracking-[0.25em] ${mono.className}`} style={{ color: dark ? CREAM : INK }}>
          {right}
        </span>
      )}
    </div>
  );
}

export function FestLogo({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/brand/logo.webp" alt="Techno-aiMBiAtion 2027" className={`mx-auto ${className}`} />;
}

/** Pink "16th edition" starburst for a ticket's corner (wider screens only: on phones it would cover the header). */
export function EditionSticker({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`auth-sticker absolute z-10 hidden h-16 w-16 rotate-12 place-items-center sm:grid lg:h-20 lg:w-20 ${className}`}>
      <Burst n={12} ro={48} ri={36} fill="#ff2d8a" className="absolute inset-0 h-full w-full" />
      <span className="relative text-center text-[9px] font-extrabold uppercase leading-tight text-white lg:text-[10px]">16th<br />edition</span>
    </div>
  );
}

/** Pill link in the hero's button style (teal by default). */
export function PillLink({ href, children, tone = "teal", className = "" }: { href: string; children: ReactNode; tone?: "teal" | "orange"; className?: string }) {
  const bg = tone === "teal" ? "linear-gradient(180deg,#178f8c,#0e5b57)" : "linear-gradient(180deg,#ffa63d,#ef5a1c)";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full border-[3px] px-5 py-2 text-sm font-extrabold uppercase tracking-wide transition hover:-translate-y-0.5 hover:brightness-110 ${className}`}
      style={{ background: bg, color: tone === "teal" ? CREAM : INK, borderColor: INK, boxShadow: `inset 0 0 0 3px rgba(255,240,210,.45), 0 4px 0 ${INK}` }}
    >
      {children}
    </Link>
  );
}
