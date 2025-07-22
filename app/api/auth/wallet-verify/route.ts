import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createAdminClient();
    const body = await req.json();

    const { address, signature, nonce } = body;

    if (!address || !signature || !nonce) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Validate nonce
    const { data: nonceData, error: nonceError } = await supabase
      .from("nonces")
      .select("*")
      .eq("address", address.toLowerCase())
      .eq("nonce", nonce)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (nonceError || !nonceData) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 401 }
      );
    }
    const recoveredAddress = ethers.verifyMessage(nonceData.nonce, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Check existing wallet
    const { data: walletData } = await supabase
      .from("participant_wallets")
      .select("participant_id")
      .eq("wallet_address", address.toLowerCase())
      .single();

    let userId: string;

    // Check if user is trying to link a wallet that's already associated with another account
    if (body?.userId && walletData) {
      const isOwner = body?.userId === walletData.participant_id;

      return NextResponse.json(
        {
          error: isOwner
            ? "You already have this wallet linked"
            : "Wallet already linked",
          message:
            "This wallet address is already associated with another account. Please use a different wallet address.",
        },
        { status: 401 }
      );
    }

    if (body?.userId) {
      const lowerCaseAddress = address.toLowerCase();
      const { data: olderWallets } = await supabase
        .from("participant_wallets")
        .select("*")
        .eq("participant_id", body?.userId);

      const { error: walletError, data } = await supabase
        .from("participant_wallets")
        .insert({
          participant_id: body?.userId,
          wallet_address: lowerCaseAddress,
          // Set primary_wallet to true if this is the first wallet for the user (no older wallets exist)
          // Otherwise set it to false since user already has other wallets
          primary_wallet: !Boolean(olderWallets?.length),
        });

      if (walletError) {
        return NextResponse.json(
          { error: `Wallet linking failed: ${walletError}`, walletError },
          { status: 401 }
        );
      }

      return NextResponse.json({ data });
    }

    if (walletData) {
      userId = walletData.participant_id;
    } else {
      const lowerCaseAddress = address.toLowerCase();
      const dummyEmail = `${lowerCaseAddress}@devspot.app`;
      const dummyPassword = crypto.randomBytes(16).toString("hex");
      const { data: userData, error: userError } =
        await supabase.auth.admin.createUser({
          email: dummyEmail,
          password: dummyPassword,
          email_confirm: true,
          user_metadata: {
            first_wallet: lowerCaseAddress,
            full_name: lowerCaseAddress.slice(-4),
          },
        });

      if (userError) {
        return NextResponse.json(
          { error: `User creation failed: ${userError}`, userError },
          { status: 401 }
        );
      }

      userId = userData.user.id;

      // 5. Link wallet
      const { error: walletError } = await supabase
        .from("participant_wallets")
        .insert({
          participant_id: userId,
          wallet_address: lowerCaseAddress,
          primary_wallet: true,
        });

      if (walletError) {
        // throw new Error(`Wallet linking failed: ${walletError}`);
        return NextResponse.json(
          { error: `Wallet linking failed: ${walletError}`, walletError },
          { status: 401 }
        );
      }
    }
    const jwtPayload = {
      email: `${address.toLowerCase()}@devspot.app`,
      sub: userId,
      aud: "authenticated",
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
      aal: "aal1",
      app_metadata: {
        provider: "wallet",
        providers: ["wallet"],
      },
      user_metadata: {
        first_wallet: address.toLowerCase(),
      },
      confirmed_at: new Date().toISOString(),
    };

    // 6. Generate JWT
    const token = jwt.sign(jwtPayload, process.env.SUPABASE_JWT_SECRET!, {
      algorithm: "HS256",
    });

    // 7. Update nonce as used
    await supabase
      .from("nonces")
      .update({ used: true })
      .eq("address", address.toLowerCase());

    const { data: authData, error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    });

    if (error) {
      // throw new Error(`Could not Generate Session: ${error}`);
      return NextResponse.json(
        { error: `Could not Generate Session: ${error}` },
        { status: 401 }
      );
    }

    const { data: user_roles, error: user_roles_error } = await supabase
      .from("user_participant_roles")
      .select("*")
      .eq("participant_id", authData?.user?.id);

    const { origin } = new URL(req.url);

    if (user_roles_error || !user_roles?.length) {
      const completeProfileUrl = new URL(
        `${origin}/en/sign-up/participants/select-location`
      );

      return NextResponse.json({ url: completeProfileUrl.toString() });
    }

    const homeUrl = new URL(`${origin}/en`);

    return NextResponse.json({ url: homeUrl.toString() });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed", message: error },
      { status: 500 }
    );
  }
}
