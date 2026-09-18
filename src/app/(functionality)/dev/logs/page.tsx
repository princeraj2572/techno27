export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/auditLog.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <Link href="/dev" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No audit logs yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Target Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log: {
                  _id: string;
                  action: string;
                  performedBy?: { fullName?: string; email?: string };
                  targetType?: string;
                  reason?: string;
                  timestamp?: string;
                }) => (
                  <TableRow key={log._id}>
                    <TableCell className="font-mono text-xs font-medium">{log.action}</TableCell>
                    <TableCell className="text-sm">
                      {log.performedBy?.fullName ?? log.performedBy?.email ?? "System"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.targetType ?? "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{log.reason ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
