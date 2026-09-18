export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { ManagementAssignment } from "@/models/managementAssignment.model";
import { Event } from "@/models/event.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

async function getEventManagersWithAssignments() {
  await connectToDatabase();
  const managers = await User.find({ role: "EVENT_MANAGER" }).lean();
  const assignments = await ManagementAssignment.find({ isActive: true }).lean();
  const eventIds = [...new Set(assignments.flatMap((a: { eventIds: unknown[] }) => a.eventIds.map(String)))];
  const events = await Event.find({ _id: { $in: eventIds } }).select("name").lean();
  const eventMap = Object.fromEntries(events.map((e: { _id: unknown; name: string }) => [String(e._id), e.name]));

  return JSON.parse(JSON.stringify(managers.map((m: { _id: unknown }) => ({
    ...m,
    assignments: assignments.filter((a: { userId: unknown }) => String(a.userId) === String(m._id)).map(
      (a: { eventIds: unknown[] }) => ({
        ...a,
        eventNames: a.eventIds.map((id) => eventMap[String(id)] ?? "Unknown"),
      })
    ),
  }))));
}

export default async function AdminEventManagersPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const managers = await getEventManagersWithAssignments().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Managers</h1>
        <div className="flex items-center gap-3">
          {user.role === "DEV_ADMIN" && (
            <Link
              href="/dev/management/create"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              + Create Account
            </Link>
          )}
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Manager Accounts ({managers.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {managers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <p>No event manager accounts yet.</p>
              {user.role === "DEV_ADMIN" && (
                <Link href="/dev/management/create" className="text-primary hover:underline mt-2 block">
                  Create the first one →
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Events</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((m: {
                  _id: string;
                  fullName: string;
                  email: string;
                  assignments: { eventNames: string[]; permissions: string[] }[];
                }) => {
                  const activeAssignment = m.assignments[0];
                  return (
                    <TableRow key={m._id}>
                      <TableCell className="font-medium">{m.fullName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                      <TableCell className="text-sm">
                        {activeAssignment
                          ? activeAssignment.eventNames.join(", ") || "—"
                          : <span className="text-muted-foreground">Not assigned</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={activeAssignment ? "secondary" : "outline"} className="text-xs">
                          {activeAssignment ? "Active" : "Unassigned"}
                        </Badge>
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
