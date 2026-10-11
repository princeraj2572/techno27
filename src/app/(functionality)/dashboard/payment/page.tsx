export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getPaymentSummaryForUser } from "@/actions/payment-actions";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import PaymentClient from "./PaymentClient";

export default async function DashboardPaymentPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "EXTERNAL_USER") redirect("/dashboard");

  const summary = await getPaymentSummaryForUser(user.email).catch(() => null);

  return (
    <AppShell
      title="Payment" crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Payment" }]} back={{ href: "/dashboard", label: "Back to dashboard" }}
      sub="Techno-aiMBiAtion 2027 · External participant"
      icon={<CreditCard className="h-6 w-6" />}
    >
      {summary === null || summary.eventRows.length === 0 ? (
        <div className="border-2 border-dashed border-[#f5edd8]/40 py-14 text-center">
          <CreditCard className="mx-auto mb-3 h-9 w-9 text-[#f5c928]" />
          <p className="text-xl font-bold uppercase text-[#f5edd8]">No events registered yet</p>
          <p className="mt-1 text-sm text-[#f5edd8]/70">Register for events first to see your payment details.</p>
          <Link href="/events-selection" className="mt-2 block text-sm font-bold uppercase tracking-wider text-[#f5c928] hover:underline">
            Browse events →
          </Link>
        </div>
      ) : (
        <PaymentClient userEmail={user.email} summary={summary} />
      )}
    </AppShell>
  );
}
