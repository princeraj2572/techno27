export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { ChevronLeft, BarChart2, CalendarDays, CreditCard, Hotel, Users } from "lucide-react";
import Link from "next/link";

const REPORTS = [
  {
    key: "event-participants",
    title: "Event Participants",
    description: "All participants per event with team details.",
    icon: CalendarDays,
    color: "bg-teal-50 text-teal-600",
    exportHref: "/api/export/event-participants",
  },
  {
    key: "payments",
    title: "Payment Report",
    description: "External participant payments with clearance status.",
    icon: CreditCard,
    color: "bg-emerald-50 text-emerald-600",
    exportHref: "/api/export/payments",
  },
  {
    key: "accommodation",
    title: "Accommodation Report",
    description: "Accommodation requests with arrival and departure times.",
    icon: Hotel,
    color: "bg-amber-50 text-amber-600",
    exportHref: "/api/export/accommodation",
  },
  {
    key: "registrations",
    title: "All Registrations",
    description: "Full participant list — internal and external.",
    icon: Users,
    color: "bg-slate-50 text-slate-600",
    exportHref: "/api/export/registrations",
  },
];

export default async function AdminReportsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports</h1>
            <p className="text-xs text-slate-400 mt-0.5">View and export paginated, filterable report data</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-teal-600" />
          </div>
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {REPORTS.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.key} className="bg-white border border-slate-100 rounded-2xl px-5 py-5 hover:border-teal-100 hover:shadow-sm transition-all">
                <div className={`w-9 h-9 rounded-xl ${report.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-slate-900">{report.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{report.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link
                    href={`/admin/reports/${report.key}`}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    View data →
                  </Link>
                  <a
                    href={report.exportHref}
                    download
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Download Excel
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
