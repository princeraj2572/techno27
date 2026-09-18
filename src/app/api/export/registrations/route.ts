import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import * as XLSX from "xlsx";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

async function getAuthRole(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const role = await getAuthRole();
  if (!role || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp    = req.nextUrl.searchParams;
  const q     = sp.get("q")     ?? "";
  const type  = sp.get("type")  ?? "";
  const event = sp.get("event") ?? "";

  await connectToDatabase();

  const filter: Record<string, unknown> = { role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } };
  if (type === "internal") filter.role = "INTERNAL_USER";
  if (type === "external") filter.role = "EXTERNAL_USER";

  if (q) {
    const r = new RegExp(q, "i");
    filter.$or = [
      { fullName: r }, { email: r }, { mobileNumber: r },
      { enrollmentNumber: r }, { participantId: r }, { collegeName: r },
    ];
  }

  if (event) {
    const teams = await Team.find({ event }).select("leader members").lean();
    const emails = [...new Set(teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...t.members]))];
    filter.email = { $in: emails };
    delete filter.$or;
  }

  const users = await User.find(filter)
    .select("fullName email role department program branch year enrollmentNumber participantId collegeName city state mobileNumber gender dateOfBirth createdAt")
    .sort({ createdAt: -1 })
    .lean();

  type UserDoc = {
    fullName?: string; email?: string; role?: string;
    department?: string; program?: string; branch?: string; year?: string;
    enrollmentNumber?: string; participantId?: string;
    collegeName?: string; city?: string; state?: string;
    mobileNumber?: string; gender?: string; dateOfBirth?: string; createdAt?: string;
  };

  const data = JSON.parse(JSON.stringify(users)).map((u: UserDoc) => ({
    "Full Name":         u.fullName         ?? "—",
    "Email":             u.email            ?? "—",
    "Type":              u.role === "INTERNAL_USER" ? "OPJU (Internal)" : "External",
    "Mobile":            u.mobileNumber     ?? "—",
    "Gender":            u.gender           ?? "—",
    "Date of Birth":     u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : "—",
    "Enrollment No.":    u.enrollmentNumber ?? "—",
    "Participant ID":    u.participantId    ?? "—",
    "Department":        u.department       ?? "—",
    "Program":           u.program          ?? "—",
    "Branch":            u.branch           ?? "—",
    "Year":              u.year             ?? "—",
    "College Name":      u.collegeName      ?? "—",
    "City":              u.city             ?? "—",
    "State":             u.state            ?? "—",
    "Registered At":     u.createdAt ? new Date(u.createdAt).toLocaleString() : "—",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registrations");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="registrations.xlsx"`,
    },
  });
}
