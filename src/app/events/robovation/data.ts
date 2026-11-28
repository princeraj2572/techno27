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
  date: "Feb 16–18, 2027",
  time: "From 9:30 AM (see schedule)",
  venue: "Babuji Chowk & beside Volleyball Ground",
  teamSize: "Up to 4 members",
  fee: "Free for OPJU · ₹199 per team for external",
  prize: "₹60,000",
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
  // Wording copied exactly from the event's official document; " · " separates its bullet points.
  subEventInfo: {
    "Robo Soccer": "Teams operate a specially designed robot to chase, push or hit a ball around the arena and score more goals than the opposing team. The event tests robot flipping, kicking, maneuvering and control skills, while encouraging teamwork and practical engineering.",
    "Robo Race": "Teams design a wireless or Bluetooth-controlled robot that can be driven through turns and obstacles on the track. The fastest robot that completes the specified course, subject to the event rules and checkpoint evaluation, is the winner.",
    "Pick & Place Challenge": "The Pick-and-Place Challenge is a robot systems integration event in which participants must design and operate a robot capable of picking up, transporting, and placing objects into their respective colour-designated zones.",
    "Robo War": "Robo War is a robotic combat challenge in which teams design, build and operate a robot to push, throw, flip, hit, drag or otherwise move the opponent out of the battle ring. The event tests engineering design, driving ability and team coordination.",
    "Autonomous Line Follower": "Autonomous Line Follower challenges teams to run a robot through a defined track, clear checkpoints, autonomously pick up a cube, release it inside the delivery box, and reach the finish zone.",
    "AeroDrift: The Sky Chaser": "AeroDrift is a drone flying competition where participants must fly their drones through multiple obstacles within a given time limit. The winner is determined by points scored & successful completion of the obstacle course.",
  },

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
