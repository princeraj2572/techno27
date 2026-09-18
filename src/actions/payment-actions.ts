"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event, IEvent } from "@/models/event.model";
import { Team, ITeam } from "@/models/team.model";
import { Transaction, ITransaction } from "@/models/transaction.model";
import { User, IUser } from "@/models/user.model";

// ─── Pricing constants (from Technorollix 2026) ───────────────────────────
export const MAX_PAYMENT = 499;   // ₹499 hard cap
export const SOLO_FEE_1  = 99;    // 1 individual event
export const SOLO_FEE_2  = 199;   // 2–3 individual events
export const TEAM_FEE    = 299;   // per team event

export function calculatePayAmount(
  individualCount: number,
  teamCount: number,
): number {
  const total = individualCount + teamCount;
  if (total >= 4) return MAX_PAYMENT;

  let amount = 0;
  if (individualCount === 1)       amount += SOLO_FEE_1;
  else if (individualCount >= 2)   amount += SOLO_FEE_2;

  amount += teamCount * TEAM_FEE;

  return Math.min(amount, MAX_PAYMENT);
}

// ─── Submit a transaction ID (external user) ──────────────────────────────
export async function addTransactionIdAction(
  transactionId: string,
  userEmail: string,
  currentPayAmount: number,
): Promise<ITransaction> {
  await connectToDatabase();
  const newTx = new Transaction({
    transactionId,
    userEmail,
    currentPayAmount,
    amountAtAdmin: 0,
    acknowledgementByAdmin: false,
    clearanceApproval: false,
  });
  const saved = await newTx.save();
  return JSON.parse(JSON.stringify(saved));
}

// ─── Get all transactions for a user ──────────────────────────────────────
export async function getTransactionsByUserEmail(
  userEmail: string,
): Promise<(ITransaction & { createdAt: Date })[]> {
  await connectToDatabase();
  const txs = await Transaction.find({ userEmail }).sort({ createdAt: -1 }).lean<ITransaction[]>();
  return JSON.parse(JSON.stringify(txs));
}

// ─── Payment summary for a single external user ───────────────────────────
export interface IEventFeeRow {
  eventId: string;
  name: string;
  isIndividual: boolean; // teamSize == 1
  fee: number;
}

export interface IPaymentSummary {
  payableAmount: number;
  individualCount: number;
  teamCount: number;
  eventRows: IEventFeeRow[];
  transactions: (ITransaction & { createdAt: Date })[];
  acknowledgedAmount: number;
  payClearance: boolean;
  remaining: number;
}

export async function getPaymentSummaryForUser(
  email: string,
): Promise<IPaymentSummary> {
  await connectToDatabase();

  // Teams the user leads
  const teams = await Team.find({ leader: email }).lean<ITeam[]>();

  const eventRows: IEventFeeRow[] = [];
  let individualCount = 0;
  let teamCount = 0;

  for (const team of teams) {
    const event = await Event.findById(team.event).select("name teamSize").lean<IEvent>();
    if (!event) continue;
    const isIndividual = (event.teamSize ?? 1) === 1;
    if (isIndividual) individualCount++;
    else teamCount++;
    eventRows.push({
      eventId: String(event._id),
      name: event.name as string,
      isIndividual,
      fee: isIndividual ? SOLO_FEE_1 : TEAM_FEE,
    });
  }

  const payableAmount = calculatePayAmount(individualCount, teamCount);

  const transactions = await Transaction.find({ userEmail: email })
    .sort({ createdAt: -1 })
    .lean<ITransaction[]>();

  const serialized = JSON.parse(JSON.stringify(transactions)) as (ITransaction & { createdAt: Date })[];

  const acknowledgedAmount = serialized.reduce(
    (acc, t) => acc + (t.acknowledgementByAdmin ? t.amountAtAdmin : 0),
    0,
  );
  const payClearance = acknowledgedAmount >= payableAmount && payableAmount > 0;
  const remaining    = Math.max(payableAmount - acknowledgedAmount, 0);

  return {
    payableAmount,
    individualCount,
    teamCount,
    eventRows,
    transactions: serialized,
    acknowledgedAmount,
    payClearance,
    remaining,
  };
}

// ─── Acknowledge a transaction (DEV_ADMIN only) ───────────────────────────
export async function acknowledgeTransactionAction(
  transactionId: string,
  amountReceived: number,
  performedById: string,
): Promise<{ success: boolean; cleared?: boolean }> {
  await connectToDatabase();

  const performer = await User.findById(performedById).lean<IUser>();
  if (!performer || performer.role !== "DEV_ADMIN") {
    throw new Error("Unauthorized — only DEV_ADMIN can acknowledge transactions");
  }

  const tx = await Transaction.findOne({ transactionId });
  if (!tx) throw new Error("Transaction not found");

  tx.amountAtAdmin = amountReceived;
  tx.acknowledgementByAdmin = true;
  await tx.save();

  // Check if user's total acknowledged amount now covers payable
  const summary = await getPaymentSummaryForUser(tx.userEmail);
  const newAcknowledged = summary.acknowledgedAmount;

  let cleared = false;
  if (newAcknowledged >= summary.payableAmount && summary.payableAmount > 0) {
    // Mark all transactions for this user as cleared
    await Transaction.updateMany(
      { userEmail: tx.userEmail },
      { clearanceApproval: true },
    );
    cleared = true;
  }

  return { success: true, cleared };
}

// ─── Full payment data for admin views ────────────────────────────────────
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
  transactions: Array<{
    transactionId: string;
    currentPayAmount: number;
    amountAtAdmin: number;
    acknowledgementByAdmin: boolean;
    clearanceApproval: boolean;
    createdAt: Date;
  }>;
}

export async function getPaymentData(): Promise<IPaymentData[] | null> {
  await connectToDatabase();

  const users = await User.find({
    role: "EXTERNAL_USER",
    $expr: { $gte: [{ $size: "$teams" }, 1] },
  }).lean<IUser[]>();

  const results = await Promise.all(
    users.map(async (user) => {
      const { email, fullName } = user;

      const teams = await Team.find({ leader: email }).lean<ITeam[]>();
      if (teams.length === 0) return null;

      let individualCount = 0;
      let teamCount = 0;
      const eventNames: string[] = [];

      for (const team of teams) {
        const event = await Event.findById(team.event).select("name teamSize").lean<IEvent>();
        if (!event) continue;
        const isIndividual = (event.teamSize ?? 1) === 1;
        if (isIndividual) individualCount++;
        else teamCount++;
        if (!eventNames.includes(event.name as string)) {
          eventNames.push(event.name as string);
        }
      }

      const payableAmount = calculatePayAmount(individualCount, teamCount);

      const txs = await Transaction.find({ userEmail: email })
        .sort({ createdAt: -1 })
        .lean<ITransaction[]>();

      const serializedTxs = JSON.parse(JSON.stringify(txs));
      const acknowledgedAmount = serializedTxs.reduce(
        (acc: number, t: ITransaction) => acc + (t.acknowledgementByAdmin ? t.amountAtAdmin : 0),
        0,
      );
      const payClearance = acknowledgedAmount >= payableAmount && payableAmount > 0;

      return {
        fullName,
        email,
        mobileNumber: user.mobileNumber || "",
        eventNames: eventNames.join(", "),
        individualSchemaCount: individualCount,
        teamSchemaCount: teamCount,
        payableAmount,
        numberOfTransactions: txs.length,
        acknowledgedTransactions: serializedTxs.filter((t: ITransaction) => t.acknowledgementByAdmin).length,
        acknowledgedAmount,
        payClearance,
        transactions: serializedTxs,
      };
    }),
  );

  return JSON.parse(JSON.stringify(results.filter((r) => r !== null)));
}
