"use client";

/**
 * Login/signup background, ported from the portfolio (portfolio-october: motion/ripple-bg), recoloured for the fest:
 * a faint dot grid whose dots swell gold around the cursor and ripple out from every click.
 */
import { useEffect, useRef } from "react";

const GOLD = "#f5c928";
const CELL = 28; // grid spacing; the ripple draws on the same grid so the dots line up
const SPEED = 0.52; // px per ms the wave front travels
const BAND = 70; // how far ahead of the front dots start to swell (thin ring)
const MAX_RIPPLES = 4;
const GLOW_R = 90; // radius of the cursor glow
const GLOW_HOLD = 900; // ms the glow lingers after the mouse stops

export function AuthBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth; h = window.innerHeight;
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const ripples: { x: number; y: number; t0: number }[] = [];
    const mouse = { x: -999, y: -999, last: -1e9 };
    let raf = 0;

    const frame = (now: number) => {
      raf = 0;
      const reach = Math.hypot(w, h) + BAND;
      for (let i = ripples.length - 1; i >= 0; i--) if ((now - ripples[i].t0) * SPEED > reach) ripples.splice(i, 1);
      const glowing = now - mouse.last < GLOW_HOLD;
      ctx.clearRect(0, 0, w, h);
      if (!ripples.length && !glowing) return; // idle: stop until something happens

      const glowK = glowing ? 1 - (now - mouse.last) / GLOW_HOLD : 0;
      ctx.fillStyle = GOLD;
      for (let y = CELL / 2; y < h; y += CELL) {
        for (let x = CELL / 2; x < w; x += CELL) {
          let k = 0;
          for (const r of ripples) {
            // distance ahead of the front: positive = wave not here yet
            const delta = Math.hypot(x - r.x, y - r.y) - (now - r.t0) * SPEED;
            if (delta > BAND || delta < -BAND * 0.5) continue;
            const f = delta > 0 ? 1 - delta / BAND : 1 + delta / (BAND * 0.5);
            k = Math.max(k, f * f);
          }
          if (glowing) {
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            if (d < GLOW_R) k = Math.max(k, (1 - d / GLOW_R) ** 2 * 0.9 * glowK);
          }
          if (k < 0.03) continue;
          ctx.globalAlpha = 0.2 + 0.7 * k;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + k * CELL * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.last = performance.now();
      wake();
    };
    window.addEventListener("click", onClick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(245,237,216,.16) 1.4px, transparent 1.8px)", backgroundSize: `${CELL}px ${CELL}px` }} />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
