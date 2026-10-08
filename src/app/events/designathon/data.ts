import type { EventData } from "@/data/event-types";

// Designathon — everything shown at /events/designathon lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const designathon: EventData = {
  slug: "designathon",
  name: "Designathon",
  category: "Technical",
  iconKey: "pen",

  // ---- details ----
  tagline: "Design that moves people.",
  about: "Designathon is one of the flagship technical events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 19, 2027",
  time: "5:30 PM",
  venue: "Sports Arena",
  teamSize: "2–4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹15,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Kabir Nair", phone: "+91 98765 50140" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#ffb360",
    bg2: "#ffe7b8",
    ink: "#4a2f04",
    soft: "#8a5208",
    accent: "#2f6b3a",
    accentInk: "#ffffff",
    accent2: "#a8650a",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "rings",
    patternColor: "#a8650a",
    motif: "Chhattisgarh ✦ Dhokra ✦ Sal forests ✦ Design with heart ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/designathon.jpg" }
  media: {},
};
