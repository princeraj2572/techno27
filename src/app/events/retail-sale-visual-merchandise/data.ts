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
  // Copied exactly from the event's official document.
  about: "Retail Sales and Visual Merchandising is a practical, skill-based competition designed to provide students with hands-on exposure to the functioning of a retail business. Aligned with the IndiaSkills occupational skill domains of Retail Sales (Skill 55) and Visual Merchandising (Skill 59), the competition aims to assess participants' abilities in retail store planning, product presentation, customer engagement, selling techniques and basic retail operations.\n\nUnder the theme \"Local to Global,\" participating teams will transform designated spaces into attractive and functional retail outlets. They will be required to plan their store layout, arrange and display products, develop appropriate signage, interact with customers, handle sales transactions and maintain accurate sales records.\n\nThe competition will simulate a real-world retail environment, enabling participants to demonstrate their creativity, commercial understanding, communication skills and practical retail management capabilities.",
  date: "Feb 16, 2027",
  time: "11:30 AM",
  venue: "Lawn opposite ATM",
  teamSize: "Teams (one 2 m × 2 m stall each)",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹10,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Round 1: Store Plan": "Mode: Online · Teams must submit a product list with proposed prices and a planogram illustrating the stall layout, including the focal display, product placement, signage and billing counter. The proposed layout will serve as the reference for evaluating the actual store setup.",
    "Round 2: Build": "Mode: On-campus · Teams must transform their allotted 2 m × 2 m stall into an attractive and functional retail outlet by arranging products, creating focal displays, designing signage and organising the billing area.",
    "Round 3: Retail Trading": "Mode: Live Retail Simulation · Teams will operate their stalls and engage with visitors through live selling activities, demonstrating product knowledge, customer handling, promotional communication and sales skills.",
  },

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
