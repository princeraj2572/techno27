"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { serif } from "@/components/indie";
import { Lockup } from "@/components/home/lockup";

// Coded cinematic intro, choreographed after the reference video:
//   0–2.4s  dark horizon: a point of light, light streaks racing over the floor, flowing streams, drifting wireframes
//   1–3s    light ribbons sweep across the whole screen, sparks rise off the horizon
//   2–3.4s  an orbiting ring of light draws the logo as glowing gold line-art; god rays build behind it
//   3.4s    flash: bloom, shock ring, spark burst; the line-art turns to solid gold; an anamorphic flare sweeps across
//   3.7–6s  HUD/blueprint lines draw over the full width
//   4.8–6s  the gold logo flies onto the hero's real logo, then everything dissolves and it "colourises" into the hero
// Click-to-enter gate so audio may play; only the soundtrack file is reused from the reference video.
const SRC = "/audio/intro.mp4";
const T = { draw: 1.95, drawDur: 1.45, peak: 3.42, metal: 3.3, fly: 4.8, flyDur: 1.25, fade: 6.1, end: 7.5 };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeIO = (x: number) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const GOLD = "255,190,90";
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

type Geo = { left: number; top: number; width: number; height: number; dx: number; dy: number; s: number };
type Pt = [number, number];
type Spark = { x: number; y: number; vx: number; vy: number; life: number; age: number; r: number };
type Fx = {
  ps: { x: number; y: number; r: number; vx: number; vy: number; ph: number }[];
  bokeh: { x: number; y: number; r: number; ph: number }[];
  polys: { x: number; y: number; vx: number; vy: number; rot: number; vr: number; pts: Pt[] }[];
  floor: { x: number; ph: number; sp: number }[];
  ribbons: { p: Pt[]; start: number; dur: number }[];
  rays: { a: number; hw: number; len: number; g: number }[];
  sparks: Spark[]; ups: Spark[]; sparked: boolean;
  endX: number; endY: number; lw: number; lh: number;
};

function makeFx(w: number, h: number, geo: Geo | null): Fx {
  return {
    ps: Array.from({ length: 90 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.6, 2.2), vx: rnd(-0.15, 0.15), vy: rnd(-0.15, 0.15), ph: rnd(0, 6) })),
    bokeh: Array.from({ length: 16 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(24, 90), ph: rnd(0, 6) })),
    polys: Array.from({ length: 8 }, () => {
      const n = 4 + Math.floor(Math.random() * 3), s = rnd(34, 95);
      return { x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.15, 0.15), vy: rnd(-0.1, 0.1), rot: rnd(0, 6), vr: rnd(-0.15, 0.15),
        pts: Array.from({ length: n }, (_, i) => { const a = (i / n) * 6.283 + rnd(-0.4, 0.4), r = s * rnd(0.5, 1); return [Math.cos(a) * r, Math.sin(a) * r] as Pt; }) };
    }),
    floor: Array.from({ length: 46 }, () => ({ x: rnd(-0.7, 1.7), ph: rnd(0, 1), sp: rnd(0.25, 0.6) })),
    // ribbons enter off one edge, swirl through the centre and leave off the opposite edge: they cross the whole screen
    ribbons: Array.from({ length: 9 }, (_, i) => {
      const th = rnd(0, 6.283), d = rnd(0.25, 0.7), o = rnd(0.12, 0.35);
      const px = -Math.sin(th) * o, py = Math.cos(th) * o;
      return {
        p: [[0.5 + Math.cos(th) * 0.95, 0.47 + Math.sin(th) * 0.95], [0.5 + px, 0.47 + py], [0.5 - px * 0.6, 0.47 - py * 0.6], [0.5 - Math.cos(th + d) * 0.95, 0.47 - Math.sin(th + d) * 0.95]] as Pt[],
        start: 0.95 + i * 0.13, dur: rnd(1.3, 1.8),
      };
    }),
    rays: Array.from({ length: 72 }, (_, i) => ({ a: rnd(0, 6.283), hw: rnd(0.004, 0.024), len: rnd(0.55, 1.15), g: i % 2 })),
    sparks: [], ups: [], sparked: false,
    endX: geo ? geo.left + geo.width / 2 : w / 2, endY: geo ? geo.top + geo.height / 2 : h * 0.47,
    lw: geo ? geo.width * geo.s : Math.min(w * 0.6, 700), lh: geo ? geo.height * geo.s : Math.min(h * 0.4, 380),
  };
}

// Layered stroke = soft halo + glow + hot core; with "lighter" blending this reads as emitted light.
function glow(ctx: CanvasRenderingContext2D, path: () => void, a: number, thin = false) {
  const passes: [number, number][] = thin ? [[5, 0.12], [1.3, 0.7]] : [[18, 0.045], [8, 0.12], [3.2, 0.32], [1.4, 0.95]];
  passes.forEach(([lw, k], i) => {
    ctx.lineWidth = lw;
    ctx.strokeStyle = i === passes.length - 1 ? `rgba(255,246,220,${a * k})` : `rgba(${GOLD},${a * k})`;
    ctx.beginPath(); path(); ctx.stroke();
  });
}
const poly = (ctx: CanvasRenderingContext2D, pts: Pt[]) => () => pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));

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

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number, fx: Fx) {
  const hy = h * 0.5, diag = Math.hypot(w, h);
  // light centre = logo centre; follows the logo's flight onto the hero logo
  const k = easeIO((t - T.fly) / T.flyDur);
  const tx = w / 2 + (fx.endX - w / 2) * k, ty = h * 0.47 + (fx.endY - h * 0.47) * k;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#070504";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  // warm haze from above, rising slowly
  radial(ctx, w / 2, -h * 0.1, h, [[0, `rgba(${GOLD},${0.16 * clamp01(t / 2.5)})`], [1, "rgba(0,0,0,0)"]]);

  // bokeh
  const bk = clamp01((t - 0.1) / 2.2) * (1 - 0.6 * clamp01((t - 4) / 1.5));
  fx.bokeh.forEach((b) => {
    const a = (0.045 + 0.035 * Math.sin(t * 0.6 + b.ph)) * bk;
    radial(ctx, b.x, b.y, b.r, [[0, `rgba(${GOLD},${a * 1.5})`], [0.7, `rgba(${GOLD},${a})`], [1, "rgba(0,0,0,0)"]]);
  });

  // horizon: streaks racing over the floor, flowing streams, a hot line across the whole width
  const fl = clamp01((t - 0.15) / 1.4) * (1 - clamp01((t - 2.6) / 1.0));
  if (fl > 0) {
    fx.floor.forEach((s) => {
      const bx = s.x * w;
      ctx.strokeStyle = `rgba(${GOLD},${0.07 * fl})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w / 2, hy); ctx.lineTo(bx, h); ctx.stroke();
      const p = (t * s.sp + s.ph) % 1, a = p * p, b = Math.min(1, a + 0.05 + 0.12 * p);
      glow(ctx, poly(ctx, [[w / 2 + (bx - w / 2) * a, hy + (h - hy) * a], [w / 2 + (bx - w / 2) * b, hy + (h - hy) * b]]), 0.75 * fl * Math.sin(p * Math.PI), true);
    });
    for (let i = 0; i < 6; i++) {
      const pts: Pt[] = [];
      for (let x = -20; x <= w + 20; x += 24) pts.push([x, hy + 6 + i * 9 + Math.sin(x * 0.006 + t * (0.8 + i * 0.15) + i) * (6 + i * 3)]);
      glow(ctx, poly(ctx, pts), 0.16 * fl, true);
    }
    const hg = ctx.createLinearGradient(0, 0, w, 0);
    hg.addColorStop(0, "rgba(255,190,90,0)"); hg.addColorStop(0.5, `rgba(255,220,160,${0.6 * fl})`); hg.addColorStop(1, "rgba(255,190,90,0)");
    ctx.fillStyle = hg; ctx.fillRect(0, hy - 1, w, 2);
  }

  // the point of light on the horizon that everything grows from
  const pt = clamp01((t - 0.2) / 1.4) * (1 - clamp01((t - 2.3) / 0.6));
  if (pt > 0) {
    radial(ctx, w / 2, hy, 10 + 50 * pt, [[0, `rgba(255,250,235,${0.95 * pt})`], [0.3, `rgba(${GOLD},${0.4 * pt})`], [1, "rgba(0,0,0,0)"]]);
    streak(ctx, w / 2, hy, w * 0.35 * pt, 0.8 * pt);
  }

  // sparks lifting off the horizon
  if (t > 0.9 && t < 3.0) for (let i = 0; i < Math.round(90 * dt); i++) fx.ups.push({ x: w / 2 + rnd(-0.4, 0.4) * w, y: hy + rnd(-4, 10), vx: rnd(-15, 15), vy: rnd(-170, -60), life: rnd(0.8, 1.6), age: 0, r: rnd(0.8, 1.8) });
  fx.ups = fx.ups.filter((s) => (s.age += dt) < s.life);
  fx.ups.forEach((s) => {
    s.x += s.vx * dt; s.y += s.vy * dt;
    const a = Math.sin((s.age / s.life) * Math.PI);
    ctx.fillStyle = `rgba(255,220,150,${0.9 * a})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
  });

  // drifting wireframe shapes + particle field
  const pv = clamp01((t - 0.2) / 1.8) * (1 - clamp01((t - 3.4) / 1.0));
  if (pv > 0) fx.polys.forEach((p) => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr * dt;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.strokeStyle = `rgba(${GOLD},${0.3 * pv})`; ctx.lineWidth = 0.8;
    ctx.beginPath(); poly(ctx, p.pts)(); ctx.closePath(); ctx.moveTo(...p.pts[0]); ctx.lineTo(...p.pts[2]); ctx.stroke();
    p.pts.forEach(([x, y]) => { ctx.fillStyle = `rgba(255,220,150,${0.8 * pv})`; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill(); });
    ctx.restore();
  });
  const vis = clamp01((t - 0.4) / 1.6) * (1 - 0.5 * clamp01((t - 4.5) / 1));
  fx.ps.forEach((p) => {
    p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
    const a = (0.3 + 0.7 * Math.abs(Math.sin(t * 1.2 + p.ph))) * vis;
    radial(ctx, p.x, p.y, p.r * 4, [[0, `rgba(255,225,160,${a})`], [0.35, `rgba(${GOLD},${a * 0.35})`], [1, "rgba(0,0,0,0)"]]);
  });

  // ribbons of light crossing the whole screen
  const rib = 1 - clamp01((t - 3.0) / 0.8);
  if (rib > 0) fx.ribbons.forEach((r, i) => {
    const head = 1.3 * ease((t - r.start) / r.dur);
    if (head <= 0) return;
    const [p0, p1, p2, p3] = r.p.map(([x, y]) => [x * w, y * h] as Pt);
    const at = (u: number): Pt => { const m = 1 - u; return [
      m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0],
      m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]]; };
    const pts: Pt[] = [];
    for (let u = Math.max(0, head - 0.5); u <= Math.min(1, head); u += 0.012) pts.push(at(u));
    if (pts.length < 2) return;
    glow(ctx, poly(ctx, pts), 0.9 * rib);
    pts.forEach(([x, y], j) => {
      if (j % 3) return;
      const a = (j / pts.length) * rib;
      ctx.fillStyle = `rgba(255,236,190,${0.85 * a})`;
      ctx.beginPath(); ctx.arc(x + Math.sin(j * 1.7 + i) * 9, y + Math.cos(j * 2.3 + i) * 9, 1.1 + 1.6 * a, 0, 7); ctx.fill();
    });
  });

  // god rays filling the screen from behind the logo
  const R = ease((t - 2.0) / 1.3) * (1 - 0.4 * clamp01((t - 3.9) / 0.8)) * (1 - clamp01((t - 4.9) / 1.1));
  if (R > 0) {
    [0, 1].forEach((grp) => {
      const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, diag * 1.1);
      const f = grp ? 0.7 + 0.3 * Math.sin(t * 3.1) : 0.7 + 0.3 * Math.cos(t * 2.3);
      g.addColorStop(0, `rgba(255,226,170,${0.5 * R * f})`); g.addColorStop(0.25, `rgba(${GOLD},${0.2 * R * f})`); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      fx.rays.forEach((r) => {
        if (r.g !== grp) return;
        const a = r.a + t * 0.03, L = diag * r.len;
        ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(a - r.hw) * L, ty + Math.sin(a - r.hw) * L); ctx.lineTo(tx + Math.cos(a + r.hw) * L, ty + Math.sin(a + r.hw) * L); ctx.closePath();
      });
      ctx.fill();
    });
  }

  // hot core behind the logo + horizontal flare through it
  const C = ease((t - 1.9) / 1.4) * (1 - 0.55 * clamp01((t - 3.6) / 0.6)) * (1 - clamp01((t - 5.0) / 1.0));
  if (C > 0) {
    radial(ctx, tx, ty, Math.min(w, h) * 0.55, [[0, `rgba(255,244,220,${0.85 * C})`], [0.2, `rgba(255,205,130,${0.35 * C})`], [1, "rgba(0,0,0,0)"]]);
    streak(ctx, tx, ty, w * 0.6, 0.85 * C);
  }

  // the orbiting ring of light that draws the logo (in step with the CSS conic reveal)
  const rk = (t - T.draw) / T.drawDur;
  const ringA = rk > 0 ? (rk < 1 ? 1 : 1 - clamp01((t - T.draw - T.drawDur) / 0.35)) : 0;
  if (ringA > 0) {
    const rx = fx.lw * 0.58, ry = fx.lh * 0.62, head = -Math.PI / 2 + Math.PI * 2 * clamp01(rk);
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(-0.25);
    ctx.strokeStyle = `rgba(${GOLD},${0.12 * ringA})`; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7); ctx.stroke();
    glow(ctx, () => ctx.ellipse(0, 0, rx, ry, 0, head - 1.5, head), ringA);
    radial(ctx, Math.cos(head) * rx, Math.sin(head) * ry, 40, [[0, `rgba(255,250,235,${ringA})`], [1, "rgba(0,0,0,0)"]]);
    ctx.restore();
  }

  // the flash: bloom over the whole frame, shock ring, spark burst
  const B = Math.exp(-Math.pow((t - T.peak) / 0.2, 2));
  if (B > 0.01) { ctx.fillStyle = `rgba(255,214,150,${0.32 * B})`; ctx.fillRect(0, 0, w, h); }
  const sk = (t - T.peak) / 1.4;
  if (sk > 0 && sk < 1) glow(ctx, () => ctx.ellipse(tx, ty, ease(sk) * diag * 0.6, ease(sk) * diag * 0.36, 0, 0, 7), 0.7 * (1 - sk));
  if (t >= T.peak && !fx.sparked) {
    fx.sparked = true;
    fx.sparks = Array.from({ length: 170 }, () => { const a = rnd(0, 6.283), v = rnd(150, 900); return { x: tx, y: ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, life: rnd(1.2, 2.8), age: 0, r: rnd(0.8, 2.4) }; });
  }
  fx.sparks.forEach((s) => {
    if ((s.age += dt) > s.life) return;
    const d = Math.pow(0.15, dt); s.vx *= d; s.vy *= d; s.x += s.vx * dt; s.y += s.vy * dt + 14 * dt;
    const a = 1 - s.age / s.life;
    radial(ctx, s.x, s.y, s.r * 4, [[0, `rgba(255,240,200,${a})`], [0.3, `rgba(${GOLD},${a * 0.4})`], [1, "rgba(0,0,0,0)"]]);
  });

  // anamorphic flare sweeping across the full width
  const sw = (t - 3.65) / 1.1;
  if (sw > 0 && sw < 1) {
    const a = Math.sin(sw * Math.PI);
    streak(ctx, -0.2 * w + 1.4 * w * easeIO(sw), ty + h * 0.02, w * 0.45, 0.9 * a);
    radial(ctx, -0.2 * w + 1.4 * w * easeIO(sw), ty + h * 0.02, 28, [[0, `rgba(255,250,235,${a})`], [1, "rgba(0,0,0,0)"]]);
  }

  // HUD / blueprint lines over the full width
  const hud = clamp01((t - 3.7) / 1.1) * (1 - clamp01((t - 5.3) / 0.8));
  if (hud > 0) {
    const x1 = w * 0.05, x2 = w * 0.95, y0 = h * 0.12, y1 = h * 0.8;
    ctx.strokeStyle = `rgba(${GOLD},${0.55 * hud})`; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, 0); ctx.lineTo(x1, h * hud); ctx.moveTo(x2, 0); ctx.lineTo(x2, h * hud);
    ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * hud, y1); ctx.moveTo(x2, y0); ctx.lineTo(x2 - (x2 - x1) * 0.35 * hud, y0);
    for (let y = 24; y < h * hud; y += 24) { const l = y % 96 === 24 ? 14 : 6; ctx.moveTo(x1, y); ctx.lineTo(x1 + l, y); ctx.moveTo(x2, y); ctx.lineTo(x2 - l, y); }
    ctx.stroke();
    [[x1, y1], [x2, y0], [x1, y0], [x2, y1]].forEach(([x, y]) => {
      ctx.strokeStyle = `rgba(${GOLD},${0.7 * hud})`; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.stroke();
      ctx.fillStyle = `rgba(255,225,160,${hud})`; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill();
    });
    const sx = x1 + (x2 - x1) * ((t * 0.45) % 1);
    radial(ctx, sx, y1, 16, [[0, `rgba(255,245,220,${hud})`], [1, "rgba(0,0,0,0)"]]);
    ctx.font = "12px ui-monospace, Menlo, Consolas, monospace";
    ctx.fillStyle = `rgba(255,214,150,${0.9 * hud})`;
    ctx.fillText("VOL. 1  //  16TH EDITION", x1 + 20, y0 + 4);
    ctx.fillText("18 – 20 FEB 2027", x2 - 140, y0 + 22);
    ctx.fillText("O.P. JINDAL UNIVERSITY", x1 + 20, y1 - 12);
    ctx.fillText(`T+${t.toFixed(2)}`, x2 - 70, y1 - 12);
  }

  // progress line along the bottom, full width
  const pa = 1 - clamp01((t - T.fade) / 0.6);
  ctx.fillStyle = `rgba(${GOLD},${0.2 * pa})`; ctx.fillRect(w * 0.05, h - 20, w * 0.9, 1);
  ctx.fillStyle = `rgba(255,225,160,${0.8 * pa})`; ctx.fillRect(w * 0.05, h - 21, w * 0.9 * clamp01(t / T.fade), 3);

  ctx.globalCompositeOperation = "source-over";

  // retro film damage: a few dust specks most frames, the odd vertical scratch
  if (Math.random() < 0.4) for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(255,240,210,${rnd(0.15, 0.45)})`;
    ctx.beginPath(); ctx.arc(rnd(0, w), rnd(0, h), rnd(0.6, 2.2), 0, 7); ctx.fill();
  }
  if (Math.random() < 0.12) { ctx.fillStyle = `rgba(255,236,200,${rnd(0.08, 0.22)})`; ctx.fillRect(rnd(0, w), 0, rnd(0.6, 1.4), h); }
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

export function Intro() {
  const [phase, setPhase] = useState<"gate" | "play" | "out" | "gone">("gate");
  const [geo, setGeo] = useState<Geo | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // plays on every visit; only reduced-motion users skip it
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("gone");
  }, []);

  // lock scroll while the overlay is up
  useEffect(() => {
    document.body.style.overflow = phase === "gone" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  function enter() {
    window.scrollTo(0, 0);
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
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let fx = makeFx(innerWidth, innerHeight, measure());
    const size = () => {
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = measure(); setGeo(g);
      fx = { ...fx, ...makeFx(innerWidth, innerHeight, g), sparks: fx.sparks, ups: fx.ups, sparked: fx.sparked };
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

  return (
    <div className={`intro-overlay fixed inset-0 z-[100] overflow-hidden bg-[#070504] ${phase === "out" ? "out" : ""}`} style={{ transition: "opacity 1.4s ease", opacity: phase === "out" ? 0 : 1, pointerEvents: phase === "out" ? "none" : "auto" }}>
      {phase === "gate" ? (
        <button onClick={enter} className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-[#f1c36b]">
          <span className={`text-4xl sm:text-6xl ${serif.className}`} style={{ backgroundImage: goldText, WebkitBackgroundClip: "text", color: "transparent" }}>Techno-aiMBiAtion &apos;27</span>
          <span className="animate-pulse border border-[#f1c36b]/70 px-8 py-2 text-sm font-bold uppercase tracking-[0.4em]">Enter ♪</span>
        </button>
      ) : (
        <>
          {/* slight gate weave, like film running through a projector */}
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" style={{ animation: "intro-weave .3s steps(2) infinite" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.65) 100%)" }} />
          {/* warm light leaks in the poster's orange and teal */}
          <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(ellipse 45% 55% at 0% 15%, rgba(214,90,40,.55), transparent 70%), radial-gradient(ellipse 40% 50% at 100% 90%, rgba(47,140,140,.45), transparent 70%)", animation: "intro-leak 7.5s ease-in-out both" }} />

          {/* The gold logo: drawn as light at the centre of the screen, turns to solid gold at the flash,
              then flies onto the hero's real logo (it is laid out over it, and starts blown up to the centre). */}
          {geo && (
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                left: geo.left, top: geo.top, width: geo.width, height: geo.height, transformOrigin: "50% 50%",
                ["--dx" as string]: `${geo.dx}px`, ["--dy" as string]: `${geo.dy}px`, ["--s" as string]: geo.s,
                animation: `intro-fly ${T.flyDur}s ${T.fly}s cubic-bezier(.65,0,.35,1) both, intro-land .9s ${T.fly + T.flyDur - 0.15}s ease-out`,
              } as CSSProperties}
            >
              {/* slight red/teal chromatic fringe, like an old lens */}
              <div className="absolute inset-0" style={{ animation: `intro-breathe 2.8s ${T.draw}s ease-out both`, filter: "drop-shadow(-2px 0 rgba(255,70,40,.4)) drop-shadow(2px 0 rgba(40,200,210,.35))" }}>
                <div className="intro-sweep absolute inset-0" style={{ animation: `intro-sweep ${T.drawDur}s ${T.draw}s linear both, intro-outline-dim .8s ${T.metal + 0.2}s ease forwards` }}>
                  <Lockup variant="outline" />
                </div>
                <div className="absolute inset-0" style={{ animation: `intro-metal .8s ${T.metal}s ease both` }}>
                  <Lockup variant="metal" />
                </div>
              </div>
            </div>
          )}

          {/* cinematic letterbox that retracts slowly at the start */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[13vh] bg-black" style={{ animation: "intro-bar-t 1.8s .6s cubic-bezier(.6,0,.2,1) both" }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[13vh] bg-black" style={{ animation: "intro-bar-b 1.8s .6s cubic-bezier(.6,0,.2,1) both" }} />

          {/* retro film finish: sepia grade, grain, scanlines, projector flicker */}
          <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: "#c48a3a", opacity: 0.18 }} />
          <div aria-hidden className="pointer-events-none absolute -inset-[10%] mix-blend-overlay" style={{ backgroundImage: NOISE, opacity: 0.22, animation: "intro-grain .5s steps(1) infinite" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px)", opacity: 0.5 }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#ffe6bf] mix-blend-overlay" style={{ animation: "intro-flicker 1.7s linear infinite" }} />

          <button onClick={finish} className="absolute bottom-6 right-6 z-10 border border-[#f1c36b]/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-[#f1c36b]/80 hover:bg-[#f1c36b]/10">Skip</button>
        </>
      )}
      <style>{`
        @property --sweep { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        .intro-sweep {
          -webkit-mask-image: conic-gradient(from 0deg at 50% 50%, #000 var(--sweep), transparent calc(var(--sweep) + 3deg));
          mask-image: conic-gradient(from 0deg at 50% 50%, #000 var(--sweep), transparent calc(var(--sweep) + 3deg));
        }
        @keyframes intro-sweep { from { --sweep: 0deg; } to { --sweep: 362deg; } }
        @keyframes intro-outline-dim { to { opacity: .35; } }
        @keyframes intro-metal { from { opacity: 0; filter: brightness(2.4) blur(6px); } to { opacity: 1; filter: none; } }
        @keyframes intro-breathe { from { scale: 1.07; } to { scale: 1; } }
        @keyframes intro-fly { from { transform: translate(var(--dx), var(--dy)) scale(var(--s)); } to { transform: none; } }
        @keyframes intro-land { 0% { filter: none; } 30% { filter: brightness(1.7) drop-shadow(0 0 30px rgba(255,200,110,.9)); } 100% { filter: none; } }
        @keyframes intro-weave { 0% { transform: translate(0, 0); } 50% { transform: translate(.4px, .7px); } }
        @keyframes intro-grain { 0% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -3%); } 60% { transform: translate(-2%, -1%); } 80% { transform: translate(3%, 2%); } }
        @keyframes intro-flicker { 0%, 100% { opacity: 0; } 6% { opacity: .07; } 8% { opacity: 0; } 41% { opacity: .05; } 43% { opacity: 0; } 70% { opacity: .08; } 72% { opacity: 0; } }
        @keyframes intro-leak { 0% { opacity: 0; transform: translateX(-4%); } 25% { opacity: .55; } 55% { opacity: .3; } 80% { opacity: .5; transform: translateX(3%); } 100% { opacity: .35; } }
        @keyframes intro-bar-t { from { transform: none; } to { transform: translateY(-100%); } }
        @keyframes intro-bar-b { from { transform: none; } to { transform: translateY(100%); } }
      `}</style>
    </div>
  );
}
