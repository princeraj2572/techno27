import { EventPage, eventMetadata } from "@/components/event-page";
import { voiceOfYouth } from "./data";

export const metadata = eventMetadata(voiceOfYouth);

export default function Page() {
  return <EventPage event={voiceOfYouth} />;
}
