"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Bot, Brain, CalendarDays, ChefHat, Clock, Code2, Compass, FlaskConical, Flame,
  Lightbulb, MapPin, Mic, Music, Palette, PenTool, Search, Shirt, Star, Terminal, Trophy,
  TrendingUp, type LucideIcon,
} from "lucide-react";
import { display } from "@/components/indie";
import { EVENT_CATEGORIES, type EventCategory } from "@/data/public-events";

const ICONS: Record<string, LucideIcon> = {
  terminal: Terminal, palette: Palette, bot: Bot, chef: ChefHat, flame: Flame, bulb: Lightbulb,
  music: Music, flask: FlaskConical, trend: TrendingUp, shirt: Shirt, compass: Compass,
  mic: Mic, brain: Brain, code: Code2, pen: PenTool, star: Star,
};

const CATEGORY_STYLE: Record<EventCategory, { strip: string; text: string }> = {
  Technical: { strip: "bg-[#f5c928]", text: "text-black" },
  Cultural: { strip: "bg-[#ff6a00]", text: "text-black" },
  Management: { strip: "bg-[#ff2d8a]", text: "text-black" },
  Fun: { strip: "bg-[#3b82f6]", text: "text-white" },
};

export interface EventCard {
  slug: string;
  number: number;
  name: string;
  category: EventCategory;
  iconKey: string;
  subEvents: string[];
  tagline: string;
  date: string;
  time: string;
  venue: string;
  prize: string;
}

export function EventsCards({ events, initial = "All" }: { events: EventCard[]; initial?: string }) {
  const start = (EVENT_CATEGORIES as string[]).includes(initial) ? initial : "All";
  const [cat, setCat] = useState<string>(start);
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return events.filter(
      (e) =>
        (cat === "All" || e.category === cat) &&
        (!needle || e.name.toLowerCase().includes(needle) || e.subEvents.some((s) => s.toLowerCase().includes(needle)))
    );
  }, [events, cat, q]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Event categories">
          {["All", ...EVENT_CATEGORIES].map((c) => {
            const count = c === "All" ? events.length : events.filter((e) => e.category === c).length;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`border-2 border-black px-4 py-1.5 text-base font-bold uppercase tracking-wider shadow-[3px_3px_0_0_#000] transition ${
                  cat === c ? "bg-[#f5c928] text-black -rotate-1" : "bg-[#f5edd8] text-black hover:-translate-y-0.5"
                }`}
              >
                {c} <span className="opacity-60">· {count}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block sm:w-64">
          <span className="sr-only">Search events</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events…"
            className="w-full border-2 border-black bg-[#f5edd8] py-2 pl-9 pr-3 text-base font-semibold text-black shadow-[3px_3px_0_0_#000] outline-none placeholder:text-black/40 focus:bg-white"
          />
        </label>
      </div>

      <p className="mb-6 text-sm font-bold uppercase tracking-[0.25em] text-[#f5edd8]/80" aria-live="polite">
        Showing {shown.length} of {events.length} events
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((e, i) => {
          const Icon = ICONS[e.iconKey] ?? Star;
          const st = CATEGORY_STYLE[e.category];
          return (
            <Link
              key={e.slug}
              href={`/events/${e.slug}`}
              className="indie-pop group block"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <article className="flex h-full flex-col overflow-hidden border-2 border-black bg-[#f5edd8] text-[#1a0505] shadow-[5px_5px_0_0_#000] transition-all duration-200 group-hover:-translate-y-1.5 group-hover:-rotate-[0.6deg] group-hover:shadow-[9px_9px_0_0_#000]">
                {/* top strip */}
                <div className={`relative flex items-center justify-between px-4 py-4 ${st.strip} ${st.text}`}>
                  <span className="ml-14 text-lg font-bold tracking-[0.2em]">{String(e.number).padStart(2, "0")}</span>
                  <span className="rounded-full border-2 border-black bg-black/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest">{e.category}</span>
                  <span className="absolute -bottom-6 left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#f5edd8] text-[#7a1c1c] shadow-[2px_2px_0_0_#000] transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-9">
                  <div>
                    <h3 className={`text-2xl leading-tight ${display.className}`}>{e.name}</h3>
                    <p className="mt-0.5 text-lg font-semibold leading-snug text-[#7a1c1c]">{e.tagline}</p>
                  </div>

                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm font-semibold text-black/75">
                    <li className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 shrink-0 text-[#c8421f]" />{e.date}</li>
                    <li className="flex items-center gap-1.5"><Clock className="h-4 w-4 shrink-0 text-[#c8421f]" />{e.time}</li>
                    <li className="flex items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0 text-[#c8421f]" />{e.venue}</li>
                    <li className="flex items-center gap-1.5"><Trophy className="h-4 w-4 shrink-0 text-[#c8421f]" />{e.prize}</li>
                  </ul>

                  {e.subEvents.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {e.subEvents.slice(0, 3).map((s) => (
                        <li key={s} className="border border-black/40 bg-black/5 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">{s}</li>
                      ))}
                      {e.subEvents.length > 3 && (
                        <li className="px-1 py-0.5 text-xs font-bold uppercase tracking-wide text-[#c8421f]">+{e.subEvents.length - 3} more</li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-xs font-bold uppercase tracking-widest text-black/50">Marquee event</p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-black/25 pt-3">
                    <span className="text-sm font-bold uppercase tracking-wider">View details</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[#f5c928] transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div className="border-2 border-dashed border-[#f5edd8]/60 py-16 text-center">
          <p className={`text-3xl text-[#f5c928] ${display.className}`}>No events found</p>
          <p className="mt-2 text-lg text-[#f5edd8]/80">Try a different category or search term.</p>
        </div>
      )}
    </div>
  );
}
