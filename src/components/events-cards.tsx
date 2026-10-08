"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search, Trophy } from "lucide-react";
import { display, serif } from "@/components/indie";
import { LogoSlot } from "@/components/media";
import { CULTURES, CultureScene } from "@/components/culture-art";
import { EVENT_CATEGORIES, type EventCategory } from "@/data/public-events";

const CATEGORY_BADGE: Record<EventCategory, string> = {
  Technical: "bg-[#f5c928] text-black",
  Cultural: "bg-[#ff6a00] text-black",
  Management: "bg-[#ff2d8a] text-black",
  Fun: "bg-[#3b82f6] text-white",
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
  image?: string; // optional picture; replaces the illustration inside the stamp
  logo?: string;
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
        (!needle ||
          e.name.toLowerCase().includes(needle) ||
          (CULTURES[e.slug]?.state ?? "").toLowerCase().includes(needle) ||
          e.subEvents.some((s) => s.toLowerCase().includes(needle)))
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
            placeholder="Search events or states…"
            className="w-full border-2 border-black bg-[#f5edd8] py-2 pl-9 pr-3 text-base font-semibold text-black shadow-[3px_3px_0_0_#000] outline-none placeholder:text-black/40 focus:bg-white"
          />
        </label>
      </div>

      <p className="mb-8 text-sm font-bold uppercase tracking-[0.25em] text-[#f5edd8]/80" aria-live="polite">
        Showing {shown.length} of {events.length} events
      </p>

      {/* Stamp cards */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((e, i) => {
          const culture = CULTURES[e.slug];
          return (
            <Link
              key={e.slug}
              href={`/events/${e.slug}`}
              className="indie-pop group block"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              {/* the stamp */}
              <div className="stamp-shadow">
                <div className="stamp-cut bg-[#fde9bd] p-4">
                  <div className="bg-white p-1">
                    <div className="stamp-scene relative aspect-[3/4] overflow-hidden">
                      {e.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.image} alt={e.name} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <CultureScene slug={e.slug} className="absolute inset-0 h-full w-full" />
                      )}

                      {/* title on the sky */}
                      <div className="absolute inset-x-2 top-3 text-center">
                        <h3 className="text-[2rem] font-extrabold uppercase leading-[0.92] tracking-tight [text-shadow:0_2px_0_rgba(255,255,255,0.55)]" style={{ color: culture?.ink ?? "#1a0505" }}>
                          {e.name}
                        </h3>
                        <p className="mt-1.5 text-lg font-bold uppercase tracking-[0.3em]" style={{ color: culture?.sub ?? "#7a1c1c" }}>
                          {culture ? "India" : e.category}
                        </p>
                      </div>

                      {/* number + category */}
                      <span className="absolute bottom-2 left-2 border-2 border-black bg-[#f5edd8] px-2 py-0.5 text-sm font-bold tracking-[0.2em] text-black shadow-[2px_2px_0_0_#000]">
                        {String(e.number).padStart(2, "0")}
                      </span>
                      <span className={`absolute bottom-2 right-2 border-2 border-black px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_0_#000] ${CATEGORY_BADGE[e.category]}`}>
                        {e.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* caption */}
              <div className="mt-5 flex items-start gap-3 text-[#f5edd8]">
                <LogoSlot
                  src={e.logo}
                  alt={`${e.name} logo`}
                  label="Logo"
                  size="h-12 w-12"
                  shape="rounded-full"
                  className="text-[#f5c928]"
                />
                <div className="min-w-0">
                  <p className={`text-xl leading-tight tracking-[0.18em] uppercase ${serif.className}`}>{culture?.state ?? "India"}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#f5edd8]/70">Bharat · {culture?.landmark}</p>
                </div>
              </div>
              <p className={`mt-3 text-lg leading-snug text-[#f5c928] ${display.className}`}>{e.tagline}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[#f5edd8]/85">
                <li className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#f5c928]" />{e.date}</li>
                <li className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#f5c928]" />{e.venue}</li>
                <li className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-[#f5c928]" />{e.prize}</li>
              </ul>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#f5c928]">
                {e.subEvents.length > 0 ? `${e.subEvents.length} competitions · ` : ""}View details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
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
