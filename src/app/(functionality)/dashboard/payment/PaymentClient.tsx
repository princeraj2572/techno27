"use client";
import { useState } from "react";
import { addTransactionIdAction } from "@/features/payments/payment-actions";
import type { IPaymentSummary } from "@/features/payments/payment-actions";
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, X, QrCode, ChevronDown, Users, User } from "lucide-react";
import { CARD, display } from "@/components/indie";

// Update this URL when the 2027 Easebuzz payment link is set up
const EASEBUZZ_URL = "https://smartpay.easebuzz.in/125084/Techno-aiMBiAtion-2026";

interface Props {
  userEmail: string;
  summary: IPaymentSummary;
}

// Maroon heading that sits directly on the page background
function Heading({ children }: { children: React.ReactNode }) {
  return (
    <p className={`text-2xl text-[#f5edd8] ${display.className}`} style={{ textShadow: "3px 3px 0 #7a1c1c" }}>
      {children}
    </p>
  );
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
    <div className="space-y-8">

      {/* 1. Status */}
      <div
        className={`border-2 border-black px-6 py-6 shadow-[6px_6px_0_0_#000] ${
          payClearance ? "bg-[#1f8a3a] text-white" : "bg-[#f5c928] text-black"
        }`}
      >
        {payClearance ? (
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-10 w-10 shrink-0" />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest">Payment status</p>
              <p className={`text-2xl leading-tight ${display.className}`}>Fully cleared — you&apos;re all set!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest">Amount due</p>
              <p className={`text-6xl leading-none tabular-nums ${display.className}`}>₹{remaining}</p>
              <p className="mt-2 text-base font-semibold">
                Total fee: ₹{payableAmount}
                {isCapped && (
                  <span className="ml-2 bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#f5c928]">Cap applied</span>
                )}
              </p>
            </div>
            {acknowledgedAmount > 0 && (
              <div className="border-2 border-black bg-[#f5edd8] px-4 py-2 text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-black/60">Received</p>
                <p className={`text-3xl tabular-nums ${display.className}`}>₹{acknowledgedAmount}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Registered events */}
      <div className="space-y-3">
        <Heading>Your registrations</Heading>
        <div className={`${CARD} overflow-hidden`}>
          <div className="divide-y-2 divide-black/15">
            {initial.eventRows.map((ev) => (
              <div key={ev.eventId} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black ${ev.isIndividual ? "bg-[#f5c928]" : "bg-[#0e5b57] text-white"}`}>
                    {ev.isIndividual ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold uppercase leading-tight">{ev.name}</p>
                    <span className="text-sm font-bold uppercase tracking-wider text-[#7a1c1c]">
                      {ev.isIndividual ? "Individual" : "Team"}
                    </span>
                  </div>
                </div>
                <span className={`shrink-0 text-2xl ${display.className}`}>₹{ev.fee}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border-t-2 border-black bg-[#e8d9ae] px-5 py-3">
            {isCapped ? (
              <p className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-[#0d5a24]">
                <CheckCircle2 className="h-4 w-4" /> Bundle cap applied (4+ events)
              </p>
            ) : (
              <p className="text-sm font-bold uppercase tracking-wide text-black/65">
                {initial.eventRows.length} event{initial.eventRows.length !== 1 ? "s" : ""} registered
              </p>
            )}
            <p className="text-base font-bold uppercase">
              Total <span className={`ml-1 text-2xl text-[#7a1c1c] tabular-nums ${display.className}`}>₹{payableAmount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Fee structure */}
      <div className="space-y-3">
        <Heading>Fee structure</Heading>
        <div className={`${CARD} overflow-hidden`}>
          <button
            type="button"
            onClick={() => setShowFeeGuide((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-[#f5c928]/40"
            aria-expanded={showFeeGuide}
          >
            <span className="text-base font-bold uppercase tracking-wide">Registration fee structure</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showFeeGuide ? "rotate-180" : ""}`} />
          </button>
          {showFeeGuide && (
            <div className="space-y-4 border-t-2 border-black px-5 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { title: "Individual", icon: User, rows: [["1 event", "₹99"], ["2–3 events", "₹199"], ["4–7 events", "₹499"]] },
                  { title: "Team", icon: Users, rows: [["Per event", "₹299"], ["4–7 events", "₹499"]] },
                ].map(({ title, icon: Icon, rows }) => (
                  <div key={title} className="border-2 border-black bg-white/60 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 border-b-2 border-black/20 pb-2">
                      <Icon className="h-4 w-4 text-[#7a1c1c]" />
                      <p className="text-base font-bold uppercase tracking-wide text-[#7a1c1c]">{title}</p>
                    </div>
                    <div className="space-y-1.5">
                      {rows.map(([label, price]) => (
                        <div key={label} className="flex justify-between text-base">
                          <span className="text-black/70">{label}</span>
                          <span className="font-bold">{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="space-y-1.5 text-base leading-snug">
                <li className="flex gap-2"><span className="font-bold text-[#7a1c1c]">•</span> Only team leaders pay the registration fee.</li>
                <li className="flex gap-2"><span className="font-bold text-[#7a1c1c]">•</span> Events with team size of 1 count as individual.</li>
                <li className="flex gap-2"><span className="font-bold text-[#7a1c1c]">•</span> ₹499 is the maximum cap across all events.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 4. How to pay */}
      <div className="space-y-3">
        <Heading>How to pay</Heading>
        <div className={`${CARD} px-5 py-5`}>
          <ol className="space-y-4">
            {[
              { n: "1", text: "Click “Pay” below — it opens the Easebuzz payment page." },
              { n: "2", text: <>Use this email on the payment page: <span className="break-all border-2 border-black bg-[#f5c928] px-2 py-0.5 font-bold text-black">{userEmail}</span></> },
              { n: "3", text: "After payment, Easebuzz emails you a transaction ID." },
              { n: "4", text: "Come back here, enter the transaction ID, and submit." },
            ].map(({ n, text }) => (
              <li key={n} className="flex items-start gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-[#7a1c1c] text-lg text-[#f5edd8] ${display.className}`}>
                  {n}
                </span>
                <p className="pt-1 text-lg leading-snug">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Important note */}
        <div className="flex items-start gap-3 border-2 border-black bg-[#f5c928] px-5 py-4 text-black shadow-[4px_4px_0_0_#000]">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <p className="text-lg font-bold uppercase tracking-wide">Important</p>
            <p className="text-base leading-snug">
              Use the same email as your account on the payment page, and keep your transaction ID safe.
              Your payment shows as <strong>Pending</strong> until the admin approves it.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Pay CTA */}
      {!payClearance && (
        <button
          onClick={() => setShowModal(true)}
          className={`h-16 w-full border-2 border-black bg-[#ff6a00] text-2xl uppercase tracking-wide text-black shadow-[6px_6px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#f5c928] active:translate-y-0 ${display.className}`}
        >
          Pay ₹{remaining} via Easebuzz
        </button>
      )}

      {/* 6. Success */}
      {success && (
        <div role="status" className="flex items-start gap-3 border-2 border-black bg-[#c9f0c9] px-5 py-4 text-[#0d3d1a] shadow-[4px_4px_0_0_#000]">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
          <p className="text-lg font-semibold leading-snug">{success}</p>
        </div>
      )}

      {/* 7. Transaction history */}
      {transactions.length > 0 && (
        <div className="space-y-3">
          <Heading>Transaction history</Heading>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.transactionId}
                className={`${CARD} border-l-8 px-5 py-4 ${
                  tx.clearanceApproval
                    ? "border-l-[#1f8a3a]"
                    : tx.acknowledgementByAdmin
                    ? "border-l-[#0b2a6b]"
                    : "border-l-[#e8851a]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <code className="min-w-0 truncate font-mono text-base font-bold">{tx.transactionId}</code>
                  {tx.clearanceApproval ? (
                    <span className="flex shrink-0 items-center gap-1 bg-[#1f8a3a] px-2 py-1 text-sm font-bold uppercase tracking-wider text-white">
                      <CheckCircle2 className="h-4 w-4" /> Cleared
                    </span>
                  ) : tx.acknowledgementByAdmin ? (
                    <span className="flex shrink-0 items-center gap-1 bg-[#0b2a6b] px-2 py-1 text-sm font-bold uppercase tracking-wider text-white">
                      <CheckCircle2 className="h-4 w-4" /> ₹{tx.amountAtAdmin} received
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 bg-[#e8851a] px-2 py-1 text-sm font-bold uppercase tracking-wider text-black">
                      <Clock className="h-4 w-4" /> Pending
                    </span>
                  )}
                </div>
                <p className="mt-1 text-base text-black/65">
                  ₹{tx.currentPayAmount} submitted · {new Date(tx.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Payment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Complete payment">
          <div className="max-h-[92vh] w-full max-w-md overflow-y-auto border-2 border-black bg-[#f5edd8] text-[#1a0505] shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center justify-between border-b-2 border-black bg-[#7a1c1c] px-5 py-4 text-[#f5edd8]">
              <p className={`text-xl ${display.className}`}>Complete payment</p>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#f5c928] text-black hover:bg-[#ff6a00]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="flex items-center justify-between gap-3 border-2 border-black bg-[#f5c928] px-4 py-4 text-black">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest">Pay now</p>
                  <p className={`text-4xl tabular-nums ${display.className}`}>₹{remaining}</p>
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-xs font-bold uppercase tracking-widest">Use this email</p>
                  <p className="truncate text-sm font-bold">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-2 border-black bg-white/60 px-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-[#f5c928]">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-bold">Scan QR at venue or pay online</p>
                  <p className="text-sm text-black/65">Click the button below to open Easebuzz</p>
                </div>
              </div>

              <a
                href={EASEBUZZ_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 border-2 border-black bg-[#7a1c1c] text-lg font-bold uppercase tracking-wider text-white shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#5a1212]"
              >
                Open Easebuzz <ExternalLink className="h-4 w-4" />
              </a>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-black/30" />
                <span className="text-sm font-bold uppercase tracking-wider text-black/65">then enter your transaction ID</span>
                <div className="h-px flex-1 bg-black/30" />
              </div>

              <input
                type="text"
                value={txInput}
                onChange={(e) => setTxInput(e.target.value)}
                placeholder="Paste transaction ID here"
                aria-label="Transaction ID"
                className="h-12 w-full border-2 border-black bg-white px-3 font-mono text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-4 focus:ring-[#f5c928]"
              />

              {error && (
                <p role="alert" className="border-2 border-black bg-[#ffd0d0] px-3 py-2 text-base font-semibold text-[#6b0010]">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!txInput.trim() || submitting}
                className="h-12 w-full border-2 border-black bg-[#1f8a3a] text-lg font-bold uppercase tracking-wider text-white shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:bg-[#166b2c] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {submitting ? "Submitting…" : "Submit transaction ID"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
