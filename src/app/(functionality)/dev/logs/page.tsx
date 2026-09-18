export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/auditLog.model";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

async function getRecentLogs(limit = 100) {
  await connectToDatabase();
  const logs = await AuditLog.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("performedBy", "fullName email")
    .lean();
  return JSON.parse(JSON.stringify(logs));
}

export default async function DevLogsPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const logs = await getRecentLogs().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
            <p className="text-xs text-slate-400 mt-0.5">{logs.length} recent entries</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {logs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <FileText className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No audit logs yet</p>
              <p className="text-xs text-slate-400 mt-1">Actions by admins will appear here</p>
            </div>
          ) : (
            logs.map((log: {
              _id: string;
              action: string;
              performedBy?: { fullName?: string; email?: string } | null;
              targetType?: string;
              reason?: string;
              timestamp?: string;
            }) => (
              <div key={log._id} className="bg-white border border-slate-100 border-l-4 border-l-indigo-200 rounded-xl px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {log.action}
                      </code>
                      {log.targetType && (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                          {log.targetType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      {log.performedBy?.fullName ?? log.performedBy?.email ?? "System"}
                    </p>
                    {log.reason && <p className="text-xs text-slate-400 mt-0.5 truncate">{log.reason}</p>}
                  </div>
                  <p className="text-xs text-slate-300 shrink-0 tabular-nums">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
