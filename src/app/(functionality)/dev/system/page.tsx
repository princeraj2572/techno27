export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ChevronLeft, Database, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

async function getSystemStats() {
  await connectToDatabase();
  const conn = mongoose.connection;
  const isConnected = conn.readyState === 1;
  const db = conn.db;
  let collectionStats: { name: string; count: number }[] = [];

  if (db && isConnected) {
    try {
      const collections = await db.listCollections().toArray();
      const counts = await Promise.all(
        collections.map(async (col) => ({
          name: col.name,
          count: await db.collection(col.name).countDocuments(),
        }))
      );
      collectionStats = counts.sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      collectionStats = [];
    }
  }

  return {
    isConnected,
    readyState: conn.readyState,
    dbName: conn.name ?? "unknown",
    host: conn.host ?? "unknown",
    collectionStats,
  };
}

const READY_STATE: Record<number, string> = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

export default async function DevSystemPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const stats = await getSystemStats().catch(() => ({
    isConnected: false,
    readyState: 0,
    dbName: "unknown",
    host: "unknown",
    collectionStats: [],
  }));

  const totalDocs = stats.collectionStats.reduce((s, c) => s + c.count, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">System</h1>
            <p className="text-xs text-slate-400 mt-0.5">DB health &amp; stats</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Database className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Connection status card */}
        <div className={`rounded-2xl border px-5 py-5 flex items-center gap-4 animate-slide-up ${
          stats.isConnected ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
        }`} style={{ animationDelay: "0.05s" }}>
          {stats.isConnected
            ? <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            : <XCircle className="h-6 w-6 text-red-500 shrink-0" />}
          <div>
            <p className={`text-sm font-bold ${stats.isConnected ? "text-emerald-800" : "text-red-800"}`}>
              MongoDB {READY_STATE[stats.readyState] ?? "Unknown"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              <code className="font-mono">{stats.dbName}</code>
              {" · "}
              <code className="font-mono">{stats.host}</code>
            </p>
          </div>
        </div>

        {/* Stats cards row */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <div className="bg-indigo-600 rounded-2xl px-5 py-4">
            <p className="text-xs font-medium text-indigo-200">Total documents</p>
            <p className="text-3xl font-bold text-white tabular-nums mt-1">{totalDocs.toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
            <p className="text-xs font-medium text-slate-400">Collections</p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums mt-1">{stats.collectionStats.length}</p>
            <p className="text-xs text-slate-400 mt-1">NODE_ENV: <code className="font-mono">{process.env.NODE_ENV ?? "unknown"}</code></p>
          </div>
        </div>

        {/* Collection counts */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold text-slate-400 mb-4">Collection counts</p>
          {stats.collectionStats.length === 0 ? (
            <p className="text-sm text-slate-400">No collections found or DB not connected.</p>
          ) : (
            <div className="space-y-0">
              {stats.collectionStats.map((col, i) => (
                <div key={col.name} className={`flex items-center justify-between py-2.5 ${i < stats.collectionStats.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <code className="text-xs font-mono text-slate-600">{col.name}</code>
                  <div className="flex items-center gap-3">
                    {/* Mini fill bar */}
                    <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{ width: `${Math.min((col.count / Math.max(totalDocs, 1)) * 100 * 3, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums w-12 text-right">{col.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
