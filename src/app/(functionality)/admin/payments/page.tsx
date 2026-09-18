export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getPaymentData } from "@/actions/payment-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const paymentData = await getPaymentData().catch(() => []);
  const payments = paymentData ?? [];

  const totalPayable = payments.reduce((s, p) => s + (p?.payableAmount ?? 0), 0);
  const totalCleared = payments.filter((p) => p?.payClearance).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-xs text-muted-foreground">Total Payable Participants</div>
            <div className="text-2xl font-bold mt-1">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-xs text-muted-foreground">Total Amount Expected</div>
            <div className="text-2xl font-bold mt-1">₹{totalPayable}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-xs text-muted-foreground">Payment Cleared</div>
            <div className="text-2xl font-bold mt-1 text-green-500">{totalCleared} / {payments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All External Participant Payments</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No payment data.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Payable</TableHead>
                  <TableHead>Acknowledged</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) =>
                  p ? (
                    <TableRow key={p.email}>
                      <TableCell className="font-medium">{p.fullName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{p.eventNames || "—"}</TableCell>
                      <TableCell>₹{p.payableAmount}</TableCell>
                      <TableCell>₹{p.acknowledgedAmount}</TableCell>
                      <TableCell>
                        <Badge variant={p.payClearance ? "secondary" : "outline"} className="text-xs">
                          {p.payClearance ? "Cleared" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ) : null
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
