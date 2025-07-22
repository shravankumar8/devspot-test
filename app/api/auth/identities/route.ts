import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: identities, error: identitiesError } = await supabase.auth.getUserIdentities()


  if (identitiesError) {
    return NextResponse.json(
      { error: "Failed to get user identities", message: identitiesError },
      { status: 500 }
    );
  }

  return NextResponse.json(identities, { status: 200 });
}
