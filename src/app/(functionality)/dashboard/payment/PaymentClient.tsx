"use client";
import { useState } from "react";
import { addTransactionIdAction } from "@/actions/payment-actions";
import type { IPaymentSummary } from "@/actions/payment-actions";
import { CheckCircle2, Clock, ExternalLink, X, QrCode, ChevronDown, Users, User } from "lucide-react";

// Update this URL when the 2027 Easebuzz payment link is set up
const EASEBUZZ_URL = "https://smartpay.easebuzz.in/125084/Techno-aiMBiAtion-2026";

interface Props {
  userEmail: string;
  summary: IPaymentSummary;
}

export default function PaymentClient({ userEmail, summary: initial }: Props) {
  const [payableAmount]       = useState(initial.payableAmount);
  const acknowledgedAmount = initial.acknowledgedAmount;
  const payClearance       = initial.payClearance;
  const [transactions, setTransactions]             = useState(initial.transactions);
  const [showModal, setShowModal]                   = useState(false);
  const [showFeeGuide, setShowFeeGuide]             = useState(true);
  const [txInput, setTxInput]                       = useState("");
  const [submitting, setSubmitting]                 = useState(false);
  const [error, setError]                           = useState("");
  const [success, setSuccess]                       = useState("");

  const remaining = Math.max(payableAmount - acknowledgedAmount, 0);
  const isCapped = (initial.individualCount + initial.teamCount) >= 4;

  const handleSubmit = async () => {
    if (!txInput.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await addTransactionIdAction(txInput.trim(), userEmail, remaining);
      setTransactions((prev) => [
        {
          transactionId: txInput.trim(),
          currentPayAmount: remaining,
          amountAtAdmin: 0,
          acknowledgementByAdmin: false,
          clearanceApproval: false,
          createdAt: new Date(),
        } as typeof prev[0],
        ...prev,
      ]);
      setSuccess("Transaction ID submitted. Approval is pending from admin.");
      setTxInput("");
      setShowModal(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* â”€â”€ 1. STATUS HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className={`rounded-2xl px-5 py-5 animate-slide-up ${payClearance ? "bg-emerald-500" : "bg-violet-600"}`}
        style={{ animationDelay: "0.04s" }}
      >
        {payClearance ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-400/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-100">Payment status</p>
              <p className="text-lg font-bold text-white leading-tight">Fully cleared â€” you&apos;re all set!</p>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-violet-200 mb-0.5">Amount due</p>
              <p className="text-5xl font-bold text-white tabular-nums leading-none">â‚¹{remaining}</p>
              <p className="text-xs text-violet-300 mt-2">
                Total: â‚¹{payableAmount}
                {isCapped && <span className="ml-1.5 bg-emerald-500/30 text-emerald-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">cap applied</span>}
              </p>
            </div>
            {acknowledgedAmount > 0 && (
              <div className="text-right bg-violet-500/30 rounded-xl px-3 py-2">
                <p className="text-[10px] text-violet-300 font-medium">Received</p>
                <p className="text-xl font-bold text-white tabular-nums">â‚¹{acknowledgedAmount}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* â”€â”€ 2. REGISTERED EVENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.07s" }}>
        <div className="px-5 pt-4 pb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Your registrations</p>
        </div>
        <div className="divide-y divide-slate-50">
          {initial.eventRows.map((ev) => (
            <div key={ev.eventId} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  ev.isIndividual ? "bg-violet-50" : "bg-teal-50"
                }`}>
                  {ev.isIndividual
                    ? <User className="h-3.5 w-3.5 text-violet-500" />
                    : <Users className="h-3.5 w-3.5 text-teal-500" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{ev.name}</p>
                  <span className={`text-[10px] font-semibold ${ev.isIndividual ? "text-violet-500" : "text-teal-600"}`}>
                    {ev.isIndividual ? "Individual" : "Team"}
                  </span>
                </div>
              </div>
              <span className={`text-sm font-bold shrink-0 ${ev.isIndividual ? "text-violet-700" : "text-teal-700"}`}>
                â‚¹{ev.fee}
              </span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {isCapped ? (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Bundle cap applied (4+ events)
            </p>
          ) : (
            <p className="text-xs text-slate-400">{initial.eventRows.length} event{initial.eventRows.length !== 1 ? "s" : ""} registered</p>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-base font-bold text-violet-600 tabular-nums">â‚¹{payableAmount}</span>
          </div>
        </div>
      </div>

      {/* â”€â”€ 3. FEE GUIDE (collapsible) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.09s" }}>
        <button
          type="button"
          onClick={() => setShowFeeGuide((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-xs font-semibold text-fuchsia-700">Registration fee structure</span>
          <ChevronDown className={`h-4 w-4 text-fuchsia-400 transition-transform ${showFeeGuide ? "rotate-180" : ""}`} />
        </button>
        {showFeeGuide && (
          <div className="px-4 pb-4 space-y-3 border-t border-fuchsia-200">
            <div className="grid grid-cols-2 gap-2 pt-3">
              {/* Individual */}
              <div className="bg-white rounded-xl px-3 py-2.5 border border-fuchsia-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <User className="h-3 w-3 text-fuchsia-500" />
                  <p className="text-[10px] font-bold text-fuchsia-700 uppercase tracking-wide">Individual</p>
                </div>
                <div className="space-y-1">
                  {[["1 event", "â‚¹99"], ["2â€“3 events", "â‚¹199"], ["4â€“7 events", "â‚¹499"]].map(([label, price]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-800">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Team */}
              <div className="bg-white rounded-xl px-3 py-2.5 border border-fuchsia-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="h-3 w-3 text-fuchsia-500" />
                  <p className="text-[10px] font-bold text-fuchsia-700 uppercase tracking-wide">Team</p>
                </div>
                <div className="space-y-1">
                  {[["Per event", "â‚¹299"], ["4â€“7 events", "â‚¹499"]].map(([label, price]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-800">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ul className="text-xs text-fuchsia-700 space-y-0.5 pl-1">
              <li>â€¢ Only team leaders pay the registration fee.</li>
              <li>â€¢ Events with team size of 1 count as individual.</li>
              <li>â€¢ â‚¹499 is the maximum cap across all events.</li>
            </ul>
          </div>
        )}
      </div>

      {/* â”€â”€ 4. HOW TO PAY STEPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 animate-slide-up" style={{ animationDelay: "0.11s" }}>
        <p className="text-xs font-bold text-amber-800 mb-3">How to pay</p>
        <div className="space-y-2.5">
          {[
            { n: "1", text: "Click Pay below â€” opens the Easebuzz payment page." },
            { n: "2", text: <>Use <span className="font-semibold text-amber-900">{userEmail}</span> on the payment page.</> },
            { n: "3", text: "After payment, Easebuzz emails you a transaction ID." },
            { n: "4", text: "Come back here, enter the transaction ID, and submit." },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {n}
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ 5. PAY CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!payClearance && (
        <div className="animate-slide-up" style={{ animationDelay: "0.13s" }}>
          <button
            onClick={() => setShowModal(true)}
            className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-sm font-bold tracking-wide transition-all shadow-sm shadow-indigo-200"
          >
            Pay â‚¹{remaining} via Easebuzz
          </button>
        </div>
      )}

      {/* â”€â”€ 6. SUCCESS TOAST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          {success}
        </div>
      )}

      {/* â”€â”€ 7. TRANSACTION HISTORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {transactions.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-xs font-semibold text-slate-400 mb-2 px-1">Transaction history</p>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.transactionId}
                className={`bg-white border border-slate-100 border-l-4 rounded-xl px-4 py-3 ${
                  tx.clearanceApproval
                    ? "border-l-emerald-400"
                    : tx.acknowledgementByAdmin
                    ? "border-l-indigo-400"
                    : "border-l-amber-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-slate-600 truncate">{tx.transactionId}</code>
                  {tx.clearanceApproval ? (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> Cleared
                    </span>
                  ) : tx.acknowledgementByAdmin ? (
                    <span className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> â‚¹{tx.amountAtAdmin} received
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  â‚¹{tx.currentPayAmount} submitted Â· {new Date(tx.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€ 8. PAYMENT MODAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-slide-up">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">Complete payment</p>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Amount pill */}
              <div className="bg-violet-600 rounded-2xl px-4 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-violet-200 font-medium">Pay now</p>
                  <p className="text-3xl font-bold text-white tabular-nums">â‚¹{remaining}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-violet-300">Use this email</p>
                  <p className="text-xs text-indigo-100 font-medium max-w-[140px] truncate">{userEmail}</p>
                </div>
              </div>

              {/* QR hint */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <QrCode className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800">Scan QR at venue or pay online</p>
                  <p className="text-[10px] text-slate-400">Click the button below to open Easebuzz</p>
                </div>
              </div>

              <a
                href={EASEBUZZ_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
              >
                Open Easebuzz <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-[10px] text-slate-400 font-medium">then enter your transaction ID</span></div>
              </div>

              <input
                type="text"
                value={txInput}
                onChange={(e) => setTxInput(e.target.value)}
                placeholder="Paste transaction ID here"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 font-mono transition"
              />

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!txInput.trim() || submitting}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {submitting ? "Submittingâ€¦" : "Submit transaction ID"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
