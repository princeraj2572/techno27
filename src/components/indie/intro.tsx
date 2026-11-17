"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { serif } from "@/components/indie";
import { Lockup, LOCKUP_EM, LOCKUP_PIECES } from "@/components/home/lockup";

// Coded intro, light + colour:
//   0–2s     dark horizon: a point of light, streaks racing over the floor, flowing streams, drifting wireframes
//   1–3s     ribbons in the logo's colours sweep across the whole screen
//   1–3.4s   paint/powder streams fly in from every edge and converge on the logo; each piece of the real colour
//            logo splashes into place where its colour lands (splat + droplets), with god rays building behind
//   3.45s    flash: bloom, shock ring and a colour-powder explosion; an anamorphic flare sweeps across
//   3.7–6s   HUD lines
//   4.85–6.1 the colour logo flies onto the hero's logo (identical, so the hand-off is seamless), then dissolve
// Retro film finish on top (grain, scanlines, flicker, weave, leaks, dust). Click-to-enter gate so audio may play.
const SRC = "/audio/intro.mp4";
const T = { build: 1.75, peak: 3.45, fly: 4.85, flyDur: 1.25, fade: 6.15, end: 7.55 };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeIO = (x: number) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const GOLD = "255,190,90";
// the logo's own palette (+ a couple of brighter accents) for paint, powder and coloured light
const PALETTE = ["#c4512b", "#2f6f73", "#e2b43b", "#efe2c4", "#6b4a3c", "#d9b95a", "#3f8a92", "#ff6a00"];
const RIB_RGB = ["196,81,43", "63,160,166", "226,180,59", "239,226,196"];
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <X,>(a: X[]) => a[Math.floor(Math.random() * a.length)];

type Geo = { left: number; top: number; width: number; height: number; dx: number; dy: number; s: number };
type Pt = [number, number];
type Spark = { x: number; y: number; vx: number; vy: number; life: number; age: number; r: number };
type Drop = { x: number; y: number; vx: number; vy: number; life: number; age: number; r: number; c: string };
// a blob of paint/powder flying along a curve onto a logo piece
type Stream = { p0: Pt; p1: Pt; p2: Pt; start: number; dur: number; r: number; c: string };
// where each logo piece sits on screen while the logo is built, and when it lands
type Piece = { x: number; y: number; rad: number; c: string; at: number; blob: number[]; hit: boolean };
type Fx = {
  ps: { x: number; y: number; r: number; vx: number; vy: number; ph: number }[];
  bokeh: { x: number; y: number; r: number; ph: number }[];
  polys: { x: number; y: number; vx: number; vy: number; rot: number; vr: number; pts: Pt[] }[];
  floor: { x: number; ph: number; sp: number }[];
  ribbons: { p: Pt[]; start: number; dur: number }[];
  rays: { a: number; hw: number; len: number; g: number }[];
  pieces: Piece[]; streams: Stream[]; drops: Drop[]; clouds: Drop[];
  sparks: Spark[]; ups: Spark[]; sparked: boolean;
  endX: number; endY: number;
};

function makeFx(w: number, h: number, geo: Geo | null): Fx {
  const diag = Math.hypot(w, h), cx = w / 2, cy = h * 0.47;
  // logo piece positions on screen during the build (logo blown up by geo.s around the screen centre)
  const fs = geo ? geo.width / LOCKUP_EM.width : 14, s = geo ? geo.s : 1.5;
  const lw = geo ? geo.width : LOCKUP_EM.width * fs, lh = geo ? geo.height : LOCKUP_EM.height * fs;
  const pieces: Piece[] = LOCKUP_PIECES.map((p) => ({
    x: cx + (p.cx * fs - lw / 2) * s, y: cy + (p.cy * fs - lh / 2) * s, rad: (p.size * fs * s) / 2,
    c: p.color, at: T.build + p.at, blob: Array.from({ length: 14 }, () => rnd(0.7, 1.25)), hit: false,
  }));
  const streams: Stream[] = pieces.flatMap((pc) => Array.from({ length: 46 }, () => {
    const a = rnd(0, 6.283), d = diag * rnd(0.5, 0.78), dur = rnd(0.9, 1.5);
    const p0: Pt = [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
    const p2: Pt = [pc.x + rnd(-0.6, 0.6) * pc.rad, pc.y + rnd(-0.4, 0.4) * pc.rad];
    const sw = rnd(0.6, 1.1) * (Math.random() < 0.5 ? -1 : 1); // swirl in from the side
    const mx = (p0[0] + p2[0]) / 2 - p2[0], my = (p0[1] + p2[1]) / 2 - p2[1];
    const p1: Pt = [p2[0] + mx * Math.cos(sw) - my * Math.sin(sw), p2[1] + mx * Math.sin(sw) + my * Math.cos(sw)];
    return { p0, p1, p2, start: pc.at + rnd(-0.05, 0.12) - dur, dur, r: rnd(2, 5.5), c: Math.random() < 0.72 ? pc.c : pick(PALETTE) };
  }));
  return {
    ps: Array.from({ length: 90 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.6, 2.2), vx: rnd(-0.15, 0.15), vy: rnd(-0.15, 0.15), ph: rnd(0, 6) })),
    bokeh: Array.from({ length: 16 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(24, 90), ph: rnd(0, 6) })),
    polys: Array.from({ length: 8 }, () => {
      const n = 4 + Math.floor(Math.random() * 3), sz = rnd(34, 95);
      return { x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.15, 0.15), vy: rnd(-0.1, 0.1), rot: rnd(0, 6), vr: rnd(-0.15, 0.15),
        pts: Array.from({ length: n }, (_, i) => { const a = (i / n) * 6.283 + rnd(-0.4, 0.4), r = sz * rnd(0.5, 1); return [Math.cos(a) * r, Math.sin(a) * r] as Pt; }) };
    }),
    floor: Array.from({ length: 46 }, () => ({ x: rnd(-0.7, 1.7), ph: rnd(0, 1), sp: rnd(0.25, 0.6) })),
    ribbons: Array.from({ length: 9 }, (_, i) => {
      const th = rnd(0, 6.283), d = rnd(0.25, 0.7), o = rnd(0.12, 0.35);
      const px = -Math.sin(th) * o, py = Math.cos(th) * o;
      return {
        p: [[0.5 + Math.cos(th) * 0.95, 0.47 + Math.sin(th) * 0.95], [0.5 + px, 0.47 + py], [0.5 - px * 0.6, 0.47 - py * 0.6], [0.5 - Math.cos(th + d) * 0.95, 0.47 - Math.sin(th + d) * 0.95]] as Pt[],
        start: 0.95 + i * 0.13, dur: rnd(1.3, 1.8),
      };
    }),
    rays: Array.from({ length: 72 }, (_, i) => ({ a: rnd(0, 6.283), hw: rnd(0.004, 0.024), len: rnd(0.55, 1.15), g: i % 2 })),
    pieces, streams, drops: [], clouds: [],
    sparks: [], ups: [], sparked: false,
    endX: geo ? geo.left + geo.width / 2 : cx, endY: geo ? geo.top + geo.height / 2 : cy,
  };
}

// Layered stroke = soft halo + glow + hot core; with "lighter" blending this reads as emitted light.
function glow(ctx: CanvasRenderingContext2D, path: () => void, a: number, thin = false, rgb = GOLD) {
  const passes: [number, number][] = thin ? [[5, 0.12], [1.3, 0.7]] : [[18, 0.05], [8, 0.13], [3.2, 0.32], [1.4, 0.95]];
  passes.forEach(([lw, k], i) => {
    ctx.lineWidth = lw;
    ctx.strokeStyle = i === passes.length - 1 ? `rgba(255,246,220,${a * k})` : `rgba(${rgb},${a * k})`;
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

const qb = (p0: Pt, p1: Pt, p2: Pt, u: number): Pt => {
  const m = 1 - u;
  return [m * m * p0[0] + 2 * m * u * p1[0] + u * u * p2[0], m * m * p0[1] + 2 * m * u * p1[1] + u * u * p2[1]];
};

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: string, a: number) {
  ctx.globalAlpha = clamp01(a); ctx.fillStyle = c;
  ctx.beginPath(); ctx.arc(x, y, Math.max(0.3, r), 0, 7); ctx.fill();
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number, fx: Fx) {
  const hy = h * 0.5, diag = Math.hypot(w, h);
  // light centre = logo centre; follows the logo's flight onto the hero logo
  const k = easeIO((t - T.fly) / T.flyDur);
  const tx = w / 2 + (fx.endX - w / 2) * k, ty = h * 0.47 + (fx.endY - h * 0.47) * k;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#070504";
  ctx.fillRect(0, 0, w, h);

  // ---------- light (additive) ----------
  ctx.globalCompositeOperation = "lighter";
  radial(ctx, w / 2, -h * 0.1, h, [[0, `rgba(${GOLD},${0.16 * clamp01(t / 2.5)})`], [1, "rgba(0,0,0,0)"]]);

  const bk = clamp01((t - 0.1) / 2.2) * (1 - 0.6 * clamp01((t - 4) / 1.5));
  fx.bokeh.forEach((b, i) => {
    const a = (0.045 + 0.035 * Math.sin(t * 0.6 + b.ph)) * bk, rgb = RIB_RGB[i % RIB_RGB.length];
    radial(ctx, b.x, b.y, b.r, [[0, `rgba(${rgb},${a * 1.5})`], [0.7, `rgba(${rgb},${a})`], [1, "rgba(0,0,0,0)"]]);
  });

  // horizon: streaks racing over the floor, flowing streams, a hot line across the whole width
  const fl = clamp01((t - 0.15) / 1.4) * (1 - clamp01((t - 2.6) / 1.0));
  if (fl > 0) {
    fx.floor.forEach((s, i) => {
      const bx = s.x * w;
      ctx.strokeStyle = `rgba(${GOLD},${0.07 * fl})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w / 2, hy); ctx.lineTo(bx, h); ctx.stroke();
      const p = (t * s.sp + s.ph) % 1, a = p * p, b = Math.min(1, a + 0.05 + 0.12 * p);
      glow(ctx, poly(ctx, [[w / 2 + (bx - w / 2) * a, hy + (h - hy) * a], [w / 2 + (bx - w / 2) * b, hy + (h - hy) * b]]), 0.75 * fl * Math.sin(p * Math.PI), true, RIB_RGB[i % RIB_RGB.length]);
    });
    for (let i = 0; i < 6; i++) {
      const pts: Pt[] = [];
      for (let x = -20; x <= w + 20; x += 24) pts.push([x, hy + 6 + i * 9 + Math.sin(x * 0.006 + t * (0.8 + i * 0.15) + i) * (6 + i * 3)]);
      glow(ctx, poly(ctx, pts), 0.16 * fl, true, RIB_RGB[i % RIB_RGB.length]);
    }
    const hg = ctx.createLinearGradient(0, 0, w, 0);
    hg.addColorStop(0, "rgba(255,190,90,0)"); hg.addColorStop(0.5, `rgba(255,220,160,${0.6 * fl})`); hg.addColorStop(1, "rgba(255,190,90,0)");
    ctx.fillStyle = hg; ctx.fillRect(0, hy - 1, w, 2);
  }

  const pt = clamp01((t - 0.2) / 1.4) * (1 - clamp01((t - 2.3) / 0.6));
  if (pt > 0) {
    radial(ctx, w / 2, hy, 10 + 50 * pt, [[0, `rgba(255,250,235,${0.95 * pt})`], [0.3, `rgba(${GOLD},${0.4 * pt})`], [1, "rgba(0,0,0,0)"]]);
    streak(ctx, w / 2, hy, w * 0.35 * pt, 0.8 * pt);
  }

  // drifting wireframes + particle field
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

  // ribbons in the logo's colours, crossing the whole screen
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
    if (pts.length > 1) glow(ctx, poly(ctx, pts), 0.95 * rib, false, RIB_RGB[i % RIB_RGB.length]);
  });

  // god rays from behind the logo, half warm, half teal
  const R = ease((t - 1.9) / 1.4) * (1 - 0.45 * clamp01((t - 3.9) / 0.8)) * (1 - clamp01((t - 4.9) / 1.1));
  if (R > 0) {
    ["255,214,150", "120,210,200"].forEach((rgb, grp) => {
      const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, diag * 1.1);
      const f = grp ? 0.6 + 0.3 * Math.sin(t * 3.1) : 0.75 + 0.25 * Math.cos(t * 2.3);
      g.addColorStop(0, `rgba(${rgb},${0.42 * R * f})`); g.addColorStop(0.25, `rgba(${rgb},${0.16 * R * f})`); g.addColorStop(1, "rgba(0,0,0,0)");
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
  const C = ease((t - 1.8) / 1.4) * (1 - 0.6 * clamp01((t - 3.6) / 0.6)) * (1 - clamp01((t - 5.0) / 1.0));
  if (C > 0) {
    radial(ctx, tx, ty, Math.min(w, h) * 0.55, [[0, `rgba(255,244,220,${0.7 * C})`], [0.2, `rgba(255,205,130,${0.28 * C})`], [1, "rgba(0,0,0,0)"]]);
    streak(ctx, tx, ty, w * 0.6, 0.8 * C);
  }

  // flash: bloom over the whole frame + shock ring
  const B = Math.exp(-Math.pow((t - T.peak) / 0.2, 2));
  if (B > 0.01) { ctx.fillStyle = `rgba(255,220,170,${0.3 * B})`; ctx.fillRect(0, 0, w, h); }
  const sk = (t - T.peak) / 1.4;
  if (sk > 0 && sk < 1) glow(ctx, () => ctx.ellipse(tx, ty, ease(sk) * diag * 0.6, ease(sk) * diag * 0.36, 0, 0, 7), 0.7 * (1 - sk));
  if (t >= T.peak && !fx.sparked) {
    fx.sparked = true;
    fx.sparks = Array.from({ length: 110 }, () => { const a = rnd(0, 6.283), v = rnd(150, 900); return { x: tx, y: ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7, life: rnd(1.2, 2.6), age: 0, r: rnd(0.8, 2.2) }; });
    // colour-powder explosion: fast droplets + slow soft clouds, in the logo's palette
    fx.drops.push(...Array.from({ length: 320 }, () => { const a = rnd(0, 6.283), v = rnd(700, 2400); return { x: tx, y: ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.75, life: rnd(1.4, 2.8), age: 0, r: rnd(3, 10), c: pick(PALETTE) }; }));
    fx.clouds = Array.from({ length: 34 }, () => { const a = rnd(0, 6.283), v = rnd(500, 1300); return { x: tx, y: ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.6, life: rnd(2, 3.2), age: 0, r: rnd(60, 150), c: pick(PALETTE) }; });
  }
  fx.sparks.forEach((s) => {
    if ((s.age += dt) > s.life) return;
    const d = Math.pow(0.15, dt); s.vx *= d; s.vy *= d; s.x += s.vx * dt; s.y += s.vy * dt + 14 * dt;
    const a = 1 - s.age / s.life;
    radial(ctx, s.x, s.y, s.r * 4, [[0, `rgba(255,240,200,${a})`], [0.3, `rgba(${GOLD},${a * 0.4})`], [1, "rgba(0,0,0,0)"]]);
  });

  // anamorphic flare sweeping across the full width
  const swp = (t - 3.65) / 1.1;
  if (swp > 0 && swp < 1) {
    const a = Math.sin(swp * Math.PI), x = -0.2 * w + 1.4 * w * easeIO(swp);
    streak(ctx, x, ty + h * 0.02, w * 0.45, 0.9 * a);
    radial(ctx, x, ty + h * 0.02, 28, [[0, `rgba(255,250,235,${a})`], [1, "rgba(0,0,0,0)"]]);
  }

  // HUD / blueprint lines over the full width
  const hud = clamp01((t - 3.7) / 1.1) * (1 - clamp01((t - 5.3) / 0.8));
  if (hud > 0) {
    const x1 = w * 0.05, x2 = w * 0.95, y0 = h * 0.12, y1 = h * 0.8;
    ctx.strokeStyle = `rgba(${GOLD},${0.5 * hud})`; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, 0); ctx.lineTo(x1, h * hud); ctx.moveTo(x2, 0); ctx.lineTo(x2, h * hud);
    ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * hud, y1); ctx.moveTo(x2, y0); ctx.lineTo(x2 - (x2 - x1) * 0.35 * hud, y0);
    for (let y = 24; y < h * hud; y += 24) { const l = y % 96 === 24 ? 14 : 6; ctx.moveTo(x1, y); ctx.lineTo(x1 + l, y); ctx.moveTo(x2, y); ctx.lineTo(x2 - l, y); }
    ctx.stroke();
    [[x1, y1], [x2, y0], [x1, y0], [x2, y1]].forEach(([x, y]) => {
      ctx.strokeStyle = `rgba(${GOLD},${0.7 * hud})`; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.stroke();
      ctx.fillStyle = `rgba(255,225,160,${hud})`; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill();
    });
    ctx.font = "12px ui-monospace, Menlo, Consolas, monospace";
    ctx.fillStyle = `rgba(255,214,150,${0.9 * hud})`;
    ctx.fillText("VOL. 1  //  16TH EDITION", x1 + 20, y0 + 4);
    ctx.fillText("18 – 20 FEB 2027", x2 - 140, y0 + 22);
    ctx.fillText("O.P. JINDAL UNIVERSITY", x1 + 20, y1 - 12);
    ctx.fillText(`T+${t.toFixed(2)}`, x2 - 70, y1 - 12);
  }

  const pa = 1 - clamp01((t - T.fade) / 0.6);
  ctx.fillStyle = `rgba(${GOLD},${0.2 * pa})`; ctx.fillRect(w * 0.05, h - 20, w * 0.9, 1);
  ctx.fillStyle = `rgba(255,225,160,${0.8 * pa})`; ctx.fillRect(w * 0.05, h - 21, w * 0.9 * clamp01(t / T.fade), 3);

  // ---------- colour (paint, normal blending) ----------
  ctx.globalCompositeOperation = "source-over";
  // the build moves with the logo: once it starts flying, offset everything by the same amount
  const ox = tx - w / 2, oy = ty - h * 0.47;

  // powder clouds from the explosion (soft, slow)
  fx.clouds.forEach((c) => {
    if ((c.age += dt) > c.life) return;
    const d = Math.pow(0.2, dt); c.vx *= d; c.vy *= d; c.x += c.vx * dt; c.y += c.vy * dt;
    ctx.globalAlpha = 0.38 * (1 - c.age / c.life);
    radial(ctx, c.x, c.y, c.r * (1 + c.age * 0.6), [[0, c.c], [1, "rgba(0,0,0,0)"]]);
  });
  ctx.globalAlpha = 1;

  // paint splats where each piece lands, plus a ring of droplets thrown off it
  fx.pieces.forEach((p) => {
    const e = t - p.at;
    if (e >= 0 && !p.hit) {
      p.hit = true;
      fx.drops.push(...Array.from({ length: 26 }, () => { const a = rnd(0, 6.283), v = rnd(180, 620); return { x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(0.6, 1.3), age: 0, r: rnd(2, 6), c: Math.random() < 0.8 ? p.c : pick(PALETTE) }; }));
    }
    if (e < 0 || e > 1.1) return;
    const grow = ease(e / 0.22), a = 0.9 * (1 - clamp01((e - 0.25) / 0.85)), R0 = p.rad * 1.15 * grow;
    ctx.globalAlpha = a; ctx.fillStyle = p.c;
    ctx.beginPath();
    p.blob.forEach((f, i) => {
      const ang = (i / p.blob.length) * 6.283, ang2 = ((i + 0.5) / p.blob.length) * 6.283;
      const r1 = R0 * f, r2 = R0 * (0.75 + 0.2 * f);
      if (i === 0) ctx.moveTo(p.x + ox + Math.cos(ang) * r1, p.y + oy + Math.sin(ang) * r1);
      ctx.quadraticCurveTo(p.x + ox + Math.cos(ang2) * r2 * 1.1, p.y + oy + Math.sin(ang2) * r2 * 1.1,
        p.x + ox + Math.cos(ang + 6.283 / p.blob.length) * R0 * p.blob[(i + 1) % p.blob.length], p.y + oy + Math.sin(ang + 6.283 / p.blob.length) * R0 * p.blob[(i + 1) % p.blob.length]);
    });
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // paint/powder streams converging on the logo pieces
  fx.streams.forEach((s) => {
    const u = (t - s.start) / s.dur;
    if (u < 0 || u > 1) return;
    const e = Math.pow(u, 1.5);
    for (let j = 0; j < 4; j++) {
      const [x, y] = qb(s.p0, s.p1, s.p2, Math.max(0, e - j * 0.035));
      dot(ctx, x, y, s.r * (1 - j * 0.22) * (0.7 + 0.5 * u), s.c, (0.95 - j * 0.22) * Math.min(1, u * 4));
    }
  });

  // droplets (piece splashes + the explosion)
  fx.drops = fx.drops.filter((d) => (d.age += dt) < d.life);
  fx.drops.forEach((d) => {
    const dm = Math.pow(0.12, dt); d.vx *= dm; d.vy *= dm; d.x += d.vx * dt; d.y += d.vy * dt + 60 * dt * d.age;
    dot(ctx, d.x, d.y, d.r * (1 - 0.5 * (d.age / d.life)), d.c, 1 - d.age / d.life);
  });
  ctx.globalAlpha = 1;

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
      const fresh = makeFx(innerWidth, innerHeight, g);
      fx = { ...fresh, pieces: fresh.pieces.map((p, i) => ({ ...p, hit: fx.pieces[i]?.hit ?? false })), drops: fx.drops, clouds: fx.clouds, sparks: fx.sparks, ups: fx.ups, sparked: fx.sparked };
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

          {/* The real colour logo, built piece by piece where the colour lands, blown up at the centre;
              then it flies onto the hero's logo (identical, so the hand-off is seamless). */}
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
              {/* light on the colour: a warm glow that settles, then a sheen of light across the logo at the flash */}
              <div className="absolute inset-0" style={{ animation: `intro-breathe 2.8s ${T.build}s ease-out both, intro-glow 2.6s ${T.build}s ease-out both` }}>
                <Lockup buildAt={T.build} />
              </div>
              <div className="absolute inset-0 overflow-hidden mix-blend-screen" style={{ WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 55%, transparent 80%)" }}>
                <div className="absolute inset-y-0 -left-1/2 w-1/2" style={{ background: "linear-gradient(105deg, transparent, rgba(255,240,210,.75), transparent)", animation: `intro-sheen 1.1s ${T.peak + 0.1}s ease-in-out both` }} />
              </div>
            </div>
          )}

          {/* retro film finish: sepia grade, grain, scanlines, projector flicker */}
          <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: "#c48a3a", opacity: 0.12 }} />
          <div aria-hidden className="pointer-events-none absolute -inset-[10%] mix-blend-overlay" style={{ backgroundImage: NOISE, opacity: 0.22, animation: "intro-grain .5s steps(1) infinite" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px)", opacity: 0.5 }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#ffe6bf] mix-blend-overlay" style={{ animation: "intro-flicker 1.7s linear infinite" }} />

          {/* cinematic letterbox that retracts slowly at the start */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[13vh] bg-black" style={{ animation: "intro-bar-t 1.8s .6s cubic-bezier(.6,0,.2,1) both" }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[13vh] bg-black" style={{ animation: "intro-bar-b 1.8s .6s cubic-bezier(.6,0,.2,1) both" }} />

          <button onClick={finish} className="absolute bottom-6 right-6 z-10 border border-[#f1c36b]/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-[#f1c36b]/80 hover:bg-[#f1c36b]/10">Skip</button>
        </>
      )}
      <style>{`
        @keyframes lsx-splat { from { scale: 0; rotate: -25deg; opacity: 0; } 60% { scale: 1.15; opacity: 1; } to { scale: 1; rotate: 0deg; } }
        @keyframes lsx-ink { from { clip-path: inset(-50% 100% -50% -50%); filter: brightness(1.8); } to { clip-path: inset(-50% -50% -50% -50%); filter: none; } }
        @keyframes lsx-stamp { from { scale: 2.2; opacity: 0; } to { scale: 1; opacity: 1; } }
        @keyframes intro-glow { from { filter: drop-shadow(0 0 30px rgba(255,220,160,.9)) brightness(1.3); } to { filter: drop-shadow(0 0 0 rgba(255,220,160,0)); } }
        @keyframes intro-sheen { from { transform: translateX(0); } to { transform: translateX(400%); } }
        @keyframes intro-breathe { from { scale: 1.07; } to { scale: 1; } }
        @keyframes intro-fly { from { transform: translate(var(--dx), var(--dy)) scale(var(--s)); } to { transform: none; } }
        @keyframes intro-land { 0% { filter: none; } 30% { filter: brightness(1.5) drop-shadow(0 0 30px rgba(255,200,110,.9)); } 100% { filter: none; } }
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
