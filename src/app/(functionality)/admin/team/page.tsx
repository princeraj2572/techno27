export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { ArrowLeft, Phone, Users } from "lucide-react";
import Link from "next/link";

// Placeholder data only — replace with real conveners before the fest.
const DEPARTMENTS = [
  "Information, Publicity & Invitation",
  "Design, Print & Media",
  "Registration & Reception",
  "Accommodation",
  "Stage, Light, Sound & Stall",
  "Catering",
  "Venue Preparation",
  "Transportation",
  "Hospitality",
  "Website Maintenance",
  "Sponsorship",
  "Certificate & Prize",
  "Discipline",
  "Stationery & Logistics",
  "Health & First Aid",
].map((department, i) => ({
  department,
  convener: { name: "Convener Name", phone: `+91 90000 000${String(i + 1).padStart(2, "0")}` },
  coConvener: { name: "Co-Convener Name", phone: `+91 80000 000${String(i + 1).padStart(2, "0")}` },
}));

function Person({ role, name, phone }: { role: string; name: string; phone: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{role}</p>
      <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
        <Phone className="h-3 w-3" /> {phone}
      </p>
    </div>
  );
}

export default async function AdminTeamPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <Link href="/admin" className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 mb-3">
            <ArrowLeft className="h-3 w-3" /> Management
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Behind Techno-aiMBiAtion</h1>
              <p className="text-xs text-slate-400 mt-0.5">Conveners &amp; co-conveners by department</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEPARTMENTS.map((d) => (
            <div key={d.department} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-slate-900">{d.department}</p>
              <div className="grid grid-cols-2 gap-3">
                <Person role="Convener" name={d.convener.name} phone={d.convener.phone} />
                <Person role="Co-Convener" name={d.coConvener.name} phone={d.coConvener.phone} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
