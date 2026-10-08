import { PUBLIC_EVENTS } from "@/data/public-events";
import { EventPage, eventMetadata } from "@/components/event-page";

// Fallback: events that do not have their own folder yet still get a page from the shared template.
export function generateStaticParams() {
  return PUBLIC_EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return eventMetadata(slug);
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EventPage slug={slug} />;
}
