import { EventPage, eventMetadata } from "@/components/event-page";
import { beatBattle } from "./data";

export const metadata = eventMetadata(beatBattle);

export default function Page() {
  return <EventPage event={beatBattle} />;
}
