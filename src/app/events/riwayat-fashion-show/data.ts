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
  // Copied exactly from the event's official document.
  about: "RIWAYAT 2026 is a spectacular celebration of fashion, style, elegance and creativity, providing a vibrant platform for students to express their individuality, artistic vision and confidence through fashion.\n\nThe event celebrates the beauty of Indian traditions blended with contemporary fashion trends. It aims to bring together creativity, cultural heritage, innovation and self-expression through an exciting runway experience.\n\nRIWAYAT is more than just a fashion show; it is a platform where imagination meets expression, tradition meets modernity, and confidence takes centre stage.",
  date: "Feb 16, 2027",
  time: "7:00 PM",
  venue: "University Playground",
  teamSize: "Open to students of all institutions",
  fee: "Free for OPJU · ₹99 for external (individual)",
  prize: "₹25,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Fashion Technology": "Fashion illustration and design · Pattern making and garment construction · Fabric innovation · Sustainable fashion · Fashion runway presentation",
    "Hairdressing & Makeup Artistry": "Bridal and occasion makeup · Creative hairstyling · Contemporary and traditional looks · Fashion makeup",
    "Riwayat Grand Finale": "Fashion ramp walk · Complete styling and makeover · Best designer outfit · Best makeup and hairstyling · Best overall presentation",
  },

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
