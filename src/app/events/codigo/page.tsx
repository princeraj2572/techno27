import { EventPage, eventMetadata } from "@/components/event-page";
import { codigo } from "./data";

export const metadata = eventMetadata(codigo);

export default function Page() {
  return <EventPage event={codigo} />;
}
