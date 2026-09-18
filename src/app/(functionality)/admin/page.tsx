export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user.fullName}</p>
        </div>
        <Badge variant="outline">{user.role.replace(/_/g, " ")}</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Participants", href: "/admin/participants", icon: "👥" },
          { label: "Events", href: "/admin/events", icon: "🎪" },
          { label: "Payments", href: "/admin/payments", icon: "💳" },
          { label: "Accommodation", href: "/admin/accommodation", icon: "🏨" },
          { label: "Check-In", href: "/admin/checkin", icon: "✅" },
          { label: "Teams", href: "/admin/teams", icon: "🤝" },
          { label: "Event Managers", href: "/admin/event-managers", icon: "🛡️" },
          { label: "Reports", href: "/admin/reports", icon: "📊" },
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

      <Card>
        <CardHeader>
          <CardTitle>Events Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events available.</p>
            ) : (
              events.map((event: { _id: string; name: string; status: string }) => (
                <div key={event._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium text-sm">{event.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {event.status.replace(/_/g, " ")}
                    </Badge>
                    <Link href={`/admin/events/${event._id}`} className="text-xs text-primary hover:underline">
                      View →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
