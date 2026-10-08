import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("robovation");

export default function Page() {
  return <EventPage slug="robovation" />;
}
