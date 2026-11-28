"use client";

import { useEffect, useState } from "react";
import { display } from "@/components/indie";
import { mono, sans } from "./fonts";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

// Compact countdown strip: days to go, a live clock and the fest dates. Sized in em off the wrapper's font-size.
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
    <div
      role="timer"
      aria-label={`${t.d} days to go. Fest on 16 to 18 February 2027`}
      className={`inline-flex flex-wrap items-center justify-center gap-x-[.9em] gap-y-[.3em] rounded-[1.2em] border-[.2em] border-[#1c1812] bg-[#0e5b57] px-[1.1em] py-[.45em] text-[#f3e8cf] ${sans.className}`}
      style={{ boxShadow: "inset 0 0 0 .15em #f5c928, 0 .3em 0 #1c1812" }}
    >
      <span className="flex items-baseline gap-[.35em]">
        <span className={`hi-slam text-[2.1em] leading-none text-[#f5c928] ${display.className}`} style={{ ["--d" as string]: 0.5, textShadow: ".05em .05em 0 #ff2d8a" }}>{t.d}</span>
        <span className="text-[.95em] font-extrabold uppercase tracking-wide">days to go</span>
      </span>
      <span aria-hidden className="h-[1.4em] w-[.12em] bg-[#f5c928]/60" />
      <span className={`text-[1.05em] font-bold tabular-nums ${mono.className}`}>
        {pad(t.h)}<small>h</small> {pad(t.m)}<small>m</small> {pad(t.s)}<small>s</small>
      </span>
      {/* on narrow phones the date wraps to its own line, so drop the divider before it */}
      <span aria-hidden className="hidden h-[1.4em] w-[.12em] bg-[#f5c928]/60 min-[420px]:block" />
      <span className="text-[.95em] font-extrabold uppercase tracking-[.06em] text-[#f5c928]">16 – 18 Feb 2027</span>
    </div>
  );
}
