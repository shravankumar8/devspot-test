import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const devtoClientId = process.env.DEVTO_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/devto/callback`;

  // TODO: generate & store a random state value for CSRF protection
  const state = "someRandomState";

  // Build dev.to OAuth URL (adjust scopes as needed)
  const authUrl =
    `https://dev.to/oauth/authorize?client_id=${devtoClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code&state=${state}&scope=read,write`;

  return NextResponse.redirect(authUrl.toString());
}
