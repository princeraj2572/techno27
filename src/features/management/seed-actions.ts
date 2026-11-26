"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/features/events/event.model";
import { User } from "@/features/users/user.model";
import { seedEvents } from "@/features/events/data/seed-events";
import { getUser } from "@/features/users/user-actions";

export async function seedEventsAction() {
  await connectToDatabase();

  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    throw new Error("Only DEV_ADMIN can seed events");
  }

  // Upsert by slug: safe to run again. New events are added; existing ones get the website's latest
  // name, rules and team size, but keep their status, fees and prizes as set by the admins.
  const res = await Event.bulkWrite(
    seedEvents.map(({ status, internalFee, externalFee, prizeMoney, accommodationFee, ...data }) => ({
      updateOne: {
        filter: { slug: data.slug },
        update: { $set: data, $setOnInsert: { status, internalFee, externalFee, prizeMoney, accommodationFee } },
        upsert: true,
      },
    })),
  );
  return { success: true, count: seedEvents.length, added: res.upsertedCount, updated: res.modifiedCount };
}

export async function createDevAdminIfNotExists() {
  await connectToDatabase();

  const existing = await User.findOne({ role: "DEV_ADMIN" });
  if (existing) return { success: false, message: "DEV_ADMIN already exists" };

  const devAdmin = new User({
    fullName: "Dev Admin",
    email: "devadmin@Techno-aiMBiAtion.com",
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
