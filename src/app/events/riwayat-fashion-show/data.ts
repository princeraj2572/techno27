import type { EventData } from "@/features/events/data/event-types";

// Riwayat (Fashion Show) — everything shown at /events/riwayat-fashion-show lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const riwayatFashionShow: EventData = {
  slug: "riwayat-fashion-show",
  name: "Fashion Show (Riwayat)",
  category: "Cultural",
  iconKey: "shirt",

  // ---- details ----
  tagline: "Tradition on the runway.",
  about: "Riwayat 3.0 is the grand fashion show celebrating style, elegance, culture and creativity. Indian tradition meets contemporary trends on a runway where imagination meets expression and confidence takes centre stage.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Open to students of all institutions",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Open to students from universities, colleges and other educational institutions.",
    "Categories: Fashion Technology, Hairdressing & Makeup Artistry, and the Riwayat Grand Finale.",
    "Judged on creativity, outfit selection and styling, theme interpretation, confidence, ramp walk and overall impact.",
  ],
  contact: { name: "Karishma Mehra", phone: "+91 87208 45925" },
  moreContacts: [
    { name: "Ayush Singh", phone: "" },
    { name: "Manshi Sharma", phone: "" },
    { name: "Komal Kirti", phone: "" },
  ],
  subEvents: [
    "Fashion Technology",
    "Hairdressing & Makeup Artistry",
    "Riwayat Grand Finale",
  ],

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
  media: { image: "/images/events/riwayat-fashion-show.jpg" },
};
