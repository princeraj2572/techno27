export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { searchUsers } from "@/actions/user-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const ROLE_COLORS: Record<string, string> = {
  DEV_ADMIN: "text-red-400",
  MANAGEMENT_ADMIN: "text-purple-400",
  EVENT_MANAGER: "text-blue-400",
  INTERNAL_USER: "text-green-400",
  EXTERNAL_USER: "text-orange-400",
};

export default async function DevUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { q } = await searchParams;
  const users = q ? await searchUsers(q).catch(() => []) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Link href="/dev" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
      </div>

      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name, email, phone, enrollment, participantId..."
          className="flex-1 px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {q ? `Results for "${q}" (${users.length})` : "Enter a search query above"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!q ? (
            <p className="text-muted-foreground text-sm py-4">
              Search by name, email, mobile, enrollment number, or participantId.
            </p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: {
                  _id: string;
                  fullName: string;
                  email: string;
                  role: string;
                  mobileNumber?: string;
                  enrollmentNumber?: string;
                  participantId?: string;
                }) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold ${ROLE_COLORS[u.role] ?? ""}`}>
                        {u.role.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{u.mobileNumber ?? "—"}</TableCell>
                    <TableCell className="text-xs font-mono">
                      {u.participantId ?? u.enrollmentNumber ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dev/users/${u._id}`}
                        className="text-xs text-primary hover:underline"
                      >
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
