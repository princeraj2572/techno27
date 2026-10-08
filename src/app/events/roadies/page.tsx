import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("roadies");

export default function Page() {
  return <EventPage slug="roadies" />;
}
