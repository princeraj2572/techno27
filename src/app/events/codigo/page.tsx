import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("codigo");

export default function Page() {
  return <EventPage slug="codigo" />;
}
