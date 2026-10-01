import { NextRequest, NextResponse } from "next/server";
import { setAccommodationDetailsAction } from "@/actions/accommodation-actions";
import { assertLoadtestEnabled, errorResponse, impersonate } from "../_guard";

export async function POST(req: NextRequest) {
  const blocked = assertLoadtestEnabled();
  if (blocked) return blocked;

  try {
    const { token, ...details } = await req.json();
    await impersonate(token);
    const result = await setAccommodationDetailsAction({
      ...details,
      arrivalTime: new Date(details.arrivalTime),
      departureTime: new Date(details.departureTime),
    });
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return errorResponse(e);
  }
}
