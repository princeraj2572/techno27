"use client";

import { useEffect } from "react";

// Stacked "drawer" sections (.panel):
//  - each pins once its bottom edge reaches the bottom of the screen (--panel-h), so sections taller than the
//    screen are fully readable before the next slides over;
//  - a panel that is off screen or fully covered pauses its looping animations (.pin-off), and so do
//    .pause-offscreen strips outside the stack (marquees), which keeps scrolling smooth.
// Per-frame work: read positions first, then only toggle a class when a panel's visibility changes.
const CSS = `
.pin-off, .pin-off * { animation-play-state: paused !important; }
`;

export function PanelPins() {
  useEffect(() => {
    const all = () => [...document.querySelectorAll<HTMLElement>(".panel")];
    const hidden = new WeakMap<HTMLElement, boolean>();

    const ro = new ResizeObserver((entries) =>
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        el.style.setProperty("--panel-h", `${el.offsetHeight}px`);
      }),
    );
    all().forEach((el) => ro.observe(el));

    // Looping strips outside the pinned stack pause while off screen.
    const offscreen = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("pin-off", !e.isIntersecting)));
    document.querySelectorAll(".pause-offscreen").forEach((el) => offscreen.observe(el));

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Re-queried each frame (cheap, no layout) because pages like the gallery remount panels on filter change.
      const panels = all();
      // read phase
      const off = panels.map((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return true;
        const next = el.nextElementSibling;
        return !!next?.classList.contains("panel") && next.getBoundingClientRect().top <= vh * 0.01;
      });
      // write phase
      panels.forEach((el, i) => {
        if (hidden.get(el) === off[i]) return;
        hidden.set(el, off[i]);
        el.classList.toggle("pin-off", off[i]);
      });
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      ro.disconnect();
      offscreen.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <style>{CSS}</style>;
}
