
import { NextResponse } from "next/server";

const STACKOVERFLOW_CLIENT_ID = process.env.STACKOVERFLOW_CLIENT_ID!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  console.log(state);
  const authUrl = `https://stackoverflow.com/oauth?client_id=${STACKOVERFLOW_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/stackoverflow/callback&scope=read_inbox,private_info&state=${state}`;
  return NextResponse.redirect(authUrl);
}
