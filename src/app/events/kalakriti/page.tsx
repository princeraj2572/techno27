import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("kalakriti");

export default function Page() {
  return <EventPage slug="kalakriti" />;
}
