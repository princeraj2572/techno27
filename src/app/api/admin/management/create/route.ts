import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";
import { getUser } from "@/features/users/user-actions";

export async function POST(req: NextRequest) {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { fullName, email, password, mobileNumber, role, department, gender } = await req.json();

  if (!fullName || !email || !password || !mobileNumber || !role || !gender) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const newUser = new User({
    fullName,
    email: email.toLowerCase().trim(),
    password,
    mobileNumber,
    role,
    gender,
    department: department ?? "",
    program: "N/A",
    branch: "N/A",
    year: "1st",
    address: "N/A",
    emergencyContactName: "N/A",
    emergencyContactNumber: "0000000000",
    isAdmin: true,
    isOutsider: false,
  });

  await newUser.save();
  return NextResponse.json({ success: true, userId: newUser._id.toString() });
}
