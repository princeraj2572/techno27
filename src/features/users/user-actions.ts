"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { IUser, User } from "@/features/users/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { AUTH_COOKIE, authCookieOptions, JWT_SECRET } from "@/lib/auth";
import { createUser, SignupData } from "@/features/users/create-user";
import { withVerifiedOtp } from "@/features/users/otp.model";
import { AuditLog } from "@/features/management/auditLog.model";

export const userSignup = async (data: SignupData): Promise<IUser> => {
  await connectToDatabase();
  const email = data.email.toLowerCase().trim();
  const user = await withVerifiedOtp(email, "signup", () => createUser({ ...data, email }));
  // sign them straight in (same token + cookie as userLogin)
  const token = jwt.sign({ userId: user._id, email, role: user.role }, JWT_SECRET(), { expiresIn: "1h" });
  (await cookies()).set(AUTH_COOKIE, token, authCookieOptions());
  return user;
};

interface LoginData {
  email: string;
  password: string;
}

type LoginResult =
  | { success: true; user: IUser; token: string }
  | { success: false; error: string };

// Returns a result object instead of throwing for expected auth failures
// (wrong password, unknown email). Next.js sends errors *thrown* from a
// Server Action to the nearest error boundary rather than as a normal
// catchable rejection — even when the caller wraps the call in try/catch —
// which showed users a generic "Server Components render" crash screen
// instead of an inline "wrong password" message.
export const userLogin = async (loginData: LoginData): Promise<LoginResult> => {
  await connectToDatabase();

  const normalizedEmail = loginData.email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (!existingUser) return { success: false, error: "User does not exist with this email" };

  if (existingUser.password !== loginData.password) {
    return { success: false, error: "Invalid password" };
  }

  const token = jwt.sign(
    { userId: existingUser._id, email: normalizedEmail, role: existingUser.role },
    JWT_SECRET(),
    { expiresIn: "1h" },
  );

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, authCookieOptions());

  return JSON.parse(JSON.stringify({ success: true, user: existingUser, token }));
};

export const resetPassword = async (email: string, newPassword: string) => {
  await connectToDatabase();
  const normalizedEmail = email.toLowerCase().trim();
  if (typeof newPassword !== "string" || newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
  return withVerifiedOtp(normalizedEmail, "reset", async () => {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) throw new Error("User not found");
    user.password = newPassword;
    await user.save();
    return { success: true };
  });
};

export const getUserFromAuth = async (token: string): Promise<IUser | null> => {
  await connectToDatabase();
  if (!token) throw new Error("No auth token provided");

  const decoded = jwt.verify(token, JWT_SECRET()) as { userId: string; email: string };
  const user = await User.findOne({
    _id: decoded.userId,
    email: decoded.email.toLowerCase(),
  });
  if (!user) throw new Error("User not found");
  return JSON.parse(JSON.stringify(user));
};

export async function getUser(): Promise<IUser | null> {
  await connectToDatabase();
  const authToken = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!authToken) return null;

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET()) as { userId: string; email: string };
    const user = await User.findOne({
      _id: decoded.userId,
      email: decoded.email.toLowerCase(),
    });
    return JSON.parse(JSON.stringify(user));
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  await connectToDatabase();
  const user = await User.findById(id).select("fullName email role mobileNumber department createdAt").lean();
  return user ? JSON.parse(JSON.stringify(user)) : null;
}

export async function getUsersByEmails(
  emails: string[],
): Promise<(IUser & { createdAt: Date })[]> {
  await connectToDatabase();
  const normalizedEmails = emails.map((e) => e.toLowerCase().trim());
  const users = await User.find({ email: { $in: normalizedEmails } }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function getOutsiderUsers(): Promise<IUser[]> {
  await connectToDatabase();
  const users = await User.find({ role: "EXTERNAL_USER" }).lean<IUser[]>();
  return JSON.parse(JSON.stringify(users));
}

export async function getUsersByEmailsPaginated(
  emails: string[],
  page: number = 1,
  limit: number = 10,
) {
  await connectToDatabase();
  const normalizedEmails = [...new Set(emails.map((e) => e.toLowerCase().trim()))];
  const totalUsers = await User.countDocuments({ email: { $in: normalizedEmails } });
  const skip = (page - 1) * limit;
  const users = await User.find({ email: { $in: normalizedEmails } })
    .skip(skip)
    .limit(limit)
    .lean();
  return JSON.parse(
    JSON.stringify({ users, totalUsers, totalPages: Math.ceil(totalUsers / limit), currentPage: page }),
  );
}

export async function searchUsers(query: string) {
  await connectToDatabase();
  const regex = new RegExp(query, "i");
  const users = await User.find({
    $or: [
      { fullName: regex },
      { email: regex },
      { mobileNumber: regex },
      { enrollmentNumber: regex },
      { participantId: regex },
      { collegeName: regex },
    ],
  })
    .limit(50)
    .lean();
  return JSON.parse(JSON.stringify(users));
}

export async function updateUserRole(
  targetUserId: string,
  newRole: IUser["role"],
  performedById: string,
  reason?: string,
) {
  await connectToDatabase();
  const performer = await User.findById(performedById);
  if (!performer || performer.role !== "DEV_ADMIN") {
    throw new Error("Only DEV_ADMIN can change user roles");
  }

  const target = await User.findByIdAndUpdate(
    targetUserId,
    { role: newRole, isAdmin: ["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER"].includes(newRole) },
    { new: true },
  );
  if (!target) throw new Error("Target user not found");

  await new AuditLog({
    action: "ROLE_CHANGE",
    targetId: target._id,
    targetType: "User",
    performedBy: performer._id,
    reason,
    metadata: { newRole },
  }).save();

  return JSON.parse(JSON.stringify(target));
}

export async function userLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  return { success: true };
}

export async function createManagementAccount(data: {
  fullName: string;
  email: string;
  mobileNumber: string;
  role: "MANAGEMENT_ADMIN" | "EVENT_MANAGER";
  department?: string;
  performedById: string;
}) {
  await connectToDatabase();
  const performer = await User.findById(data.performedById);
  if (!performer || performer.role !== "DEV_ADMIN") {
    throw new Error("Only DEV_ADMIN can create management accounts");
  }

  const normalizedEmail = data.email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("User already exists with this email");

  const tempPassword = Math.random().toString(36).slice(-8);
  const newUser = new User({
    fullName: data.fullName,
    email: normalizedEmail,
    password: tempPassword,
    mobileNumber: data.mobileNumber,
    role: data.role,
    department: data.department,
    isAdmin: true,
    isOutsider: false,
  });

  await newUser.save();

  await new AuditLog({
    action: "MANAGEMENT_ACCOUNT_CREATED",
    targetId: newUser._id,
    targetType: "User",
    performedBy: performer._id,
    metadata: { role: data.role, email: normalizedEmail, tempPassword },
  }).save();

  return JSON.parse(JSON.stringify({ user: newUser, tempPassword }));
}

export async function getAllUsersPaginated(
  page: number = 1,
  limit: number = 25,
  filters: { branch?: unknown; department?: string; semester?: string } = {},
) {
  await connectToDatabase();
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (filters.branch) filter.branch = filters.branch;
  if (filters.department) filter.department = filters.department;
  if (filters.semester) filter.semester = filters.semester;

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("fullName email role mobileNumber enrollmentNumber participantId collegeName branch department semester createdAt")
    .lean();
  return JSON.parse(
    JSON.stringify({ users, total, totalPages: Math.ceil(total / limit), currentPage: page }),
  );
}
