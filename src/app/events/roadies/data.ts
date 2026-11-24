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
  about: "Roadies 2027 tests strength, stamina, agility and mental toughness through a series of challenging physical tasks and obstacles. Step out of your comfort zone, push your limits and show courage under pressure.",
  date: "Feb 16–18, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Individual",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
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
