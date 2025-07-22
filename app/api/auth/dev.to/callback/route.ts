// pages/api/auth/devto/callback.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "profile";

  // TODO: Validate the 'state' against the stored value for CSRF protection.
  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const devtoClientId = process.env.DEVTO_CLIENT_ID;
  const devtoClientSecret = process.env.DEVTO_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/devto/callback`;

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch("https://dev.to/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: devtoClientId,
      client_secret: devtoClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    console.error("Token exchange error:", await tokenResponse.text());

    return NextResponse.json(
      { error: "Error fetching access token" },
      { status: 500 }
    );
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // --- Save the token to Supabase ---
  // Here you would typically update the authenticated user’s record in your Supabase database.
  // For example, using your Supabase admin client:
  /*
  import { createClient } from '@supabase/supabase-js';
  const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const userId = ...; // Retrieve the currently logged-in user's ID
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ devto_access_token: accessToken })
    .eq('id', userId);
  if (error) {
    console.error('Supabase update error:', error);
    return res.status(500).send("Error saving access token");
  }
  */

  // Redirect the user after successful connection
  return NextResponse.redirect("/settings?connected=devto");
}
