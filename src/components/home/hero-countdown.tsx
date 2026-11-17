"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Arrow, Burst, CREAM, INK, Sparkle, Star } from "./hero-art";
import { mono, pixel, sans } from "./fonts";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

// Stacked outlines (ink / gold / ink) around cream pixel digits, as in the poster.
const OUTLINES = [{ c: INK, w: 0.13 }, { c: "#c9a24a", w: 0.09 }, { c: INK, w: 0.05 }];

// Right half of the hero. Everything is sized in em so it scales with the wrapper's clamp()ed font-size.
export function HeroCountdown({ to }: { to: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(to).getTime();
    const tick = () => setT(parts(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);

  return (
    <div role="timer" aria-label="Time until the fest starts" className="relative mx-auto w-[34em] max-w-full" style={{ fontSize: "clamp(9px, min(1.16vw, 2vh), 25px)" }}>
      {/* background doodles */}
      <Burst n={11} ro={48} ri={24} seed={2} fill="#efe2c4" className="hi-pop absolute -left-[3em] -top-[2.5em] h-[11em] w-[11em] -rotate-12 opacity-95" style={{ ["--d" as string]: 0.26 }} />
      <Burst n={10} ro={48} ri={30} seed={5} fill="#c4512b" className="hi-pop absolute left-[9em] top-[14.5em] h-[16em] w-[16em]" style={{ ["--d" as string]: 0.32 }} />
      <Burst n={10} ro={48} ri={26} seed={1} fill="#efd7c4" className="hi-pop absolute -right-[2em] top-[15em] h-[6em] w-[6em] rotate-12" style={{ ["--d" as string]: 0.38 }} />
      <Sparkle className="hi-twinkle absolute right-[1.5em] top-[1em] h-[2em] w-[2em]" style={{ ["--d" as string]: 0.35 }} />
      <Sparkle fill="#c4512b" className="hi-twinkle absolute left-[8em] top-[7em] h-[1.4em] w-[1.4em]" style={{ ["--d" as string]: 0.7 }} />
      <Sparkle fill="#e2b43b" className="hi-twinkle absolute left-[3em] top-[11em] h-[1.5em] w-[1.5em]" style={{ ["--d" as string]: 1.05 }} />
      <Star fill="#e2b43b" className="hi-pop absolute left-[7em] top-[10em] h-[3em] w-[3em] rotate-12" style={{ ["--d" as string]: 0.44 }} />
      <Star fill="#f3e8cf" className="hi-pop absolute -right-[1em] top-[20em] h-[3em] w-[3em] opacity-90" style={{ ["--d" as string]: 0.5 }} />
      <Arrow className="hi-pop absolute right-[0.5em] top-[4.5em] h-[4em] w-[5.5em] rotate-[35deg]" style={{ ["--d" as string]: 0.56 }} />
      <Arrow className="hi-pop absolute -left-[2em] top-[17em] h-[5em] w-[5em] -rotate-90" style={{ ["--d" as string]: 0.62 }} />
      <Arrow className="hi-pop absolute -right-[2.5em] top-[16em] h-[7em] w-[5em] rotate-[110deg]" style={{ ["--d" as string]: 0.68 }} />
      {/* pixel confetti */}
      {[[26, 2.5, "#e2b43b"], [27.5, 4, "#c4512b"], [29, 3, "#e2b43b"], [28, 6, "#c4512b"], [30.5, 5, "#e2b43b"]].map(([x, y, c]) => (
        <span key={`${x}${y}`} className="hi-pop absolute h-[0.7em] w-[0.7em]" style={{ left: `${x}em`, top: `${y}em`, background: c as string, ["--d" as string]: 1.1 }} />
      ))}

      {/* 92 */}
      <div className={`hi-slam relative mx-auto w-fit ${pixel.className}`} style={{ ["--d" as string]: 0.5, fontSize: "12.5em", lineHeight: 1, letterSpacing: "0.03em", transform: "scaleY(1.22)", transformOrigin: "50% 30%", marginBottom: "0.12em" }}>
        {OUTLINES.map(({ c, w }, i) => (
          <span key={i} aria-hidden className="absolute inset-0" style={{ color: c, WebkitTextStroke: `${w}em ${c}`, paintOrder: "stroke fill", textShadow: i === 0 ? "0.03em 0.05em 0 rgba(0,0,0,.45)" : undefined }}>{t.d}</span>
        ))}
        <span className="relative" style={{ color: CREAM, }}>{t.d}</span>
      </div>
      <div className="hi-stamp absolute right-[0.4em] top-[10.2em] z-20 rotate-[8deg]" style={{ ["--d" as string]: 1.15 }}>
        <span
          className={`block bg-[#cfe3d6] px-[1.1em] py-[.55em] text-[1.25em] font-bold uppercase tracking-wide text-[#1c1812] shadow-[0.15em_0.2em_0_rgba(0,0,0,.35)] ${mono.className}`}
          style={{ clipPath: "polygon(0 6%,3% 0,97% 4%,100% 0,99% 94%,100% 100%,2% 96%,0 100%)" }}
        >
          Days to go
        </span>
      </div>

      {/* yellow plate */}
      <div
        className={`hi-rise relative z-10 mx-auto mt-[0.15em] -rotate-1 border-[0.22em] bg-[#e9c12f] px-[1em] py-[0.35em] text-center text-[#1c1812] ${mono.className}`}
        style={{ ["--d" as string]: 0.9, borderColor: INK, fontSize: "3.3em", boxShadow: `inset 0 0 0 0.07em #f4dc74, 0.07em 0.09em 0 0.07em rgba(0,0,0,.5)`, width: "8.6em" }}
      >
        {[["left-[0.12em]", "top-[0.1em]"], ["right-[0.12em]", "top-[0.1em]"], ["left-[0.12em]", "bottom-[0.1em]"], ["right-[0.12em]", "bottom-[0.1em]"]].map(([a, b]) => (
          <i key={a + b} className={`absolute ${a} ${b} h-[0.16em] w-[0.16em] rounded-full bg-[#1c1812]/70`} />
        ))}
        <span className="whitespace-nowrap">{pad(t.h)}h {pad(t.m)}m {pad(t.s)}s</span>
      </div>

      <p className={`hi-rise relative mt-[1.6em] text-center text-[1.55em] font-extrabold uppercase tracking-[0.04em] text-[#efe2c4] ${sans.className}`} style={{ ["--d" as string]: 1.05 }}>18 – 20 February 2027</p>

      <Link
        href="/auth/signup"
        className={`hi-rise relative mx-auto mt-[1.6em] block w-fit px-[2.2em] py-[0.8em] text-[1.15em] font-extrabold uppercase tracking-wide text-[#1c1812] transition hover:-translate-y-0.5 ${sans.className}`}
        style={{
          ["--d" as string]: 1.3,
          background: "radial-gradient(ellipse at 100% 100%, rgba(214,90,48,.55), transparent 55%), #efe2c4",
          border: `0.14em solid ${INK}`,
          boxShadow: "0.15em 0.2em 0 rgba(0,0,0,.4)",
          WebkitMask: "radial-gradient(circle 0.6em at 0 50%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 0.6em at 100% 50%, #0000 98%, #000) right / 51% 100% no-repeat",
          mask: "radial-gradient(circle 0.6em at 0 50%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 0.6em at 100% 50%, #0000 98%, #000) right / 51% 100% no-repeat",
        }}
      >
        Get your pass →
      </Link>
    </div>
  );
}
