import { PUBLIC_EVENTS } from "@/data/public-events";
import { getEventMock } from "@/data/dummy";
import { RadioConsole } from "@/components/radio-console";
import { Band, Marquee, PageHero, PageShell, TicketCta } from "@/components/indie";

export const metadata = { title: "Events | Techno-aiMBiAtion 2027" };

export default function EventsPage() {
  const totalSub = PUBLIC_EVENTS.reduce((n, e) => n + e.subEvents.length, 0);

  return (
    <PageShell>
      <PageHero
        tone="crimson"
        outline
        title="Events"
        sub={`Tune into the fest — ${PUBLIC_EVENTS.length} events, ${totalSub}+ competitions`}
        ghost="Something for every genre"
      />

      <Band tone="crimson" mandala className="!pt-6">
        <RadioConsole
          events={PUBLIC_EVENTS.map((e, i) => {
            const m = getEventMock(e.slug, e.name, e.category, i);
            return {
              slug: e.slug,
              name: e.name,
              category: e.category,
              subEvents: e.subEvents,
              tagline: m.tagline,
              date: m.date,
              time: m.time,
              venue: m.venue,
              prize: m.prize,
            };
          })}
        />
      </Band>

      <Marquee
        className="bg-black text-white font-bold uppercase tracking-wider text-lg py-2"
        text={`${PUBLIC_EVENTS.map((e) => e.name).join(" • ")} • `}
        speed={60}
      />

      <TicketCta
        title="Found your event?"
        text="Register with your OPJU email for free entry. External participants get a unique TRX27 ID."
        href="/auth/signup"
        label="Register now"
      />
    </PageShell>
  );
}
