"use client";
import { useState } from "react";
import { addTransactionIdAction } from "@/actions/payment-actions";
import type { IPaymentSummary } from "@/actions/payment-actions";
import { CheckCircle2, Clock, ExternalLink, QrCode, X } from "lucide-react";

// Update this URL when the 2027 Easebuzz payment link is set up
const EASEBUZZ_URL = "https://smartpay.easebuzz.in/125084/Technorollix-2026";

interface Props {
  userEmail: string;
  summary: IPaymentSummary;
  maxPayment: number;
}

export default function PaymentClient({ userEmail, summary: initial, maxPayment }: Props) {
  const [payableAmount]       = useState(initial.payableAmount);
  const [acknowledgedAmount, setAcknowledgedAmount] = useState(initial.acknowledgedAmount);
  const [payClearance, setPayClearance]             = useState(initial.payClearance);
  const [transactions, setTransactions]             = useState(initial.transactions);
  const [showModal, setShowModal]                   = useState(false);
  const [txInput, setTxInput]                       = useState("");
  const [submitting, setSubmitting]                 = useState(false);
  const [error, setError]                           = useState("");
  const [success, setSuccess]                       = useState("");

  const remaining = Math.max(payableAmount - acknowledgedAmount, 0);

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
    <div className="space-y-5">

      {/* Status card */}
      <div className={`rounded-2xl px-5 py-5 animate-slide-up ${payClearance ? "bg-emerald-500" : "bg-indigo-600"}`} style={{ animationDelay: "0.05s" }}>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-xs font-medium mb-1 ${payClearance ? "text-emerald-100" : "text-indigo-200"}`}>
              {payClearance ? "Payment cleared" : "Amount due"}
            </p>
            <p className="text-4xl font-bold text-white tabular-nums leading-none">
              {payClearance ? "₹0" : `₹${remaining}`}
            </p>
            {!payClearance && (
              <p className={`text-xs mt-2 ${payClearance ? "text-emerald-100" : "text-indigo-300"}`}>
                Total payable: ₹{payableAmount} · Capped at ₹{maxPayment}
              </p>
            )}
            {payClearance && (
              <p className="text-xs text-emerald-100 mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Your payment is fully cleared
              </p>
            )}
          </div>
          {acknowledgedAmount > 0 && !payClearance && (
            <div className="text-right">
              <p className="text-xs text-indigo-300">Received so far</p>
              <p className="text-lg font-bold text-white tabular-nums">₹{acknowledgedAmount}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.08s" }}>
        <p className="text-xs font-semibold text-slate-400 mb-3">Fee breakdown</p>
        <div className="space-y-2">
          {initial.eventRows.map((ev) => (
            <div key={ev.eventId} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-900">{ev.name}</p>
                <p className="text-xs text-slate-400">{ev.isIndividual ? "Individual event" : "Team event"}</p>
              </div>
              <span className="text-sm font-semibold text-slate-700">₹{ev.fee}</span>
            </div>
          ))}
        </div>
        {(initial.individualCount + initial.teamCount) >= 4 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-emerald-600 font-medium">Bundle discount applied (4+ events)</p>
            <span className="text-sm font-bold text-emerald-700">Max ₹{maxPayment}</span>
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Total</p>
          <span className="text-lg font-bold text-indigo-600">₹{payableAmount}</span>
        </div>
      </div>

      {/* Pay button */}
      {!payClearance && (
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setShowModal(true)}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Pay ₹{remaining} via Easebuzz
          </button>
          <p className="text-xs text-slate-400 text-center mt-2">
            You will be redirected to Easebuzz. Come back here and enter your transaction ID.
          </p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <p className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
          {success}
        </p>
      )}

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs font-semibold text-slate-400 mb-2">Transaction history</p>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.transactionId} className={`bg-white border border-slate-100 border-l-4 ${
                tx.clearanceApproval ? "border-l-emerald-500" : tx.acknowledgementByAdmin ? "border-l-indigo-400" : "border-l-amber-300"
              } rounded-xl px-4 py-3`}>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-slate-600 truncate">{tx.transactionId}</code>
                  {tx.clearanceApproval ? (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                    </span>
                  ) : tx.acknowledgementByAdmin ? (
                    <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledged ₹{tx.amountAtAdmin}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-amber-600 flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5" /> Pending approval
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submitted ₹{tx.currentPayAmount} · {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-slide-up">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Pay via Easebuzz</p>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Amount to pay</p>
                <p className="text-2xl font-bold text-indigo-600 tabular-nums">₹{remaining}</p>
                <p className="text-xs text-slate-400 mt-0.5">Use your signup email: {userEmail}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <QrCode className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">QR / Link payment</p>
                  <p className="text-xs text-slate-400">Scan QR at venue or click below</p>
                </div>
              </div>

              <a
                href={EASEBUZZ_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                Open Easebuzz <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <p className="text-xs text-slate-400 text-center">
                After payment, Easebuzz emails you a transaction ID. Enter it below.
              </p>

              <input
                type="text"
                value={txInput}
                onChange={(e) => setTxInput(e.target.value)}
                placeholder="Paste transaction ID here"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 font-mono"
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!txInput.trim() || submitting}
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {submitting ? "Submitting..." : "Submit transaction ID"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
