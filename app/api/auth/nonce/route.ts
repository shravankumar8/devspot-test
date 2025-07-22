import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const walletAddress = searchParams.get("address");

  // Generate random 16-byte nonce
  const nonce = [...Array(16)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

  const { error } = await supabase.from("nonces").upsert({
    address: (walletAddress as string).toLowerCase(),
    nonce,
    used: false,
    expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minute expiry
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to generate nonce", message: error },
      { status: 500 }
    );
  }

  return NextResponse.json({ nonce }, { status: 200 });
}
