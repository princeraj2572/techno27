"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventIcon } from "@/components/event-icons";
import { serif } from "@/components/heritage";
import { EVENT_CATEGORIES, type EventCategory } from "@/data/public-events";

export interface GridEvent {
  slug: string;
  name: string;
  category: EventCategory;
  iconKey: string;
  subCount: number;
}

export function EventsGrid({ events, initial = "All" }: { events: GridEvent[]; initial?: string }) {
  const start = (EVENT_CATEGORIES as string[]).includes(initial) ? initial : "All";
  const [cat, setCat] = useState<string>(start);
  const shown = cat === "All" ? events : events.filter((e) => e.category === cat);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5 mb-10" role="tablist" aria-label="Event categories">
        {["All", ...EVENT_CATEGORIES].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
              cat === c
                ? "bg-gradient-to-b from-[#c1121f] to-[#7a0c14] text-white shadow-[0_6px_14px_-6px_rgba(122,12,20,0.8)]"
                : "bg-white/60 border border-[#9b111e]/20 text-[#1c0b09] hover:bg-white"
            }`}
          >
            {c === "All" ? "All Events" : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {shown.map((e, i) => (
          <Link key={e.slug} href={`/events/${e.slug}`} className="group">
            <div className="relative h-full rounded-xl bg-[#fffaf0]/90 border border-[#c9a27a]/60 shadow-[0_6px_18px_-10px_rgba(110,11,18,0.5)] p-4 pt-5 text-center transition group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_-10px_rgba(110,11,18,0.6)]">
              <span className="absolute left-2.5 top-2.5 h-7 w-7 rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white text-xs font-bold flex items-center justify-center">
                {String(events.indexOf(e) + 1 || i + 1).padStart(2, "0")}
              </span>
              <div className="mx-auto mb-3 mt-2 flex h-20 w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#fde3c6] to-[#fbf3e6]">
                <EventIcon name={e.iconKey} className="h-10 w-10 text-[#7a0c14]" />
              </div>
              <h3 className={`text-lg font-bold leading-tight text-[#1c0b09] ${serif.className}`}>{e.name}</h3>
              <p className="text-xs text-[#1c0b09]/65 mt-1">
                {e.subCount > 0 ? `${e.subCount} competitions` : "Marquee event"}
              </p>
              <span className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <p className="text-center text-[#1c0b09]/60">No events in this category yet.</p>}
    </div>
  );
}
