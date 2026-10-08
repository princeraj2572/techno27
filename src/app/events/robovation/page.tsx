import { EventPage, eventMetadata } from "@/components/event-page";
import { robovation } from "./data";

export const metadata = eventMetadata(robovation);

export default function Page() {
  return <EventPage event={robovation} />;
}
