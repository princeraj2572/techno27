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
