// PLACEHOLDER schedule, copied from the design mockup — replace with the real plan.
// The mockup used Jan 15-19 2027; the hero mockup said 05-08 Feb 2027. Confirm before launch.

export type ScheduleKind = "Special" | "Technical" | "Cultural" | "General" | "Management" | "Fun";

export interface ScheduleItem {
  time: string; // "09:00"
  title: string;
  kind: ScheduleKind;
  venue: string;
  iconKey: string;
}

export interface ScheduleDay {
  label: string;
  date: string;
  items: ScheduleItem[];
}

const SAMPLE: ScheduleItem[] = [
  { time: "09:00", title: "Inauguration Ceremony", kind: "Special",   venue: "Main Auditorium", iconKey: "flame" },
  { time: "10:30", title: "CodeQuest",             kind: "Technical", venue: "CSE Block",       iconKey: "code" },
  { time: "12:00", title: "RoboRumble",            kind: "Technical", venue: "Robotics Lab",    iconKey: "bot" },
  { time: "13:30", title: "Lunch Break",           kind: "General",   venue: "Mess Area",       iconKey: "chef" },
  { time: "14:30", title: "Ideathon",              kind: "Technical", venue: "Seminar Hall",    iconKey: "bulb" },
  { time: "16:00", title: "PixelPerfect",          kind: "Cultural",  venue: "Design Studio",   iconKey: "camera" },
  { time: "17:30", title: "VibeStation",           kind: "Cultural",  venue: "Open Air Stage",  iconKey: "mic" },
  { time: "19:00", title: "Cultural Night",        kind: "Special",   venue: "Main Ground",     iconKey: "music" },
];

export const SCHEDULE: ScheduleDay[] = [
  { label: "Day 1", date: "Jan 15, 2027", items: SAMPLE },
  { label: "Day 2", date: "Jan 16, 2027", items: SAMPLE },
  { label: "Day 3", date: "Jan 17, 2027", items: SAMPLE },
  { label: "Day 4", date: "Jan 18, 2027", items: SAMPLE },
  { label: "Day 5", date: "Jan 19, 2027", items: SAMPLE },
];
