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
  // Copied exactly from the event's official document.
  about: "Kalakriti is the creative arts segment of Techno-ambiation 2026. The 2026 edition adopts a skill-task approach inspired by the practical, measurable and competency-based assessment style used in India Skills and WorldSkills competitions. The event is designed to assess planning, technical execution, creativity, time management, safe working practices and professional presentation.\n\nThe programme comprises one curated exhibition and 6 judged competitions. Rangoli and Alpana have been merged into one floor-art competition, Bhumi Kala. Floral Fusion includes a floral-work module. The 6 judged slots are Floral Fusion,Painting Challenge, Bhumi Kala (Rangoli or Alpana), Mahendi (Rang-e- Heena) and Faces That Speak.",
  date: "Feb 16–18, 2027",
  time: "11:00 AM onwards (see schedule)",
  venue: "Central Library, Library & opposite Chemistry Lab",
  teamSize: "Individual or group of 4–6 (varies by competition)",
  fee: "Free for OPJU · External: ₹99 individual / ₹199 team",
  prize: "₹30,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Pradarshini (Exhibition)": "Imagine what life would have been without colors, art and aesthetics boring right? And what Techno would be without an Art exhibition indeed boring. But don't worry we would not give you a millisecond of it. So, to dazzle your eyes we have \"Pradarshini”, an art exhibition by Kalakriti. and to quench the thirst of your imagination and take you on a bewildering journey worth remembering. Get yourself a pair of sunglasses and come engulf yourself in the art and aesthetics.",
    "Floral Fusion (Decoration)": "Participants are required to create an attractive and innovative floral decoration based on any celebration, festival or party theme of their choice. They can use fresh or dry flowers, leaves, decorative accessories and other creative materials to design a beautiful and aesthetically appealing setup.",
    "Bhumi Kala: Alpana": "Rangoli is a very popular folk art that has several connotations across India. It is a spiritual distribution of colors Which represents the happiness, positivity and liveliness of a household, and is intended to welcome the goddess of wealth and Prosperity.",
    "Bhumi Kala: Rangoli": "Rangoli is a very popular folk art that has several connotations across India. It is a spiritual distribution of colors Which represents the happiness, positivity and liveliness of a household, and is intended to welcome the goddess of wealth and Prosperity.",
    "Painting Challenge": "In order to create, we draw from our inner well. This inner well, an artistic reservoir, is ideally like a well-stocked fish pond… If we don’t give some attention to upkeep, our well is apt to become depleted, stagnant, or blocked…As artists, we must learn to be self-nourishing. We must become alert enough to consciously replenish our creative resources as we draw on them — to restock the trout pond, Speak up…. Just Speak up…. on Canvas….",
    "Faces That Speak": "Faces That Speak is a creative face painting competition where participants use the human face as a canvas to convey emotions, stories, themes, and social messages. This event encourages artists to go beyond beauty and focus on expression, meaning, and visual storytelling.",
    "Mahendi (Rang-e-Heena)": "Rang-e-Heena celebrates the traditional art of Mehendi, encouraging participants to showcase their creativity, precision and artistic skills through intricate henna designs.",
  },

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
