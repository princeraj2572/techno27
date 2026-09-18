export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllAccommodationsWithUsers } from "@/actions/accommodation-actions";
import { ChevronLeft, Hotel } from "lucide-react";
import Link from "next/link";

export default async function AdminAccommodationPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const accommodations = await getAllAccommodationsWithUsers().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Accommodation</h1>
            <p className="text-xs text-slate-400 mt-0.5">{accommodations.length} submissions</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Hotel className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {accommodations.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Hotel className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No accommodation requests yet</p>
            </div>
          ) : (
            accommodations.map((item) => {
              const u = item.user as { _id: unknown; fullName: string; email: string };
              const a = item.accommodation;
              return (
                <div key={String(u._id)} className="bg-white border border-slate-100 border-l-4 border-l-indigo-200 rounded-xl px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0 mt-0.5">
                      {u.fullName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{u.fullName}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {a.universityName && <span className="mr-2">{a.universityName}</span>}
                        {a.gender && (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-1.5 py-0.5 rounded-full mr-2">
                            {a.gender}
                          </span>
                        )}
                        {a.arrivalTime && (
                          <span>Arrives {new Date(a.arrivalTime).toLocaleDateString()}</span>
                        )}
                        {a.departureTime && (
                          <span> · Departs {new Date(a.departureTime).toLocaleDateString()}</span>
                        )}
                      </p>
                      {a.additionalDetails && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{a.additionalDetails}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
