import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PUBLIC_EVENTS } from "@/data/public-events";
import { ACCENTS, CARD, Marquee, PageHeader, PageShell, TicketCta, display } from "@/components/indie";

export const metadata = { title: "Events | Techno-aiMBiAtion 2027" };

export default function EventsPage() {
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);

  return (
    <PageShell>
      <PageHeader
        kicker="Techno-aiMBiAtion 2027"
        title="All events"
        subtitle={`${PUBLIC_EVENTS.length} flagship events and ${totalSub}+ competitions across tech, robotics, culture and more. Pick your record.`}
      />

      <section className="py-4">
        <Marquee
          className="bg-[#ff6a00] text-black font-bold uppercase tracking-wider text-xl py-1.5 -rotate-1"
          text="Compete ✦ Collaborate ✦ Create ✦ "
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLIC_EVENTS.map((e, i) => (
          <Link key={e.slug} href={`/events/${e.slug}`} className="group">
            <div className={`${CARD} relative rounded-xl p-5 h-full flex flex-col gap-3 transition-all group-hover:-translate-y-1 group-hover:shadow-[7px_7px_0_0_#000] ${i % 2 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"} group-hover:rotate-0`}>
              <span className={`absolute -top-3 right-4 ${ACCENTS[i % ACCENTS.length]} text-black text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 border-2 border-black rotate-2`}>
                Track {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`text-xl leading-tight ${display.className}`}>{e.name}</h3>
              {e.subEvents.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {e.subEvents.map((s) => (
                    <li key={s} className="text-sm font-semibold bg-black/10 border border-black/30 px-2 py-0.5 rounded-full">
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base text-[#1a0505]/65">Single marquee event</p>
              )}
              <span className="mt-auto pt-2 text-sm font-bold uppercase tracking-wider flex items-center gap-1 text-[#c8421f]">
                View details <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <TicketCta
        title="Found your event?"
        text="Register with your OPJU email for free entry. External participants get a unique TRX27 ID."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
