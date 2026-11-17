import type { CSSProperties } from "react";
import { serif } from "@/components/indie";

export const CREAM = "#f3e8cf";
export const INK = "#1c1812";

// Spiky sticker burst. Deterministic jitter (no Math.random) so server and client markup match.
export function Burst({ n = 12, ro = 48, ri = 26, seed = 0, fill, stroke = INK, sw = 2, className = "", style }: {
  n?: number; ro?: number; ri?: number; seed?: number; fill: string; stroke?: string; sw?: number; className?: string; style?: CSSProperties;
}) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n;
    const r = (i % 2 ? ri : ro) * (1 + 0.16 * Math.sin(i * 2.7 + seed));
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  );
}

// Slightly wobbly five-point star: solid, outlined, or "scribbled" (dark with cream hatching).
export function Star({ fill = CREAM, stroke = INK, hatch = false, className = "", style }: {
  fill?: string; stroke?: string; hatch?: boolean; className?: string; style?: CSSProperties;
}) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (Math.PI * i) / 5;
    const r = (i % 2 ? 21 : 47) * (1 + 0.05 * Math.sin(i * 3.1));
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(52 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <polygon points={pts} fill="none" stroke={CREAM} strokeWidth="11" strokeLinejoin="round" />
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth="3.5" strokeLinejoin="round" />
      {hatch && [34, 44, 54, 64].map((y) => <line key={y} x1="30" y1={y} x2="70" y2={y - 14} stroke={CREAM} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />)}
    </svg>
  );
}

export function Sparkle({ fill = "#e2b43b", className = "", style }: { fill?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path d="M50 0 Q54 46 100 50 Q54 54 50 100 Q46 54 0 50 Q46 46 50 0Z" fill={fill} />
    </svg>
  );
}

// Chalk-style curved arrow. `flip` mirrors it, `down` points it downward.
export function Arrow({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 70" className={className} style={style} aria-hidden fill="none" stroke={CREAM} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 62 C 8 24, 46 6, 90 30" />
      <path d="M74 14 L91 31 L68 38" />
    </svg>
  );
}

// Round vinyl-in-a-star badge used as the navbar logo.
export function VinylBadge({ className = "" }: { className?: string }) {
  const star = Array.from({ length: 20 }, (_, i) => {
    const a = (Math.PI * i) / 10 - Math.PI / 2;
    const r = i % 2 ? 40 : 58;
    return `${(60 + r * Math.cos(a)).toFixed(1)},${(60 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  const line = { fill: CREAM, stroke: INK, strokeWidth: 4.5, paintOrder: "stroke" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <polygon points={star} fill="#e2b43b" stroke={CREAM} strokeWidth="6" strokeLinejoin="round" />
      <polygon points={star} fill="#e2b43b" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="60" cy="62" r="39" fill="#15120d" stroke={CREAM} strokeWidth="2" />
      {[33, 28, 23].map((r) => <circle key={r} cx="60" cy="62" r={r} fill="none" stroke="#3a342b" strokeWidth="0.8" />)}
      <path d="M32 50 A31 31 0 0 1 60 31 L60 62 Z" fill="#b5482a" opacity="0.9" />
      <polygon points="60,6 63,15 72,15 65,21 68,30 60,24 52,30 55,21 48,15 57,15" fill="#e2b43b" stroke={INK} strokeWidth="1.4" transform="translate(14 -2) scale(0.72)" />
      <g transform="rotate(-9 60 62)" className={serif.className} fontSize="17" textAnchor="middle">
        <text x="60" y="55" {...line}>Techno-</text>
        <text x="60" y="73" {...line}>aiMBiAtion</text>
        <text x="60" y="90" {...line}>&apos;27</text>
      </g>
    </svg>
  );
}
