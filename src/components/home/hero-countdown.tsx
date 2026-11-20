"use client";

import { useEffect, useState } from "react";
import { display } from "@/components/indie";
import { mono, sans } from "./fonts";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

// Countdown in an ornate teal frame (cusped top, pink + gold rings). Sized in em off the wrapper's font-size.
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
      aria-label="Time until the fest starts"
      className="relative w-[19em] border-[.3em] border-[#ff2d8a] bg-[#0e5b57] px-[1.4em] pb-[1.2em] pt-[2.2em] text-center"
      style={{ borderRadius: "9.5em 9.5em .8em .8em", boxShadow: "inset 0 0 0 .25em #f5c928, inset 0 0 0 .45em #0e5b57, inset 0 0 0 .55em #ff8a00, .35em .45em 0 #1c1812" }}
    >
      <div
        className={`hi-slam leading-none text-[#f5c928] ${display.className}`}
        style={{ ["--d" as string]: 0.5, fontSize: "6.5em", textShadow: ".04em .04em 0 #ff2d8a, .08em .08em 0 #1c1812", WebkitTextStroke: ".012em #1c1812" }}
      >
        {t.d}
      </div>
      <p className={`mt-[.3em] text-[1.35em] font-extrabold uppercase tracking-wide text-[#f3e8cf] ${sans.className}`}>Days to go</p>
      <div className={`hi-rise mx-auto mt-[.6em] w-fit whitespace-nowrap border-[.12em] border-[#f5c928] bg-[#1c1812] px-[.7em] py-[.25em] text-[1.7em] font-bold text-[#f3e8cf] ${mono.className}`} style={{ ["--d" as string]: 0.9 }}>
        {pad(t.h)}<small>h</small> {pad(t.m)}<small>m</small> {pad(t.s)}<small>s</small>
      </div>
      <p className={`mt-[.8em] text-[1.05em] font-extrabold uppercase tracking-[.08em] text-[#f5c928] ${sans.className}`}>18 – 20 February 2027</p>
    </div>
  );
}
