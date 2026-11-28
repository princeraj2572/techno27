import { SCHEDULE } from "@/data/schedule";
import { DeparturesBoard } from "@/components/events/departures-board";
import { PageShell, body, serif } from "@/components/indie";

export const metadata = { title: "Schedule | Techno-aiMBiAtion 2027" };

export default function SchedulePage() {
  return (
    <PageShell>
      {/* cream paper with a light dot texture, so the tricolour board stands out */}
      <section
        className={`relative overflow-hidden ${body.className}`}
        style={{ background: "#f5edd8", backgroundImage: "radial-gradient(rgba(58,8,8,.12) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      >
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6">
          <h1 className={`text-5xl leading-[0.95] text-[#0b2a6b] sm:text-7xl ${serif.className}`} style={{ textShadow: "3px 3px 0 #ff9933" }}>
            Schedule
          </h1>
          <p className="mb-10 mt-3 text-2xl font-bold uppercase text-[#138808] sm:text-3xl">All lines · All stations</p>
          <DeparturesBoard days={SCHEDULE} theme="tricolourFlap" />
        </div>
      </section>
    </PageShell>
  );
}
