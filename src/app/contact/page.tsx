import { MapPin, Mail, Phone } from "lucide-react";
import { PageShell, SceneHeader, SectionHead, serif } from "@/components/heritage";

export const metadata = { title: "Contact | Techno-aiMBiAtion 2027" };

// PLACEHOLDER contacts — replace with the real emails, numbers and conveners.
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
          { Icon: Mail, label: "Email", value: "contact@example.com" },
          { Icon: Phone, label: "Phone", value: "+91 00000 00000" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-6 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#c1121f] to-[#6e0b12] text-white">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#1c0b09]/60">{label}</p>
            <p className="mt-1 font-semibold leading-snug">{value}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className={`text-3xl font-bold mb-6 text-center ${serif.className}`}>Our teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((d, i) => (
            <div key={d} className="rounded-xl border border-[#c9a27a]/60 bg-[#fffaf0]/90 p-4">
              <p className={`font-bold ${serif.className}`}>{d}</p>
              <p className="mt-2 text-sm text-[#1c0b09]/70">Convener Name · +91 90000 000{String(i + 1).padStart(2, "0")}</p>
              <p className="text-sm text-[#1c0b09]/70">Co-Convener Name · +91 80000 000{String(i + 1).padStart(2, "0")}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[#1c0b09]/50">Sample details — real contacts will be added.</p>
      </section>
    </PageShell>
  );
}
