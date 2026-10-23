"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { REVEAL_DATE } from "@/data/dummy";
import { display, serif, Marquee } from "@/components/indie";

const UNITS = ["Days", "Hours", "Minutes", "Seconds"];

// "DDHHMMSS" until the reveal, zero-padded
function remaining() {
  const s = Math.max(0, Math.floor((new Date(REVEAL_DATE).getTime() - Date.now()) / 1000));
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((n) => String(n).padStart(2, "0")).join("");
}

function Half({ ch, bottom }: { ch: string; bottom?: boolean }) {
  return (
    <div className={`absolute inset-x-0 h-1/2 overflow-hidden ${bottom ? "bottom-0" : "top-0"}`}>
      <div className={`absolute inset-x-0 flex h-[200%] items-center justify-center ${bottom ? "bottom-0" : "top-0"}`}>{ch}</div>
    </div>
  );
}

// One split-flap character: the old top flap folds down, the new bottom flap falls into place.
function Flap({ ch }: { ch: string }) {
  const [prev, setPrev] = useState(ch);
  const [cur, setCur] = useState(ch);
  if (ch !== cur) { setPrev(cur); setCur(ch); }
  // once the flap has landed, drop the old face so only the new digit remains
  useEffect(() => {
    const id = setTimeout(() => setPrev(cur), 300);
    return () => clearTimeout(id);
  }, [cur]);
  const face = "bg-[#f5edd8] text-[#1a0505]";
  return (
    <div className={`relative h-[1.35em] w-[1.05em] rounded-md border-2 border-black leading-none shadow-[0_6px_0_0_#ff6a00] ${face} ${display.className}`} style={{ perspective: "500px" }}>
      <div className={`${face} absolute inset-0 rounded-md`}>
        <Half ch={cur} />
        <Half ch={prev} bottom />
      </div>
      {prev !== cur && (
        <div key={cur} className="absolute inset-0">
          <div className={`rv-flap-top ${face} absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-md`}>
            <div className="absolute inset-x-0 top-0 flex h-[200%] items-center justify-center">{prev}</div>
          </div>
          <div className={`rv-flap-bot ${face} absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-md`}>
            <div className="absolute inset-x-0 bottom-0 flex h-[200%] items-center justify-center">{cur}</div>
          </div>
        </div>
      )}
      <div aria-hidden className="absolute inset-x-0 top-1/2 z-10 h-[3px] -translate-y-1/2 bg-[#1a0505]" />
    </div>
  );
}

// Full-screen reveal teaser shown on every visit to the landing page, right after the loading splash.
export function RevealPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [vals, setVals] = useState("00000000");

  useEffect(() => {
    let splashSeen = false;
    try { splashSeen = sessionStorage.getItem("splash-seen") === "1"; } catch { /* storage blocked */ }
    // splash runs 2.6s + 0.8s slide-out; wait for it unless it is skipped
    const id = setTimeout(() => setOpen(true), splashSeen ? 0 : 3500);
    return () => clearTimeout(id);
  }, []);

  // Flaps shuffle for a moment, then settle on the real countdown.
  useEffect(() => {
    if (!open) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      setVals(Date.now() - t0 < 1800
        ? Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("")
        : remaining());
    }, 250);
    return () => clearInterval(id);
  }, [open]);

  const close = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 900);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  if (!open) return null;

  return (
    <div
      className={`${closing ? "rv-out" : "rv-in"} fixed inset-0 z-[9999] flex cursor-pointer flex-col overflow-hidden bg-[#2a0606] text-center`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Website reveal countdown"
    >
      <style>{`
        @keyframes rv-in { from { transform: perspective(1800px) rotateX(90deg); } to { transform: perspective(1800px) rotateX(0); } }
        @keyframes rv-out { from { transform: perspective(1800px) rotateX(0); opacity: 1; } to { transform: perspective(1800px) rotateX(-100deg); opacity: 0; } }
        @keyframes rv-flap-top { from { transform: rotateX(0); } to { transform: rotateX(-90deg); } }
        @keyframes rv-flap-bot { from { transform: rotateX(90deg); } to { transform: rotateX(0); } }
        @keyframes rv-blink { 50% { opacity: .15; } }
        @keyframes rv-fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .rv-in { transform-origin: top center; animation: rv-in .9s cubic-bezier(.3,1.3,.5,1) both; }
        .rv-out { transform-origin: top center; animation: rv-out .9s cubic-bezier(.6,0,.8,.4) both; }
        .rv-flap-top { transform-origin: bottom; animation: rv-flap-top .12s ease-in both; backface-visibility: hidden; }
        .rv-flap-bot { transform-origin: top; animation: rv-flap-bot .12s .12s ease-out both; backface-visibility: hidden; }
        .rv-blink { animation: rv-blink 1s steps(2) infinite; }
        .rv-fade { animation: rv-fade .7s both; }
        @media (prefers-reduced-motion: reduce) { .rv-in, .rv-out, .rv-blink, .rv-fade { animation: none !important; } .rv-flap-top, .rv-flap-bot { display: none; } }
      `}</style>

      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)" }} />

      <div className="relative flex items-center justify-between border-b-4 border-black bg-[#f5c928] px-4 py-3 text-black sm:px-8">
        <span className={`text-xl uppercase tracking-[0.3em] sm:text-3xl ${display.className}`}>Departures</span>
        <button
          onClick={(e) => { e.stopPropagation(); close(); }}
          aria-label="Close (Esc)"
          className="flex items-center gap-1 border-2 border-black bg-[#f5edd8] px-3 py-1.5 text-xs font-bold uppercase shadow-[3px_3px_0_0_#000] hover:bg-white"
        >
          Esc <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-4 sm:gap-10">
        <div className="rv-fade space-y-3" style={{ animationDelay: ".5s" }}>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#f5edd8]/70">Next service · Platform 20/11</p>
          <h2 className={`text-5xl leading-[0.95] text-[#f5edd8] sm:text-7xl lg:text-8xl ${serif.className}`}>
            The website <span className="text-[#f5c928]">reveal</span>
          </h2>
          <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#ff6a00] sm:text-2xl">
            <span className="rv-blink mr-2 inline-block h-3 w-3 rounded-full bg-[#ff6a00]" aria-hidden />
            Boarding · 20 November 2026
          </p>
        </div>

        <div role="timer" aria-label="Time until the website reveal" className="flex gap-3 sm:gap-6" style={{ fontSize: "clamp(2rem, 8.2vw, 6.5rem)" }}>
          {UNITS.map((u, i) => (
            <div key={u} className="flex flex-col items-center gap-3">
              <div className="flex gap-[0.08em]">
                <Flap ch={vals[i * 2]} />
                <Flap ch={vals[i * 2 + 1]} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f5edd8]/60 sm:text-sm">{u}</span>
            </div>
          ))}
        </div>

        <div className="rv-fade" style={{ animationDelay: "1s" }}>
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="border-2 border-black bg-[#f5c928] px-10 py-4 text-xl font-bold uppercase tracking-widest text-black shadow-[5px_5px_0_0_#ff6a00] transition-transform hover:-translate-y-1 hover:bg-[#f5edd8]"
          >
            Enter website →
          </button>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#f5edd8]/60">Press Esc or click anywhere</p>
        </div>
      </div>

      <Marquee
        className="relative bg-[#ff6a00] py-1.5 text-lg font-bold uppercase tracking-wider text-black"
        text="Save the date ✦ 20 Nov website reveal ✦ 18–20 Feb 2027 fest ✦ "
      />
    </div>
  );
}
