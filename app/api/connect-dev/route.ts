import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { provider, redirect } = await request.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const origin = headers().get("origin");

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: provider as "github" | "gitlab" | "linkedin_oidc",
      options: {
        redirectTo: `${origin}/auth/callback?linked=true&provider=${provider}&redirect=${redirect}`,
        scopes: getProviderScopes(provider),
      },
    });

    if (error) throw error;

    if (!data || !data.url) {
      throw new Error("No OAuth URL returned");
    }

    // Return the URL to the client for redirection
    return NextResponse.json(
      {
        url: data.url,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error initiating OAuth flow:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 }
    );
  }
}

function getProviderScopes(provider: string): string {
  switch (provider) {
    case "github":
      return "read:user";
    case "gitlab":
      return "read_user";
    case "linkedin_oidc":
      return "profile openid email";
    case "spotify":
      return "user-read-private user-read-email user-top-read user-read-currently-playing user-read-recently-played playlist-read-private";
    default:
      return "";
  }
}
