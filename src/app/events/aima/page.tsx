import { EventPage, eventMetadata } from "@/components/event-page";
import { aima } from "./data";

export const metadata = eventMetadata(aima);

export default function Page() {
  return <EventPage event={aima} />;
}
