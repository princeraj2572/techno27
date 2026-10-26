import { Band, PageShell, blockHindi } from "@/components/indie";
import { DEPARTMENTS } from "@/data/dummy";
import { DeptSection } from "@/components/events/dept-section";

export const metadata = { title: "Contact | Techno-aiMBiAtion 2027" };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ContactPage() {
  return (
    <PageShell>
      {/* Heading: "Tera bhai sabkuch sambhal lega" as a logo-style lockup */}
      <Band tone="teal" art="gold" artCenterRight className="!max-w-6xl !py-14">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.4em] text-[#ffd34d]">Team · The people behind Techno-aiMBiAtion &apos;27</p>
            <h1>
              <span className="sr-only">Team — Tera bhai sabkuch sambhal lega</span>
              <span aria-hidden className="relative block w-fit">
                <span
                  className={`block text-[4.2rem] leading-[1.12] text-[#ffb800] sm:text-[9rem] ${blockHindi.className}`}
                  style={{ textShadow: "6px 6px 0 #ff2d8a" }}
                >
                  तेरा भाई
                </span>
                {[["-right-6 top-3", "#ff2d8a"], ["left-24 -top-2", "#ffd34d"], ["right-8 bottom-6", "#ffd34d"]].map(([pos, c], i) => (
                  <svg key={i} viewBox="0 0 20 20" className={`absolute h-5 w-5 ${pos}`} fill={c}><path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" /></svg>
                ))}
              </span>
              <span
                aria-hidden
                className={`mt-1 block text-[2.1rem] leading-[1.2] text-[#efe6d0] sm:text-7xl ${blockHindi.className}`}
                style={{ textShadow: "5px 5px 0 #052f2c" }}
              >
                सबकुछ संभाल लेगा
              </span>
            </h1>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.3em] text-[#ffd34d] sm:text-base">Tera bhai sabkuch sambhal lega — meet the crew keeping the fest running</p>
          </div>

          {/* A tiffin of good things — decorative */}
          <svg viewBox="0 0 170 210" className="mx-auto hidden h-56 w-auto md:block" aria-hidden>
            <path d="M34 46 Q85 -14 136 46" fill="none" stroke="#9fb0b6" strokeWidth="8" strokeLinecap="round" />
            {[34, 78, 122].map((y, i) => (
              <g key={y}>
                <rect x="30" y={y + 14} width="110" height="40" rx="10" fill="#dfe8eb" stroke="#4d646b" strokeWidth="3" />
                <path d={`M36 ${y + 28} H134`} stroke="#b9c8cd" strokeWidth="3" />
                {i === 0 && <rect x="26" y={y + 6} width="118" height="14" rx="7" fill="#c9d6da" stroke="#4d646b" strokeWidth="3" />}
              </g>
            ))}
            <rect x="20" y="56" width="9" height="124" rx="4" fill="#7e939a" stroke="#4d646b" strokeWidth="2.5" />
            <rect x="141" y="56" width="9" height="124" rx="4" fill="#7e939a" stroke="#4d646b" strokeWidth="2.5" />
            {[[30, 196], [150, 190], [86, 12], [14, 20], [158, 22]].map(([x, y], i) => (
              <path key={i} transform={`translate(${x - 7} ${y - 7})`} d="M7 0 L9.2 4.8 L14 7 L9.2 9.2 L7 14 L4.8 9.2 L0 7 L4.8 4.8 Z" fill={i % 2 ? "#ff2d8a" : "#ffd34d"} />
            ))}
          </svg>
        </div>
      </Band>

      {/* Venue / email / phone */}
      <Band tone="amber" mandala className="!py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Venue", "O.P. Jindal University, Raigarh, Chhattisgarh"],
            ["Email", "hello@technoaimbiation.example"],
            ["Phone", "+91 98765 43210"],
          ].map(([l, v]) => (
            <div key={l} className="border-2 border-black bg-[#f5edd8] p-4 shadow-[4px_4px_0_0_#000]">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/50">{l}</p>
              <p className="mt-1 break-words font-semibold leading-snug text-black">{v}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Sticky strip to jump between departments */}
      <nav aria-label="Departments" className="sticky top-16 z-30 border-y-2 border-black bg-[#1a0f08]/95 backdrop-blur">
        <ul className="indie-hscroll mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-2.5">
          {DEPARTMENTS.map((d) => (
            <li key={d.name} className="shrink-0">
              <a
                href={`#${slugify(d.name)}`}
                className="block whitespace-nowrap border-2 border-[#f5c928]/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f5edd8] transition hover:bg-[#f5c928] hover:text-black"
              >
                {d.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* One section per department */}
      {DEPARTMENTS.map((d, i) => (
        <DeptSection key={d.name} dept={d} index={i} total={DEPARTMENTS.length} id={slugify(d.name)} />
      ))}

      <p className="bg-black py-3 text-center text-xs uppercase tracking-widest text-[#f5edd8]/60">
        Organizing team for Techno-aiMBiAtion 2027 (18–20 February). Hover a card for the cheekier caption.
      </p>
    </PageShell>
  );
}
