export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAccommodationDetailsAction } from "@/actions/accommodation-actions";
import { ChevronLeft, Hotel } from "lucide-react";
import Link from "next/link";
import AccommodationClient from "./AccommodationClient";

export default async function AccommodationPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) redirect("/dashboard");

  if (user.role !== "EXTERNAL_USER") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors mb-6">
            <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <div className="rounded-2xl border-2 border-dashed border-slate-100 py-16 text-center">
            <Hotel className="h-10 w-10 mx-auto mb-4 text-slate-200" />
            <p className="text-sm font-semibold text-slate-600">Accommodation is for external participants only</p>
            <p className="text-xs text-slate-400 mt-1">OPJU students stay on campus.</p>
          </div>
        </div>
      </div>
    );
  }

  const existing = await getAccommodationDetailsAction().catch(() => null);
  const u = user as unknown as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="animate-slide-up" style={{ animationDelay: "0s" }}>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors mb-3">
            <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Accommodation</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {existing ? "Your accommodation request is submitted." : "Submit your accommodation request for Technorollix 2027."}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
              <Hotel className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-xs font-semibold text-violet-800 mb-1">Accommodation guidelines</p>
          <ul className="text-xs text-violet-700 space-y-1 list-disc list-inside">
            <li>Accommodation is provided free of charge for registered external participants.</li>
            <li>Separate dormitories for male and female participants.</li>
            <li>Meals included during the fest days (27–28 Feb 2027).</li>
            <li>Bring your own bedding / sleeping bag if possible.</li>
          </ul>
        </div>

        {/* Form / summary */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <AccommodationClient
            initial={existing ? JSON.parse(JSON.stringify(existing)) : null}
            userUniversity={(u.collegeName as string) ?? ""}
            userGender={(u.gender as string) ?? ""}
            userPhone={(u.mobileNumber as string) ?? ""}
          />
        </div>

      </div>
    </div>
  );
}
