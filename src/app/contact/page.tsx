import { Band, PageShell, serif } from "@/components/indie";

export const metadata = { title: "Contact | Techno-aiMBiAtion 2027" };

// PLACEHOLDER team — replace with the real conveners, photos and contact numbers.
const DEPARTMENTS = [
  "Information, Publicity & Invitation",
  "Design, Print & Media",
  "Registration & Reception",
  "Accommodation",
  "Stage, Light, Sound & Stall",
  "Catering",
  "Venue Preparation",
  "Transportation",
  "Hospitality",
  "Website Maintenance",
  "Sponsorship",
  "Certificate & Prize",
  "Discipline",
  "Stationery & Logistics",
  "Health & First Aid",
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Stamp({ initials, name, role, phone }: { initials: string; name: string; role: string; phone: string }) {
  return (
    <div className="indie-stamp p-2 text-black shadow-[4px_4px_0_0_#000]">
      <div className="flex aspect-[4/3] items-center justify-center bg-[#fff3d6]">
        <span className={`text-5xl text-[#c8421f] ${serif.className}`}>{initials}</span>
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
      <Band tone="amber" mandala className="!max-w-6xl">
        <h1 className="text-6xl sm:text-8xl font-bold uppercase leading-none text-white" style={{ textShadow: "4px 4px 0 #7a1c1c" }}>Team</h1>
        <p className="mt-2 text-lg font-semibold text-black/80">The people behind Techno-aiMBiAtion &apos;27.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-[230px_1fr]">
          <nav aria-label="Departments" className="md:sticky md:top-24 md:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0 md:overflow-visible">
              {DEPARTMENTS.map((d) => (
                <li key={d} className="shrink-0">
                  <a href={`#${slugify(d)}`} className="block whitespace-nowrap px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f5edd8] md:whitespace-normal">
                    {d}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-10">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Venue", "O.P. Jindal University, Raigarh, Chhattisgarh"],
                ["Email", "contact@example.com"],
                ["Phone", "+91 00000 00000"],
              ].map(([l, v]) => (
                <div key={l} className="border-2 border-black bg-[#f5edd8] p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/50">{l}</p>
                  <p className="mt-1 font-semibold leading-snug text-black">{v}</p>
                </div>
              ))}
            </div>

            {DEPARTMENTS.map((d, i) => (
              <section key={d} id={slugify(d)} className="scroll-mt-24">
                <p className="mb-3 inline-block bg-black px-3 py-0.5 text-xs font-bold uppercase tracking-[0.3em] text-[#f5c928]">{d}</p>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  <Stamp initials="CN" name="Convener Name" role="Convener" phone={`+91 90000 000${String(i + 1).padStart(2, "0")}`} />
                  <Stamp initials="CC" name="Co-Convener Name" role="Co-Convener" phone={`+91 80000 000${String(i + 1).padStart(2, "0")}`} />
                </div>
              </section>
            ))}
            <p className="text-center text-xs uppercase tracking-widest text-black/50">Sample details — real contacts will be added.</p>
          </div>
        </div>
      </Band>
    </PageShell>
  );
}
