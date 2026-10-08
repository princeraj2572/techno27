import { MapPin, Mail, Phone } from "lucide-react";
import { PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";
import { DEPARTMENTS, initials } from "@/data/dummy";

export const metadata = { title: "Contact | Techno-aiMBiAtion 2027" };

function Person({ name, role, phone }: { name: string; role: string; phone: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white text-sm font-bold ${serif.className}`}>
        {initials(name)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold leading-tight">{name}</p>
        <p className="text-[11px] uppercase tracking-wider text-[#9b111e]">{role}</p>
        <p className="text-sm text-[#1c0b09]/70 tabular-nums">{phone}</p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="CONTACT"
          sub="Ask • Connect • Collaborate"
          text="Questions about registration, events, accommodation or sponsorship? Reach out to the right team."
        />
      </SceneHeader>

      <section className="max-w-5xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-5">
        {[
          { Icon: MapPin, label: "Venue", value: "O.P. Jindal University, Raigarh, Chhattisgarh" },
          { Icon: Mail, label: "Email", value: "hello@technoaimbiation.example" },
          { Icon: Phone, label: "Phone", value: "+91 98765 43210" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-6 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#1c0b09]/60">{label}</p>
            <p className="mt-1 font-semibold leading-snug break-words">{value}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className={`text-3xl font-bold mb-6 text-center ${serif.className}`}>Our teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEPARTMENTS.map((d) => (
            <div key={d.name} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-5 space-y-4">
              <p className={`text-lg font-bold ${serif.className}`}>{d.name}</p>
              <Person name={d.convener.name} role="Convener" phone={d.convener.phone} />
              <Person name={d.coConvener.name} role="Co-Convener" phone={d.coConvener.phone} />
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[#1c0b09]/50">Sample team — all names and numbers are fictional.</p>
      </section>
    </PageShell>
  );
}
