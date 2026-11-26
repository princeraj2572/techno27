export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getPaymentSummaryForUser } from "@/features/payments/payment-actions";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/app-shell";
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
        <div className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 bg-white/60 py-14 text-center">
          <CreditCard className="mx-auto mb-3 h-9 w-9 text-[#ef5a1c]" />
          <p className="text-xl font-bold uppercase text-[#1c1812]">No events registered yet</p>
          <p className="mt-1 text-sm text-black/60">Register for events first to see your payment details.</p>
          <Link href="/events-selection" className="mt-2 block text-sm font-bold uppercase tracking-wider text-[#0e5b57] hover:underline">
            Browse events →
          </Link>
        </div>
      ) : (
        <PaymentClient userEmail={user.email} summary={summary} />
      )}
    </AppShell>
  );
}
