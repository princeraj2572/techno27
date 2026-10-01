import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/event.model";
import { getUser } from "@/actions/user-actions";

export async function GET() {
  const currentUser = await getUser();
  if (!currentUser || currentUser.role !== "DEV_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectToDatabase();
  const events = await Event.find().select("name status category").sort({ name: 1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(events)));
}
