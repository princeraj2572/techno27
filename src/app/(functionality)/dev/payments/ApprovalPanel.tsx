"use client";
import { useState } from "react";
import { acknowledgeTransactionAction, recordPaymentAction } from "@/features/payments/payment-actions";
import { CheckCircle2, Clock, ChevronDown, ChevronUp, PlusCircle, AlertCircle } from "lucide-react";

interface TxRow {
  transactionId: string;
  currentPayAmount: number;
  amountAtAdmin: number;
  acknowledgementByAdmin: boolean;
  clearanceApproval: boolean;
  createdAt: Date;
}

interface UserRow {
  email: string;
  fullName: string;
  participantId?: string;
  mobileNumber?: string;
  eventNames: string;
  payableAmount: number;
  acknowledgedAmount: number;
  payClearance: boolean;
  transactions: TxRow[];
}

interface Props {
  rows: UserRow[];
  currentUserId: string;
}

export default function ApprovalPanel({ rows, currentUserId }: Props) {
  const [expanded, setExpanded]     = useState<Record<string, boolean>>({});
  const [ackAmounts, setAckAmounts] = useState<Record<string, string>>({});
  const [manualTxId, setManualTxId] = useState<Record<string, string>>({});
  const [manualAmt, setManualAmt]   = useState<Record<string, string>>({});
  const [loading, setLoading]       = useState<Record<string, boolean>>({});
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [success, setSuccess]       = useState<Record<string, string>>({});

  type TxState = Record<string, { ackAmount: number; acknowledged: boolean; cleared: boolean }>;

  const [txStates, setTxStates] = useState<TxState>(() => {
    const init: TxState = {};
    for (const row of rows)
      for (const tx of row.transactions)
        init[tx.transactionId] = {
          ackAmount:    tx.amountAtAdmin,
          acknowledged: tx.acknowledgementByAdmin,
          cleared:      tx.clearanceApproval,
        };
    return init;
  });

  const [userCleared, setUserCleared] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const row of rows) init[row.email] = row.payClearance;
    return init;
  });

  const [extraTxs, setExtraTxs] = useState<Record<string, TxRow[]>>({});

  const flash = (key: string, kind: "error" | "success", msg: string) => {
    if (kind === "error") {
      setErrors((p) => ({ ...p, [key]: msg }));
      setTimeout(() => setErrors((p) => { const n = { ...p }; delete n[key]; return n; }), 4000);
    } else {
      setSuccess((p) => ({ ...p, [key]: msg }));
      setTimeout(() => setSuccess((p) => { const n = { ...p }; delete n[key]; return n; }), 3000);
    }
  };

  const markAllCleared = (email: string, allTxIds: string[]) => {
    setUserCleared((p) => ({ ...p, [email]: true }));
    setTxStates((p) => {
      const next = { ...p };
      for (const id of allTxIds)
        if (next[id]) next[id] = { ...next[id], cleared: true };
      return next;
    });
    setExtraTxs((p) => ({
      ...p,
      [email]: (p[email] ?? []).map((t) => ({ ...t, clearanceApproval: true })),
    }));
  };

  const handleAcknowledge = async (txId: string, userEmail: string, allTxIds: string[]) => {
    const amount = parseFloat(ackAmounts[txId] ?? "");
    if (isNaN(amount) || amount <= 0) return;
    setLoading((p) => ({ ...p, [txId]: true }));
    try {
      const result = await acknowledgeTransactionAction(txId, amount, currentUserId);
      setTxStates((p) => ({
        ...p,
        [txId]: { ackAmount: amount, acknowledged: true, cleared: result.cleared ?? false },
      }));
      if (result.cleared) {
        markAllCleared(userEmail, allTxIds);
        flash(userEmail, "success", "Payment cleared!");
      } else {
        flash(userEmail, "success", `₹${amount} acknowledged.`);
      }
    } catch (e) {
      flash(userEmail, "error", e instanceof Error ? e.message : "Acknowledge failed.");
    } finally {
      setLoading((p) => ({ ...p, [txId]: false }));
    }
  };

  const handleRecord = async (email: string, allTxIds: string[]) => {
    const txId   = (manualTxId[email] ?? "").trim();
    const amount = parseFloat(manualAmt[email] ?? "");
    if (!txId)          { flash(email, "error", "Enter a transaction ID."); return; }
    if (isNaN(amount) || amount <= 0) { flash(email, "error", "Enter a valid amount."); return; }

    const recordKey = `record-${email}`;
    setLoading((p) => ({ ...p, [recordKey]: true }));
    try {
      const result = await recordPaymentAction(txId, email, amount, currentUserId);
      const newTx: TxRow = {
        transactionId: txId,
        currentPayAmount: amount,
        amountAtAdmin: amount,
        acknowledgementByAdmin: true,
        clearanceApproval: result.cleared ?? false,
        createdAt: new Date(),
      };
      setTxStates((p) => ({
        ...p,
        [txId]: { ackAmount: amount, acknowledged: true, cleared: result.cleared ?? false },
      }));
      setExtraTxs((p) => ({ ...p, [email]: [newTx, ...(p[email] ?? [])] }));
      setManualTxId((p) => ({ ...p, [email]: "" }));
      setManualAmt((p)  => ({ ...p, [email]: "" }));
      if (result.cleared) {
        markAllCleared(email, [...allTxIds, txId]);
        flash(email, "success", "Payment recorded and fully cleared!");
      } else {
        flash(email, "success", `₹${amount} recorded and acknowledged.`);
      }
    } catch (e) {
      flash(email, "error", e instanceof Error ? e.message : "Record failed. Try again.");
    } finally {
      setLoading((p) => ({ ...p, [recordKey]: false }));
    }
  };

  if (rows.length === 0) return (
    <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
      <p className="text-sm font-medium text-slate-500">No external participants yet</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const isExpanded = expanded[row.email];
        const allTxs     = [...row.transactions, ...(extraTxs[row.email] ?? [])];
        const isCleared  = userCleared[row.email];
        const anyTx      = allTxs.length > 0;

        return (
          <div key={row.email} className={`bg-white border border-slate-100 border-l-4 ${
            isCleared ? "border-l-emerald-500" : anyTx ? "border-l-amber-400" : "border-l-slate-200"
          } rounded-xl overflow-hidden`}>

            {/* Row header */}
            <button
              className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded((p) => ({ ...p, [row.email]: !p[row.email] }))}
            >
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                {row.fullName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{row.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{row.email}</p>
                {row.eventNames && <p className="text-xs text-slate-300 truncate">{row.eventNames}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-slate-900">₹{row.payableAmount}</p>
                <p className="text-xs text-slate-400">{allTxs.length} tx</p>
              </div>
              {isCleared ? (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                </span>
              ) : anyTx ? (
                <span className="text-xs font-medium text-amber-600 flex items-center gap-1 shrink-0">
                  <Clock className="h-3.5 w-3.5" /> Pending
                </span>
              ) : (
                <span className="text-xs text-slate-400 shrink-0">No payment</span>
              )}
              {isExpanded
                ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                : <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              }
            </button>

            {/* Expanded panel */}
            {isExpanded && (
              <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/50">

                {/* Flash messages */}
                {errors[row.email] && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-700">{errors[row.email]}</p>
                  </div>
                )}
                {success[row.email] && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <p className="text-xs text-emerald-700">{success[row.email]}</p>
                  </div>
                )}

                {/* Existing transactions */}
                {allTxs.map((tx) => {
                  const s = txStates[tx.transactionId] ?? {
                    ackAmount: tx.amountAtAdmin,
                    acknowledged: tx.acknowledgementByAdmin,
                    cleared: tx.clearanceApproval,
                  };
                  return (
                    <div key={tx.transactionId} className="bg-white border border-slate-100 rounded-xl px-4 py-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <code className="text-xs font-mono text-slate-700">{tx.transactionId}</code>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Claimed ₹{tx.currentPayAmount} · {new Date(tx.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {s.cleared ? (
                          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                          </span>
                        ) : s.acknowledged ? (
                          <span className="text-xs font-medium text-indigo-600 shrink-0">
                            Acknowledged ₹{s.ackAmount}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium shrink-0">Pending</span>
                        )}
                      </div>
                      {!s.acknowledged && (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            placeholder="Amount received (₹)"
                            value={ackAmounts[tx.transactionId] ?? ""}
                            onChange={(e) => setAckAmounts((p) => ({ ...p, [tx.transactionId]: e.target.value }))}
                            className="h-8 flex-1 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                          <button
                            onClick={() => handleAcknowledge(tx.transactionId, row.email, allTxs.map(t => t.transactionId))}
                            disabled={loading[tx.transactionId] || !ackAmounts[tx.transactionId]}
                            className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-medium transition-colors shrink-0"
                          >
                            {loading[tx.transactionId] ? "..." : "Acknowledge"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Manual / additional payment entry */}
                {!isCleared && (
                  <div className="bg-white border border-dashed border-indigo-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <PlusCircle className="h-3.5 w-3.5 text-indigo-500" />
                      <p className="text-xs font-semibold text-indigo-700">
                        {anyTx ? "Record another payment" : "Record manual payment"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      {anyTx
                        ? `Remaining: ₹${Math.max(row.payableAmount - allTxs.reduce((s, t) => s + (txStates[t.transactionId]?.acknowledged ? (txStates[t.transactionId]?.ackAmount ?? 0) : 0), 0), 0)} · Enter a new transaction ref and amount received.`
                        : "No transaction submitted yet. Record a cash or offline payment directly."}
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Transaction / receipt ID (e.g. CASH-001)"
                        value={manualTxId[row.email] ?? ""}
                        onChange={(e) => setManualTxId((p) => ({ ...p, [row.email]: e.target.value }))}
                        className="w-full h-8 px-3 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder={`Amount received (₹, due ₹${row.payableAmount})`}
                          value={manualAmt[row.email] ?? ""}
                          onChange={(e) => setManualAmt((p) => ({ ...p, [row.email]: e.target.value }))}
                          className="h-8 flex-1 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button
                          onClick={() => handleRecord(row.email, allTxs.map(t => t.transactionId))}
                          disabled={
                            loading[`record-${row.email}`] ||
                            !(manualTxId[row.email] ?? "").trim() ||
                            !manualAmt[row.email]
                          }
                          className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-medium transition-colors shrink-0"
                        >
                          {loading[`record-${row.email}`] ? "Saving..." : "Record & Ack"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
