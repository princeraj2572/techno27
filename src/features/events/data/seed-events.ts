// The registrable events in the database, built from the public event pages (src/app/events/<slug>/data.ts)
// so names, categories, rules and images never drift from what the website shows.
//
// A fest event either is one registration ("single"), or is split into competitions (sub-events), each its
// own registration. Every row carries `mainEvent` = the fest event's slug: an external participant may join
// at most 7 different fest events, and sub-events of the same fest event count once (see event-actions.ts).
//
// All start as UPCOMING (registration not open). Open them from Developer -> Events when dates are fixed.
// prizeMoney = the fest event's whole prize pool (from its page; 0 while "To be announced"), shared by its competitions.
// teamSize = maximum members per team.
import { ALL_EVENTS } from "@/features/events/data/all-events";
import { SOLO_FEE_1, TEAM_FEE } from "@/features/payments/payment-constants";

/** An external participant may join at most this many different fest events (sub-events of one fest event count once). */
export const MAX_EXTERNAL_EVENTS = 7;

type Competition = { name: string; teamSize: number };
// Fest events whose listed `subEvents` are separate competitions. Everything else registers as one event
// (their `subEvents` are rounds or problem statements, not separate entries).
const COMPETITIONS: Record<string, Competition[]> = {
  techlab: [
    { name: "Working Models", teamSize: 4 },
    { name: "Non-Working Models", teamSize: 4 },
    { name: "Poster Presentation", teamSize: 4 },
    { name: "App & Web Development", teamSize: 4 },
  ],
  robovation: [
    { name: "Robo Soccer", teamSize: 4 },
    { name: "Robo Race", teamSize: 4 },
    { name: "Pick & Place Challenge", teamSize: 4 },
    { name: "Robo War", teamSize: 4 },
    { name: "Autonomous Line Follower", teamSize: 4 },
    { name: "AeroDrift: The Sky Chaser", teamSize: 4 },
  ],
  "game-paradise": [
    { name: "BGMI", teamSize: 4 },
    { name: "Free Fire MAX", teamSize: 4 },
  ],
  kalakriti: [
    { name: "Pradarshini (Exhibition)", teamSize: 1 },
    { name: "Floral Fusion (Decoration)", teamSize: 6 },
    { name: "Bhumi Kala: Alpana", teamSize: 6 },
    { name: "Bhumi Kala: Rangoli", teamSize: 6 },
    { name: "Painting Challenge", teamSize: 1 },
    { name: "Faces That Speak", teamSize: 1 },
    { name: "Mahendi (Rang-e-Heena)", teamSize: 1 },
  ],
  "riwayat-fashion-show": [
    { name: "Fashion Technology", teamSize: 1 },
    { name: "Hairdressing & Makeup Artistry", teamSize: 1 },
    { name: "Riwayat Grand Finale", teamSize: 1 },
  ],
  antaragni: [
    { name: "Solo Dance", teamSize: 1 },
    { name: "Group Dance", teamSize: 10 },
    { name: "Solo Singing", teamSize: 1 },
    { name: "Duet / Group Singing & Instrumental", teamSize: 6 },
    { name: "Rap / Beat-boxing", teamSize: 1 },
    { name: "Mime / Silent Act", teamSize: 8 },
    { name: "Short Film / Video Performance", teamSize: 5 },
  ],
};

// Max team size for events registered as one entry (from each page's teamSize / rules).
const SINGLE_TEAM_SIZE: Record<string, number> = {
  ideathon: 4,
  codigo: 1,
  designathon: 2,
  "startup-business-plan": 5,
  "voice-of-youth": 4,
  roadies: 1,
  "business-quiz": 4,
  "beat-battle": 1,
  masterchef: 3,
  "retail-sale-visual-merchandise": 4,
};

// OPJU students enter free; externals pay per registration by team size (see payment-constants.ts).
const fees = (teamSize: number) => ({ internalFee: 0, externalFee: teamSize === 1 ? SOLO_FEE_1 : TEAM_FEE });

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const seedEvents = ALL_EVENTS.flatMap((e) => {
  const base = {
    category: e.category,
    venue: e.venue,
    image: e.media?.image,
    rules: e.rules.join("\n"),
    schedule: `${e.date} · ${e.time}`,
    status: "UPCOMING" as const,
    accommodationFee: 0,
    prizeMoney: Number(e.prize.replace(/[^\d]/g, "")) || 0,
    mainEvent: e.slug,
  };
  const comps = COMPETITIONS[e.slug];
  if (!comps) {
    const teamSize = SINGLE_TEAM_SIZE[e.slug];
    if (!teamSize) throw new Error(`seed-events: no team size for "${e.slug}"`);
    return [{ ...base, slug: e.slug, name: e.name, description: `${e.tagline} ${e.about}`, teamSize, ...fees(teamSize) }];
  }
  return comps.map((c) => ({
    ...base,
    slug: `${e.slug}-${slugify(c.name)}`,
    name: `${e.name}: ${c.name}`,
    description: `Part of ${e.name}. ${e.tagline} ${e.about}`,
    teamSize: c.teamSize,
    ...fees(c.teamSize),
  }));
});
