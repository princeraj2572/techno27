export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAllAccommodationsWithUsers } from "@/actions/accommodation-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminAccommodationPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const accommodations = await getAllAccommodationsWithUsers().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Accommodation</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accommodation Submissions ({accommodations.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {accommodations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No accommodation requests yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Additional Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accommodations.map((item) => (
                  <TableRow key={String((item.user as { _id: unknown })._id)}>
                    <TableCell className="font-medium">{(item.user as { fullName: string }).fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{(item.user as { email: string }).email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.accommodation.gender}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.accommodation.universityName}</TableCell>
                    <TableCell className="text-xs">
                      {item.accommodation.arrivalTime
                        ? new Date(item.accommodation.arrivalTime).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.accommodation.departureTime
                        ? new Date(item.accommodation.departureTime).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm max-w-[160px] truncate">
                      {item.accommodation.additionalDetails ?? "—"}
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
