import { EventPage, eventMetadata } from "@/components/events/event-page";
import { businessQuiz } from "./data";

export const metadata = eventMetadata(businessQuiz);

export default function Page() {
  return <EventPage event={businessQuiz} />;
}
