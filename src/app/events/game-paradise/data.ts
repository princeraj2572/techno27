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
  // Copied exactly from the event's official document.
  about: "Game Paradise is an online gaming event designed to bring together passionate gamers and create an exciting atmosphere of competition, teamwork, and entertainment. Featuring two popular games, BGMI: Multiplayer Gun Games and Free Fire MAX: Storm Arena, the event will give participants a chance to showcase their gaming skills, team coordination, strategic thinking, and quick reflexes. Teams will compete against each other, putting their skills and strategies to the test. Get ready for an action-packed experience where teamwork makes the difference and every move counts!",
  date: "Feb 16–17, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "4 players per team",
  fee: "Free for OPJU · ₹199 per team for external",
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
