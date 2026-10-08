import type { EventData } from "@/data/event-types";

// Riwayat (Fashion Show) — everything shown at /events/riwayat-fashion-show lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const riwayatFashionShow: EventData = {
  slug: "riwayat-fashion-show",
  name: "Riwayat (Fashion Show)",
  category: "Cultural",
  iconKey: "shirt",

  // ---- details ----
  tagline: "Tradition on the runway.",
  about: "Riwayat (Fashion Show) is one of the flagship cultural events of Techno-aiMBiAtion 2027. Participants from OPJU and other colleges compete through qualifying rounds and a live final in front of a panel of judges. Expect a high-energy atmosphere, tough competition and plenty of prizes.",
  date: "Jan 19, 2027",
  time: "5:30 PM",
  venue: "Main Auditorium",
  teamSize: "Solo or group",
  fee: "Free for OPJU · ₹199 for external",
  prize: "₹12,000",
  rules: [
    "Carry your TRX27 QR pass and a valid college ID.",
    "Report to the venue 20 minutes before the start time.",
    "Judges' decisions are final; any misconduct leads to disqualification.",
    "Use of unfair means or outside help is not permitted.",
  ],
  contact: { name: "Gauri Nambiar", phone: "+91 98765 50090" },
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#ffb3a0",
    bg2: "#ffeccb",
    ink: "#5e2230",
    soft: "#9a3d55",
    accent: "#b3496a",
    accentInk: "#ffffff",
    accent2: "#79bcd8",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "diamonds",
    patternColor: "#b3496a",
    motif: "Agra ✦ Uttar Pradesh ✦ Taj Mahal ✦ Tradition on the runway ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/riwayat-fashion-show.jpg" }
  media: {},
};
