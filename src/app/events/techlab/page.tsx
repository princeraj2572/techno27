import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("techlab");

export default function Page() {
  return <EventPage slug="techlab" />;
}
