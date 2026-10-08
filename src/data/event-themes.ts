import type { CSSProperties } from "react";

// One visual theme per event page, drawn from the event's Indian cultural motif.
// Colours here are inline-styled (they are dynamic), patterns are generated SVG tiles.

export type PatternKind =
  | "dots" | "waves" | "stars" | "diamonds" | "rings"
  | "stripes" | "zigzag" | "peaks" | "arches" | "leaves";

export interface EventTheme {
  bg: string; // hero gradient start
  bg2: string; // hero gradient end / page tint
  ink: string; // main text on bg
  soft: string; // secondary text on bg
  accent: string; // buttons, tiles, highlights
  accentInk: string; // text on accent
  accent2: string; // second highlight
  card: string; // card surface
  cardInk: string; // text on cards
  pattern: PatternKind;
  patternColor: string;
  motif: string; // words for the scrolling strip
}

const TILES: Record<PatternKind, { size: number; svg: (c: string) => string }> = {
  dots: { size: 36, svg: (c) => `<circle cx='9' cy='9' r='2.6' fill='${c}'/><circle cx='27' cy='27' r='2.6' fill='${c}'/><circle cx='27' cy='9' r='1.4' fill='${c}'/><circle cx='9' cy='27' r='1.4' fill='${c}'/>` },
  waves: { size: 40, svg: (c) => `<path d='M0 14 q10 -10 20 0 t20 0 M0 34 q10 -10 20 0 t20 0' fill='none' stroke='${c}' stroke-width='2'/>` },
  stars: { size: 44, svg: (c) => `<path d='M11 4 l2.4 6.6 6.6 2.4 -6.6 2.4 L11 22 8.6 15.4 2 13 8.6 10.6Z M33 26 l1.6 4.4 4.4 1.6 -4.4 1.6 L33 38 31.4 33.6 27 32 31.4 30.4Z' fill='${c}'/>` },
  diamonds: { size: 36, svg: (c) => `<path d='M18 3 L33 18 L18 33 L3 18Z' fill='none' stroke='${c}' stroke-width='2'/><circle cx='18' cy='18' r='2.4' fill='${c}'/>` },
  rings: { size: 48, svg: (c) => `<circle cx='24' cy='24' r='20' fill='none' stroke='${c}' stroke-width='2'/><circle cx='24' cy='24' r='12' fill='none' stroke='${c}' stroke-width='2'/><circle cx='24' cy='24' r='4' fill='${c}'/>` },
  stripes: { size: 24, svg: (c) => `<path d='M-4 28 L28 -4 M-4 16 L16 -4 M8 28 L28 8' stroke='${c}' stroke-width='3' fill='none'/>` },
  zigzag: { size: 40, svg: (c) => `<path d='M0 28 l10 -18 l10 18 l10 -18 l10 18' fill='none' stroke='${c}' stroke-width='2.4'/>` },
  peaks: { size: 48, svg: (c) => `<path d='M0 40 L16 14 L26 30 L34 20 L48 40' fill='none' stroke='${c}' stroke-width='2.4' stroke-linejoin='round'/>` },
  arches: { size: 36, svg: (c) => `<path d='M4 34 V18 a14 14 0 0 1 28 0 V34 M10 34 V19 a8 8 0 0 1 16 0 V34' fill='none' stroke='${c}' stroke-width='2'/>` },
  leaves: { size: 40, svg: (c) => `<path d='M10 30 Q4 14 20 6 Q26 22 10 30Z M30 36 Q26 24 36 16 Q40 28 30 36Z' fill='none' stroke='${c}' stroke-width='2'/>` },
};

export function patternStyle(kind: PatternKind, color: string): CSSProperties {
  const t = TILES[kind];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${t.size}' height='${t.size}' viewBox='0 0 ${t.size} ${t.size}'>${t.svg(color)}</svg>`;
  return { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: `${t.size}px ${t.size}px` };
}

const light = { card: "#fffaf0", cardInk: "#1a0f08" };

export const EVENT_THEMES: Record<string, EventTheme> = {
  // Karnataka — Hampi sandstone
  backtrace: { bg: "#f6a65a", bg2: "#ffe2b0", ink: "#4a2410", soft: "#7a4020", accent: "#b5521f", accentInk: "#fff3e0", accent2: "#5a3418", ...light, pattern: "diamonds", patternColor: "#b5521f", motif: "Hampi ✦ Karnataka ✦ Stone chariot ✦ Trace the clues ✦ " },
  // Bihar — Madhubani
  kalakriti: { bg: "#ffd27a", bg2: "#fff3c8", ink: "#6e1818", soft: "#a03020", accent: "#1d6fa5", accentInk: "#ffffff", accent2: "#c8421f", ...light, pattern: "dots", patternColor: "#c8421f", motif: "Madhubani ✦ Bihar ✦ Folk art ✦ Colour & craft ✦ " },
  // Odisha — Konark
  robovation: { bg: "#ff9a3c", bg2: "#ffe19a", ink: "#4a1608", soft: "#8a3410", accent: "#4a1a08", accentInk: "#ffe9c4", accent2: "#d9741a", ...light, pattern: "rings", patternColor: "#8a3410", motif: "Konark ✦ Odisha ✦ The wheel turns ✦ Build & race ✦ " },
  // Kerala — backwaters
  masterchef: { bg: "#7fd0da", bg2: "#e6f7f3", ink: "#073d46", soft: "#0f6b78", accent: "#c9892a", accentInk: "#1a0f08", accent2: "#1c7f8e", ...light, pattern: "waves", patternColor: "#1c7f8e", motif: "Kerala ✦ Backwaters ✦ Spice & flame ✦ Cook up a storm ✦ " },
  // Gujarat — Garba night (dark theme)
  antaragni: { bg: "#2a1055", bg2: "#5b2272", ink: "#ffe9a8", soft: "#ffc977", accent: "#ffd23a", accentInk: "#2a1055", accent2: "#ff4d6d", card: "#3b1a66", cardInk: "#ffe9a8", pattern: "stars", patternColor: "#ffd23a", motif: "Garba ✦ Gujarat ✦ Dance of fire ✦ Night of lights ✦ " },
  // Rajasthan — Hawa Mahal pink city
  ideathon: { bg: "#f4a08a", bg2: "#fde3d4", ink: "#5e1f14", soft: "#9a3a28", accent: "#2a7aa8", accentInk: "#ffffff", accent2: "#c0392b", ...light, pattern: "arches", patternColor: "#c0392b", motif: "Jaipur ✦ Rajasthan ✦ Hawa Mahal ✦ Ideas that breathe ✦ " },
  // Punjab — wheat fields and dhol
  "beat-battle": { bg: "#f0c040", bg2: "#fff3c4", ink: "#4a3000", soft: "#8a5a05", accent: "#2f8f4e", accentInk: "#ffffff", accent2: "#a65a22", ...light, pattern: "stripes", patternColor: "#b8860b", motif: "Punjab ✦ Dhol ✦ Golden fields ✦ Let the beats decide ✦ " },
  // Tamil Nadu — temple gopuram
  techlab: { bg: "#3dbcc9", bg2: "#ffe9b0", ink: "#06444c", soft: "#0f7480", accent: "#d9534f", accentInk: "#ffffff", accent2: "#f0a830", ...light, pattern: "zigzag", patternColor: "#d9534f", motif: "Tamil Nadu ✦ Gopuram ✦ Crafted to last ✦ Hands-on tech ✦ " },
  // Maharashtra — Gateway of India, harbour
  "startup-business-plan": { bg: "#ff9a6c", bg2: "#ffe3a8", ink: "#4a2410", soft: "#8a4018", accent: "#1b6aa5", accentInk: "#ffffff", accent2: "#c9a074", ...light, pattern: "waves", patternColor: "#1b6aa5", motif: "Mumbai ✦ Maharashtra ✦ Gateway of India ✦ Pitch it, fund it ✦ " },
  // Uttar Pradesh — Taj, silk
  "riwayat-fashion-show": { bg: "#ffb3a0", bg2: "#ffeccb", ink: "#5e2230", soft: "#9a3d55", accent: "#b3496a", accentInk: "#ffffff", accent2: "#79bcd8", ...light, pattern: "diamonds", patternColor: "#b3496a", motif: "Agra ✦ Uttar Pradesh ✦ Taj Mahal ✦ Tradition on the runway ✦ " },
  // Himachal — mountains
  roadies: { bg: "#8fd1ee", bg2: "#e4f4fa", ink: "#0c2748", soft: "#1b5c90", accent: "#e8742a", accentInk: "#ffffff", accent2: "#2f7a4a", ...light, pattern: "peaks", patternColor: "#1b6aa5", motif: "Himachal ✦ Pine & snow ✦ Hill temple ✦ Survive the trail ✦ " },
  // Delhi — Red Fort
  "voice-of-youth": { bg: "#e8856a", bg2: "#fff0cf", ink: "#4a1410", soft: "#8a2a1c", accent: "#138808", accentInk: "#ffffff", accent2: "#ff9933", ...light, pattern: "arches", patternColor: "#b5402a", motif: "Delhi ✦ Red Fort ✦ A nation's voice ✦ Speak up ✦ " },
  // Telangana — Charminar
  aima: { bg: "#6fc3e8", bg2: "#ffe6b8", ink: "#4a2c10", soft: "#85501a", accent: "#2a7aa8", accentInk: "#ffffff", accent2: "#a8601e", ...light, pattern: "diamonds", patternColor: "#a8601e", motif: "Hyderabad ✦ Telangana ✦ Charminar ✦ Think like a manager ✦ " },
  // Assam — tea gardens
  codigo: { bg: "#8fd4b0", bg2: "#f2f7d8", ink: "#124a2c", soft: "#2a7a4c", accent: "#ff9f1c", accentInk: "#1a0f08", accent2: "#2e8a56", ...light, pattern: "leaves", patternColor: "#2e8a56", motif: "Assam ✦ Tea gardens ✦ One-horned rhino ✦ Code & conquer ✦ " },
  // Chhattisgarh — Dhokra and sal forests
  designathon: { bg: "#ffb360", bg2: "#ffe7b8", ink: "#4a2f04", soft: "#8a5208", accent: "#2f6b3a", accentInk: "#ffffff", accent2: "#a8650a", ...light, pattern: "rings", patternColor: "#a8650a", motif: "Chhattisgarh ✦ Dhokra ✦ Sal forests ✦ Design with heart ✦ " },
};

export const DEFAULT_THEME: EventTheme = EVENT_THEMES.kalakriti;
