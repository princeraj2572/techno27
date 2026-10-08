import { SCHEDULE } from "@/data/schedule";
import { DeparturesBoard } from "@/components/departures-board";
import { Band, PageHero, PageShell, TicketCta } from "@/components/indie";

export const metadata = { title: "Schedule | Techno-aiMBiAtion 2027" };

export default function SchedulePage() {
  return (
    <PageShell>
      <PageHero tone="crimson" title="Schedule" sub="All lines · All stations" ghost="Techno Junction · All lines" />

      <Band tone="crimson" mandala className="!pt-4">
        <DeparturesBoard days={SCHEDULE} />
        <p className="mt-6 text-center text-xs uppercase tracking-widest text-white/60">
          Sample timetable — all times and venues are placeholders.
        </p>
      </Band>

      {/* train strip */}
      <div aria-hidden className="relative h-24 overflow-hidden bg-[#a1001a] border-y-2 border-black">
        <div className="indie-train absolute bottom-3 flex">
          {[0, 1, 2, 3].map((c) => (
            <div key={c} className="mr-1 h-14 w-44 rounded-md border-2 border-black bg-[#e9e6df] relative">
              <div className="absolute inset-x-0 top-1/2 h-1.5 bg-[#7a1c1c]" />
              <div className="absolute left-3 right-3 top-2 flex gap-2">
                {[0, 1, 2, 3].map((w) => <span key={w} className="h-4 flex-1 rounded-sm bg-[#1a2a44] border border-black" />)}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-[#3d2314] border-t-2 border-black" />
      </div>

      <TicketCta
        title="Plan your fest"
        text="Register now, pick your events and build your team."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
