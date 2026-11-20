"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { body, serif } from "@/components/indie";
import type { ScheduleDay, ScheduleKind } from "@/data/schedule";

const FILTERS: ("All" | ScheduleKind)[] = ["All", "Technical", "Cultural", "Management", "Fun", "Special"];

// Colour strip down the left edge of each card, by category.
const STRIP: Record<ScheduleKind, string> = {
  Technical: "#f5c928", Cultural: "#a1001a", Management: "#0b2a6b", Fun: "#1f6b3a", Special: "#ff2d8a", General: "#9ca3af",
};

const time12 = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
// "Feb 18, 2027" -> "Thu, 18 Feb"
const shortDate = (date: string) =>
  new Date(`${date} 12:00 UTC`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export function ScheduleGrid({ days }: { days: ScheduleDay[] }) {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState<"All" | ScheduleKind>("All");
  const items = days[day].items.filter((i) => filter === "All" || i.kind === filter);

  return (
    <div className={body.className}>
      {/* day tabs */}
      <div role="tablist" aria-label="Fest day" className="mb-5 grid grid-cols-3 gap-3">
        {days.map((d, n) => (
          <button
            key={d.label}
            role="tab"
            aria-selected={n === day}
            onClick={() => setDay(n)}
            className={`border-2 border-black px-3 py-3 text-left shadow-[4px_4px_0_0_#000] transition ${
              n === day ? "bg-[#3a0808] text-[#f5edd8]" : "bg-[#f5edd8] text-[#3a0808] hover:-translate-y-0.5"
            }`}
          >
            <span className={`block text-2xl leading-none sm:text-3xl ${n === day ? "text-[#ffd60a]" : ""} ${serif.className}`}>{d.label}</span>
            <span className="mt-1 block text-sm font-bold uppercase tracking-wide">{shortDate(d.date)}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`border-2 border-black px-4 py-1.5 text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#000] transition ${
              filter === f ? "bg-[#a1001a] text-[#ffd60a]" : "bg-[#f5edd8] text-[#3a0808] hover:-translate-y-0.5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* the chosen day's events, in time order: time block on the left, details on the right */}
      <ol role="tabpanel" aria-label={days[day].label} className="space-y-3">
        {items.map((i, n) => (
          <li key={`${i.time}-${i.title}-${n}`} className="flex border-2 border-black bg-[#f5edd8] text-[#1a0505] shadow-[3px_3px_0_0_#000]">
            <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r-2 border-black bg-[#3a0808] py-3 text-[#ffd60a] sm:w-32">
              <Clock className="h-4 w-4 opacity-70" />
              <span className="mt-1 text-lg font-bold leading-none sm:text-xl">{time12(i.time)}</span>
            </div>
            <div className="min-w-0 flex-1 px-4 py-3" style={{ borderLeft: `8px solid ${STRIP[i.kind]}` }}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a1001a]">{i.kind}</p>
              <p className="text-xl font-bold leading-tight">{i.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm opacity-70"><MapPin className="h-3.5 w-3.5" />{i.venue}</p>
            </div>
          </li>
        ))}
        {!items.length && <li className="text-sm font-bold text-white">No {filter.toLowerCase()} events on {days[day].label}.</li>}
      </ol>
    </div>
  );
}
