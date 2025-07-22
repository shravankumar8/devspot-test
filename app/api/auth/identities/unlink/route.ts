import { createClient } from "@/lib/supabase/server";
import { ConnectedAccount } from "@/types/profile";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body?.provider) {
    return NextResponse.json(
      { error: "Failed to unlink identity", message: "No provider provided" },
      { status: 400 }
    );
  }

  const provider = body.provider as string;

  const supabase = await createClient();

  const { user, error: authError } = await getAuthenticatedUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "Not authenticated", message: authError || "Unknown" },
      { status: 401 }
    );
  }

  // Fetch all identities
  const { data: identitiesData, error: identitiesError } =
    await supabase.auth.getUserIdentities();

  if (identitiesError) {
    return NextResponse.json(
      {
        error: "Failed to fetch identities",
        message: identitiesError.message || identitiesError,
      },
      { status: 500 }
    );
  }

  const identities = identitiesData.identities;

  // Server‑side guard: don’t unlink if it’s the only identity
  if (identities.length <= 1) {
    return NextResponse.json(
      {
        error: "You must have at least one identity connected.",
        message: "You must have at least one identity connected.",
      },
      { status: 400 }
    );
  }

  // Find the identity to unlink
  const providerIdentity = identities.find((i) => i.provider === provider);
  if (!providerIdentity) {
    return NextResponse.json(
      {
        error: `No identity found for provider '${provider}'`,
        message: `No identity found for provider '${provider}'`,
      },
      { status: 400 }
    );
  }

  // Perform unlink
  const { data: unlinkData, error: unlinkError } =
    await supabase.auth.unlinkIdentity(providerIdentity);

  if (unlinkError) {
    return NextResponse.json(
      {
        error: "Failed to unlink identity",
        message: unlinkError.message || unlinkError,
      },
      { status: 500 }
    );
  }

  // Also remove it from your own profile table
  const { data: profile, error: profileError } = await supabase
    .from("participant_profile")
    .select("connected_accounts")
    .eq("participant_id", user.id)
    .single();

  if (profileError) {
    // not fatal — continue
    console.error("Could not load participant_profile:", profileError);
  } else {
    const connectedAccounts = (profile.connected_accounts ||
      []) as ConnectedAccount[];
    const idx = connectedAccounts.findIndex(
      (acc) => Object.keys(acc)[0] === provider
    );
    if (idx !== -1) {
      connectedAccounts.splice(idx, 1);
      await supabase
        .from("participant_profile")
        .update({ connected_accounts: connectedAccounts })
        .eq("participant_id", user.id);
    }
  }

  return NextResponse.json(unlinkData, { status: 200 });
}
