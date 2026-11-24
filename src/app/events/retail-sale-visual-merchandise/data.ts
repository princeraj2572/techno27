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
  about: "Retail Sales and Visual Merchandising, theme “Local to Global”, is a hands-on competition aligned with IndiaSkills Retail Sales (Skill 55) and Visual Merchandising (Skill 59). Teams turn a 2 m × 2 m space into a retail outlet, plan the layout, display products, engage customers and handle sales.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Teams (one 2 m × 2 m stall each)",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Three rounds: Store Plan (online), Build (on campus), and Retail Trading with Mystery Shopping (live).",
    "Products: handmade or art & craft items, Waste to Wow products, local handicrafts, or sponsored shop products. No food.",
    "No single product may be priced above ₹1,000. Prepare a priced product list; every item needs a visible price tag.",
    "Organisers provide a 2 m × 2 m stall, one table, two chairs and a backdrop frame. Teams arrange display materials, signage and props.",
    "Kalakriti participants can sell their products by registering in this event.",
  ],
  contact: { name: "Reema Sahoo", phone: "" },
  moreContacts: [
    { name: "Dikshanshu Chakradhari", phone: "" },
    { name: "Soumya Dansena", phone: "" },
    { name: "Ayush Kumar Singh", phone: "" },
  ],
  subEvents: [
    "Round 1: Store Plan",
    "Round 2: Build",
    "Round 3: Retail Trading",
  ],

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
  media: { image: "/images/events/retail-sale-visual-merchandise.jpg" },
};
