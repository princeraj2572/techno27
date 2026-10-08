import { EventPage, eventMetadata } from "@/components/event-page";

export const metadata = eventMetadata("backtrace");

export default function Page() {
  return <EventPage slug="backtrace" />;
}
