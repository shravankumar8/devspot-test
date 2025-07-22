import { coinbaseWebhook } from "@/lib/services/staking/webhook";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.text();

  const headersList = headers();
  const signature = headersList.get("x-cc-webhook-signature");

  // Verify webhook signature
  const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  return await coinbaseWebhook(body);
};
