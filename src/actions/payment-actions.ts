"use server";
import { eventSubEventData } from "@/data/event-subeventData";
import { connectToDatabase } from "@/lib/mongodb";
import { Event, IEvent } from "@/models/event.model";
import { ITeam, Team } from "@/models/team.model";
import { Transaction, ITransaction } from "@/models/transaction.model";
import { IUser, User } from "@/models/user.model";

export async function addTransactionIdAction(
  transactionId: string,
  userEmail: string,
  currentPayAmount: number,
): Promise<ITransaction> {
  await connectToDatabase();
  const newTransaction = new Transaction({
    transactionId,
    userEmail,
    currentPayAmount,
    amountAtAdmin: 0,
    acknowledgementByAdmin: false,
    clearanceApproval: false,
  });
  const saved = await newTransaction.save();
  return JSON.parse(JSON.stringify(saved));
}

export async function getTransactionsByUserEmail(
  userEmail: string,
): Promise<(ITransaction & { createdAt: Date })[]> {
  await connectToDatabase();
  const transactions = await Transaction.find({ userEmail }).lean<ITransaction[]>();
  return JSON.parse(JSON.stringify(transactions));
}

function calculatePayAmount(individualSchemaCount: number, teamSchemaCount: number): number {
  const totalTeams = individualSchemaCount + teamSchemaCount;
  if (totalTeams >= 4) return 499;
  let payAmount = 0;
  if (individualSchemaCount === 1) payAmount += 99;
  else if (individualSchemaCount === 2 || individualSchemaCount === 3) payAmount += 199;
  if (teamSchemaCount === 1) payAmount += 299;
  else if (teamSchemaCount === 2) payAmount += 299 * 2;
  else if (teamSchemaCount === 3) payAmount += 299 * 3;
  return payAmount;
}

export interface IPaymentData {
  fullName: string;
  email: string;
  mobileNumber: string;
  eventNames: string;
  individualSchemaCount: number;
  teamSchemaCount: number;
  payableAmount: number;
  numberOfTransactions: number;
  acknowledgedTransactions: number;
  acknowledgedAmount: number;
  payClearance: boolean;
}

export async function getPaymentData(): Promise<IPaymentData[] | null> {
  await connectToDatabase();

  const users = await User.find({
    role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] },
    $expr: { $gte: [{ $size: "$teams" }, 1] },
  }).lean<IUser[]>();

  const paymentDataArray = await Promise.all(
    users.map(async (user) => {
      const { email, fullName, mobileNumber } = user;

      const teams = await Team.find({ leader: email }).lean<ITeam[]>();
      if (teams.length === 0) return null;

      const populatedTeams = await Promise.all(
        teams.map(async (team) => {
          const [leader, event, members] = await Promise.all([
            User.findOne({ email: team.leader }).select("fullName email role").lean<{ fullName: string; email: string; role: string }>(),
            Event.findById(team.event).lean<IEvent>(),
            User.find({ email: { $in: team.members } }).select("fullName email role").lean<{ fullName: string; email: string; role: string }[]>(),
          ]);

          const anyMemberIsExternal = members.some((m) => m.role === "EXTERNAL_USER");
          if (!anyMemberIsExternal) return null;

          const individualSchema = team.members.length === 1 && leader?.role === "EXTERNAL_USER";
          return { ...team, members, leader, event, individualSchema };
        }),
      );

      const leadingTeams = populatedTeams.filter((d) => d !== null);
      if (leadingTeams.length === 0) return null;

      const eventIds = leadingTeams.map((t) => t.event?._id?.toString());
      const eventNames: string[] = [];
      const individualSchemaCount = leadingTeams.filter((t) => t.individualSchema).length;
      const teamSchemaCount = leadingTeams.filter((t) => !t.individualSchema).length;

      eventSubEventData.events.forEach((e) => {
        if (eventIds.includes(e.event)) {
          if (!eventNames.includes(e.eventName)) eventNames.push(e.eventName);
        } else {
          e.subEvents.forEach((se) => {
            if (eventIds.includes(se.subEvent) && !eventNames.includes(e.eventName)) {
              eventNames.push(e.eventName);
            }
          });
        }
      });

      const payableAmount = calculatePayAmount(individualSchemaCount, teamSchemaCount);
      const transactions = await Transaction.find({ userEmail: email }).lean<ITransaction[]>();
      const numberOfTransactions = transactions.length;
      const acknowledgedTransactions = transactions.filter((t) => t.acknowledgementByAdmin).length;
      const acknowledgedAmount = transactions.reduce(
        (acc, t) => acc + (t.acknowledgementByAdmin ? t.amountAtAdmin : 0),
        0,
      );
      const payClearance = payableAmount <= acknowledgedAmount;

      return {
        fullName,
        email,
        mobileNumber: mobileNumber || "",
        eventNames: eventNames.join(", "),
        individualSchemaCount,
        teamSchemaCount,
        payableAmount,
        numberOfTransactions,
        acknowledgedTransactions,
        acknowledgedAmount,
        payClearance,
      };
    }),
  );

  return JSON.parse(JSON.stringify(paymentDataArray.filter((d) => d !== null)));
}
