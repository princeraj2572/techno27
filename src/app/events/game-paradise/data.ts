import type { EventData } from "@/features/events/data/event-types";

// Game Paradise — everything shown at /events/game-paradise lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const gameParadise: EventData = {
  slug: "game-paradise",
  name: "Game Paradise",
  category: "Fun",
  iconKey: "bot",

  // ---- details ----
  tagline: "Play online. Play to win.",
  about: "Game Paradise is an online gaming event with two titles, BGMI and Free Fire MAX. Squads compete in custom rooms through qualifiers, semi-finals and a Grand Final, scored on placement and eliminations.",
  date: "Feb 16–17, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "4 players per team",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Only students of a recognised school, college or university can play. Carry a valid student ID.",
    "Each team has four registered main players. No player can join more than one team.",
    "Use the UID / Character ID submitted at registration. Join the custom room with the Room ID and password shared by the organisers.",
    "Score = placement points (1st 12 … 10th 1) + 1 point per elimination.",
    "Hacks, cheats, scripts, teaming or match manipulation lead to disqualification.",
    "Keep your device charged and internet stable. Technical issues do not guarantee a rematch.",
  ],
  contact: { name: "Anant Jhunjhunwala", phone: "+91 98610 63616" },
  moreContacts: [
    { name: "Shiva Rana", phone: "+91 93992 60863" },
  ],
  subEvents: [
    "BGMI",
    "Free Fire MAX",
  ],

  // ---- look ----
  theme: {
    bg: "#f6a65a",
    bg2: "#ffe2b0",
    ink: "#4a2410",
    soft: "#7a4020",
    accent: "#b5521f",
    accentInk: "#fff3e0",
    accent2: "#5a3418",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "diamonds",
    patternColor: "#b5521f",
    motif: "Hampi ✦ Karnataka ✦ Stone chariot ✦ Online gaming ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/game-paradise.jpg" }
  media: { image: "/images/events/game-paradise.jpg" },
};
