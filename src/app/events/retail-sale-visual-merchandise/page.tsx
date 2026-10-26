import { EventPage, eventMetadata } from "@/components/events/event-page";
import { retailSaleVisualMerchandise } from "./data";

export const metadata = eventMetadata(retailSaleVisualMerchandise);

export default function Page() {
  return <EventPage event={retailSaleVisualMerchandise} />;
}
