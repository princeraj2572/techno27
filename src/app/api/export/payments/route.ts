import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Transaction } from "@/models/transaction.model";
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
  const status = sp.get("status") ?? "";

  await connectToDatabase();

  const userFilter: Record<string, unknown> = { role: "EXTERNAL_USER" };
  if (q) {
    const r = new RegExp(q, "i");
    userFilter.$or = [{ fullName: r }, { email: r }];
  }

  const externalUsers = await User.find(userFilter)
    .select("fullName email participantId mobileNumber collegeName city state")
    .lean();

  const emails = externalUsers.map((u: { email: string }) => u.email);
  const allTx  = await Transaction.find({ userEmail: { $in: emails } }).lean();

  const txByEmail = new Map<string, typeof allTx>();
  for (const tx of allTx as { userEmail: string }[]) {
    if (!txByEmail.has(tx.userEmail)) txByEmail.set(tx.userEmail, []);
    txByEmail.get(tx.userEmail)!.push(tx as never);
  }

  type Row = {
    "Full Name": string; "Email": string; "Participant ID": string;
    "Mobile": string; "College": string; "City": string; "State": string;
    "Total Payable (₹)": number; "Amount Acknowledged (₹)": number;
    "Transactions": number; "Clearance Status": string;
  };

  let rows: Row[] = JSON.parse(JSON.stringify(externalUsers)).map((u: {
    email: string; fullName: string; participantId?: string;
    mobileNumber?: string; collegeName?: string; city?: string; state?: string;
  }) => {
    const txs = (txByEmail.get(u.email) ?? []) as { currentPayAmount?: number; amountAtAdmin?: number; clearanceApproval?: boolean }[];
    const cleared = txs.some((t) => t.clearanceApproval);
    return {
      "Full Name":                u.fullName,
      "Email":                    u.email,
      "Participant ID":           u.participantId ?? "—",
      "Mobile":                   u.mobileNumber  ?? "—",
      "College":                  u.collegeName   ?? "—",
      "City":                     u.city          ?? "—",
      "State":                    u.state         ?? "—",
      "Total Payable (₹)":       txs.reduce((s, t) => s + (t.currentPayAmount ?? 0), 0),
      "Amount Acknowledged (₹)": txs.reduce((s, t) => s + (t.amountAtAdmin   ?? 0), 0),
      "Transactions":             txs.length,
      "Clearance Status":         cleared ? "Cleared" : "Pending",
    };
  });

  if (status === "cleared") rows = rows.filter((r) => r["Clearance Status"] === "Cleared");
  if (status === "pending")  rows = rows.filter((r) => r["Clearance Status"] === "Pending");

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payments");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="payments.xlsx"`,
    },
  });
}
