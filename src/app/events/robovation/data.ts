import type { EventData } from "@/data/event-types";

// Robovation — everything shown at /events/robovation lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const robovation: EventData = {
  slug: "robovation",
  name: "Robovation",
  category: "Technical",
  iconKey: "bot",

  // ---- details ----
  tagline: "Machines, meet your match.",
  about: "Robovation is one of the flagship technical events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 17, 2027",
  time: "2:30 PM",
  venue: "Seminar Hall",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹15,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Anaya Das", phone: "+91 98765 50020" },
  subEvents: [
    "Robo Race",
    "Robo Soccer",
    "Fast Line Follower",
    "Robo War",
  ],

  // ---- look ----
  theme: {
    bg: "#ff9a3c",
    bg2: "#ffe19a",
    ink: "#4a1608",
    soft: "#8a3410",
    accent: "#4a1a08",
    accentInk: "#ffe9c4",
    accent2: "#d9741a",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "rings",
    patternColor: "#8a3410",
    motif: "Konark ✦ Odisha ✦ The wheel turns ✦ Build & race ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/robovation.jpg" }
  media: {},
};
