import type { EventData } from "@/features/events/data/event-types";

// Beat Battle — everything shown at /events/beat-battle lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const beatBattle: EventData = {
  slug: "beat-battle",
  name: "Beat Battle",
  category: "Cultural",
  iconKey: "music",

  // ---- details ----
  tagline: "Let the beats decide.",
  // Copied exactly from the event's official document.
  about: "Step into a high-energy clash of rhythm, creativity, and raw talent at our Dance Battle Event—where the floor becomes the battlefield and movement is the weapon. Dancers from diverse styles face off in head-to-head rounds, trading explosive footwork, sharp musicality, and fearless improvisation. The crowd fuels the momentum, judges watch for originality and control, and every beat drop is a chance to make a statement.",
  date: "Feb 17, 2027",
  time: "2:30 PM",
  venue: "Babuji Chowk",
  teamSize: "Solo",
  fee: "Free for OPJU · ₹99 for external (individual)",
  prize: "₹10,000",
  rules: [
    "Only students enrolled in a recognised school, college or university can enter. Private dance academy or class participants are not allowed.",
    "A valid student I-card is mandatory and will be verified. Fake IDs mean immediate disqualification.",
    "Solo participation only, with no duets or groups. Register before the deadline.",
    "No props unless provided by the organisers. No offensive or inappropriate moves.",
    "Judged on musicality & rhythm (25%), creativity (25%), energy & stage presence (20%), execution (20%) and overall impact (10%).",
  ],
  contact: { name: "Rajnayan Choudhary", phone: "+91 94792 18521" },
  moreContacts: [
    { name: "Tarana Sah", phone: "+91 83199 15571" },
  ],
  subEvents: [
    "Prelims (Top 16)",
    "Top 16 (1 vs 1)",
    "Top 8 (1 vs 1)",
    "Semi-Finals (Top 4)",
    "Finals (Top 2)",
  ],
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Prelims (Top 16)": "Format: All participants perform a single solo set. · Time: 45 seconds per dancer. · Music: One randomly selected song played by the DJ. · Outcome: Judges select the Top 16 dancers to advance.",
    "Top 16 (1 vs 1)": "Format: Head-to-head battles; matchups are selected by the community. · Time: 45 seconds per dancer. · Music: Both dancers perform to the same randomly played song. · Outcome: Winners advance to the Top 8.",
    "Top 8 (1 vs 1)": "Format: Head-to-head battles; matchups are selected by the community. · Time: 45 seconds per dancer. · Music: Both dancers perform to the same randomly played song. · Outcome: Winners advance to the Semi-Finals.",
    "Semi-Finals (Top 4)": "Format: 1 vs 1 battles; matchups are selected by the community. · Rounds: Each dancer performs two rounds. · Time: 45 seconds per round. · Music: Two different songs randomly played by the DJ. · Outcome: Winners advance to the Finals.",
    "Finals (Top 2)": "Format: 1 vs 1 face-off; matchup chosen by the community. · Rounds: Each dancer performs two rounds. · Time: 1 minute per round. · Music: Two different songs randomly played by the DJ. · Outcome: The winner is crowned Event Champion; the other is named Runner-Up.",
  },

  // ---- look ----
  theme: {
    bg: "#f0c040",
    bg2: "#fff3c4",
    ink: "#4a3000",
    soft: "#8a5a05",
    accent: "#2f8f4e",
    accentInk: "#ffffff",
    accent2: "#a65a22",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "stripes",
    patternColor: "#b8860b",
    motif: "Punjab ✦ Dhol ✦ Golden fields ✦ Let the beats decide ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/beat-battle.jpg" }
  media: { image: "/images/events/beat-battle.jpg" },
};
