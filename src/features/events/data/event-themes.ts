import type { CSSProperties } from "react";
import { ALL_EVENTS } from "./all-events";

// The theme shape and the generated SVG pattern tiles. The theme VALUES for each event live in
// src/app/events/<slug>/data.ts (colours are inline-styled because they are dynamic).

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

// Each event keeps its own theme in src/app/events/<slug>/data.ts; this just collects them by slug.
export const EVENT_THEMES: Record<string, EventTheme> = Object.fromEntries(ALL_EVENTS.map((e) => [e.slug, e.theme]));

export const DEFAULT_THEME: EventTheme = EVENT_THEMES.kalakriti;
