import type { EventData } from "@/features/events/data/event-types";

// Beat Battle — everything shown at /events/beat-battle lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const beatBattle: EventData = {
  slug: "beat-battle",
  name: "Beat Battle",
  category: "Cultural",
  iconKey: "music",

  // ---- details ----
  tagline: "Let the beats decide.",
  about: "A high-energy dance battle where the floor is the battlefield. Dancers from diverse styles face off head to head, trading footwork, musicality and fearless improvisation. The crowd picks the matchups, and the judges watch for originality and control.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Solo",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Only students enrolled in a recognised school, college or university can enter. Private dance academy or class participants are not allowed.",
    "A valid student I-card is mandatory and will be verified. Fake IDs mean immediate disqualification.",
    "Solo participation only, with no duets or groups. Register before the deadline.",
    "No props unless provided by the organisers. No offensive or inappropriate moves.",
    "Judged on musicality & rhythm (25%), creativity (25%), energy & stage presence (20%), execution (20%) and overall impact (10%).",
  ],
  contact: { name: "Rajnayan Choudhary", phone: "+91 94792 18521" },
  moreContacts: [
    { name: "Tarana Sah", phone: "+91 83199 15571" },
  ],
  subEvents: [
    "Prelims (Top 16)",
    "Top 16 (1 vs 1)",
    "Top 8 (1 vs 1)",
    "Semi-Finals (Top 4)",
    "Finals (Top 2)",
  ],

  // ---- look ----
  theme: {
    bg: "#f0c040",
    bg2: "#fff3c4",
    ink: "#4a3000",
    soft: "#8a5a05",
    accent: "#2f8f4e",
    accentInk: "#ffffff",
    accent2: "#a65a22",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "stripes",
    patternColor: "#b8860b",
    motif: "Punjab ✦ Dhol ✦ Golden fields ✦ Let the beats decide ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/beat-battle.jpg" }
  media: { image: "/images/events/beat-battle.jpg" },
};
