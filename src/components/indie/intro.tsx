"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { serif } from "@/components/indie";

// Coded intro — golden light on black (no colour splash):
//   0–2s      dark horizon: a point of light, streaks racing over the floor, drifting wireframes (slow open)
//   1.8–3.45s the logo is slowly revealed from its centre outwards (widening circle of light) behind the god rays
//   3.45s     light flash + bloom, warm motes drift out
//   4.7–5.9s  the logo flies onto the hero's logo (identical lockup, so the hand-off is seamless), then dissolve
// Smoothness: everything that moves a lot is a DOM layer animating only transform/opacity (blur is static, never
// animated), so it runs on the compositor; the canvas only draws the light. Retro film finish on top.
const SRC = "/audio/intro.mp4";
const T = { bloom: 1.3, build: 1.8, peak: 3.45, fly: 4.7, flyDur: 1.2, fade: 6.0, end: 7.4 };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeIO = (x: number) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const GOLD = "255,190,90";
const MOTE = ["196,81,43", "63,160,166", "226,180,59", "239,226,196"];
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

type Geo = { left: number; top: number; width: number; height: number; dx: number; dy: number; s: number };
type Pt = [number, number];
type Mote = { x: number; y: number; vx: number; vy: number; life: number; age: number; r: number; c: string };
type Fx = {
  ps: { x: number; y: number; r: number; vx: number; vy: number; ph: number }[];
  polys: { x: number; y: number; vx: number; vy: number; rot: number; vr: number; pts: Pt[] }[];
  floor: { x: number; ph: number; sp: number }[];
  rays: { a: number; hw: number; len: number; g: number }[];
  motes: Mote[]; burst: boolean;
  endX: number; endY: number;
};

function makeFx(w: number, h: number, geo: Geo | null): Fx {
  return {
    ps: Array.from({ length: 70 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.6, 1.8), vx: rnd(-0.12, 0.12), vy: rnd(-0.12, 0.12), ph: rnd(0, 6) })),
    polys: Array.from({ length: 7 }, () => {
      const n = 4 + Math.floor(Math.random() * 3), sz = rnd(34, 95);
      return { x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.15, 0.15), vy: rnd(-0.1, 0.1), rot: rnd(0, 6), vr: rnd(-0.15, 0.15),
        pts: Array.from({ length: n }, (_, i) => { const a = (i / n) * 6.283 + rnd(-0.4, 0.4), r = sz * rnd(0.5, 1); return [Math.cos(a) * r, Math.sin(a) * r] as Pt; }) };
    }),
    floor: Array.from({ length: 40 }, () => ({ x: rnd(-0.7, 1.7), ph: rnd(0, 1), sp: rnd(0.25, 0.6) })),
    rays: Array.from({ length: 64 }, (_, i) => ({ a: rnd(0, 6.283), hw: rnd(0.004, 0.022), len: rnd(0.55, 1.15), g: i % 2 })),
    motes: [], burst: false,
    endX: geo ? geo.left + geo.width / 2 : w / 2, endY: geo ? geo.top + geo.height / 2 : h * 0.47,
  };
}

// soft halo + hot core; with "lighter" blending this reads as emitted light
function glowLine(ctx: CanvasRenderingContext2D, a: Pt, b: Pt, alpha: number, rgb = GOLD) {
  [[5, 0.14, rgb], [1.3, 0.75, "255,246,220"]].forEach(([lw, k, c]) => {
    ctx.lineWidth = lw as number; ctx.strokeStyle = `rgba(${c},${alpha * (k as number)})`;
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
  });
}

function radial(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}

function streak(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, a: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.03);
  radial(ctx, 0, 0, len, [[0, `rgba(255,236,190,${a})`], [0.4, `rgba(${GOLD},${a * 0.35})`], [1, "rgba(0,0,0,0)"]]);
  ctx.restore();
}

// The canvas draws light only (the colour is DOM layers above it).
function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number, fx: Fx) {
  const hy = h * 0.5, diag = Math.hypot(w, h);
  const k = easeIO((t - T.fly) / T.flyDur);
  const tx = w / 2 + (fx.endX - w / 2) * k, ty = h * 0.47 + (fx.endY - h * 0.47) * k;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#070504";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  radial(ctx, w / 2, -h * 0.1, h, [[0, `rgba(${GOLD},${0.14 * clamp01(t / 2.5)})`], [1, "rgba(0,0,0,0)"]]);

  // horizon: streaks racing over the floor + a hot line across the whole width
  const fl = clamp01((t - 0.15) / 1.4) * (1 - clamp01((t - 2.4) / 1.0));
  if (fl > 0) {
    ctx.strokeStyle = `rgba(${GOLD},${0.07 * fl})`; ctx.lineWidth = 1;
    ctx.beginPath();
    fx.floor.forEach((s) => { ctx.moveTo(w / 2, hy); ctx.lineTo(s.x * w, h); });
    ctx.stroke();
    fx.floor.forEach((s, i) => {
      const bx = s.x * w, p = (t * s.sp + s.ph) % 1, a = p * p, b = Math.min(1, a + 0.05 + 0.12 * p);
      glowLine(ctx, [w / 2 + (bx - w / 2) * a, hy + (h - hy) * a], [w / 2 + (bx - w / 2) * b, hy + (h - hy) * b], 0.75 * fl * Math.sin(p * Math.PI), MOTE[i % MOTE.length]);
    });
    const hg = ctx.createLinearGradient(0, 0, w, 0);
    hg.addColorStop(0, "rgba(255,190,90,0)"); hg.addColorStop(0.5, `rgba(255,220,160,${0.6 * fl})`); hg.addColorStop(1, "rgba(255,190,90,0)");
    ctx.fillStyle = hg; ctx.fillRect(0, hy - 1, w, 2);
  }
  const pt = clamp01((t - 0.2) / 1.4) * (1 - clamp01((t - 2.2) / 0.6));
  if (pt > 0) {
    radial(ctx, w / 2, hy, 10 + 50 * pt, [[0, `rgba(255,250,235,${0.95 * pt})`], [0.3, `rgba(${GOLD},${0.4 * pt})`], [1, "rgba(0,0,0,0)"]]);
    streak(ctx, w / 2, hy, w * 0.35 * pt, 0.8 * pt);
  }

  // drifting wireframes + star field (plain dots: cheap, smooth)
  const pv = clamp01((t - 0.2) / 1.8) * (1 - clamp01((t - 3.2) / 1.0));
  if (pv > 0) {
    ctx.strokeStyle = `rgba(${GOLD},${0.28 * pv})`; ctx.lineWidth = 0.8;
    fx.polys.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr * dt;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.beginPath(); p.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke();
      ctx.restore();
    });
  }
  const vis = clamp01((t - 0.4) / 1.6) * (1 - 0.5 * clamp01((t - 4.5) / 1));
  fx.ps.forEach((p) => {
    p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
    ctx.fillStyle = `rgba(255,225,160,${(0.3 + 0.7 * Math.abs(Math.sin(t * 1.2 + p.ph))) * vis})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
  });

  // god rays behind the logo, warm + teal, slowly turning
  const R = ease((t - 1.6) / 1.6) * (1 - 0.45 * clamp01((t - 3.9) / 0.8)) * (1 - clamp01((t - 4.8) / 1.1));
  if (R > 0) {
    ["255,214,150", "120,210,200"].forEach((rgb, grp) => {
      const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, diag * 1.1);
      g.addColorStop(0, `rgba(${rgb},${0.36 * R})`); g.addColorStop(0.25, `rgba(${rgb},${0.13 * R})`); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      fx.rays.forEach((r) => {
        if (r.g !== grp) return;
        const a = r.a + t * 0.03 * (grp ? -1 : 1), L = diag * r.len;
        ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(a - r.hw) * L, ty + Math.sin(a - r.hw) * L); ctx.lineTo(tx + Math.cos(a + r.hw) * L, ty + Math.sin(a + r.hw) * L); ctx.closePath();
      });
      ctx.fill();
    });
  }
  const C = ease((t - 1.8) / 1.5) * (1 - 0.6 * clamp01((t - 3.6) / 0.6)) * (1 - clamp01((t - 4.9) / 1.0));
  if (C > 0) {
    radial(ctx, tx, ty, Math.min(w, h) * 0.5, [[0, `rgba(255,244,220,${0.6 * C})`], [0.2, `rgba(255,205,130,${0.22 * C})`], [1, "rgba(0,0,0,0)"]]);
    streak(ctx, tx, ty, w * 0.6, 0.7 * C);
  }

  // flash: bloom over the whole frame
  const B = Math.exp(-Math.pow((t - T.peak) / 0.22, 2));
  if (B > 0.01) { ctx.fillStyle = `rgba(255,224,180,${0.32 * B})`; ctx.fillRect(0, 0, w, h); }

  // colour motes drifting out after the flash (few, slow, plain dots)
  if (t >= T.peak && !fx.burst) {
    fx.burst = true;
    fx.motes = Array.from({ length: 90 }, () => { const a = rnd(0, 6.283), v = rnd(60, 380); return { x: tx + Math.cos(a) * 40, y: ty + Math.sin(a) * 30, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, life: rnd(1.6, 3), age: 0, r: rnd(1.2, 3.2), c: MOTE[Math.floor(Math.random() * MOTE.length)] }; });
  }
  fx.motes = fx.motes.filter((m) => (m.age += dt) < m.life);
  fx.motes.forEach((m) => {
    const d = Math.pow(0.5, dt); m.vx *= d; m.vy *= d; m.x += m.vx * dt; m.y += m.vy * dt - 8 * dt;
    ctx.fillStyle = `rgba(${m.c},${0.9 * Math.sin((m.age / m.life) * Math.PI)})`;
    ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill();
  });

  // anamorphic flare sweeping across the full width
  const swp = (t - 3.6) / 1.1;
  if (swp > 0 && swp < 1) {
    const a = Math.sin(swp * Math.PI), x = -0.2 * w + 1.4 * w * easeIO(swp);
    streak(ctx, x, ty + h * 0.02, w * 0.45, 0.85 * a);
  }

  // thin progress line along the bottom
  const pa = 1 - clamp01((t - T.fade) / 0.6);
  ctx.fillStyle = `rgba(${GOLD},${0.2 * pa})`; ctx.fillRect(w * 0.05, h - 20, w * 0.9, 1);
  ctx.fillStyle = `rgba(255,225,160,${0.8 * pa})`; ctx.fillRect(w * 0.05, h - 21, w * 0.9 * clamp01(t / T.fade), 3);

  ctx.globalCompositeOperation = "source-over";
  // retro film damage: a few dust specks most frames, the odd vertical scratch
  if (Math.random() < 0.35) for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(255,240,210,${rnd(0.15, 0.4)})`;
    ctx.beginPath(); ctx.arc(rnd(0, w), rnd(0, h), rnd(0.6, 2), 0, 7); ctx.fill();
  }
  if (Math.random() < 0.1) { ctx.fillStyle = `rgba(255,236,200,${rnd(0.08, 0.2)})`; ctx.fillRect(rnd(0, w), 0, rnd(0.6, 1.4), h); }
}

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";


let audio: HTMLAudioElement | null = null; // module-level so the sound outlives the overlay

// Where the hero logo is on screen, and the transform that blows it up to the centre of the screen.
function measure(): Geo | null {
  const el = document.querySelector<HTMLElement>("[data-hero-lockup]");
  if (!el) return null;
  const r = el.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
  const s = Math.max(1, Math.min((vw * 0.8) / r.width, (vh * 0.62) / r.height, 2.8));
  return { left: r.left, top: r.top, width: r.width, height: r.height, dx: vw / 2 - (r.left + r.width / 2), dy: vh * 0.47 - (r.top + r.height / 2), s };
}

const SEEN = "techno27-intro-seen";

export function Intro() {
  // "check": plain black until we know whether this tab has already seen the intro
  const [phase, setPhase] = useState<"check" | "gate" | "play" | "out" | "gone">("check");
  const [geo, setGeo] = useState<Geo | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // once per tab session; reduced-motion users always skip it
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN) === "1"; } catch { /* storage blocked: just show it */ }
    setPhase(seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "gone" : "gate");
  }, []);

  // lock scroll while the overlay is up
  useEffect(() => {
    document.body.style.overflow = phase === "gone" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  function enter() {
    window.scrollTo(0, 0);
    try { sessionStorage.setItem(SEEN, "1"); } catch { /* fine, it may replay */ }
    setGeo(measure());
    try { audio = new Audio(SRC); audio.volume = 0.9; void audio.play().catch(() => {}); } catch { /* no audio, still play visuals */ }
    setPhase("play");
  }

  function finish() {
    if (audio) { audio.pause(); audio = null; }
    setPhase("gone");
  }

  // "play" and "out" share one loop; depending on `running` (not `phase`) keeps it alive through the fade
  const running = phase === "play" || phase === "out";
  useEffect(() => {
    if (!running) return;
    const cv = canvas.current!, ctx = cv.getContext("2d")!;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1); // light is soft; full retina resolution isn't worth the frame time
    let fx = makeFx(innerWidth, innerHeight, measure());
    const size = () => {
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = measure(); setGeo(g);
      fx = { ...makeFx(innerWidth, innerHeight, g), motes: fx.motes, burst: fx.burst };
    };
    size(); addEventListener("resize", size);
    const t0 = performance.now();
    let raf = 0, faded = false, last = t0;
    const loop = (now: number) => {
      const t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (t >= T.fade && !faded) { faded = true; setPhase("out"); }
      if (t >= T.end) { setPhase("gone"); return; }
      draw(ctx, innerWidth, innerHeight, t, dt, fx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, [running]);

  if (phase === "gone") return null;
  const goldText = "linear-gradient(180deg,#fff3cf 0%,#f1c36b 45%,#a8741f 100%)";
  const v = (o: Record<string, string | number>) => o as CSSProperties;

  return (
    <div className={`intro-overlay fixed inset-0 z-[100] overflow-hidden bg-[#070504] ${phase === "out" ? "out" : ""}`} style={{ transition: "opacity 1.4s ease", opacity: phase === "out" ? 0 : 1, pointerEvents: phase === "out" ? "none" : "auto" }}>
      {phase === "check" ? null : phase === "gate" ? (
        <button onClick={enter} className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-[#f1c36b]">
          <span className={`text-4xl sm:text-6xl ${serif.className}`} style={{ backgroundImage: goldText, WebkitBackgroundClip: "text", color: "transparent" }}>Techno-aiMBiAtion &apos;27</span>
          <span className="animate-pulse border border-[#f1c36b]/70 px-8 py-2 text-sm font-bold uppercase tracking-[0.4em]">Enter ♪</span>
        </button>
      ) : (
        <>
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" style={{ animation: "intro-weave .3s steps(2) infinite" }} />

          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6) 100%)" }} />

          {/* The logo, blown up at the centre; slowly revealed from the centre out.
              Then it flies onto the hero's logo (identical, so the hand-off is seamless). */}
          {geo && (
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={v({
                left: geo.left, top: geo.top, width: geo.width, height: geo.height, transformOrigin: "50% 50%",
                "--dx": `${geo.dx}px`, "--dy": `${geo.dy}px`, "--s": geo.s,
                animation: `intro-fly ${T.flyDur}s ${T.fly}s cubic-bezier(.65,0,.35,1) both, intro-land .9s ${T.fly + T.flyDur - 0.15}s ease-out`,
              })}
            >
              <div className="absolute inset-0" style={{ animation: `intro-breathe 3s ${T.build}s cubic-bezier(.16,1,.3,1) both` }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- sized by the measured hero box, not next/image */}
                <img src="/images/brand/logo.webp" alt="" className="absolute inset-0 h-full w-full object-contain" style={{ animation: `intro-reveal ${T.peak - T.build}s ${T.build}s cubic-bezier(.4,0,.2,1) both` }} />
              </div>
              {/* a sheen of light across the logo at the flash */}
              <div className="absolute inset-0 overflow-hidden mix-blend-screen" style={{ WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 55%, transparent 80%)" }}>
                <div className="absolute inset-y-0 -left-1/2 w-1/2" style={{ background: "linear-gradient(105deg, transparent, rgba(255,240,210,.7), transparent)", willChange: "transform", animation: `intro-sheen 1.2s ${T.peak + 0.05}s cubic-bezier(.45,0,.25,1) both` }} />
              </div>
            </div>
          )}

          {/* retro film finish: warm grade, grain, scanlines, projector flicker, light leaks */}
          <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(ellipse 45% 55% at 0% 15%, rgba(214,90,40,.45), transparent 70%), radial-gradient(ellipse 40% 50% at 100% 90%, rgba(47,140,140,.4), transparent 70%)", animation: "intro-leak 7.4s ease-in-out both" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: "#c48a3a", opacity: 0.12 }} />
          <div aria-hidden className="pointer-events-none absolute -inset-[10%] mix-blend-overlay" style={{ backgroundImage: NOISE, opacity: 0.2, animation: "intro-grain .5s steps(1) infinite" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px)", opacity: 0.45 }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#ffe6bf] mix-blend-overlay" style={{ animation: "intro-flicker 1.7s linear infinite" }} />

          {/* cinematic letterbox that retracts slowly at the start */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[13vh] bg-black" style={{ animation: "intro-bar-t 1.8s .6s cubic-bezier(.6,0,.2,1) both" }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[13vh] bg-black" style={{ animation: "intro-bar-b 1.8s .6s cubic-bezier(.6,0,.2,1) both" }} />

          <button onClick={finish} className="absolute bottom-6 right-6 z-10 border border-[#f1c36b]/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-[#f1c36b]/80 hover:bg-[#f1c36b]/10">Skip</button>
        </>
      )}
      <style>{`
        /* logo slowly revealed: a widening circle, sharpening + settling as it opens */
        @keyframes intro-reveal { from { clip-path: circle(0% at 50% 50%); opacity: 0; scale: 1.08; filter: brightness(2.2) blur(6px); } 40% { opacity: 1; } to { clip-path: circle(75% at 50% 50%); opacity: 1; scale: 1; filter: none; } }


        @keyframes intro-sheen { from { transform: translateX(0); } to { transform: translateX(400%); } }
        @keyframes intro-breathe { from { scale: 1.06; } to { scale: 1; } }
        @keyframes intro-fly { from { transform: translate(var(--dx), var(--dy)) scale(var(--s)); } to { transform: none; } }
        @keyframes intro-land { 0% { filter: none; } 30% { filter: brightness(1.4) drop-shadow(0 0 26px rgba(255,200,110,.85)); } 100% { filter: none; } }
        /* retro film */
        @keyframes intro-weave { 0% { transform: translate(0, 0); } 50% { transform: translate(.4px, .7px); } }
        @keyframes intro-grain { 0% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -3%); } 60% { transform: translate(-2%, -1%); } 80% { transform: translate(3%, 2%); } }
        @keyframes intro-flicker { 0%, 100% { opacity: 0; } 6% { opacity: .06; } 8% { opacity: 0; } 41% { opacity: .04; } 43% { opacity: 0; } 70% { opacity: .07; } 72% { opacity: 0; } }
        @keyframes intro-leak { 0% { opacity: 0; } 25% { opacity: .5; } 55% { opacity: .3; } 80% { opacity: .45; } 100% { opacity: .3; } }
        @keyframes intro-bar-t { from { transform: none; } to { transform: translateY(-100%); } }
        @keyframes intro-bar-b { from { transform: none; } to { transform: translateY(100%); } }
      `}</style>
    </div>
  );
}
