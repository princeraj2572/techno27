import type { EventCategory } from "@/features/events/data/public-events";
import { Trophy } from "lucide-react";
import { CULTURES, CultureScene } from "@/components/indie/culture-art";

export const CATEGORY_BADGE: Record<EventCategory, string> = {
  Technical: "bg-[#f5c928] text-black",
  Cultural: "bg-[#ff6a00] text-black",
  Management: "bg-[#ff2d8a] text-black",
  Fun: "bg-[#3b82f6] text-white",
};

// Ink colour of the category rubber stamp.
const STAMP_INK: Record<EventCategory, string> = {
  Technical: "#0b4a8f",
  Cultural: "#a1001a",
  Management: "#9d174d",
  Fun: "#1f6b3a",
};

// A postage stamp: scalloped cream edge, framed picture, title on the sky.
// The picture is the event's cultural illustration unless `image` is given.
export function Stamp({
  slug,
  name,
  category,
  number,
  image,
  prize,
  big = false,
  compact = false,
  className = "",
}: {
  slug: string;
  name: string;
  category: EventCategory;
  number: number;
  image?: string;
  prize?: string; // shown as a "Prize pool" badge; "TBA" while the amount has no number
  big?: boolean;
  compact?: boolean; // smaller stamp for rows and carousels
  className?: string;
}) {
  const culture = CULTURES[slug];
  return (
    <div className={`stamp-shadow ${className}`}>
      <div className={`stamp-cut bg-[#fde9bd] ${compact ? "p-3" : "p-4"}`}>
        <div className="bg-white p-1">
          <div className="stamp-scene relative aspect-[3/4] overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <CultureScene slug={slug} className="absolute inset-0 h-full w-full" />
            )}

            {/* category as a rubber stamp in the top corner */}
            <span
              className={`absolute right-2 top-3 rotate-[-10deg] border-[3px] border-double bg-white/85 font-extrabold uppercase tracking-[0.2em] ${big ? "px-3 py-1 text-base" : "px-2 py-0.5 text-xs lg:text-sm"}`}
              style={{ color: STAMP_INK[category], borderColor: STAMP_INK[category] }}
            >
              {category}
            </span>

            {/* all text sits low: name, then the event number and prize pool on the bottom row */}
            <div
              className={`absolute inset-x-0 bottom-0 text-center ${compact ? "px-2 pb-2 pt-6" : "px-2 pb-2 pt-8 lg:px-3 lg:pb-3"}`}
              style={{ background: "linear-gradient(to top, rgba(253,233,189,.95) 55%, rgba(253,233,189,.6) 80%, rgba(253,233,189,0))" }}
            >
              <h3
                className={`${big ? "text-6xl sm:text-7xl" : compact ? "text-[1.8rem]" : "text-[2.5rem]"} break-words font-extrabold uppercase leading-[0.9] tracking-tight [text-shadow:0_2px_0_rgba(255,255,255,0.55)]`}
                style={{ color: culture?.ink ?? "#1a0505" }}
              >
                {name}
              </h3>
              <p className={`${big ? "mt-1 text-xl" : "mt-0.5 text-xs"} font-bold uppercase tracking-[0.3em]`} style={{ color: culture?.sub ?? "#7a1c1c" }}>
                {culture ? "India" : category}
              </p>
              <div className={`flex items-center justify-between gap-2 ${big ? "mt-3" : "mt-2"}`}>
                <span className="border-2 border-black bg-[#f5edd8] px-2 py-0.5 text-sm font-bold tracking-[0.2em] text-black shadow-[2px_2px_0_0_#000] lg:px-3 lg:py-1 lg:text-base">
                  {String(number).padStart(2, "0")}
                </span>
                {prize !== undefined && (
                  <span className={`inline-flex items-center gap-1 border-2 border-black bg-[#f5c928] px-2 py-0.5 font-extrabold uppercase tracking-wider text-black shadow-[2px_2px_0_0_#000] ${big ? "text-lg" : "text-xs lg:text-sm"}`}>
                    <Trophy className={big ? "h-5 w-5" : "h-4 w-4"} aria-hidden /> Prize pool {/\d/.test(prize) ? prize : "TBA"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Circular cancellation mark with wavy lines, as on a posted stamp.
export function Postmark({ className = "", lines = true }: { className?: string; lines?: boolean }) {
  return (
    <svg viewBox={lines ? "0 0 220 120" : "0 0 120 120"} className={className} aria-hidden fill="none" stroke="#2a1208" strokeWidth="3" strokeLinecap="round">
      <defs>
        <path id="postmark-arc" d="M60,60 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <circle cx="60" cy="60" r="52" />
      <circle cx="60" cy="60" r="26" strokeWidth="2" />
      <text fill="#2a1208" stroke="none" fontSize="10.5" fontWeight="800" letterSpacing="2">
        <textPath href="#postmark-arc">TECHNO-AIMBIATION · 2027 · RAIGARH ·</textPath>
      </text>
      <text x="60" y="64" textAnchor="middle" fill="#2a1208" stroke="none" fontSize="12" fontWeight="800">16 FEB</text>
      {lines && (
        <>
          <path d="M118 36 q14 -10 28 0 t28 0 t28 0" />
          <path d="M118 60 q14 -10 28 0 t28 0 t28 0" />
          <path d="M118 84 q14 -10 28 0 t28 0 t28 0" />
        </>
      )}
    </svg>
  );
}
