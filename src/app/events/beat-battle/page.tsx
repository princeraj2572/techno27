import { EventPage, eventMetadata } from "@/components/events/event-page";
import { beatBattle } from "./data";

export const metadata = eventMetadata(beatBattle);

export default function Page() {
  return <EventPage event={beatBattle} />;
}
