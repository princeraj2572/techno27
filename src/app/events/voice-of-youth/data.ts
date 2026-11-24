import type { EventData } from "@/features/events/data/event-types";

// Voice Of Youth — everything shown at /events/voice-of-youth lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const voiceOfYouth: EventData = {
  slug: "voice-of-youth",
  name: "Yuva Sabha",
  category: "Management",
  iconKey: "mic",

  // ---- details ----
  tagline: "Speak up, be heard.",
  about: "Step into the intellectual battlefield of Tarkash, where logic meets leadership and arguments shape innovation. Debate current business trends, corporate ethics, financial strategy, socio-political matters and current events, and win by thinking critically and countering strategically.",
  date: "Feb 16–17, 2027",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "2–4 members per side",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Two sides: Proposition (supports the motion) and Opposition (opposes it).",
    "Round 1: 5–8 min speeches with 3 min rebuttals. Semi-final: 8–10 min with 5 min rebuttals. Final: 8–15 min with 8 min rebuttals. Overrunning may be penalised.",
    "Arguments must be fact-based and logical. Cite sources; fabricating evidence is prohibited.",
    "Points of Information may be raised where the format allows; the speaker may accept or reject them.",
    "No offensive language, discrimination or personal attacks. Judges score content, delivery, rebuttals and structure.",
  ],
  contact: { name: "Sammi Khan", phone: "+91 70675 11534" },
  moreContacts: [
    { name: "Suyash Miri", phone: "+91 93019 60952" },
    { name: "Aniket Kumar Chaubey", phone: "+91 78490 97229" },
  ],
  subEvents: [
    "Round 1",
    "Semi-Final",
    "Final",
  ],

  // ---- look ----
  theme: {
    bg: "#e8856a",
    bg2: "#fff0cf",
    ink: "#4a1410",
    soft: "#8a2a1c",
    accent: "#138808",
    accentInk: "#ffffff",
    accent2: "#ff9933",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "arches",
    patternColor: "#b5402a",
    motif: "Delhi ✦ Red Fort ✦ A nation's voice ✦ Speak up ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/voice-of-youth.jpg" }
  media: { image: "/images/events/voice-of-youth.jpg" },
};
