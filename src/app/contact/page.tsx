import { Band, PageShell, blockHindi, serif } from "@/components/indie";
import { DEPARTMENTS, initials } from "@/data/dummy";

export const metadata = { title: "Contact | Techno-aiMBiAtion 2027" };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Stamp({ name, role, phone }: { name: string; role: string; phone: string }) {
  return (
    <div className="indie-stamp p-2 text-black shadow-[4px_4px_0_0_#000]">
      <div className="flex aspect-[4/3] items-center justify-center bg-[#fff3d6]">
        <span className={`text-5xl text-[#c8421f] ${serif.className}`}>{initials(name)}</span>
      </div>
      <div className="bg-[#d9d4c7] px-2 py-1.5">
        <p className="truncate text-base font-bold leading-tight">{name}</p>
        <p className="truncate text-xs uppercase tracking-wider text-black/60">{role}</p>
        <p className="text-xs font-semibold tabular-nums">{phone}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <PageShell>
      {/* Heading: "Tera bhai sabkuch sambhal lega" as a logo-style lockup */}
      <Band tone="teal" art="gold" className="!max-w-6xl !py-14">
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

      <Band tone="amber" mandala className="!max-w-6xl !pt-12">
        <div className="grid gap-8 md:grid-cols-[230px_1fr]">
          <nav aria-label="Departments" className="md:sticky md:top-24 md:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0 md:overflow-visible">
              {DEPARTMENTS.map((d) => (
                <li key={d.name} className="shrink-0">
                  <a href={`#${slugify(d.name)}`} className="block whitespace-nowrap px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f5edd8] md:whitespace-normal">
                    {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-10">
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

            {DEPARTMENTS.map((d) => (
              <section key={d.name} id={slugify(d.name)} className="scroll-mt-24">
                <p className="mb-3 inline-block bg-black px-3 py-0.5 text-xs font-bold uppercase tracking-[0.3em] text-[#f5c928]">{d.name}</p>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  <Stamp name={d.convener.name} role="Convener" phone={d.convener.phone} />
                  <Stamp name={d.coConvener.name} role="Co-Convener" phone={d.coConvener.phone} />
                </div>
              </section>
            ))}
            <p className="text-center text-xs uppercase tracking-widest text-black/50">Sample team — all names and numbers are fictional.</p>
          </div>
        </div>
      </Band>
    </PageShell>
  );
}
