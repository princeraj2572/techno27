export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

async function getManagementUsers() {
  await connectToDatabase();
  const users = await User.find({
    role: { $in: ["MANAGEMENT_ADMIN", "EVENT_MANAGER"] },
  })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(users));
}

const ROLE_COLORS: Record<string, string> = {
  MANAGEMENT_ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  EVENT_MANAGER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default async function DevManagementPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const mgmtUsers = await getManagementUsers().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Management Accounts</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/dev/management/create"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            + Create Account
          </Link>
          <Link href="/dev" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Management & Event Manager Accounts ({mgmtUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {mgmtUsers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <p>No management accounts found.</p>
              <Link href="/dev/management/create" className="text-primary hover:underline mt-2 block">
                Create the first one →
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mgmtUsers.map((u: {
                  _id: string;
                  fullName: string;
                  email: string;
                  role: string;
                  mobileNumber?: string;
                  createdAt?: string;
                }) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${ROLE_COLORS[u.role] ?? ""}`}
                      >
                        {u.role.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{u.mobileNumber ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dev/users/${u._id}`} className="text-xs text-primary hover:underline">
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
