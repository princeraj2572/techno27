// DUMMY schedule — real event names from the fest, with made-up days, times and venues.
// Replace with the confirmed timetable before launch.

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

const lunch: ScheduleItem = { time: "13:30", title: "Lunch Break", kind: "General", venue: "Mess Area", iconKey: "chef" };

export const SCHEDULE: ScheduleDay[] = [
  {
    label: "Day 1", date: "Jan 15, 2027",
    items: [
      { time: "09:00", title: "Inauguration Ceremony", kind: "Special", venue: "Main Auditorium", iconKey: "flame" },
      { time: "10:30", title: "Codigo — Round 1", kind: "Technical", venue: "CSE Block", iconKey: "code" },
      { time: "12:00", title: "Robovation — Robo Race", kind: "Technical", venue: "Robotics Lab", iconKey: "bot" },
      lunch,
      { time: "14:30", title: "Ideathon", kind: "Technical", venue: "Seminar Hall", iconKey: "bulb" },
      { time: "16:00", title: "Kalakriti — Rangoli", kind: "Cultural", venue: "Open Court", iconKey: "palette" },
      { time: "18:00", title: "Beat Battle", kind: "Cultural", venue: "Open Air Stage", iconKey: "music" },
      { time: "19:30", title: "Pronite 1 — The Midnight Ragas", kind: "Special", venue: "Main Ground", iconKey: "music" },
    ],
  },
  {
    label: "Day 2", date: "Jan 16, 2027",
    items: [
      { time: "09:30", title: "Backtrace", kind: "Technical", venue: "Computer Lab", iconKey: "terminal" },
      { time: "11:00", title: "Techlab", kind: "Technical", venue: "Innovation Lab", iconKey: "flask" },
      { time: "12:30", title: "Startup Business Plan", kind: "Management", venue: "Seminar Hall", iconKey: "trend" },
      lunch,
      { time: "14:30", title: "Designathon", kind: "Technical", venue: "Design Studio", iconKey: "pen" },
      { time: "16:00", title: "Masterchef", kind: "Fun", venue: "Food Court", iconKey: "chef" },
      { time: "17:30", title: "Voice of Youth", kind: "Management", venue: "Main Auditorium", iconKey: "mic" },
    ],
  },
  {
    label: "Day 3", date: "Jan 17, 2027",
    items: [
      { time: "09:30", title: "AIMA", kind: "Management", venue: "Conference Room", iconKey: "brain" },
      { time: "11:00", title: "Robovation — Robo Soccer", kind: "Technical", venue: "Sports Arena", iconKey: "bot" },
      { time: "12:30", title: "Antaragni — Mime", kind: "Cultural", venue: "Amphitheatre", iconKey: "flame" },
      lunch,
      { time: "15:00", title: "Roadies", kind: "Fun", venue: "Campus Trail", iconKey: "compass" },
      { time: "16:30", title: "Riwayat — Fashion Show", kind: "Cultural", venue: "Main Auditorium", iconKey: "shirt" },
      { time: "18:30", title: "Kalakriti — Art Exhibition", kind: "Cultural", venue: "Art Gallery", iconKey: "palette" },
      { time: "20:00", title: "Pronite 2 — DJ Nova", kind: "Special", venue: "Main Ground", iconKey: "music" },
    ],
  },
  {
    label: "Day 4", date: "Jan 18, 2027",
    items: [
      { time: "10:00", title: "Codigo — Finals", kind: "Technical", venue: "CSE Block", iconKey: "code" },
      { time: "11:30", title: "Ideathon — Pitch Round", kind: "Technical", venue: "Seminar Hall", iconKey: "bulb" },
      lunch,
      { time: "14:30", title: "Techlab — Showcase", kind: "Technical", venue: "Innovation Lab", iconKey: "flask" },
      { time: "16:00", title: "Voice of Youth — Finals", kind: "Management", venue: "Main Auditorium", iconKey: "mic" },
      { time: "17:30", title: "Beat Battle — Finals", kind: "Cultural", venue: "Open Air Stage", iconKey: "music" },
      { time: "19:00", title: "Cultural Night", kind: "Special", venue: "Main Ground", iconKey: "flame" },
    ],
  },
  {
    label: "Day 5", date: "Jan 19, 2027",
    items: [
      { time: "10:00", title: "Robovation — Finals", kind: "Technical", venue: "Sports Arena", iconKey: "bot" },
      { time: "12:00", title: "Startup Business Plan — Finals", kind: "Management", venue: "Seminar Hall", iconKey: "trend" },
      lunch,
      { time: "15:00", title: "Roadies — Finale", kind: "Fun", venue: "Campus Trail", iconKey: "compass" },
      { time: "16:30", title: "Prize Distribution", kind: "Special", venue: "Main Auditorium", iconKey: "star" },
      { time: "17:30", title: "Closing Ceremony", kind: "Special", venue: "Main Ground", iconKey: "flame" },
      { time: "19:00", title: "Pronite 3 — Echo & The Monsoon", kind: "Special", venue: "Main Ground", iconKey: "music" },
    ],
  },
];
