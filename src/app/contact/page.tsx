import { Band, PageShell, serif } from "@/components/indie";
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
      <Band tone="amber" mandala className="!max-w-6xl">
        <h1 className="text-6xl sm:text-8xl font-bold uppercase leading-none text-white" style={{ textShadow: "4px 4px 0 #7a1c1c" }}>Team</h1>
        <p className="mt-2 text-lg font-semibold text-black/80">The people behind Techno-aiMBiAtion &apos;27.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-[230px_1fr]">
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
