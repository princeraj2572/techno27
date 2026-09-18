export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Users, Search } from "lucide-react";
import Link from "next/link";

async function getParticipants(q?: string) {
  await connectToDatabase();
  const filter: Record<string, unknown> = { role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } };
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { fullName: regex }, { email: regex }, { mobileNumber: regex },
      { enrollmentNumber: regex }, { participantId: regex }, { collegeName: regex },
    ];
  }
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const { q } = await searchParams;
  const participants = await getParticipants(q).catch(() => []);

  const internalCount = participants.filter((p: { role: string }) => p.role === "INTERNAL_USER").length;
  const externalCount = participants.filter((p: { role: string }) => p.role === "EXTERNAL_USER").length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Participants</h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stats */}
        {!q && (
          <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.04s" }}>
            <div className="bg-indigo-600 rounded-2xl p-4">
              <p className="text-xs font-medium text-indigo-200 mb-3">Total</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">{participants.length}</p>
              <p className="text-xs text-indigo-300 mt-2">participants</p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4">
              <p className="text-xs font-medium text-indigo-400 mb-3">Internal</p>
              <p className="text-4xl font-bold text-indigo-900 tabular-nums leading-none">{internalCount}</p>
              <p className="text-xs text-indigo-400 mt-2">OPJU students</p>
            </div>
            <div className={`rounded-2xl p-4 ${externalCount > 0 ? "bg-amber-500" : "bg-slate-100"}`}>
              <p className={`text-xs font-medium mb-3 ${externalCount > 0 ? "text-amber-100" : "text-slate-400"}`}>External</p>
              <p className={`text-4xl font-bold tabular-nums leading-none ${externalCount > 0 ? "text-white" : "text-slate-700"}`}>{externalCount}</p>
              <p className={`text-xs mt-2 ${externalCount > 0 ? "text-amber-200" : "text-slate-400"}`}>outside colleges</p>
            </div>
          </div>
        )}

        {/* Search */}
        <form method="GET" className="flex gap-2 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search by name, email, phone, enrollment number…"
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
          {q && (
            <Button variant="outline" asChild>
              <Link href="/admin/participants">Clear</Link>
            </Button>
          )}
        </form>

        {/* List */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs font-medium text-slate-400">
            {q ? `Results for "${q}"` : "All participants"} · {participants.length}
          </p>

          {participants.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No participants found</p>
            </div>
          ) : (
            participants.map((p: {
              _id: string; fullName: string; email: string; role: string;
              mobileNumber?: string; enrollmentNumber?: string; participantId?: string;
              collegeName?: string; department?: string;
            }) => (
              <div key={p._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  p.role === "INTERNAL_USER" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {p.fullName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      p.role === "INTERNAL_USER"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {p.role === "INTERNAL_USER" ? "OPJU" : "External"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{p.email}</p>
                  <p className="text-xs text-slate-400">
                    {p.collegeName ?? p.department ?? "—"}
                    {(p.enrollmentNumber ?? p.participantId) && (
                      <code className="ml-2 font-mono">{p.enrollmentNumber ?? p.participantId}</code>
                    )}
                  </p>
                </div>
                <Link href={`/admin/participants/${p._id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0">
                  View →
                </Link>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
