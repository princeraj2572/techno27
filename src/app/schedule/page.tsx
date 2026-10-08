import { SCHEDULE } from "@/data/schedule";
import { ScheduleBoard } from "@/components/schedule-board";
import { CtaBand, PageShell, SceneHeader, SectionHead } from "@/components/heritage";

export const metadata = { title: "Schedule | Techno-aiMBiAtion 2027" };

export default function SchedulePage() {
  return (
    <PageShell>
      <SceneHeader>
        <SectionHead
          title="EVENT SCHEDULE"
          sub="Plan • Participate • Experience"
          text="Stay updated with the complete schedule of events, competitions, workshops, and special sessions."
        />
      </SceneHeader>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <ScheduleBoard days={SCHEDULE} />
        <p className="mt-10 text-center text-xs text-[#1c0b09]/50">Sample schedule — timings and venues will be confirmed.</p>
      </section>

      <CtaBand
        title="Plan your fest"
        text="Register now, pick your events and build your team."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
