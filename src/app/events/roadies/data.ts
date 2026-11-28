import type { EventData } from "@/features/events/data/event-types";

// Roadies — everything shown at /events/roadies lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const roadies: EventData = {
  slug: "roadies",
  name: "Roadies",
  category: "Fun",
  iconKey: "compass",

  // ---- details ----
  tagline: "Survive the campus trail.",
  // Copied exactly from the event's official document.
  about: "ROADIES 2027 is an exciting platform designed to test student’s physical strength, stamina, endurance, agility, mental toughness, and determination through a series of challenging and engaging physical tasks. The event encourages participants to step out of their comfort zones, overcome physical challenges, push their limits, and demonstrate courage, confidence, and competitive spirit. It aims to promote physical fitness, resilience, self-discipline, and the ability to perform under pressure while creating an atmosphere of adventure, excitement, and healthy competition.\n\nThe event is designed to promote:\n• Physical Strength & Endurance\n• Agility & Coordination\n• Mental Toughness\n• Confidence & Courage\n• Sportsmanship & Discipline",
  date: "Feb 16–18, 2027",
  time: "From 11:30 AM (see schedule)",
  venue: "Car & Bus Parking Area and Open Gym",
  teamSize: "Individual",
  fee: "Free for OPJU · ₹99 for external (individual)",
  prize: "₹16,000",
  rules: [
    "Open to individual students. Register within the deadline.",
    "Complete all assigned tasks within the time limit and follow the coordinators' instructions.",
    "Wear sports attire and suitable footwear. Use equipment and obstacles only as directed.",
    "Misconduct, unsafe behaviour or obstructing others may lead to disqualification.",
    "Tell the event managers in advance about any medical condition or injury. The organisers' decision is final.",
  ],
  contact: { name: "Dr Amit Paras", phone: "+91 78796 10288" },
  moreContacts: [
    { name: "Leetesh Patel", phone: "" },
    { name: "Navin Giri", phone: "" },
    { name: "Swarup Ranjan Dash", phone: "" },
  ],
  subEvents: [],

  // ---- look ----
  theme: {
    bg: "#8fd1ee",
    bg2: "#e4f4fa",
    ink: "#0c2748",
    soft: "#1b5c90",
    accent: "#e8742a",
    accentInk: "#ffffff",
    accent2: "#2f7a4a",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "peaks",
    patternColor: "#1b6aa5",
    motif: "Himachal ✦ Pine & snow ✦ Hill temple ✦ Survive the trail ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/roadies.jpg" }
  media: { image: "/images/events/roadies.jpg" },
};
