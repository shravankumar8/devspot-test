import { createClient } from "@/lib/supabase/server";
import { ConnectedAccount } from "@/types/profile";
import { NextResponse } from "next/server";

const STACKOVERFLOW_CLIENT_ID = process.env.STACKOVERFLOW_CLIENT_ID!;
const STACKOVERFLOW_CLIENT_SECRET = process.env.STACKOVERFLOW_CLIENT_SECRET!;
const STACKOVERFLOW_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/stackoverflow/callback`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/profile`);
  }
    const {
      data: { user },
      error:fetchUserError
    } = await supabase.auth.getUser();

  if (!user || fetchUserError) {
    return NextResponse.redirect(`/login?ref=${request.url}`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://stackoverflow.com/oauth/access_token/json",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: STACKOVERFLOW_CLIENT_ID,
          client_secret: STACKOVERFLOW_CLIENT_SECRET,
          code,
          redirect_uri: STACKOVERFLOW_REDIRECT_URI,
        }),
      }
    );
    console.log(tokenResponse);

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    console.log(tokenData);
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Fetch user data
    const userReputation = await fetch(
      `https://api.stackexchange.com/2.3/me?site=stackoverflow&key=${process.env.STACKOVERFLOW_API_KEY}&access_token=${accessToken}&filter=!*Mg4PjfXdyMcuySE`
    );
    console.log(userReputation);
    if (!userReputation.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await userReputation.json();
    const userInfo = userData.items[0];

    const stackOverflowData = {
      reputation: userInfo?.reputation,
      upvote: userInfo?.up_vote_count,
      answers: userInfo?.answer_count,
      questions: userInfo?.question_count,
      url: userInfo?.link,
    };

    // Store the Stack Overflow data in Supabase
    const supabase = await createClient();

    const { data: existingData, error: fetchError } = await supabase
      .from("participant_profile")
      .select("connected_accounts")
      .eq("participant_id", user?.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const connectedAccounts = (existingData?.connected_accounts ||
      []) as ConnectedAccount[];
    const existingAccountIndex = connectedAccounts.findIndex(
      (account) => "stack_overflow" in account
    );

    if (existingAccountIndex !== -1) {
      // @ts-ignore
      connectedAccounts[existingAccountIndex] = {
        stack_overflow: stackOverflowData,
      };
    } else {
      // @ts-ignore
      connectedAccounts.push({ stack_overflow: stackOverflowData });
    }

    const { data, error: updateError } = await supabase
      .from("participant_profile")
      .update({ connected_accounts: connectedAccounts })
      .eq("participant_id", user?.id);

    if (updateError) throw updateError;

    // Redirect back to the connected accounts page
    if (state == "profile") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=true&provider=stackoverflow`
      );
    } else if (state == "signup") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/connect-account?success=true&provider=stackoverflow`
      );
    }
  } catch (error) {
    console.error("Stack Overflow OAuth error:", error);
    if (state == "profile") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=true&provider=stackoverflow`
      );
    } else if (state == "signup") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/connect-account?success=false&provider=spotify`
      );
    }
  }
}
