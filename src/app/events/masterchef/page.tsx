import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("masterchef");

export default function Page() {
  return <EventPage slug="masterchef" />;
}
