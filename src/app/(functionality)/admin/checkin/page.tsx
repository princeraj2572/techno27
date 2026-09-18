export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminCheckinPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);
  const activeEvents = events.filter((e: { status: string }) =>
    ["REGISTRATION_OPEN", "EVENT_LIVE"].includes(e.status)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Check-In</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Events — Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          {activeEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No events are currently open or live.
            </p>
          ) : (
            <div className="space-y-3">
              {activeEvents.map((e: { _id: string; name: string; status: string }) => (
                <div
                  key={e._id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <Badge variant={e.status === "EVENT_LIVE" ? "default" : "secondary"} className="text-xs mt-1">
                      {e.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <Link
                    href={`/admin/events/${e._id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Participants →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6 text-center text-muted-foreground text-sm">
          <p className="font-medium">QR-based check-in coming soon.</p>
          <p className="text-xs mt-1">
            Event managers will scan participant QR codes at the venue. Profile photo is shown for identity verification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
