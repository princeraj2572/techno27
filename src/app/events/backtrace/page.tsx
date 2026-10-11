import { EventPage, eventMetadata } from "@/components/events/event-page";
import { backtrace } from "./data";

export const metadata = eventMetadata(backtrace);

export default function Page() {
  return <EventPage event={backtrace} />;
}
