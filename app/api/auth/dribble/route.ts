import { NextResponse } from "next/server";

const DRIBBLE_CLIENT_ID = process.env.DRIBBLE_CLIENT_ID!;
const DRIBBLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/dribble/callback`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || "profile";

  const scope = "public";

  const authUrl = new URL(`https://dribbble.com/oauth/authorize`);
  authUrl.searchParams.append("client_id", DRIBBLE_CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", DRIBBLE_REDIRECT_URI);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("scope", scope);

  return NextResponse.redirect(authUrl.toString());
}
