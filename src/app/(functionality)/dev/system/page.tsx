export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const READY_STATE_LABELS: Record<number, string> = {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System</h1>
        <Link href="/dev" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Database Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={stats.isConnected ? "secondary" : "destructive"}>
                {READY_STATE_LABELS[stats.readyState] ?? "Unknown"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="font-mono text-sm">{stats.dbName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Host</span>
              <span className="font-mono text-sm">{stats.host}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Collection Counts</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.collectionStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collections found or DB not connected.</p>
          ) : (
            <div className="space-y-2">
              {stats.collectionStats.map((col) => (
                <div key={col.name} className="flex items-center justify-between py-1 border-b last:border-0">
                  <span className="font-mono text-sm">{col.name}</span>
                  <span className="text-sm font-semibold tabular-nums">{col.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">NODE_ENV</span>
            <Badge variant="outline">{process.env.NODE_ENV ?? "unknown"}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
