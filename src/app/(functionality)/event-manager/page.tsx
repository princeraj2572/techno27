export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function EventManagerPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your assigned events</p>
        </div>
        <Badge variant="outline">{user.role.replace(/_/g, " ")}</Badge>
      </div>

      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <div className="text-4xl mb-4">🎪</div>
          <p className="font-medium">Your assigned events will appear here.</p>
          <p className="text-sm mt-2">
            Contact a{" "}
            <Link href="/admin" className="text-primary hover:underline">
              Management Admin
            </Link>{" "}
            to get events assigned to your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
