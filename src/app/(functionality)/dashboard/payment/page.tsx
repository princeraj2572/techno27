export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getPaymentSummaryForUser, MAX_PAYMENT } from "@/actions/payment-actions";
import { ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import PaymentClient from "./PaymentClient";

export default async function DashboardPaymentPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "EXTERNAL_USER") redirect("/dashboard");

  const summary = await getPaymentSummaryForUser(user.email).catch(() => null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment</h1>
            <p className="text-xs text-slate-400 mt-0.5">Technorollix 2027 · External participant</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {summary === null || summary.eventRows.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-100 py-14 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No events registered yet</p>
            <p className="text-xs text-slate-400 mt-1">Register for events first to see your payment details.</p>
            <Link href="/events-selection" className="text-xs text-indigo-600 hover:underline mt-2 block">
              Browse events →
            </Link>
          </div>
        ) : (
          <PaymentClient
            userEmail={user.email}
            summary={summary}
            maxPayment={MAX_PAYMENT}
          />
        )}

      </div>
    </div>
  );
}
