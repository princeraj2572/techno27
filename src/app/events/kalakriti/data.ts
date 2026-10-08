import type { EventData } from "@/data/event-types";

// Kalakriti — everything shown at /events/kalakriti lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const kalakriti: EventData = {
  slug: "kalakriti",
  name: "Kalakriti",
  category: "Cultural",
  iconKey: "palette",

  // ---- details ----
  tagline: "Where art meets culture.",
  about: "Kalakriti is one of the flagship cultural events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 16, 2027",
  time: "11:30 AM",
  venue: "Main Auditorium",
  teamSize: "Solo or group",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹20,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Arjun Verma", phone: "+91 98765 50010" },
  subEvents: [
    "Darbar-e-Bharat (Decoration)",
    "Alpana",
    "Rangoli",
    "Colour Painting",
    "Faces That Speak",
    "Waste to Wow",
    "Pradarshini (Art Exhibition)",
  ],

  // ---- look ----
  theme: {
    bg: "#ffd27a",
    bg2: "#fff3c8",
    ink: "#6e1818",
    soft: "#a03020",
    accent: "#1d6fa5",
    accentInk: "#ffffff",
    accent2: "#c8421f",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "dots",
    patternColor: "#c8421f",
    motif: "Madhubani ✦ Bihar ✦ Folk art ✦ Colour & craft ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/kalakriti.jpg" }
  media: {},
};
