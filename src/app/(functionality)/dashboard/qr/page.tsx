export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import QRDisplay from "./QRDisplay";

export default async function DashboardQRPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) redirect("/dashboard");

  const userId = String((user as Record<string, unknown>)._id ?? "");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-sm mx-auto px-4 py-8 space-y-7">

        <div className="animate-slide-up" style={{ animationDelay: "0s" }}>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My QR Code</h1>
          <p className="text-xs text-slate-400 mt-0.5">Show this at the event check-in counter</p>
        </div>

        <QRDisplay
          userId={userId}
          fullName={user.fullName}
          email={user.email}
          role={user.role}
          identifier={
            (user as Record<string, unknown>).enrollmentNumber as string ??
            (user as Record<string, unknown>).participantId as string ?? ""
          }
        />

      </div>
    </div>
  );
}
