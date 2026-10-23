"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { display, serif } from "@/components/indie";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Poster-style countdown: one giant day count with a tape strip for hours/minutes/seconds.
// Renders zeros on the server and fills in after mount.
export function TicketCountdown({ to }: { to: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(to).getTime();
    const tick = () => setT(parts(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);

  return (
    <div role="timer" aria-label="Time until the fest starts" className="relative mx-auto w-full max-w-md text-center">
      <p className={`text-3xl leading-none text-[#f5edd8] sm:text-4xl ${serif.className}`} style={{ textShadow: "3px 3px 0 #3a0808" }}>
        The fest starts in
      </p>

      <div className="relative mt-2">
        <span
          className={`block text-[8.5rem] leading-[0.9] tabular-nums text-[#f5c928] sm:text-[11rem] ${display.className}`}
          style={{ textShadow: "6px 6px 0 #000, 10px 10px 0 #ff6a00" }}
        >
          {t.d}
        </span>
        <span className="absolute -right-2 bottom-4 rotate-6 border-2 border-black bg-[#f5edd8] px-3 py-1 text-lg font-bold uppercase tracking-widest text-black shadow-[3px_3px_0_0_#000] sm:-right-6 sm:text-xl">
          Days to go
        </span>
      </div>

      <div className="-mx-2 mt-4 -rotate-1 border-y-4 border-black bg-[#f5c928] py-2 text-black sm:mx-0">
        <p className={`text-3xl tabular-nums tracking-wider sm:text-4xl ${display.className}`}>
          {pad(t.h)}<small className="mr-3 text-base">h</small>
          {pad(t.m)}<small className="mr-3 text-base">m</small>
          {pad(t.s)}<small className="text-base">s</small>
        </p>
      </div>

      <p className={`mt-4 text-base font-bold uppercase tracking-[0.3em] text-[#f5edd8] sm:text-lg ${display.className}`}>18 – 20 February 2027</p>
      <Link
        href="/auth/signup"
        className="mt-3 inline-block border-2 border-black bg-[#f5edd8] px-6 py-2 text-sm font-bold uppercase tracking-widest text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#ff6a00]"
      >
        Get your pass →
      </Link>
    </div>
  );
}
