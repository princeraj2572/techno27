export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const REPORTS = [
  {
    title: "Event Participants",
    description: "Download a list of all participants per event with team details.",
    href: "/api/export/event-participants",
    icon: "🎪",
  },
  {
    title: "Payment Report",
    description: "All external participant payment data with acknowledgement and clearance status.",
    href: "/api/export/payments",
    icon: "💳",
  },
  {
    title: "Accommodation Report",
    description: "All accommodation requests with arrival/departure times.",
    href: "/api/export/accommodation",
    icon: "🏨",
  },
  {
    title: "All Registrations",
    description: "Full participant registration list (internal and external).",
    href: "/api/export/registrations",
    icon: "📋",
  },
];

export default async function AdminReportsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORTS.map((report) => (
          <Card key={report.title} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{report.icon}</span>
                <CardTitle className="text-base">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
              <a
                href={report.href}
                download
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Download Excel →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="py-6 text-center text-muted-foreground text-sm">
          <p>More report types coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
