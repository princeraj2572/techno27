"use client";

import { useState } from "react";
import { seedEventsAction, createDevAdminIfNotExists } from "@/actions/seed-actions";
import { ChevronLeft, Sprout, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SeedPage() {
  const [seedResult,  setSeedResult]  = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);
  const [adminResult, setAdminResult] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState<string>("");

  const handleSeedEvents = async () => {
    setLoading("events");
    setSeedResult(null);
    try {
      const result = await seedEventsAction();
      setSeedResult(result.success
        ? { type: "success", text: `Seeded ${result.count} events successfully.` }
        : { type: "info",    text: result.message ?? "Already seeded." });
    } catch (err: unknown) {
      setSeedResult({ type: "error", text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setLoading("");
    }
  };

  const handleCreateDevAdmin = async () => {
    setLoading("admin");
    setAdminResult(null);
    try {
      const result = await createDevAdminIfNotExists();
      setAdminResult(result.success
        ? { type: "success", text: `Created dev admin: ${result.email} / ${result.password}` }
        : { type: "info",    text: result.message ?? "Admin already exists." });
    } catch (err: unknown) {
      setAdminResult({ type: "error", text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setLoading("");
    }
  };

  function msgClass(type: "success" | "info" | "error") {
    if (type === "success") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (type === "error")   return "bg-red-50    text-red-700    border-red-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Seed Events</h1>
            <p className="text-xs text-slate-400 mt-0.5">Bootstrap the database with test data</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Sprout className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Seed events */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Sprout className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Seed dummy events</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Inserts 5 test events (Hackathon, Coding Contest, Robo Race, UI/UX, Quiz) if the DB is empty.
              </p>
            </div>
          </div>
          <button
            onClick={handleSeedEvents}
            disabled={loading === "events"}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading === "events" ? "Seeding..." : "Seed events"}
          </button>
          {seedResult && (
            <p className={`text-xs font-mono mt-3 px-3 py-2 rounded-xl border ${msgClass(seedResult.type)}`}>
              {seedResult.text}
            </p>
          )}
        </div>

        {/* Bootstrap dev admin */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Bootstrap dev admin</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Creates a DEV_ADMIN account if none exists. Only needed on a fresh database.
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateDevAdmin}
            disabled={loading === "admin"}
            className="px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 disabled:opacity-50 transition-colors"
          >
            {loading === "admin" ? "Creating..." : "Create dev admin"}
          </button>
          {adminResult && (
            <p className={`text-xs font-mono mt-3 px-3 py-2 rounded-xl border ${msgClass(adminResult.type)}`}>
              {adminResult.text}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
