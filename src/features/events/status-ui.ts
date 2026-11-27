// One look for event status everywhere (participant cart, management and dev lists).
export const STATUS_CHIP: Record<string, { text: string; cls: string }> = {
  REGISTRATION_OPEN:   { text: "Open",       cls: "bg-[#0f6b63] text-white" },
  UPCOMING:            { text: "Opens soon", cls: "bg-[#fde9a8] text-[#1c1812]" },
  DRAFT:               { text: "Draft",      cls: "bg-black/10 text-black/60" },
  EVENT_LIVE:          { text: "Live now",   cls: "bg-[#c8421f] text-white" },
  REGISTRATION_CLOSED: { text: "Closed",     cls: "bg-black/10 text-black/60" },
  TEMPORARILY_CLOSED:  { text: "Paused",     cls: "bg-black/10 text-black/60" },
  COMPLETED:           { text: "Over",       cls: "bg-black/10 text-black/60" },
  CANCELLED:           { text: "Cancelled",  cls: "bg-black/10 text-black/60" },
  ARCHIVED:            { text: "Archived",   cls: "bg-black/10 text-black/60" },
};
export const statusChip = (s: string) => STATUS_CHIP[s] ?? { text: s.replace(/_/g, " "), cls: "bg-black/10 text-black/60" };
