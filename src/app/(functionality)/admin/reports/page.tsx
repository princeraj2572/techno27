export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { CalendarDays, Download, Hotel, Users } from "lucide-react";
import Link from "next/link";
import { CARD_UI, TicketTitle } from "@/components/indie/gold-poster";

const REPORTS = [
  {
    key: "event-participants",
    title: "Event Participants",
    description: "All participants per event with team details.",
    icon: CalendarDays,
    color: "bg-[#0f6b63] text-white",
    exportHref: "/api/export/event-participants",
  },
  {
    key: "accommodation",
    title: "Accommodation Report",
    description: "Accommodation requests with arrival and departure times.",
    icon: Hotel,
    color: "bg-[#f5c928] text-[#1c1812]",
    exportHref: "/api/export/accommodation",
  },
  {
    key: "registrations",
    title: "All Registrations",
    description: "Full participant list — internal and external.",
    icon: Users,
    color: "bg-[#c8421f] text-white",
    exportHref: "/api/export/registrations",
  },
];

export default async function AdminReportsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Reports</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">Look through the data here, or download it as an Excel sheet.</p>
          </div>
        </div>

        {/* Report cards: the card isn't a link (it has two actions), so it doesn't lift on hover */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {REPORTS.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.key} className={`${CARD_UI} flex flex-col p-5`}>
                <span className={`mb-4 grid h-11 w-11 place-items-center rounded-xl border-2 border-[#1c1812] ${report.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-lg font-extrabold text-[#1c1812]">{report.title}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-black/65">{report.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/admin/reports/${report.key}`} className="rounded-full border-2 border-[#1c1812] bg-[#0f6b63] px-4 py-1.5 text-xs font-extrabold uppercase text-white transition-transform duration-150 active:scale-95">
                    View data
                  </Link>
                  <a href={report.exportHref} download className="inline-flex items-center gap-1 rounded-full border-2 border-[#1c1812] bg-white px-4 py-1.5 text-xs font-extrabold uppercase text-[#1c1812] transition-transform duration-150 active:scale-95">
                    <Download className="h-3.5 w-3.5" /> Excel
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
