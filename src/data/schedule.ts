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
    label: "Day 1", date: "Feb 18, 2027",
    items: [
      { time: "09:00", title: "Inauguration Ceremony", kind: "Special", venue: "Main Auditorium", iconKey: "flame" },
      { time: "10:30", title: "Codigo — Round 1", kind: "Technical", venue: "CSE Block", iconKey: "code" },
      { time: "12:00", title: "Drobotics — Robo Race", kind: "Technical", venue: "Robotics Lab", iconKey: "bot" },
      lunch,
      { time: "14:30", title: "Ideathon", kind: "Technical", venue: "Seminar Hall", iconKey: "bulb" },
      { time: "16:00", title: "Kalakriti — Rangoli", kind: "Cultural", venue: "Open Court", iconKey: "palette" },
      { time: "18:00", title: "Beat Battle", kind: "Cultural", venue: "Open Air Stage", iconKey: "music" },
      { time: "19:30", title: "Junoon Night 1 — The Midnight Ragas", kind: "Special", venue: "Main Ground", iconKey: "music" },
    ],
  },
  {
    label: "Day 2", date: "Feb 19, 2027",
    items: [
      { time: "09:30", title: "Game Paradise", kind: "Technical", venue: "Computer Lab", iconKey: "terminal" },
      { time: "11:00", title: "Tech-Lab", kind: "Technical", venue: "Innovation Lab", iconKey: "flask" },
      { time: "12:30", title: "Start-up Business Plan", kind: "Management", venue: "Seminar Hall", iconKey: "trend" },
      lunch,
      { time: "14:30", title: "Designathon", kind: "Technical", venue: "Design Studio", iconKey: "pen" },
      { time: "16:00", title: "Master Chef", kind: "Fun", venue: "Food Court", iconKey: "chef" },
      { time: "17:30", title: "Yuva Sabha", kind: "Management", venue: "Main Auditorium", iconKey: "mic" },
    ],
  },
  {
    label: "Day 3", date: "Feb 20, 2027",
    items: [
      { time: "09:30", title: "Business Quiz", kind: "Management", venue: "Conference Room", iconKey: "brain" },
      { time: "11:00", title: "Drobotics — Robo Soccer", kind: "Technical", venue: "Sports Arena", iconKey: "bot" },
      { time: "12:30", title: "Antaragni — Mime", kind: "Cultural", venue: "Amphitheatre", iconKey: "flame" },
      lunch,
      { time: "15:00", title: "Roadies", kind: "Fun", venue: "Campus Trail", iconKey: "compass" },
      { time: "16:30", title: "Riwayat — Fashion Show", kind: "Cultural", venue: "Main Auditorium", iconKey: "shirt" },
      { time: "18:30", title: "Kalakriti — Art Exhibition", kind: "Cultural", venue: "Art Gallery", iconKey: "palette" },
      { time: "19:00", title: "Prize Distribution & Closing Ceremony", kind: "Special", venue: "Main Auditorium", iconKey: "star" },
      { time: "20:00", title: "Junoon Night 2 — DJ Nova", kind: "Special", venue: "Main Ground", iconKey: "music" },
    ],
  },
];
