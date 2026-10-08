"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { EventIcon } from "@/components/event-icons";
import { serif } from "@/components/heritage";
import type { ScheduleDay, ScheduleKind } from "@/data/schedule";

const FILTERS: ("All" | ScheduleKind)[] = ["All", "Technical", "Cultural", "Management", "Fun"];

const KIND_STYLE: Record<ScheduleKind, string> = {
  Special: "bg-[#fde0dc] text-[#9b111e]",
  Technical: "bg-[#e0e4ff] text-[#2b3a9b]",
  Cultural: "bg-[#fde0dc] text-[#b3121b]",
  General: "bg-[#e6e2dc] text-[#4a4540]",
  Management: "bg-[#fdebc8] text-[#8a5a00]",
  Fun: "bg-[#dff3e3] text-[#1d6b34]",
};

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { clock: `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}`, ap };
}

export function ScheduleBoard({ days }: { days: ScheduleDay[] }) {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const items = days[day].items.filter((i) => filter === "All" || i.kind === filter);

  return (
    <div>
      {/* Day tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x" role="tablist" aria-label="Festival days">
        {days.map((d, i) => (
          <button
            key={d.label}
            role="tab"
            aria-selected={day === i}
            onClick={() => setDay(i)}
            className={`snap-start shrink-0 rounded-2xl px-6 py-3 text-center transition ${
              day === i
                ? "bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white shadow-[0_8px_16px_-8px_rgba(110,11,18,0.8)]"
                : "bg-white/60 border border-[#9b111e]/20 hover:bg-white"
            }`}
          >
            <span className="block text-sm font-bold uppercase tracking-wide">{d.label}</span>
            <span className={`block text-xs ${day === i ? "text-white/85" : "text-[#1c0b09]/60"}`}>{d.date}</span>
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filter === f
                ? "bg-gradient-to-b from-[#c1121f] to-[#7a0c14] text-white"
                : "bg-white/60 border border-[#9b111e]/20 hover:bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <ol className="relative mt-8 space-y-4">
        <span aria-hidden className="absolute left-[4.6rem] sm:left-[5.2rem] top-2 bottom-2 w-px bg-[#9b111e]/40" />
        {items.map((it) => {
          const { clock, ap } = formatTime(it.time);
          return (
            <li key={it.time + it.title} className="relative flex items-center gap-3 sm:gap-4">
              <div className="w-14 sm:w-16 shrink-0 text-right">
                <p className={`text-base sm:text-lg font-bold leading-none text-[#6e0b12] ${serif.className}`}>{clock}</p>
                <p className="text-xs text-[#1c0b09]/60">{ap}</p>
              </div>
              <span className="relative z-10 h-4 w-4 shrink-0 rounded-full border-2 border-[#9b111e] bg-[#fbf3e6] flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c1121f]" />
              </span>
              <Link
                href="/events"
                className="group flex flex-1 items-center gap-3 sm:gap-4 rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-2.5 shadow-[0_6px_16px_-10px_rgba(110,11,18,0.5)] transition hover:-translate-y-0.5"
              >
                <span className="flex h-14 w-16 sm:h-16 sm:w-24 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#e8590c] via-[#b3121b] to-[#6e0b12]">
                  <EventIcon name={it.iconKey} className="h-7 w-7 text-[#fde3c6]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-base sm:text-lg font-bold ${serif.className}`}>{it.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${KIND_STYLE[it.kind]}`}>{it.kind}</span>
                    <span className="flex items-center gap-1 text-xs text-[#1c0b09]/70">
                      <MapPin className="h-3.5 w-3.5 text-[#9b111e]" /> {it.venue}
                    </span>
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      {items.length === 0 && <p className="mt-8 text-center text-[#1c0b09]/60">Nothing in this category on this day.</p>}
    </div>
  );
}
