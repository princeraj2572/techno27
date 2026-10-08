import { eventSubEventData } from "./event-subeventData";

export type EventCategory = "Technical" | "Cultural" | "Management" | "Fun";
export const EVENT_CATEGORIES: EventCategory[] = ["Technical", "Cultural", "Management", "Fun"];

export interface PublicEvent {
  slug: string;
  name: string;
  category: EventCategory;
  iconKey: string; // resolved to a lucide icon in the UI
  subEvents: string[];
}

// Category + icon per event slug. Edit freely — these only drive the public site's filters.
const META: Record<string, { category: EventCategory; iconKey: string }> = {
  backtrace: { category: "Technical", iconKey: "terminal" },
  kalakriti: { category: "Cultural", iconKey: "palette" },
  robovation: { category: "Technical", iconKey: "bot" },
  masterchef: { category: "Fun", iconKey: "chef" },
  antaragni: { category: "Cultural", iconKey: "flame" },
  ideathon: { category: "Technical", iconKey: "bulb" },
  "beat-battle": { category: "Cultural", iconKey: "music" },
  techlab: { category: "Technical", iconKey: "flask" },
  "startup-business-plan": { category: "Management", iconKey: "trend" },
  "riwayat-fashion-show": { category: "Cultural", iconKey: "shirt" },
  roadies: { category: "Fun", iconKey: "compass" },
  "voice-of-youth": { category: "Management", iconKey: "mic" },
  aima: { category: "Management", iconKey: "brain" },
  codigo: { category: "Technical", iconKey: "code" },
  designathon: { category: "Technical", iconKey: "pen" },
};

const NAME_OVERRIDES: Record<string, string> = { AIMA: "AIMA" };

export function slugify(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function prettyName(raw: string): string {
  return (
    NAME_OVERRIDES[raw] ??
    raw.replace(/-/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export const PUBLIC_EVENTS: PublicEvent[] = eventSubEventData.events.map((e) => {
  const slug = slugify(e.eventName);
  const meta = META[slug] ?? { category: "Fun" as EventCategory, iconKey: "star" };
  return {
    slug,
    name: prettyName(e.eventName),
    category: meta.category,
    iconKey: meta.iconKey,
    subEvents: e.subEvents.map((s) => s.subEventName),
  };
});

export function getPublicEvent(slug: string): PublicEvent | undefined {
  return PUBLIC_EVENTS.find((e) => e.slug === slug);
}
