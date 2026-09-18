import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";

// One-time seed endpoint — creates test accounts if they don't exist.
// Hit GET /api/seed/init once in dev, then remove this file.

const ACCOUNTS = [
  {
    email: "devadmin@techno27.com",
    password: "Dev@12345",
    fullName: "Dev Admin",
    role: "DEV_ADMIN",
    mobileNumber: "9000000001",
    gender: "Male",
    department: "Engineering",
    program: "B.Tech",
    branch: "CSE",
    year: "4th",
    address: "OPJU Campus",
    emergencyContactName: "Admin",
    emergencyContactNumber: "9000000099",
    isAdmin: true,
    isOutsider: false,
  },
  {
    email: "mgmtadmin@techno27.com",
    password: "Mgmt@12345",
    fullName: "Management Admin",
    role: "MANAGEMENT_ADMIN",
    mobileNumber: "9000000002",
    gender: "Female",
    department: "Engineering",
    program: "B.Tech",
    branch: "CSE",
    year: "4th",
    address: "OPJU Campus",
    emergencyContactName: "Admin",
    emergencyContactNumber: "9000000099",
    isAdmin: true,
    isOutsider: false,
  },
  {
    email: "student@opju.ac.in",
    password: "Student@12345",
    fullName: "Raj Sharma (Internal)",
    role: "INTERNAL_USER",
    mobileNumber: "9000000003",
    gender: "Male",
    department: "Engineering",
    program: "B.Tech",
    branch: "CSE",
    year: "3rd",
    semester: "5",
    section: "A",
    enrollmentNumber: "OPJ21CS001",
    dayScholarOrHosteller: "Hosteller",
    address: "OPJU Hostel Block A",
    emergencyContactName: "Parent",
    emergencyContactNumber: "9000000088",
    isAdmin: false,
    isOutsider: false,
  },
  {
    email: "outsider@gmail.com",
    password: "Outside@12345",
    fullName: "Priya Singh (External)",
    role: "EXTERNAL_USER",
    mobileNumber: "9000000004",
    gender: "Female",
    department: "Engineering",
    program: "B.Tech",
    branch: "ECE",
    year: "2nd",
    collegeName: "IIT Delhi",
    city: "New Delhi",
    state: "Delhi",
    accommodationNeeded: true,
    address: "IIT Delhi Campus",
    emergencyContactName: "Parent",
    emergencyContactNumber: "9000000077",
    isAdmin: false,
    isOutsider: true,
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    const results = [];

    for (const account of ACCOUNTS) {
      const existing = await User.findOne({ email: account.email });
      if (existing) {
        results.push({ email: account.email, status: "already exists" });
        continue;
      }

      // Generate participantId for EXTERNAL_USER
      let participantId: string | undefined;
      if (account.role === "EXTERNAL_USER") {
        const last = await User.findOne({ participantId: { $exists: true } })
          .sort({ participantId: -1 })
          .select("participantId")
          .lean() as { participantId?: string } | null;
        const lastNum = last?.participantId
          ? parseInt(last.participantId.replace("TRX27-OUT-", ""), 10)
          : 0;
        participantId = `TRX27-OUT-${String(lastNum + 1).padStart(4, "0")}`;
      }

      await User.create({ ...account, ...(participantId ? { participantId } : {}) });
      results.push({ email: account.email, role: account.role, status: "created" });
    }

    return NextResponse.json({ success: true, results });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
