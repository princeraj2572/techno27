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
  const event = sp.get("event") ?? "";

  await connectToDatabase();

  const teamFilter: Record<string, unknown> = {};
  if (event) teamFilter.event = event;
  if (q) {
    teamFilter.$or = [{ leader: new RegExp(q, "i") }];
  }

  const teams = await Team.find(teamFilter)
    .populate("event", "name status category")
    .sort({ createdAt: -1 })
    .lean();

  const leaderEmails = teams.map((t: { leader: string }) => t.leader);
  const users = await User.find({ email: { $in: leaderEmails } })
    .select("email fullName role enrollmentNumber participantId mobileNumber department collegeName")
    .lean();
  const nameMap = Object.fromEntries(
    JSON.parse(JSON.stringify(users)).map((u: { email: string }) => [u.email, u])
  );

  type XlsxRow = {
    "Event Name": string;
    "Category": string;
    "Leader Name": string;
    "Leader Email": string;
    "Leader ID": string;
    "Leader Mobile": string;
    "Member Count": number;
    "Members (emails)": string;
    "Registered At": string;
  };

  const rows: XlsxRow[] = JSON.parse(JSON.stringify(teams)).map((t: {
    leader: string;
    members: string[];
    createdAt?: string;
    event?: { name?: string; status?: string; category?: string };
  }) => {
    const ldr = nameMap[t.leader] ?? {};
    return {
      "Event Name":      t.event?.name     ?? "—",
      "Category":        t.event?.category ?? "—",
      "Leader Name":     ldr.fullName      ?? t.leader,
      "Leader Email":    t.leader,
      "Leader ID":       ldr.enrollmentNumber ?? ldr.participantId ?? "—",
      "Leader Mobile":   ldr.mobileNumber  ?? "—",
      "Member Count":    t.members.length,
      "Members (emails)": t.members.join(", "),
      "Registered At":   t.createdAt ? new Date(t.createdAt).toLocaleString() : "—",
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Event Participants");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="event-participants.xlsx"`,
    },
  });
}
