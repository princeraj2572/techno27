import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";

export async function generateParticipantId(): Promise<string> {
  await connectToDatabase();

  const lastExternal = await User.findOne(
    { participantId: { $exists: true, $ne: null } },
    { participantId: 1 },
  ).sort({ createdAt: -1 });

  let nextNum = 1;
  if (lastExternal?.participantId) {
    const match = lastExternal.participantId.match(/TRX27-OUT-(\d+)/);
    if (match) nextNum = parseInt(match[1], 10) + 1;
  }

  return `TRX27-OUT-${String(nextNum).padStart(4, "0")}`;
}
