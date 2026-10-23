import { NextRequest, NextResponse } from "next/server";
import { addTransactionIdAction } from "@/features/payments/payment-actions";
import { assertLoadtestEnabled, errorResponse } from "../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { transactionId, userEmail, currentPayAmount } = await req.json();
    const result = await addTransactionIdAction(transactionId, userEmail, currentPayAmount);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return errorResponse(e);
  }
}
