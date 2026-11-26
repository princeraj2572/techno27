import { Band, PageShell, serif } from "@/components/indie";

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
        {/* The timetable (src/data/schedule.ts + ScheduleGrid) goes back here once dates and venues are fixed. */}
        <div className="mx-auto max-w-2xl border-[3px] border-black bg-[#f5edd8] px-6 py-12 text-center text-black shadow-[6px_6px_0_0_#000]">
          <p className={`text-4xl sm:text-6xl ${serif.className}`}>To be announced</p>
          <p className="mt-4 text-lg font-bold uppercase tracking-wider">Dates, times and venues will be posted here soon.</p>
        </div>
      </Band>
    </PageShell>
  );
}
