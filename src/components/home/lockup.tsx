import type { CSSProperties, ReactNode } from "react";
import { serif } from "@/components/indie";
import { Burst, CREAM, INK } from "./hero-art";
import { sans } from "./fonts";

// "Techno-aiMBiAtion '27" cut-out lockup. All geometry is in em from the root's clamp()ed font-size, so every
// variant renders at exactly the same size and position:
//   color   – the hero logo (marked data-hero-lockup so the intro can find it on screen)
//   outline – glowing gold line-art
//   metal   – solid gold
// `buildAt` (seconds) makes each piece splash in on a schedule (used by the intro, which renders its own copy).
export type LockupVariant = "color" | "outline" | "metal";

const LIGHT = "#ffe2a0";
const GLOW = "drop-shadow(0 0 .1em rgba(255,186,80,.95)) drop-shadow(0 0 .45em rgba(255,170,60,.55))";
const TAG_SHADOW = `0 0 0 .14em ${CREAM}, .2em .3em 0 .1em rgba(0,0,0,.35)`;

function Tape({ x, y, rot = 0, size = 1, lettering = false, className = "", style, children }: {
  x: number; y: number; rot?: number; size?: number; lettering?: boolean; className?: string; style?: CSSProperties; children: ReactNode;
}) {
  // positioned wrapper + sized label, so the offsets are not multiplied by the label's font-size
  return (
    <div className="absolute" style={{ left: `${x}em`, top: `${y}em`, transform: `rotate(${rot}deg)` }}>
      <span className={`block whitespace-nowrap ${lettering ? serif.className : `font-extrabold uppercase ${sans.className}`} ${className}`} style={{ fontSize: `${size}em`, ...style }}>{children}</span>
    </div>
  );
}

// `c` = [centre x, centre y, size] in em, used to aim the intro's colour at each piece.
const BURSTS = [
  { n: 12, ri: 30, seed: 1, fill: "#efe2c4", cls: "-left-[4em] top-[6em] h-[13em] w-[13em]", c: [2.5, 12.5, 13] },
  { n: 9, ri: 20, seed: 3, fill: "#e2b43b", cls: "left-[12em] -top-[2em] h-[10em] w-[10em] rotate-6", c: [17, 3, 10] },
  { n: 9, ri: 22, seed: 4, fill: "#c4512b", cls: "left-[27em] top-[2.5em] h-[11em] w-[11em] rotate-[20deg]", c: [32.5, 8, 11] },
  { n: 10, ri: 24, seed: 7, fill: "#c4512b", cls: "left-[9em] top-[12.5em] h-[9em] w-[9em]", c: [13.5, 17, 9] },
  { n: 8, ri: 32, seed: 9, fill: "#d9b95a", cls: "left-[18em] top-[5em] h-[8em] w-[8em]", c: [22, 9, 8] },
];

const LINES = [
  { text: "Techno-", x: 2.4, y: 3.6, rot: -2, bg: "#c4512b", c: [12.9, 6.4, 21] },
  { text: "aiMBiAtion", x: 0.8, y: 9.1, rot: -1.5, bg: "#2f6f73", c: [15.8, 11.9, 30] },
  { text: "’27", x: 1.2, y: 14.6, rot: -4, bg: "#6b4a3c", c: [6.2, 17.4, 10] },
];

const TAGS = [
  { text: "★ Vol. 1", x: 5.5, y: 0.9, rot: -5, size: 1.35, pad: "px-[1.2em] py-[.4em] tracking-widest", color: "bg-[#e2b43b] text-[#1c1812]", colorStyle: { clipPath: "polygon(0 8%,4% 0,96% 6%,100% 0,98% 92%,100% 100%,3% 94%,0 100%)" }, fill: "#e2b43b", c: [9.5, 2, 7] },
  { text: "16th Edition", x: 21.5, y: 0.2, rot: 5, size: 1.15, pad: "px-[.9em] py-[.35em] tracking-wide", color: "border-[.15em] border-[#c4512b] bg-[#f3e8cf] text-[#c4512b]", colorStyle: { boxShadow: TAG_SHADOW }, fill: "#f3e8cf", c: [26, 1.3, 8] },
  { text: "OP Jindal University", x: 19.5, y: 16.6, rot: -2.5, size: 1.3, pad: "px-[1.1em] py-[.55em] tracking-wide", color: "border-[.15em] border-[#c4512b] bg-[#f3e8cf] text-[#3a2a22]", colorStyle: { boxShadow: TAG_SHADOW }, fill: "#f3e8cf", c: [27, 18, 11] },
];

// Build schedule, seconds after `buildAt`: bursts, then the three lettering blocks, then the tags.
const AT = { burst: (i: number) => i * 0.1, line: (i: number) => 0.45 + i * 0.22, tag: (i: number) => 1.0 + i * 0.12 };

export type LockupPiece = { cx: number; cy: number; size: number; color: string; at: number };
export const LOCKUP_EM = { width: 38, height: 20.5 };
export const LOCKUP_PIECES: LockupPiece[] = [
  ...BURSTS.map((b, i) => ({ cx: b.c[0], cy: b.c[1], size: b.c[2], color: b.fill, at: AT.burst(i) })),
  ...LINES.map((l, i) => ({ cx: l.c[0], cy: l.c[1], size: l.c[2], color: l.bg, at: AT.line(i) })),
  ...TAGS.map((tg, i) => ({ cx: tg.c[0], cy: tg.c[1], size: tg.c[2], color: tg.fill, at: AT.tag(i) })),
];

function lineStyle(v: LockupVariant, bg: string): CSSProperties {
  if (v === "outline") return {
    color: "transparent", WebkitTextStroke: `.022em ${LIGHT}`,
    boxShadow: `0 0 0 .03em ${LIGHT}, 0 0 .35em rgba(255,180,70,.55), inset 0 0 .3em rgba(255,180,70,.35)`, filter: GLOW,
  };
  if (v === "metal") return {
    background: "linear-gradient(180deg, rgba(64,40,8,.92), rgba(22,13,2,.95))", color: "#ffd47e",
    WebkitTextStroke: ".03em #fff1c9", paintOrder: "stroke fill",
    textShadow: "0 .045em 0 #7a4f12, 0 0 .3em rgba(255,190,90,.8)",
    boxShadow: `0 0 0 .045em ${LIGHT}, 0 0 0 .07em #4a3008, 0 0 .6em rgba(255,190,90,.6)`,
  };
  return {
    background: bg, color: CREAM, WebkitTextStroke: `.04em ${INK}`, paintOrder: "stroke fill",
    boxShadow: `0 0 0 .055em ${CREAM}, 0 0 0 .08em ${INK}, .07em .11em 0 .08em rgba(0,0,0,.4)`,
  };
}

function tagLook(v: LockupVariant, tag: (typeof TAGS)[number]): { className: string; style: CSSProperties } {
  if (v === "outline") return { className: tag.pad, style: { color: LIGHT, border: `.08em solid ${LIGHT}`, boxShadow: "0 0 .4em rgba(255,180,70,.6), inset 0 0 .3em rgba(255,180,70,.4)", filter: GLOW } };
  if (v === "metal") return { className: tag.pad, style: { color: "#2a1a05", background: "linear-gradient(180deg,#ffe7a8,#d9a441 55%,#a86f1c)", border: ".08em solid #fff0c4", boxShadow: "0 0 .5em rgba(255,190,90,.6)" } };
  return { className: `${tag.pad} ${tag.color}`, style: tag.colorStyle };
}

function burstLook(v: LockupVariant, fill: string) {
  if (v === "outline") return { fill: "none", stroke: LIGHT, sw: 1.4, style: { filter: "drop-shadow(0 0 3px rgba(255,186,80,.95)) drop-shadow(0 0 10px rgba(255,170,60,.5))" } as CSSProperties };
  if (v === "metal") return { fill: "rgba(150,100,25,.35)", stroke: LIGHT, sw: 1.6, style: { filter: "drop-shadow(0 0 4px rgba(255,190,90,.8))" } as CSSProperties };
  return { fill, stroke: INK, sw: 2, style: undefined as CSSProperties | undefined };
}

// keyframes lsx-splat / lsx-ink / lsx-stamp live with the intro that uses them
const anim = (name: string, dur: number, at: number | undefined, curve: string): CSSProperties =>
  at === undefined ? {} : { animation: `${name} ${dur}s ${at}s ${curve} both` };

export function Lockup({ variant = "color", buildAt }: { variant?: LockupVariant; buildAt?: number }) {
  const t = (d: number) => (buildAt === undefined ? undefined : buildAt + d);
  return (
    <div
      data-hero-lockup={variant === "color" && buildAt === undefined ? "" : undefined}
      aria-hidden={variant !== "color" || buildAt !== undefined || undefined}
      className="relative mx-auto h-[20.5em] w-[38em] max-w-full"
      style={{ fontSize: "clamp(9px, min(1.16vw, 2vh), 25px)" }}
    >
      {BURSTS.map((b, i) => {
        const look = burstLook(variant, b.fill);
        return <Burst key={b.seed} n={b.n} ro={48} ri={b.ri} seed={b.seed} fill={look.fill} stroke={look.stroke} sw={look.sw}
          style={{ ...look.style, ...anim("lsx-splat", 1.0, t(AT.burst(i)), "cubic-bezier(.16,1,.3,1)") }} className={`absolute ${b.cls}`} />;
      })}
      {LINES.map((l, i) => (
        <Tape key={l.text} x={l.x} y={l.y} rot={l.rot} size={5.4} lettering className="leading-none px-[.28em] pb-[.06em] pt-[.02em]"
          style={{ ...lineStyle(variant, l.bg), ...anim("lsx-ink", 1.0, t(AT.line(i)), "cubic-bezier(.16,1,.3,1)") }}>{l.text}</Tape>
      ))}
      {TAGS.map((tag, i) => {
        const look = tagLook(variant, tag);
        return <Tape key={tag.text} x={tag.x} y={tag.y} rot={tag.rot} size={tag.size} className={look.className}
          style={{ ...look.style, ...anim("lsx-stamp", 0.8, t(AT.tag(i)), "cubic-bezier(.16,1,.3,1)") }}>{tag.text}</Tape>;
      })}
    </div>
  );
}
