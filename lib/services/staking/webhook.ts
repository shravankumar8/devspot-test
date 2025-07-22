// app/api/webhooks/coinbase/route.ts
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Supabase = SupabaseClient<Database>;

export const coinbaseWebhook = async (body: any) => {
  const supabase: Supabase = await createClient();

  const event = JSON.parse(body);

  if (event.type === "charge:confirmed") {
    const charge = event.data;
    const metadata = charge.metadata;

    // if (metadata.type === "hackathon_stake") {
    //   const { data: stake, error: stakeError } = await supabase
    //     .from("stakes")
    //     .select("*")
    //     .eq("coinbase_charge_id", charge.id)
    //     .eq("status", "pending")
    //     .single();

    //   if (stakeError && stakeError.code !== "PGRST116") {
    //     console.error("Error finding stake:", stakeError);
    //     throw new Error(`Could not Find Stake - ${stakeError}`);
    //   }

    //   if (stake && stake.status === "pending") {
    //     // Update stake to confirmed
    //     const { error: updateError } = await supabase
    //       .from("stakes")
    //       .update({
    //         status: "confirmed",
    //         transaction_hash: charge.payments?.[0]?.transaction_id || null,
    //         updated_at: new Date().toISOString(),
    //       })
    //       .eq("id", stake.id);

    //     if (updateError) {
    //       console.error("Error updating stake:", updateError);
    //       throw new Error(`Could not Update Stake - ${updateError}`);
    //     }

    //     // Create or update hackathon participant record
    //     const { error: upsertError } = await supabase
    //       .from("hackathon_participants")
    //       .upsert(
    //         {
    //           hackathon_id: stake.hackathon_id,
    //           user_id: stake.user_id,
    //           application_status: "accepted",
    //           joined_at: new Date().toISOString(),
    //         },
    //         {
    //           onConflict: "hackathon_id,user_id",
    //           ignoreDuplicates: true,
    //         }
    //       );

    //     if (upsertError) {
    //       console.error("Error upserting hackathon participant:", upsertError);
    //       throw new Error(
    //         `Error upserting hackathon participant - ${upsertError}`
    //       );
    //     }
    //   }
    // }
  }

  // Handle charge failed event
  // if (event.type === "charge:failed") {
  //   const charge = event.data;

  //   const { error: updateError } = await supabase
  //     .from("stakes")
  //     .update({
  //       status: "failed",
  //       updated_at: new Date().toISOString(),
  //     })
  //     .eq("coinbase_charge_id", charge.id);

  //   if (updateError) {
  //     console.error("Error updating failed stakes:", updateError);
  //     throw new Error(`Error updating failed stakes- ${updateError}`);
  //   }
  // }

  return true;
};
