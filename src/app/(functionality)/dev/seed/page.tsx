"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { seedEventsAction, createDevAdminIfNotExists } from "@/actions/seed-actions";

export default function SeedPage() {
  const [seedResult, setSeedResult] = useState<string>("");
  const [adminResult, setAdminResult] = useState<string>("");
  const [loading, setLoading] = useState<string>("");

  const handleSeedEvents = async () => {
    setLoading("events");
    try {
      const result = await seedEventsAction();
      setSeedResult(result.success
        ? `✅ Seeded ${result.count} events successfully`
        : `ℹ️ ${result.message}`);
    } catch (err: unknown) {
      setSeedResult(`❌ ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setLoading("");
    }
  };

  const handleCreateDevAdmin = async () => {
    setLoading("admin");
    try {
      const result = await createDevAdminIfNotExists();
      setAdminResult(result.success
        ? `✅ Created dev admin: ${result.email} / ${result.password}`
        : `ℹ️ ${result.message}`);
    } catch (err: unknown) {
      setAdminResult(`❌ ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Dev Seed Tools</h1>
      <p className="text-muted-foreground text-sm">Bootstrap the database with test data for development.</p>

      <Card>
        <CardHeader>
          <CardTitle>Seed Events</CardTitle>
          <CardDescription>
            Insert 5 dummy events (Hackathon, Coding Contest, Robo Race, UI/UX, Quiz) if the DB is empty.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleSeedEvents} disabled={loading === "events"}>
            {loading === "events" ? "Seeding..." : "Seed Events"}
          </Button>
          {seedResult && (
            <p className="text-sm font-mono bg-muted px-3 py-2 rounded">{seedResult}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bootstrap Dev Admin</CardTitle>
          <CardDescription>
            Creates a DEV_ADMIN account if none exists. Only needed on a fresh database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleCreateDevAdmin} disabled={loading === "admin"}>
            {loading === "admin" ? "Creating..." : "Create Dev Admin"}
          </Button>
          {adminResult && (
            <p className="text-sm font-mono bg-muted px-3 py-2 rounded">{adminResult}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
