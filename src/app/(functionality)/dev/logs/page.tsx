export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/auditLog.model";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

async function getLogsPage(page: number, limit: number) {
  await connectToDatabase();
  const [logs, total] = await Promise.all([
    AuditLog.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("performedBy", "fullName email")
      .lean(),
    AuditLog.countDocuments(),
  ]);
  return { logs: JSON.parse(JSON.stringify(logs)), total };
}

export default async function DevLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 50;

  const { logs, total } = await getLogsPage(page, limit).catch(() => ({ logs: [], total: 0 }));
  const totalPages = Math.ceil(total / limit);

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
            <p className="text-xs text-slate-400 mt-0.5">{total} entries</p>
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                {(page - 1) * limit + 1}â€“{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/dev/logs?page=${page - 1}`}>â† Prev</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>â† Prev</Button>
                )}
                <span className="text-xs text-slate-400">{page} / {totalPages}</span>
                {page < totalPages ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/dev/logs?page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
