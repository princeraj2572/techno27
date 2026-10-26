import type { EventData } from "@/features/events/data/event-types";
import { gameParadise } from "@/app/events/game-paradise/data";
import { kalakriti } from "@/app/events/kalakriti/data";
import { robovation } from "@/app/events/robovation/data";
import { masterchef } from "@/app/events/masterchef/data";
import { antaragni } from "@/app/events/antaragni/data";
import { ideathon } from "@/app/events/ideathon/data";
import { beatBattle } from "@/app/events/beat-battle/data";
import { techlab } from "@/app/events/techlab/data";
import { startupBusinessPlan } from "@/app/events/startup-business-plan/data";
import { riwayatFashionShow } from "@/app/events/riwayat-fashion-show/data";
import { roadies } from "@/app/events/roadies/data";
import { voiceOfYouth } from "@/app/events/voice-of-youth/data";
import { businessQuiz } from "@/app/events/business-quiz/data";
import { retailSaleVisualMerchandise } from "@/app/events/retail-sale-visual-merchandise/data";
import { codigo } from "@/app/events/codigo/data";
import { designathon } from "@/app/events/designathon/data";

// Every event on the site, in the order it appears on the landing page, the events list and the nav.
// To add an event: create src/app/events/<slug>/{data.ts,page.tsx} (copy an existing folder) and add it here.
export const ALL_EVENTS: EventData[] = [
  techlab,
  ideathon,
  robovation,
  codigo,
  designathon,
  gameParadise,
  startupBusinessPlan,
  voiceOfYouth,
  roadies,
  businessQuiz,
  beatBattle,
  kalakriti,
  riwayatFashionShow,
  antaragni,
  masterchef,
  retailSaleVisualMerchandise,
];

export function getEvent(slug: string): EventData | undefined {
  return ALL_EVENTS.find((e) => e.slug === slug);
}
