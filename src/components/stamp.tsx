import type { EventCategory } from "@/data/public-events";
import { CULTURES, CultureScene } from "@/components/culture-art";

export const CATEGORY_BADGE: Record<EventCategory, string> = {
  Technical: "bg-[#f5c928] text-black",
  Cultural: "bg-[#ff6a00] text-black",
  Management: "bg-[#ff2d8a] text-black",
  Fun: "bg-[#3b82f6] text-white",
};

// A postage stamp: scalloped cream edge, framed picture, title on the sky.
// The picture is the event's cultural illustration unless `image` is given.
export function Stamp({
  slug,
  name,
  category,
  number,
  image,
  big = false,
  className = "",
}: {
  slug: string;
  name: string;
  category: EventCategory;
  number: number;
  image?: string;
  big?: boolean;
  className?: string;
}) {
  const culture = CULTURES[slug];
  return (
    <div className={`stamp-shadow ${className}`}>
      <div className="stamp-cut bg-[#fde9bd] p-4">
        <div className="bg-white p-1">
          <div className="stamp-scene relative aspect-[3/4] overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <CultureScene slug={slug} className="absolute inset-0 h-full w-full" />
            )}

            <div className="absolute inset-x-2 top-3 text-center">
              <h3
                className={`${big ? "text-5xl sm:text-6xl" : "text-[2rem]"} font-extrabold uppercase leading-[0.92] tracking-tight [text-shadow:0_2px_0_rgba(255,255,255,0.55)]`}
                style={{ color: culture?.ink ?? "#1a0505" }}
              >
                {name}
              </h3>
              <p className={`${big ? "mt-2 text-2xl" : "mt-1.5 text-lg"} font-bold uppercase tracking-[0.3em]`} style={{ color: culture?.sub ?? "#7a1c1c" }}>
                {culture ? "India" : category}
              </p>
            </div>

            <span className="absolute bottom-2 left-2 border-2 border-black bg-[#f5edd8] px-2 py-0.5 text-sm font-bold tracking-[0.2em] text-black shadow-[2px_2px_0_0_#000]">
              {String(number).padStart(2, "0")}
            </span>
            <span className={`absolute bottom-2 right-2 border-2 border-black px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_0_#000] ${CATEGORY_BADGE[category]}`}>
              {category}
            </span>
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
      <text x="60" y="64" textAnchor="middle" fill="#2a1208" stroke="none" fontSize="12" fontWeight="800">15 JAN</text>
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
