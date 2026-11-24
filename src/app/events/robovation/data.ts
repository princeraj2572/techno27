import type { EventData } from "@/features/events/data/event-types";

// Robovation — everything shown at /events/robovation lives in this file.
// (Its stamp illustration is drawn separately in src/components/culture-art.tsx.)
export const robovation: EventData = {
  slug: "robovation",
  name: "Drobotics",
  category: "Technical",
  iconKey: "bot",

  // ---- details ----
  tagline: "Machines, meet your match.",
  about: "Drobotics 2027 is OPJU's robotics and drone competition. Build the machine, pass inspection and take on the arena across six events, from Robo Soccer to AeroDrift. Teams bring their own robot, controller and batteries.",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  teamSize: "Up to 4 members",
  fee: "Free for OPJU · ₹199 for external",
  prize: "To be announced",
  rules: [
    "Teams of up to 4 (one or more institutes), each with a college ID. One robot per team per event.",
    "Report to the event area 30 minutes before your slot. Bring your own robot, controller, batteries and a spare battery.",
    "Ground robots: fit a 30×30×20 cm box, up to 3 kg, 12 V DC or less, sealed batteries. No ready-made commercial robots, LEGO kits, pneumatics, hydraulics or IC engines.",
    "Technical inspection before each event, plus a 3-minute scored engineering interview.",
    "LiPo batteries are charged only at the organisers' table. No AC mains at the arena. One 2-minute technical time-out per match.",
    "Referees' and judges' decisions are final.",
  ],
  contact: { name: "Ayush Singh · Robo Soccer", phone: "+91 94373 14373" },
  moreContacts: [
    { name: "Piyush Singh · Robo Race", phone: "+91 73260 04388" },
    { name: "Praneet · Pick & Place", phone: "+91 62073 78022" },
    { name: "Yash Kumar · Robo War", phone: "+91 81097 27926" },
    { name: "Tripti Niwas · Line Follower", phone: "+91 73545 83012" },
    { name: "Renuka K Nair · AeroDrift", phone: "+91 77249 38796" },
  ],
  subEvents: [
    "Robo Soccer",
    "Robo Race",
    "Pick & Place Challenge",
    "Robo War",
    "Autonomous Line Follower",
    "AeroDrift: The Sky Chaser",
  ],

  // ---- look ----
  theme: {
    bg: "#ff9a3c",
    bg2: "#ffe19a",
    ink: "#4a1608",
    soft: "#8a3410",
    accent: "#4a1a08",
    accentInk: "#ffe9c4",
    accent2: "#d9741a",
    card: "#fffaf0",
    cardInk: "#1a0f08",
    pattern: "rings",
    patternColor: "#8a3410",
    motif: "Konark ✦ Odisha ✦ The wheel turns ✦ Build & race ✦ ",
  },
  // Set image / logo to show real artwork, e.g. { image: "/images/events/robovation.jpg" }
  media: { image: "/images/events/robovation.jpg" },
};
