import { SCHEDULE } from "@/data/schedule";
import { DeparturesBoard } from "@/components/events/departures-board";
import { Band, PageShell, TicketCta, serif } from "@/components/indie";

export const metadata = { title: "Schedule | Techno-aiMBiAtion 2027" };

export default function SchedulePage() {
  return (
    <PageShell>
      <Band tone="orange" art className="!pt-12">
        <h1
          className={`text-5xl sm:text-7xl leading-[0.95] text-[#ffd60a] ${serif.className}`}
          style={{ textShadow: "3px 3px 0 #c2410c" }}
        >
          Schedule
        </h1>
        <p className="mt-3 mb-10 text-2xl sm:text-3xl font-bold uppercase text-white">All lines · All stations</p>
        <DeparturesBoard days={SCHEDULE} />
        <p className="mt-6 text-center text-xs font-bold uppercase tracking-widest text-white">
          Sample timetable — all times and venues are placeholders.
        </p>
      </Band>

      <TicketCta
        title="Plan your fest"
        text="Register now, pick your events and build your team."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
