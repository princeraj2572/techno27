"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/event.model";
import { User } from "@/models/user.model";
import { seedEvents } from "@/data/seed-events";
import { getUser } from "./user-actions";

export async function seedEventsAction() {
  await connectToDatabase();

  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    throw new Error("Only DEV_ADMIN can seed events");
  }

  const existingCount = await Event.countDocuments();
  if (existingCount > 0) {
    return { success: false, message: `Skipped — ${existingCount} events already exist` };
  }

  const inserted = await Event.insertMany(seedEvents);
  return JSON.parse(JSON.stringify({ success: true, count: inserted.length, events: inserted }));
}

export async function createDevAdminIfNotExists() {
  await connectToDatabase();

  const existing = await User.findOne({ role: "DEV_ADMIN" });
  if (existing) return { success: false, message: "DEV_ADMIN already exists" };

  const devAdmin = new User({
    fullName: "Dev Admin",
    email: "devadmin@technorollix.com",
    password: "devadmin2027",
    role: "DEV_ADMIN",
    isAdmin: true,
    isOutsider: false,
    mobileNumber: "0000000000",
  });
  await devAdmin.save();

  return JSON.parse(
    JSON.stringify({ success: true, email: devAdmin.email, password: "devadmin2027" }),
  );
}
