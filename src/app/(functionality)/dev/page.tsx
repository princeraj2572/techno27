export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventStatsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CalendarDays, Users, Shield, Sprout,
  CreditCard, Hotel, FileText, Database,
  ArrowRight, TrendingUp,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Events", href: "/dev/events", icon: CalendarDays, desc: "Full event control" },
  { label: "Users", href: "/dev/users", icon: Users, desc: "All user accounts" },
  { label: "Management", href: "/dev/management", icon: Shield, desc: "Management accounts" },
  { label: "Seed Events", href: "/dev/seed", icon: Sprout, desc: "Insert test data" },
  { label: "Payments", href: "/dev/payments", icon: CreditCard, desc: "All transactions" },
  { label: "Accommodation", href: "/dev/accommodation", icon: Hotel, desc: "Accommodation data" },
  { label: "Audit Logs", href: "/dev/logs", icon: FileText, desc: "System activity" },
  { label: "System", href: "/dev/system", icon: Database, desc: "DB health & stats" },
];

const STATUS_DOT: Record<string, string> = {
  REGISTRATION_OPEN:   "bg-green-400",
  EVENT_LIVE:          "bg-primary",
  COMPLETED:           "bg-muted-foreground/50",
  CANCELLED:           "bg-destructive",
  REGISTRATION_CLOSED: "bg-amber-400",
  TEMPORARILY_CLOSED:  "bg-amber-500",
};

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

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dev Control Center</h1>
            <Badge variant="outline" className="text-xs font-mono">DEV_ADMIN</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Welcome back, {user.fullName}</p>
        </div>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Users</span>
            </div>
            <div className="text-3xl font-bold tabular-nums">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-0.5">all registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary/70" />
              <span className="text-xs text-muted-foreground">Internal (OPJU)</span>
            </div>
            <div className="text-3xl font-bold tabular-nums text-primary">{stats.internalCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">@opju.ac.in accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-amber-400/70" />
              <span className="text-xs text-muted-foreground">External</span>
            </div>
            <div className="text-3xl font-bold tabular-nums text-amber-400">{stats.externalCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">outside participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer group">
                <CardContent className="pt-4 pb-4 px-4">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug hidden sm:block">
                    {item.desc}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Event registration table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Event Registration</CardTitle>
            <Link href="/dev/events" className="text-xs text-primary hover:underline flex items-center gap-1">
              Manage events <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {stats.eventStats.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">No events found.</p>
              <Link href="/dev/seed" className="text-sm text-primary hover:underline mt-1 block">
                Seed events to get started →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Registered</TableHead>
                    <TableHead className="text-right">Limit</TableHead>
                    <TableHead>Fill</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20" />
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
                        <TableCell className="text-right tabular-nums">{ev.registered}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {ev.limit || "∞"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[ev.status] ?? "bg-muted-foreground"}`} />
                            {ev.status.replace(/_/g, " ")}
                          </span>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
