"use client";

import { useState } from "react";
import { display } from "@/components/indie";
import type { ScheduleDay, ScheduleKind } from "@/data/schedule";

// Board colour themes (all colours inline so a theme is one object).
export type BoardTheme = {
  name: string;
  board: string; // board background
  head: string; // header strip background
  line: string; // row dividers / outlines
  text: string; // headings and times
  title: string; // event names (the "flap" colour)
  muted: string; // small labels
  tabOn: [string, string]; // selected day / filter [background, text]
  font?: string; // optional font family for times and titles
  date?: string; // header date colour (defaults to `title`)
  flap?: boolean; // show the time on split-flap tiles (24-hour, like airport boards)
  tile?: [string, string]; // split-flap tile [background, digit colour]
};

export const BOARD_THEMES = {
  // Tricolour board with split-flap times: the look used on /schedule
  tricolourFlap: { name: "Tricolour split-flap", board: "#fffaf0", head: "#138808", line: "rgba(19,136,8,.2)", text: "#0b2a6b", title: "#c45500", muted: "rgba(11,42,107,.7)", tabOn: ["#138808", "#ffffff"], date: "#ffffff", flap: true, tile: ["#0b2a6b", "#ffffff"] },
} satisfies Record<string, BoardTheme>;

const KIND_COLOR: Record<ScheduleKind, string> = {
  Technical: "#3b82f6", Cultural: "#ff2e93", Management: "#22c55e", Fun: "#f97316", Special: "#a855f7", General: "#9ca3af",
};
const FILTERS: ("All" | ScheduleKind)[] = ["All", "Technical", "Cultural", "Management", "Fun", "Special"];
const time12 = (t: string) => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };

export type BoardThemeName = keyof typeof BOARD_THEMES;

export function DeparturesBoard({ days, theme = "tricolourFlap" }: { days: ScheduleDay[]; theme?: BoardThemeName }) {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState<"All" | ScheduleKind>("All");
  const rows = days[day].items.filter((i) => filter === "All" || i.kind === filter);
  const t: BoardTheme = BOARD_THEMES[theme];
  const tab = (on: boolean) => (on ? { background: t.tabOn[0], color: t.tabOn[1] } : { background: "#f5edd8", color: "#3a0808" });

  return (
    <div className="space-y-4">
      {/* day tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist" aria-label="Festival days">
        {days.map((d, i) => (
          <button
            key={d.label}
            role="tab"
            aria-selected={day === i}
            onClick={() => setDay(i)}
            className={`border-2 border-black px-3 py-2 text-left shadow-[3px_3px_0_0_#000] transition ${day === i ? "-rotate-1" : "hover:-translate-y-0.5"}`}
            style={tab(day === i)}
          >
            <span className="block text-base font-bold uppercase tracking-wider sm:text-lg">{d.label}</span>
            <span className="block text-xs font-semibold opacity-80 sm:text-sm">{d.date}</span>
          </button>
        ))}
      </div>

      {/* category filters */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className="flex items-center gap-1.5 border-2 border-black px-3 py-1 text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#000] transition hover:-translate-y-0.5"
            style={tab(filter === f)}
          >
            {f !== "All" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_COLOR[f] }} />}
            {f}
          </button>
        ))}
      </div>

      {/* the board: every row shown, names wrap instead of being cut off */}
      <div className="overflow-hidden rounded-lg border-4 border-black shadow-[6px_6px_0_0_#000]" style={{ background: t.board, color: t.text }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: t.head, borderBottom: `1px solid ${t.line}` }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">Departures</p>
            <p className="text-xs font-bold uppercase tracking-widest text-white sm:text-sm">Techno Junction<span className="hidden sm:inline"> · All lines</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">{days[day].label}</p>
            <p className={`whitespace-nowrap text-lg sm:text-xl ${display.className}`} style={{ color: t.date ?? t.title }}>{days[day].date}</p>
          </div>
        </div>

        <div className="hidden grid-cols-[110px_1fr_auto] gap-x-4 px-4 py-2 text-[10px] uppercase tracking-[0.25em] sm:grid" style={{ color: t.muted, borderBottom: `1px solid ${t.line}` }}>
          <span>Start</span><span>Event</span><span className="text-right">Platform</span>
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.time + r.title} className="grid grid-cols-[96px_1fr] gap-x-3 px-3 py-3 sm:px-4 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:gap-x-4" style={{ borderTop: `1px solid ${t.line}` }}>
              {t.flap ? (
                <span className="flex items-center gap-0.5 self-start font-mono text-base font-bold sm:self-center sm:text-lg" aria-label={time12(r.time)}>
                  {r.time.split("").map((c, i) => (
                    <span key={i} aria-hidden className="relative rounded-sm px-[3px] leading-tight shadow-[inset_0_-1px_0_rgba(0,0,0,.6)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/60" style={{ background: t.tile?.[0] ?? "#2a2a2a", color: t.tile?.[1] ?? "#ffffff" }}>{c}</span>
                  ))}
                </span>
              ) : (
                <span className="text-base font-bold tabular-nums sm:text-lg" style={{ fontFamily: t.font }}>{time12(r.time)}</span>
              )}
              <span className="min-w-0">
                <span className="block text-base font-bold uppercase leading-tight tracking-wide sm:text-lg" style={{ color: t.title, fontFamily: t.font }}>{r.title}</span>
                <span className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[r.kind] }} />{r.kind}
                </span>
                {/* phones: venue under the name */}
                <span className="mt-1 block text-sm font-semibold sm:hidden" style={{ color: t.muted }}>📍 {r.venue}</span>
              </span>
              <span className="hidden border px-2 py-0.5 text-right text-xs font-bold uppercase tracking-wider sm:block" style={{ borderColor: t.line }}>{r.venue}</span>
            </li>
          ))}
          {rows.length === 0 && <li className="px-4 py-8 text-center text-sm uppercase tracking-widest" style={{ color: t.muted }}>No departures on this line today</li>}
        </ul>
      </div>
    </div>
  );
}
