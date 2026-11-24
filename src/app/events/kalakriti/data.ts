import type { EventData } from "@/features/events/data/event-types";

// Kalakriti — everything shown at /events/kalakriti lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const kalakriti: EventData = {
  slug: "kalakriti",
  name: "Kalakriti",
  category: "Cultural",
  iconKey: "palette",

  // ---- details ----
  tagline: "Where art meets culture.",
  about: "Kalakriti is the creative arts segment of Techno-aiMBiAtion. It follows a skill-task approach inspired by India Skills and WorldSkills: one curated exhibition and judged competitions that assess planning, technical execution, creativity, time management and presentation.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Individual or group of 4–6 (varies by competition)",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Register before the event. Every competition is a single round.",
    "Exhibition: submit your art or craft 2–3 days before the event.",
    "Floral Fusion, Alpana and Rangoli are group events of 4–6 members. Alpana gets 1.5 hours; Rangoli, Painting and Mehendi get 2 hours. No extra time.",
    "Painting Challenge themes: Paint the Future, Human v/s Technology, Soul of Rural India. Paper or canvas is provided.",
    "Faces That Speak and Mahendi are individual events. Bring your own materials.",
    "Certificates for all participants and achievement certificates for winners. The jury's decision is final.",
  ],
  contact: { name: "Dr. Kavita Patel", phone: "+91 91099 09269" },
  moreContacts: [
    { name: "Dr. Khushboo Patel", phone: "+91 91310 77676" },
    { name: "Mr. Hrishikesh Shashtri", phone: "+91 79874 06335" },
  ],
  subEvents: [
    "Pradarshini (Exhibition)",
    "Floral Fusion (Decoration)",
    "Bhumi Kala: Alpana",
    "Bhumi Kala: Rangoli",
    "Painting Challenge",
    "Faces That Speak",
    "Mahendi (Rang-e-Heena)",
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
  media: { image: "/images/events/kalakriti.jpg" },
};
