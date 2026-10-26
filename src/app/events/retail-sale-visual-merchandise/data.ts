import type { EventData } from "@/features/events/data/event-types";

// Retail Sale & Visual Merchandise — everything shown at /events/retail-sale-visual-merchandise lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const retailSaleVisualMerchandise: EventData = {
  slug: "retail-sale-visual-merchandise",
  name: "Retail Sale & Visual Merchandise",
  category: "Management",
  iconKey: "trend",

  // ---- details ----
  tagline: "Display it. Sell it.",
  about: "Retail Sale & Visual Merchandise is one of the flagship management events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Feb 20, 2027",
  time: "2:30 PM",
  venue: "Innovation Lab",
  teamSize: "1–3 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹25,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Manav Arora", phone: "+91 98765 50120" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#6fc3e8",
    bg2: "#ffe6b8",
    ink: "#4a2c10",
    soft: "#85501a",
    accent: "#2a7aa8",
    accentInk: "#ffffff",
    accent2: "#a8601e",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "diamonds",
    patternColor: "#a8601e",
    motif: "Bazaar ✦ Stalls ✦ Retail & visual merchandise ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/retail-sale-visual-merchandise.jpg" }
  media: {},
};
