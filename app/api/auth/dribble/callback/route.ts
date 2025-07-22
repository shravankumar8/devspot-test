import { createClient } from "@/lib/supabase/server";
import { ConnectedAccount } from "@/types/profile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const {
    data: { user },
    error: fetchUserError,
  } = await supabase.auth.getUser();

  if (!user || fetchUserError) {
    return NextResponse.redirect(`/login?ref=${request.url}`);
  }

  try {
    const clientId = process.env.DRIBBLE_CLIENT_ID;
    const clientSecret = process.env.DRIBBLE_CLIENT_SECRET;
    const tokenUrl = "https://dribbble.com/oauth/token";
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/dribble/callback`;

    // Exchange the authorization code for an access token.
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Token exchange error:", await response.text());

      return NextResponse.json(
        { error: "Failed to retrieve access token", details: data },
        { status: response.status }
      );
    }

    const accessToken = data?.access_token;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Fetch user data
    const userReputation = await fetch(
      `https://api.dribbble.com/v2/user?access_token=${accessToken}`
    );

    const userShots = await fetch(
      `https://api.dribbble.com/v2/user/shots?access_token=${accessToken}`
    );

    if (!userReputation.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userReputation.json();
    const userShotsData = await userShots?.json();

    console.log(userShotsData);

    // Store the Dribble data in Supabase
    const { data: existingData, error: fetchError } = await supabase
      .from("participant_profile")
      .select("connected_accounts")
      .eq("participant_id", user?.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const connectedAccounts = (existingData?.connected_accounts ||
      []) as ConnectedAccount[];
    const existingAccountIndex = connectedAccounts.findIndex(
      (account) => "dribble" in account
    );

    const dribbleData = {
      followers: userData?.followers_count,
      liked_shots: 0,
      shots: 0,
      url: userData?.html_url,
    };

    if (existingAccountIndex !== -1) {
      // @ts-ignore
      connectedAccounts[existingAccountIndex] = {
        dribble: dribbleData,
      };
    } else {
      // @ts-ignore
      connectedAccounts.push({
        dribble: dribbleData,
      });
    }

    const { data: _, error: updateError } = await supabase
      .from("participant_profile")
      .update({ connected_accounts: connectedAccounts })
      .eq("participant_id", user?.id);

    if (updateError) throw updateError;

    // Redirect back to the connected accounts page
    if (state == "profile") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=true&provider=dribble`
      );
    } else if (state == "signup") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/connect-account?success=true&provider=dribble`
      );
    }

    // Once you have the access token, you can:
    // - Store it in a secure session or cookie
    // - Redirect the user to your application with the token in context

    return NextResponse.json({ accessToken: data.access_token });
  } catch (error) {
    console.error("Dribble OAuth error:", error);
    if (state == "profile") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=true&provider=dribble`
      );
    } else if (state == "signup") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/connect-account?success=false&provider=dribble`
      );
    }
  }
}
