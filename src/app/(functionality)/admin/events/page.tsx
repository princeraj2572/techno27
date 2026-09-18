export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  REGISTRATION_OPEN: "secondary",
  EVENT_LIVE: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  DRAFT: "outline",
};

export default async function AdminEventsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      {user.role === "DEV_ADMIN" && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded px-3 py-2">
          Registration controls are available on each event&apos;s page in{" "}
          <Link href="/dev/events" className="text-primary hover:underline">Dev → Events</Link>.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No events found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>Internal Fee</TableHead>
                  <TableHead>External Fee</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event: {
                  _id: string;
                  name: string;
                  status: string;
                  teamSize?: number;
                  internalFee?: number;
                  externalFee?: number;
                  prizeMoney?: number;
                }) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[event.status] ?? "outline"}>
                        {event.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.teamSize ?? 1}</TableCell>
                    <TableCell>₹{event.internalFee ?? 0}</TableCell>
                    <TableCell>₹{event.externalFee ?? 0}</TableCell>
                    <TableCell>{event.prizeMoney ? `₹${event.prizeMoney}` : "—"}</TableCell>
                    <TableCell>
                      <Link href={`/admin/events/${event._id}`} className="text-xs text-primary hover:underline">
                        View →
                      </Link>
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
