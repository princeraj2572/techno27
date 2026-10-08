"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Vinyl, display } from "@/components/indie";
import { EVENT_CATEGORIES, type EventCategory } from "@/data/public-events";

export interface RadioEvent {
  slug: string;
  name: string;
  category: EventCategory;
  subEvents: string[];
  tagline: string;
  date: string;
  time: string;
  venue: string;
  prize: string;
}

function Knob({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-[#1a0f08] border-2 border-[#d9b36a] shadow-inner">
        <span className="absolute left-1/2 top-1 h-3 w-0.5 -translate-x-1/2 rotate-[25deg] bg-[#f5edd8]" />
      </span>
      <span className="text-[9px] font-bold uppercase tracking-widest text-[#3d2314]">{label}</span>
    </div>
  );
}

export function RadioConsole({ events }: { events: RadioEvent[] }) {
  const [cat, setCat] = useState<EventCategory>(EVENT_CATEGORIES[0]);
  const list = events.filter((e) => e.category === cat);
  const [slug, setSlug] = useState<string>(list[0]?.slug ?? events[0].slug);
  const current = events.find((e) => e.slug === slug) ?? list[0] ?? events[0];

  function pickCategory(c: EventCategory) {
    setCat(c);
    const first = events.find((e) => e.category === c);
    if (first) setSlug(first.slug);
  }

  return (
    <div className="rounded-[2rem] border-4 border-black bg-[#4a2a17] p-3 sm:p-5 shadow-[8px_8px_0_0_#000]">
      <div className="grid gap-3 lg:grid-cols-[88px_1fr] rounded-[1.4rem] bg-[#f5edd8] p-3 sm:p-4">
        {/* speaker + knobs */}
        <div className="hidden lg:flex flex-col items-center gap-4">
          <div className="indie-grille h-40 w-full rounded-lg border-2 border-[#3d2314]" />
          <div className="flex flex-col gap-3">
            <Knob label="Tune" />
            <Knob label="Vol" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
          {/* tuner: category lever + channel list */}
          <div className="rounded-xl bg-[#1a0f08] p-3 text-[#f5edd8]">
            <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Event categories">
              {EVENT_CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={cat === c}
                  onClick={() => pickCategory(c)}
                  className={`px-3 py-1 text-sm font-bold uppercase tracking-wider transition ${
                    cat === c ? "bg-[#f5c928] text-black" : "text-[#f5edd8]/60 hover:text-white"
                  }`}
                >
                  {cat === c ? "– " : ""}{c}
                </button>
              ))}
            </div>
            <ul className="max-h-72 space-y-0.5 overflow-y-auto pr-1 indie-hscroll">
              {list.map((e, i) => (
                <li key={e.slug}>
                  <button
                    onClick={() => setSlug(e.slug)}
                    className={`flex w-full items-center justify-between gap-3 rounded px-2 py-1.5 text-left transition ${
                      current.slug === e.slug ? "bg-[#7a1c1c] text-white" : "hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[10px] tracking-widest text-[#f5c928]/80">FM {(88 + i * 1.7).toFixed(1)}</span>
                    <span className="text-lg font-bold uppercase tracking-wide">{e.name}</span>
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="px-2 py-3 text-sm text-[#f5edd8]/60">No stations in this band.</li>}
            </ul>
          </div>

          {/* now broadcasting */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="rounded-xl border-2 border-black bg-[#101010] p-4 text-white">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#ff4d4d]">
                <span className="indie-blink h-2 w-2 rounded-full bg-[#ff4d4d]" /> Now broadcasting
              </p>
              <h3 className={`mt-2 text-3xl sm:text-4xl leading-tight text-[#f5c928] ${display.className}`}>{current.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-[#f5edd8]/60">{current.category}</p>
              <p key={current.slug} className="indie-pop mt-2 text-lg font-semibold text-[#f5edd8]/85">{current.tagline}</p>
              {current.subEvents.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {current.subEvents.map((s) => (
                    <li key={s} className="border border-white/30 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide">{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-lg text-[#f5edd8]/75">A standalone marquee event.</p>
              )}
              <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3">
                <span className="text-xs uppercase tracking-widest text-[#f5edd8]/60">{current.date} · {current.time} · {current.venue} · Prize {current.prize}</span>
                <Link href={`/events/${current.slug}`} className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#ff4d4d] hover:text-white">
                  Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex items-center justify-center">
              <Vinyl className="h-32 w-32" slow label={current.name.slice(0, 6).toUpperCase()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
