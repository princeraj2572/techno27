import { EventPage, eventMetadata } from "@/components/events/event-page";
import { gameParadise } from "./data";

export const metadata = eventMetadata(gameParadise);

export default function Page() {
  return <EventPage event={gameParadise} />;
}
