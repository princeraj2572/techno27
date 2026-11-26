"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUser } from "@/features/users/user-actions";
import { HelpQuery } from "@/features/helpdesk/help-query.model";
import { HELP_TOPICS, type HelpTopic } from "@/features/helpdesk/help-topics";

const STAFF = ["DEV_ADMIN", "MANAGEMENT_ADMIN"];
const MAX_OPEN = 5; // stops one account from flooding the desk

export type HelpQueryRow = {
  _id: string; userEmail: string; userName: string; topic: HelpTopic; subject: string; message: string;
  status: "OPEN" | "RESOLVED"; reply?: string; repliedBy?: string; repliedAt?: string; createdAt: string;
};
const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** A signed-in participant asks a question. */
export async function createHelpQueryAction(input: { topic: string; subject: string; message: string }) {
  const user = await getUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const subject = String(input.subject ?? "").trim();
  const message = String(input.message ?? "").trim();
  if (!HELP_TOPICS.includes(input.topic as HelpTopic)) return { ok: false, error: "Pick a topic." };
  if (subject.length < 3 || subject.length > 120) return { ok: false, error: "Subject must be 3–120 characters." };
  if (message.length < 10 || message.length > 2000) return { ok: false, error: "Message must be 10–2000 characters." };

  await connectToDatabase();
  if ((await HelpQuery.countDocuments({ userEmail: user.email, status: "OPEN" })) >= MAX_OPEN) {
    return { ok: false, error: `You already have ${MAX_OPEN} open questions. Wait for a reply first.` };
  }
  await HelpQuery.create({ userEmail: user.email, userName: user.fullName, topic: input.topic, subject, message });
  return { ok: true };
}

/** The signed-in user's own questions, newest first. */
export async function getMyHelpQueriesAction(): Promise<HelpQueryRow[]> {
  const user = await getUser();
  if (!user) return [];
  await connectToDatabase();
  return plain(await HelpQuery.find({ userEmail: user.email }).sort({ createdAt: -1 }).limit(50).lean());
}

/** Staff inbox: open questions first, then the latest resolved ones. */
export async function getHelpQueriesAction(status: "OPEN" | "RESOLVED" = "OPEN"): Promise<HelpQueryRow[]> {
  const user = await getUser();
  if (!user || !STAFF.includes(user.role)) throw new Error("Not allowed");
  await connectToDatabase();
  return plain(await HelpQuery.find({ status }).sort({ createdAt: status === "OPEN" ? 1 : -1 }).limit(200).lean());
}

/** Staff reply; replying resolves the question. */
export async function replyHelpQueryAction(id: string, reply: string) {
  const user = await getUser();
  if (!user || !STAFF.includes(user.role)) return { ok: false, error: "Not allowed" };
  const text = String(reply ?? "").trim();
  if (text.length < 2 || text.length > 2000) return { ok: false, error: "Reply must be 2–2000 characters." };
  await connectToDatabase();
  const res = await HelpQuery.updateOne(
    { _id: id },
    { $set: { reply: text, status: "RESOLVED", repliedBy: user.fullName, repliedAt: new Date() } },
  ).catch(() => null);
  if (!res?.matchedCount) return { ok: false, error: "Question not found." };
  return { ok: true };
}
