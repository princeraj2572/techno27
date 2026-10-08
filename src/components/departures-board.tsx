"use client";

import { useState } from "react";
import { display } from "@/components/indie";
import type { ScheduleDay, ScheduleKind } from "@/data/schedule";

const FILTERS: { label: "All" | ScheduleKind; cls: string }[] = [
  { label: "All", cls: "bg-[#2563eb] text-white" },
  { label: "Technical", cls: "bg-[#f5c928] text-black" },
  { label: "Cultural", cls: "bg-[#ff4d4d] text-white" },
  { label: "Management", cls: "bg-[#f5edd8] text-black" },
  { label: "Fun", cls: "bg-[#22c55e] text-black" },
];

export function DeparturesBoard({ days }: { days: ScheduleDay[] }) {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState<"All" | ScheduleKind>("All");
  const rows = days[day].items.filter((i) => filter === "All" || i.kind === filter);

  return (
    <div className="grid gap-4 md:grid-cols-[200px_1fr]">
      {/* date notes + filters */}
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible" role="tablist" aria-label="Festival days">
          {days.map((d, i) => (
            <button
              key={d.label}
              role="tab"
              aria-selected={day === i}
              onClick={() => setDay(i)}
              className={`shrink-0 border-2 border-black px-4 py-2 text-left shadow-[3px_3px_0_0_#000] transition ${
                day === i ? "bg-[#f5c928] -rotate-1" : "bg-[#f5edd8] hover:-translate-y-0.5"
              } text-black`}
            >
              <span className="block text-sm font-bold uppercase tracking-wider">{d.label}</span>
              <span className="block text-xs opacity-70">{d.date}</span>
            </button>
          ))}
        </div>
        <div className="hidden md:flex flex-col gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              aria-pressed={filter === f.label}
              className={`px-3 py-1.5 text-sm font-bold uppercase tracking-widest border-2 border-black transition ${f.cls} ${filter === f.label ? "ring-4 ring-white/60" : "opacity-80 hover:opacity-100"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* the board */}
      <div className="rounded-lg border-4 border-black bg-[#161616] shadow-[6px_6px_0_0_#000] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/15 bg-[#0d0d0d] px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Departures</p>
            <p className="text-sm font-bold uppercase tracking-widest text-[#8ab4ff]">Techno Junction · All lines</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">{days[day].label}</p>
            <p className={`text-xl text-[#ffb000] ${display.className}`}>{days[day].date}</p>
          </div>
        </div>

        {/* mobile filters */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 px-3 py-2 md:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={`shrink-0 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${f.cls} ${filter === f.label ? "ring-2 ring-white/70" : "opacity-70"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[64px_1fr_auto] gap-x-3 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/40 border-b border-white/10">
          <span>Start</span><span>Event</span><span className="text-right">Platform</span>
        </div>
        <ul className="max-h-[26rem] overflow-y-auto divide-y divide-white/10">
          {rows.map((r) => (
            <li key={r.time + r.title} className="grid grid-cols-[64px_1fr_auto] items-center gap-x-3 px-4 py-3">
              <span className="text-lg font-bold text-[#ffb000] tabular-nums">{r.time}</span>
              <span className="min-w-0">
                <span className="block truncate text-lg font-bold uppercase tracking-wide text-white">{r.title}</span>
                <span className="text-[11px] uppercase tracking-widest text-white/45">{r.kind}</span>
              </span>
              <span className="border border-white/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white/80">{r.venue}</span>
            </li>
          ))}
          {rows.length === 0 && <li className="px-4 py-8 text-center text-white/50 uppercase tracking-widest text-sm">No departures on this line today</li>}
        </ul>
      </div>
    </div>
  );
}
