export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, CalendarDays, CreditCard, Hotel,
  CheckSquare, UsersRound, ShieldCheck, BarChart2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Participants", href: "/admin/participants", icon: Users, desc: "View and search all registrants" },
  { label: "Events", href: "/admin/events", icon: CalendarDays, desc: "Monitor events and registrations" },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, desc: "Review payment submissions" },
  { label: "Accommodation", href: "/admin/accommodation", icon: Hotel, desc: "Accommodation applications" },
  { label: "Check-In", href: "/admin/checkin", icon: CheckSquare, desc: "Manage event check-in" },
  { label: "Teams", href: "/admin/teams", icon: UsersRound, desc: "All registered teams" },
  { label: "Event Managers", href: "/admin/event-managers", icon: ShieldCheck, desc: "Manage event manager access" },
  { label: "Reports", href: "/admin/reports", icon: BarChart2, desc: "Export data and reports" },
];

const STATUS_DOT: Record<string, string> = {
  REGISTRATION_OPEN:   "bg-green-400",
  EVENT_LIVE:          "bg-primary",
  COMPLETED:           "bg-muted-foreground",
  CANCELLED:           "bg-destructive",
  REGISTRATION_CLOSED: "bg-amber-400",
};

const STATUS_LABEL: Record<string, string> = {
  REGISTRATION_OPEN:   "Open",
  REGISTRATION_CLOSED: "Closed",
  TEMPORARILY_CLOSED:  "Paused",
  EVENT_LIVE:          "Live",
  COMPLETED:           "Completed",
  CANCELLED:           "Cancelled",
  DRAFT:               "Draft",
  UPCOMING:            "Upcoming",
};

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">Management</h1>
            <Badge variant="outline" className="text-xs">{user.role.replace(/_/g, " ")}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Welcome back, {user.fullName}</p>
        </div>
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

      {/* Events overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Events Overview</CardTitle>
            <Link href="/admin/events" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {(events as unknown[]).length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No events available.</p>
          ) : (
            <div className="divide-y divide-border">
              {(events as Array<{ _id: string; name: string; status: string }>).map((event) => (
                <div key={event._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[event.status] ?? "bg-muted-foreground"}`}
                    />
                    <span className="font-medium text-sm truncate">{event.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-muted-foreground">
                      {STATUS_LABEL[event.status] ?? event.status.replace(/_/g, " ")}
                    </span>
                    <Link
                      href={`/admin/events/${event._id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
