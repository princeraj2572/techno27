export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventStatsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default async function DevDashboardPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const stats = await getEventStatsAction().catch(() => ({
    totalUsers: 0,
    internalCount: 0,
    externalCount: 0,
    eventStats: [],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dev Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user.fullName}</p>
        </div>
        <Badge variant="outline" className="text-xs">DEV_ADMIN</Badge>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Internal (OPJU)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{stats.internalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">External Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{stats.externalCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Manage Events", href: "/dev/events", icon: "🎪" },
          { label: "All Users", href: "/dev/users", icon: "👥" },
          { label: "Management", href: "/dev/management", icon: "🛡️" },
          { label: "Seed Events", href: "/dev/seed", icon: "🌱" },
          { label: "Payments", href: "/dev/payments", icon: "💳" },
          { label: "Accommodation", href: "/dev/accommodation", icon: "🏨" },
          { label: "Audit Logs", href: "/dev/logs", icon: "📋" },
          { label: "System", href: "/dev/system", icon: "⚙️" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm font-medium">{item.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Event-wise registration table */}
      <Card>
        <CardHeader>
          <CardTitle>Event Registration Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.eventStats.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No events found.{" "}
              <Link href="/dev/seed" className="text-primary hover:underline">Seed events →</Link>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Fill %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.eventStats.map((ev: {
                  eventId: string;
                  name: string;
                  registered: number;
                  limit: number;
                  status: string;
                }) => {
                  const pct = ev.limit > 0 ? Math.round((ev.registered / ev.limit) * 100) : 0;
                  return (
                    <TableRow key={ev.eventId}>
                      <TableCell className="font-medium">{ev.name}</TableCell>
                      <TableCell>{ev.registered}</TableCell>
                      <TableCell>{ev.limit || "∞"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ev.status === "EVENT_LIVE" ? "default" :
                          ev.status === "REGISTRATION_OPEN" ? "secondary" :
                          "outline"
                        }>
                          {ev.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dev/events/${ev.eventId}`}
                          className="text-xs text-primary hover:underline"
                        >
                          Manage →
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
