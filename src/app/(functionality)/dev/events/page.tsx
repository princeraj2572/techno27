export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  REGISTRATION_OPEN: "secondary",
  EVENT_LIVE: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  DRAFT: "outline",
};

export default async function DevEventsPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const events = await getAllEventsAction().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <Link href="/dev" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
      </div>

      <Card>
        <CardContent className="pt-4">
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No events found.</p>
              <Link href="/dev/seed" className="text-primary hover:underline mt-2 block">
                Seed dummy events →
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>Internal Fee</TableHead>
                  <TableHead>External Fee</TableHead>
                  <TableHead>Prize Pool</TableHead>
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
                      <Link href={`/dev/events/${event._id}`} className="text-xs text-primary hover:underline">
                        Manage →
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
