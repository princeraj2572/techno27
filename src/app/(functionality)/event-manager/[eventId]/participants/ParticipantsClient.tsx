"use client";
import { useState } from "react";
import type { ParticipantRow } from "./page";
import { CheckCircle2, Clock, Download, Users } from "lucide-react";
import * as XLSX from "xlsx";

interface Props {
  participants: ParticipantRow[];
  eventName: string;
  internalCount: number;
  externalCount: number;
}

type FilterTab = "all" | "internal" | "external";

export default function ParticipantsClient({ participants, eventName }: Props) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered =
    tab === "all"      ? participants :
    tab === "internal" ? participants.filter((p) => p.role === "INTERNAL_USER") :
                         participants.filter((p) => p.role === "EXTERNAL_USER");

  const downloadExcel = () => {
    const rows = filtered.map((p) => {
      const base: Record<string, string | number> = {
        "Full Name":    p.fullName,
        "Email":        p.email,
        "Type":         p.role === "INTERNAL_USER" ? "Internal (OPJU)" : p.role === "EXTERNAL_USER" ? "External" : p.role,
        "Mobile":       p.mobileNumber ?? "",
        "Department":   p.department   ?? "",
        "Program":      p.program      ?? "",
        "Branch":       p.branch       ?? "",
        "Year":         p.year         ?? "",
      };
      if (p.role === "INTERNAL_USER") {
        base["Enrollment No."] = p.enrollmentNumber ?? "";
      }
      if (p.role === "EXTERNAL_USER") {
        base["Participant ID"] = p.participantId ?? "";
        base["College"]        = p.collegeName  ?? "";
        base["Payment Status"] =
          p.paymentCleared ? "Cleared" :
          p.paymentPending ? "Pending" :
          "Not submitted";
      }
      return base;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    const label = tab === "all" ? "All" : tab === "internal" ? "Internal" : "External";
    XLSX.writeFile(wb, `${eventName.replace(/[^a-z0-9]/gi, "_")}_${label}_Participants.xlsx`);
  };

  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      {/* Filter tabs + download */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {(["all", "internal", "external"] as FilterTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "all" ? "All" : t === "internal" ? "Internal" : "External"}
              <span className="ml-1.5 text-[10px] text-slate-400">
                {t === "all" ? participants.length :
                 t === "internal" ? participants.filter((p) => p.role === "INTERNAL_USER").length :
                 participants.filter((p) => p.role === "EXTERNAL_USER").length}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={downloadExcel}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-medium transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download Excel
        </button>
      </div>

      {/* Participant list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
          <Users className="h-8 w-8 mx-auto mb-3 text-slate-200" />
          <p className="text-sm font-medium text-slate-500">
            No {tab === "internal" ? "internal" : tab === "external" ? "external" : ""} participants yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const isExternal = p.role === "EXTERNAL_USER";
            return (
              <div
                key={p.email}
                className={`bg-white border border-slate-100 border-l-4 ${
                  isExternal
                    ? p.paymentCleared ? "border-l-emerald-500"
                      : p.paymentPending ? "border-l-amber-400"
                      : "border-l-slate-200"
                    : "border-l-indigo-400"
                } rounded-xl px-4 py-3.5 flex items-start gap-3`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isExternal ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {p.fullName[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">{p.fullName}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                      isExternal
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}>
                      {isExternal ? "External" : "OPJU"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{p.email}</p>
                  <p className="text-xs text-slate-400">
                    {[
                      p.department,
                      p.program,
                      p.branch,
                      p.year ? `${p.year} Year` : null,
                      isExternal ? p.collegeName : null,
                    ].filter(Boolean).join(" · ")}
                  </p>
                  {(p.enrollmentNumber ?? p.participantId) && (
                    <code className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                      {p.enrollmentNumber ?? p.participantId}
                    </code>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  {isExternal ? (
                    p.paymentCleared ? (
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                      </span>
                    ) : p.paymentPending ? (
                      <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">No payment</span>
                    )
                  ) : (
                    <span className="text-xs text-slate-300">Free</span>
                  )}
                  {p.mobileNumber && p.mobileNumber !== "0000000000" && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.mobileNumber}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
