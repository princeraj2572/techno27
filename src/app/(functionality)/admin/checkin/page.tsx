export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getAllEventsAction } from "@/features/events/event-actions";
import { ChevronLeft, CheckSquare, QrCode } from "lucide-react";
import Link from "next/link";
import { TicketTitle } from "@/components/indie/gold-poster";

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN: { text: "Open",     color: "text-emerald-600" },
  EVENT_LIVE:        { text: "Live now", color: "text-teal-600"  },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN: "border-l-emerald-500",
  EVENT_LIVE:        "border-l-teal-500",
};

export default async function AdminCheckinPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);
  const activeEvents = events.filter((e: { status: string }) =>
    ["REGISTRATION_OPEN", "EVENT_LIVE"].includes(e.status)
  ) as Array<{ _id: string; name: string; status: string; category?: string }>;

  return (
    <div className="">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0f6b63] transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Check-In</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">{activeEvents.length} active event{activeEvents.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-[3px] border-[#1c1812] bg-[#f5c928] shadow-[0_4px_0_#1c1812] flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-teal-600" />
          </div>
        </div>

        {/* Active events */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          <p className="text-xs font-medium text-slate-500">Active events</p>
          {activeEvents.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CheckSquare className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No events are currently open or live</p>
            </div>
          ) : (
            activeEvents.map((e) => {
              const border = STATUS_BORDER[e.status] ?? "border-l-slate-200";
              const label  = STATUS_LABEL[e.status]  ?? { text: e.status.replace(/_/g, " "), color: "text-slate-500" };
              return (
                <div key={e._id} className={`bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] border-l-[6px] ${border} rounded-2xl px-4 py-3.5 flex items-center gap-3`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                    {e.category && <p className="text-xs text-slate-500 mt-0.5">{e.category}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
                    <Link href={`/admin/events/${e._id}`} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                      View participants →
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* QR coming soon */}
        <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-5 py-5 flex items-start gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-12 h-12 rounded-full border-[3px] border-[#1c1812] bg-[#f5c928] shadow-[0_4px_0_#1c1812] flex items-center justify-center shrink-0">
            <QrCode className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">QR check-in</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Event managers will scan participant QR codes at the venue. Profile photos are shown for identity verification. Coming soon.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
