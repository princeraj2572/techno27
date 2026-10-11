import type { EventData } from "@/features/events/data/event-types";

// Startup Business Plan — everything shown at /events/startup-business-plan lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const startupBusinessPlan: EventData = {
  slug: "startup-business-plan",
  name: "Startup Business Plan",
  category: "Management",
  iconKey: "trend",

  // ---- details ----
  tagline: "Pitch it. Fund it. Build it.",
  about: "Startup Business Plan is one of the flagship management events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 18, 2027",
  time: "4:00 PM",
  venue: "CSE Block",
  teamSize: "1–3 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹15,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Simran Gill", phone: "+91 98765 50080" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#ff9a6c",
    bg2: "#ffe3a8",
    ink: "#4a2410",
    soft: "#8a4018",
    accent: "#1b6aa5",
    accentInk: "#ffffff",
    accent2: "#c9a074",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "waves",
    patternColor: "#1b6aa5",
    motif: "Mumbai ✦ Maharashtra ✦ Gateway of India ✦ Pitch it, fund it ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/startup-business-plan.jpg" }
  media: {},
};
