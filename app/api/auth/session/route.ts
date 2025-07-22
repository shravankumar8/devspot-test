import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ session: null }), { status: 401 });
  }

  return new Response(JSON.stringify({ session }), { status: 200 });
}
