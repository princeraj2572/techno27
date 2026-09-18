"use client";
import { useState } from "react";
import { acknowledgeTransactionAction } from "@/actions/payment-actions";
import { CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";

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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [amounts, setAmounts]   = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState<Record<string, boolean>>({});
  const [states, setStates]     = useState<Record<string, {
    ackAmount: number; acknowledged: boolean; cleared: boolean;
  }>>(() => {
    const init: typeof states = {};
    for (const row of rows) {
      for (const tx of row.transactions) {
        init[tx.transactionId] = {
          ackAmount:    tx.amountAtAdmin,
          acknowledged: tx.acknowledgementByAdmin,
          cleared:      tx.clearanceApproval,
        };
      }
    }
    return init;
  });

  const handleAcknowledge = async (transactionId: string) => {
    const raw = amounts[transactionId] ?? "";
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount <= 0) return;
    setLoading((p) => ({ ...p, [transactionId]: true }));
    try {
      const result = await acknowledgeTransactionAction(transactionId, amount, currentUserId);
      setStates((p) => ({
        ...p,
        [transactionId]: { ackAmount: amount, acknowledged: true, cleared: result.cleared ?? false },
      }));
      if (result.cleared) {
        // mark all sibling transactions as cleared in local state too
        for (const row of rows) {
          if (row.transactions.some((t) => t.transactionId === transactionId)) {
            for (const t of row.transactions) {
              setStates((p) => ({
                ...p,
                [t.transactionId]: { ...p[t.transactionId], cleared: true },
              }));
            }
          }
        }
      }
    } catch {
      // error silently — user can retry
    } finally {
      setLoading((p) => ({ ...p, [transactionId]: false }));
    }
  };

  if (rows.length === 0) return (
    <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
      <p className="text-sm font-medium text-slate-500">No external participants with transactions yet</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const isExpanded = expanded[row.email];
        const anyTx = row.transactions.length > 0;
        const isCleared = row.transactions.some((t) => states[t.transactionId]?.cleared);

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
                <p className="text-xs text-slate-400">{row.transactions.length} tx</p>
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
                <span className="text-xs text-slate-300 shrink-0">No tx</span>
              )}
              {anyTx && (
                isExpanded
                  ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  : <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {/* Transactions (expanded) */}
            {isExpanded && anyTx && (
              <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/50">
                {row.transactions.map((tx) => {
                  const s = states[tx.transactionId] ?? {
                    ackAmount: tx.amountAtAdmin, acknowledged: tx.acknowledgementByAdmin, cleared: tx.clearanceApproval,
                  };
                  return (
                    <div key={tx.transactionId} className="bg-white border border-slate-100 rounded-xl px-4 py-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
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
                            value={amounts[tx.transactionId] ?? ""}
                            onChange={(e) => setAmounts((p) => ({ ...p, [tx.transactionId]: e.target.value }))}
                            className="h-8 flex-1 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                          <button
                            onClick={() => handleAcknowledge(tx.transactionId)}
                            disabled={loading[tx.transactionId] || !amounts[tx.transactionId]}
                            className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-medium transition-colors shrink-0"
                          >
                            {loading[tx.transactionId] ? "..." : "Acknowledge"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
