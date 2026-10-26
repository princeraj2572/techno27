import type { EventData } from "@/features/events/data/event-types";

// Techlab — everything shown at /events/techlab lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const techlab: EventData = {
  slug: "techlab",
  name: "Tech-Lab",
  category: "Technical",
  iconKey: "flask",

  // ---- details ----
  tagline: "Hands-on tech, live.",
  about: "Techlab is one of the flagship technical events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Feb 20, 2027",
  time: "2:30 PM",
  venue: "Food Court",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹20,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Pranav Desai", phone: "+91 98765 50070" },
  subEvents: [
    "Working Models",
    "Non-Working Models",
    "App Making",
    "Poster Presentation",
  ],

  // ---- look ----
  theme: {
    bg: "#3dbcc9",
    bg2: "#ffe9b0",
    ink: "#06444c",
    soft: "#0f7480",
    accent: "#d9534f",
    accentInk: "#ffffff",
    accent2: "#f0a830",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "zigzag",
    patternColor: "#d9534f",
    motif: "Tamil Nadu ✦ Gopuram ✦ Crafted to last ✦ Hands-on tech ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/techlab.jpg" }
  media: {},
};
