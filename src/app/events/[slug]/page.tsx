import { notFound } from "next/navigation";
import { ALL_EVENTS, getEvent } from "@/data/all-events";
import { EventPage, eventMetadata } from "@/components/event-page";

// Fallback: an event listed in src/data/all-events.ts that has no folder of its own yet
// still gets a page from the shared template.
export function generateStaticParams() {
  return ALL_EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  return event ? eventMetadata(event) : { title: "Event | Techno-aiMBiAtion 2027" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  return <EventPage event={event} />;
}
