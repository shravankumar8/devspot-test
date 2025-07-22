import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/spotify/callback`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || "profile";

  const scope =
    "user-read-private user-read-email user-top-read user-read-currently-playing user-read-recently-played playlist-read-private";

  const authUrl = new URL(`https://accounts.spotify.com/authorize?show_dialog=true`);
  authUrl.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
  
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", SPOTIFY_REDIRECT_URI);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("scope", scope);

  return NextResponse.redirect(authUrl.toString());
}
