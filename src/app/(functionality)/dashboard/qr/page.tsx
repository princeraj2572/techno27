export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import AppShell from "@/components/app-shell";
import QRDisplay from "./QRDisplay";

export default async function DashboardQRPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) redirect("/dashboard");

  const userId = String(user._id ?? "");

  return (
    <AppShell title="My QR" crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "My QR" }]} back={{ href: "/dashboard", label: "Back to dashboard" }} sub="Show this at the event check-in counter" width="max-w-sm">
      <QRDisplay
        userId={userId}
        fullName={user.fullName}
        email={user.email}
        role={user.role}
        identifier={user.enrollmentNumber ?? user.participantId ?? ""}
      />
    </AppShell>
  );
}
