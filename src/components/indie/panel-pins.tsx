"use client";

import { useEffect } from "react";

// Stacked "drawer" sections (.panel):
//  - each pins once its bottom edge reaches the bottom of the screen (--panel-h), so sections taller than the
//    screen are fully readable before the next slides over;
//  - a covered panel stays still (no tilt/fade) but its looping animations pause once it's hidden;
//  - panels below the fold hold their content back (.pin-wait) and let it rise in as they arrive;
//  - a visible deck: each panel pins a little lower than the one before (--stack-top), under the 4rem navbar,
//    so the top edge of every earlier section stays on screen as a band above the current one.
// Per-frame work: read positions first, then only toggle a class when a panel's visibility changes.
const CSS = `
.panel.panel { top: min(var(--stack-top, 4rem), calc(100svh - var(--panel-h, 0px))); }
@media (min-width: 768px) and (min-height: 760px) {
  .panel.panel { min-height: calc(100svh - var(--stack-top, 4rem)); }
}
.panel + .panel { border-radius: 2.5rem 2.5rem 0 0; box-shadow: 0 -28px 60px rgba(0,0,0,.45); }
.pin-off, .pin-off * { animation-play-state: paused !important; } /* hidden panel: stop its loops (sunburst, marquees, spins) */
@media (prefers-reduced-motion: no-preference) {
  .panel > .panel-inner { transition: opacity .8s ease, transform 1s cubic-bezier(.16,1,.3,1); }
  .panel.pin-wait > .panel-inner { opacity: 0; transform: translateY(80px) scale(.95); }
}
`;

type PinState = { off: boolean; stack: number };
const STACK_STEP = 36; // px each section pins below the previous one (the band of it that stays visible)
const STACK_MAX = 4; // deeper sections reuse the last offset

export function PanelPins() {
  useEffect(() => {
    const all = () => [...document.querySelectorAll<HTMLElement>(".panel")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = new WeakMap<HTMLElement, PinState>();
    const get = (el: HTMLElement) => {
      let s = state.get(el);
      if (!s) state.set(el, (s = { off: false, stack: -1 }));
      return s;
    };

    // Heights only change on resize/content change, so measure them here rather than every frame.
    const ro = new ResizeObserver((entries) =>
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        el.style.setProperty("--panel-h", `${el.offsetHeight}px`);
      }),
    );
    all().forEach((el) => ro.observe(el));

    // Content entrance for panels that start off screen.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.remove("pin-wait"), io.unobserve(e.target))),
      { threshold: 0.2 },
    );
    all().forEach((el) => {
      if (!reduced && el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("pin-wait");
        io.observe(el);
      }
    });

    // Looping strips outside the pinned stack (marquees etc.) pause while off screen.
    const offscreen = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("pin-off", !e.isIntersecting)));
    document.querySelectorAll(".pause-offscreen").forEach((el) => offscreen.observe(el));

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Re-queried each frame (cheap, no layout) because pages like the gallery remount panels on filter change.
      const panels = all();
      // read phase
      const cover = panels.map((el) => {
        const next = el.nextElementSibling;
        if (!next?.classList.contains("panel")) return 0;
        const p = 1 - next.getBoundingClientRect().top / vh;
        return Math.min(1, Math.max(0, p));
      });
      const away = panels.map((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom < 0 || r.top > vh;
      });
      // write phase
      panels.forEach((el, i) => {
        const s = get(el);
        // position in its own stack (panels sharing a parent), so the gallery's year deck starts at 0 again
        const parent = el.parentElement;
        const depth = Math.min(STACK_MAX, panels.filter((o) => o.parentElement === parent).indexOf(el));
        if (depth !== s.stack) el.style.setProperty("--stack-top", `calc(4rem + ${(s.stack = depth) * STACK_STEP}px)`);
        const off = away[i] || cover[i] >= 0.99;
        if (off !== s.off) el.classList.toggle("pin-off", (s.off = off));
      });
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      ro.disconnect();
      io.disconnect();
      offscreen.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <style>{CSS}</style>;
}
