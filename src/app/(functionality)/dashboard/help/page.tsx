export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { LifeBuoy } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import { getUser } from "@/features/users/user-actions";
import { getMyHelpQueriesAction } from "@/features/helpdesk/help-actions";
import HelpClient from "./HelpClient";

export default async function HelpDeskPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  const queries = await getMyHelpQueriesAction().catch(() => []);
  return (
    <AppShell
      title="Help desk"
      sub="Ask the organisers anything. We reply here, usually within a day."
      crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Help desk" }]}
      back={{ href: "/dashboard", label: "Back to dashboard" }}
      icon={<LifeBuoy className="h-6 w-6" />}
    >
      <HelpClient initial={queries} />
    </AppShell>
  );
}
