"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { display, serif } from "@/components/indie";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fades + slides its children in when they scroll into view.
// Server HTML is fully visible; the effect only arms the animation after hydration.
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.style.transitionDelay = `${delay}ms`;
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}

// Counts up to `to` when scrolled into view.
export function CountUp({ to, prefix = "", suffix = "", className = "" }: { to: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setN(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref} className={className}>{prefix}{n.toLocaleString("en-IN")}{suffix}</span>;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// Auto-rotating quote slider with dots.
export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 4500);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const t = items[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="mx-auto max-w-3xl text-center">
      <div key={i} className="indie-pop">
        <p className={`text-[#f5c928] text-8xl leading-none h-12 ${serif.className}`} aria-hidden>&ldquo;</p>
        <blockquote className={`-mt-4 text-2xl sm:text-4xl leading-snug text-[#f5edd8] ${display.className}`}>{t.quote}</blockquote>
        <p className="mt-6 text-lg font-bold uppercase tracking-widest text-[#f5c928]">{t.name}</p>
        <p className="text-sm uppercase tracking-widest text-[#f5edd8]/60">{t.role}</p>
      </div>
      <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
        {items.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === i}
            aria-label={`Show testimonial ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[#f5c928]" : "w-2.5 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Full-screen loading splash (turntable + progress), shown once per browser session.
// It is part of the server HTML so the page never flashes before it; a CSS fallback
// slides it away after 6s even if JavaScript never runs.
export function Splash() {
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("splash-seen") === "1"; } catch { /* storage blocked */ }
    if (seen || prefersReducedMotion()) { setGone(true); return; }

    document.body.style.overflow = "hidden";
    const dur = 2600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2.2))));
      if (p < 1) { raf = requestAnimationFrame(tick); return; }
      setOut(true);
      setTimeout(() => {
        setGone(true);
        document.body.style.overflow = "";
        try { sessionStorage.setItem("splash-seen", "1"); } catch { /* ignore */ }
      }, 800);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = ""; };
  }, []);

  if (gone) return null;

  return (
    <div className={`splash ${out ? "out" : ""}`} role="status" aria-label="Loading">
      <svg viewBox="0 0 200 200" className="h-56 w-56 sm:h-72 sm:w-72 drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]" aria-hidden>
        <g transform="rotate(35 100 100)">
          <rect x="22" y="22" width="156" height="156" rx="14" fill="#e8b030" stroke="#000" strokeWidth="3" />
          <rect x="30" y="30" width="140" height="140" rx="9" fill="none" stroke="#000" strokeWidth="1.6" strokeDasharray="5 4" />
          <circle cx="52" cy="152" r="7" fill="#5a3d00" stroke="#000" strokeWidth="2" />
          <rect x="40" y="46" width="52" height="7" fill="#000" transform="rotate(-18 40 46)" />
          <g style={{ transformOrigin: "100px 104px", animation: "indie-spin 6s linear infinite" }}>
            <circle cx="100" cy="104" r="52" fill="#7a1c1c" stroke="#000" strokeWidth="2" />
            {[44, 36, 28].map((r) => <circle key={r} cx="100" cy="104" r={r} fill="none" stroke="#000" strokeWidth="1" />)}
            <defs><path id="splash-arc" d="M100,104 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" /></defs>
            <text fill="#f5edd8" fontSize="13" fontWeight="800" letterSpacing="1.5"><textPath href="#splash-arc">TRX&apos;27 • TECHNO • </textPath></text>
            <circle cx="100" cy="104" r="14" fill="#c1880b" stroke="#000" strokeWidth="2" />
          </g>
          <g style={{ transformOrigin: "160px 40px", transform: `rotate(${-8 + pct * 0.12}deg)`, transition: "transform .1s linear" }}>
            <rect x="148" y="28" width="22" height="22" rx="3" fill="#000" />
            <circle cx="159" cy="39" r="4" fill="#f5c928" />
            <line x1="159" y1="50" x2="124" y2="104" stroke="#000" strokeWidth="4" />
            <rect x="113" y="100" width="13" height="18" fill="none" stroke="#000" strokeWidth="3" />
          </g>
        </g>
      </svg>
      <div className="w-64 sm:w-80">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[#f5c928]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-center text-sm font-bold tracking-widest text-[#fad68e]">{pct}%</p>
      </div>
    </div>
  );
}
