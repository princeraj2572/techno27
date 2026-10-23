export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getAccommodationDetailsAction } from "@/features/accommodation/accommodation-actions";
import { Hotel } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import AccommodationClient from "./AccommodationClient";

export default async function AccommodationPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) redirect("/dashboard");

  if (user.role !== "EXTERNAL_USER") {
    return (
      <AppShell title="Accommodation" crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Accommodation" }]} back={{ href: "/dashboard", label: "Back to dashboard" }} icon={<Hotel className="h-6 w-6" />}>
        <div className="border-2 border-dashed border-[#f5edd8]/40 py-16 text-center">
          <Hotel className="mx-auto mb-4 h-10 w-10 text-[#f5c928]" />
          <p className="text-xl font-bold uppercase text-[#f5edd8]">Accommodation is for external participants only</p>
          <p className="mt-1 text-sm text-[#f5edd8]/70">OPJU students stay on campus.</p>
        </div>
      </AppShell>
    );
  }

  const existing = await getAccommodationDetailsAction().catch(() => null);
  const u = user as unknown as Record<string, unknown>;

  return (
    <AppShell
      title="Accommodation" crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Accommodation" }]} back={{ href: "/dashboard", label: "Back to dashboard" }}
      sub={existing ? "Your accommodation request is submitted." : "Submit your accommodation request for Techno-aiMBiAtion 2027."}
      icon={<Hotel className="h-6 w-6" />}
    >
      {/* Info banner */}
      <div className="border-2 border-black bg-[#f5c928] px-5 py-4 text-black shadow-[4px_4px_0_0_#000]">
        <p className="mb-1 text-sm font-bold uppercase tracking-widest">Accommodation guidelines</p>
        <ul className="list-inside list-disc space-y-1 text-base leading-snug">
          <li>Accommodation is provided free of charge for registered external participants.</li>
          <li>Separate dormitories for male and female participants.</li>
          <li>Meals included during the fest days (18–20 Feb 2027).</li>
          <li>Bring your own bedding / sleeping bag if possible.</li>
        </ul>
      </div>

      <AccommodationClient
        initial={existing ? JSON.parse(JSON.stringify(existing)) : null}
        userUniversity={(u.collegeName as string) ?? ""}
        userGender={(u.gender as string) ?? ""}
        userPhone={(u.mobileNumber as string) ?? ""}
      />
    </AppShell>
  );
}
