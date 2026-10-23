"use client";
import { useState } from "react";
import { generateAllEventManagersAction } from "@/features/management/management-actions";
import { UserCog, CheckCircle2 } from "lucide-react";

interface Props { userId: string }

export default function GenerateAllEMButton({ userId }: Props) {
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [results, setResults]   = useState<{ name: string; status: string; email?: string; password?: string }[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateAllEventManagersAction(userId);
      setResults(res);
      setDone(true);
      setShowModal(true);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 hover:text-purple-800 border border-purple-200 rounded-lg px-3 py-2 disabled:opacity-50 transition-colors"
      >
        <UserCog className="h-3.5 w-3.5" />
        {loading ? "Generating..." : done ? "Re-generate EMs" : "Generate All EMs"}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Event Manager Accounts</p>
              <button onClick={() => setShowModal(false)} className="text-xs text-slate-400 hover:text-slate-700">Close</button>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-2">
              {results.map((r) => (
                <div key={r.name} className={`border rounded-xl px-4 py-3 ${r.status === "created" ? "border-l-4 border-l-emerald-500 border-slate-100" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {r.status === "created"
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      : <UserCog className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    }
                    <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${r.status === "created" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {r.status === "created" ? "New" : "Exists"}
                    </span>
                  </div>
                  {r.email && (
                    <div className="pl-5 space-y-0.5">
                      <p className="text-xs font-mono text-slate-700">Email: {r.email}</p>
                      <p className="text-xs font-mono text-indigo-700 font-semibold">Pass: {r.password}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
