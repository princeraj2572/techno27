export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Accommodation } from "@/models/accommodation.model";
import { ChevronLeft, Hotel } from "lucide-react";
import Link from "next/link";

type AccomItem = {
  _id: string; gender?: string; universityName?: string;
  arrivalTime?: string; departureTime?: string; additionalDetails?: string;
  userId?: { fullName?: string; email?: string } | null;
};

async function getData() {
  await connectToDatabase();
  const items = await Accommodation.find()
    .populate("userId", "fullName email")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(items)) as AccomItem[];
}

const GENDER_CHIP: Record<string, string> = {
  Male:   "bg-sky-50   text-sky-700   border-sky-200",
  Female: "bg-pink-50  text-pink-700  border-pink-200",
  Other:  "bg-slate-50 text-slate-600 border-slate-200",
};

export default async function DevAccommodationPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const items = await getData().catch(() => []);

  const maleCount   = items.filter((i) => i.gender === "Male").length;
  const femaleCount = items.filter((i) => i.gender === "Female").length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Accommodation</h1>
            <p className="text-xs text-slate-400 mt-0.5">{items.length} request(s)</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Hotel className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Total</p>
            <p className="text-2xl font-bold text-white tabular-nums">{items.length}</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-sky-500 mb-1">Male</p>
            <p className="text-2xl font-bold text-sky-900 tabular-nums">{maleCount}</p>
          </div>
          <div className="bg-pink-50 border border-pink-100 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-pink-500 mb-1">Female</p>
            <p className="text-2xl font-bold text-pink-900 tabular-nums">{femaleCount}</p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Hotel className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No accommodation requests yet</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="bg-white border border-slate-100 border-l-4 border-l-amber-300 rounded-xl px-4 py-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                  {(item.userId?.fullName ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.userId?.fullName ?? "—"}</p>
                    {item.gender && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${GENDER_CHIP[item.gender] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {item.gender}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{item.userId?.email ?? "—"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {[
                      item.universityName,
                      item.arrivalTime  && `Arrives ${new Date(item.arrivalTime).toLocaleDateString()}`,
                      item.departureTime && `Departs ${new Date(item.departureTime).toLocaleDateString()}`,
                    ].filter(Boolean).join(" · ")}
                  </p>
                  {item.additionalDetails && (
                    <p className="text-xs text-slate-400 truncate">{item.additionalDetails}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
