export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { ChevronLeft, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getManagementUsers() {
  await connectToDatabase();
  const users = await User.find({ role: { $in: ["MANAGEMENT_ADMIN", "EVENT_MANAGER"] } })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(users));
}

const ROLE_CHIP: Record<string, string> = {
  MANAGEMENT_ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  EVENT_MANAGER:    "bg-blue-50   text-blue-700   border-blue-200",
};

export default async function DevManagementPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const mgmtUsers = await getManagementUsers().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">{mgmtUsers.length} account(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" asChild>
              <Link href="/dev/management/create">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create account
              </Link>
            </Button>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {mgmtUsers.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No management accounts yet</p>
              <Link href="/dev/management/create" className="text-xs text-indigo-600 hover:underline mt-1 block">
                Create the first one →
              </Link>
            </div>
          ) : (
            mgmtUsers.map((u: {
              _id: string; fullName: string; email: string; role: string;
              mobileNumber?: string; createdAt?: string;
            }) => (
              <div key={u._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
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
                  {u.mobileNumber && <p className="text-xs text-slate-400">{u.mobileNumber}</p>}
                  <p className="text-xs text-slate-300">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
                <Link href={`/dev/users/${u._id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium shrink-0">
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
