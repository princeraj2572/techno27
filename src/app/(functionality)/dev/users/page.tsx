export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { searchUsers } from "@/actions/user-actions";
import { ChevronLeft, Users, Search } from "lucide-react";
import Link from "next/link";

const ROLE_CHIP: Record<string, string> = {
  DEV_ADMIN:        "bg-red-50    text-red-700    border-red-200",
  MANAGEMENT_ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  EVENT_MANAGER:    "bg-blue-50   text-blue-700   border-blue-200",
  INTERNAL_USER:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  EXTERNAL_USER:    "bg-amber-50  text-amber-700  border-amber-200",
};

export default async function DevUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { q } = await searchParams;
  const users = q ? await searchUsers(q).catch(() => []) : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
            <p className="text-xs text-slate-400 mt-0.5">Search all registered accounts</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Search */}
        <form method="GET" className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search by name, email, mobile, enrollment, participantId..."
                className="w-full pl-9 pr-3 h-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-4 h-10 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {!q ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Search className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">Enter a query to search users</p>
              <p className="text-xs text-slate-400 mt-1">by name, email, mobile, enrollment or participant ID</p>
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <p className="text-sm font-medium text-slate-500">No users found for &ldquo;{q}&rdquo;</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400">{users.length} result(s) for &ldquo;{q}&rdquo;</p>
              {users.map((u: {
                _id: string; fullName: string; email: string; role: string;
                mobileNumber?: string; enrollmentNumber?: string; participantId?: string;
              }) => (
                <div key={u._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    u.role === "EXTERNAL_USER" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {u.fullName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{u.fullName}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${ROLE_CHIP[u.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {u.role.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {(u.enrollmentNumber ?? u.participantId) && (
                      <code className="text-xs font-mono text-slate-400 block">{u.enrollmentNumber ?? u.participantId}</code>
                    )}
                    {u.mobileNumber && <p className="text-xs text-slate-400">{u.mobileNumber}</p>}
                  </div>
                  <Link href={`/dev/users/${u._id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0">
                    View →
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
