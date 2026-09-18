import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongodb";
import { Accommodation } from "@/models/accommodation.model";
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

  const sp     = req.nextUrl.searchParams;
  const q      = sp.get("q")      ?? "";
  const gender = sp.get("gender") ?? "";

  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (gender) filter.gender = gender;

  const items = await Accommodation.find(filter)
    .populate("userId", "fullName email")
    .sort({ createdAt: -1 })
    .lean();

  type AccomItem = {
    gender?: string; universityName?: string;
    arrivalTime?: string; departureTime?: string; additionalDetails?: string;
    userId?: { fullName?: string; email?: string } | null;
  };

  let rows = JSON.parse(JSON.stringify(items)) as AccomItem[];

  if (q) {
    const rx = new RegExp(q, "i");
    rows = rows.filter((i) =>
      rx.test(i.userId?.fullName ?? "") ||
      rx.test(i.userId?.email    ?? "") ||
      rx.test(i.universityName   ?? "")
    );
  }

  const data = rows.map((item) => ({
    "Full Name":         item.userId?.fullName   ?? "—",
    "Email":             item.userId?.email      ?? "—",
    "University":        item.universityName     ?? "—",
    "Gender":            item.gender             ?? "—",
    "Arrival Time":      item.arrivalTime  ? new Date(item.arrivalTime).toLocaleString()  : "—",
    "Departure Time":    item.departureTime ? new Date(item.departureTime).toLocaleString() : "—",
    "Additional Details": item.additionalDetails ?? "—",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Accommodation");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="accommodation.xlsx"`,
    },
  });
}
