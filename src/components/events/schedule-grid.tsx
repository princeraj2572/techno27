"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { body, serif } from "@/components/indie";
import type { ScheduleDay, ScheduleItem, ScheduleKind } from "@/data/schedule";

const FILTERS: ("All" | ScheduleKind)[] = ["All", "Technical", "Cultural", "Management", "Fun", "Special"];

// Colour strip down the left edge of each card, by category.
const STRIP: Record<ScheduleKind, string> = {
  Technical: "#f5c928", Cultural: "#a1001a", Management: "#0b2a6b", Fun: "#1f6b3a", Special: "#ff2d8a", General: "#9ca3af",
};

const hourOf = (time: string) => Number(time.split(":")[0]);
const time12 = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;
// "Feb 18, 2027" -> "Thu, 18 Feb"
const shortDate = (date: string) =>
  new Date(`${date} 12:00 UTC`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

// One event: the date and start time come first so a participant can read them at a glance.
function EventCard({ item, date }: { item: ScheduleItem; date: string }) {
  return (
    <div className="border-2 border-black bg-[#f5edd8] text-[#1a0505] shadow-[3px_3px_0_0_#000]" style={{ borderLeft: `8px solid ${STRIP[item.kind]}` }}>
      <div className="px-3 py-2">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm font-bold text-[#a1001a]">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{time12(item.time)}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{shortDate(date)}</span>
        </p>
        <p className="mt-0.5 text-lg font-bold leading-tight">{item.title}</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm opacity-70"><MapPin className="h-3.5 w-3.5" />{item.venue}</p>
      </div>
    </div>
  );
}

export function ScheduleGrid({ days }: { days: ScheduleDay[] }) {
  const [filter, setFilter] = useState<"All" | ScheduleKind>("All");
  const visible = (d: ScheduleDay) => d.items.filter((i) => filter === "All" || i.kind === filter);
  // Default 9 AM-8 PM, widened to cover any earlier/later item so none vanishes from the grid.
  const hours = days.flatMap((d) => d.items.map((i) => hourOf(i.time)));
  const first = Math.min(9, ...hours);
  const last = Math.max(20, ...hours);
  const HOURS = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const cols = { gridTemplateColumns: `5.5rem repeat(${days.length}, 1fr)` };

  return (
    <div className={body.className}>
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

      {/* Desktop: time grid, hours down the side, one column per day */}
      <div className="hidden overflow-hidden border-2 border-black bg-[#fff6e0] shadow-[6px_6px_0_0_#000] md:block">
        <div className="grid border-b-2 border-black bg-[#3a0808] text-[#f5edd8]" style={cols}>
          <div />
          {days.map((d) => (
            <div key={d.label} className="border-l-2 border-black px-4 py-3">
              <p className={`text-2xl leading-none text-[#ffd60a] ${serif.className}`}>{d.label}</p>
              <p className="mt-1 text-sm font-bold">{shortDate(d.date)} 2027</p>
            </div>
          ))}
        </div>
        {HOURS.map((h) => (
          <div key={h} className="grid border-b border-black/15 last:border-b-0" style={cols}>
            <div className="px-3 py-3 text-right text-sm font-bold text-[#3a0808]/70">{hourLabel(h)}</div>
            {days.map((d) => {
              const here = visible(d).filter((i) => hourOf(i.time) === h);
              return (
                <div key={d.label} className="min-h-[3.5rem] space-y-2 border-l border-black/15 p-2">
                  {here.map((i, n) => <EventCard key={`${i.time}-${i.title}-${n}`} item={i} date={d.date} />)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Phone: one block per day, events in time order */}
      <div className="space-y-8 md:hidden">
        {days.map((d) => (
          <section key={d.label}>
            <div className="mb-3 border-2 border-black bg-[#3a0808] px-4 py-2 text-[#f5edd8] shadow-[3px_3px_0_0_#000]">
              <p className={`text-2xl leading-none text-[#ffd60a] ${serif.className}`}>{d.label}</p>
              <p className="text-sm font-bold">{shortDate(d.date)} 2027</p>
            </div>
            <div className="space-y-3">
              {visible(d).map((i, n) => <EventCard key={`${i.time}-${i.title}-${n}`} item={i} date={d.date} />)}
              {!visible(d).length && <p className="text-sm font-bold text-white">No {filter.toLowerCase()} events on this day.</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
