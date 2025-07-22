import { SupabaseClient } from "@supabase/supabase-js";
import ApiBaseService from "../utils/baseService";
import { coinbaseAPI } from "./coinbase";

export class StakingService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async stake_for_hackathon(hackathonId: number, user_id: string) {
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select("*")
      .eq("id", hackathonId)
      .single();

    if (hackathonError || !hackathon) {
      throw new Error(`Hackathon not found - ${hackathonError}`);
    }

    if (hackathon.application_method !== "stake") {
      throw new Error(`This hackathon does not use staking`);
    }

    if (!hackathon.stake_amount) {
      throw new Error(`Stake amount not configured`);
    }

    // Check deadline
    if (
      hackathon.deadline_to_join &&
      new Date() > new Date(hackathon.deadline_to_join)
    ) {
      throw new Error(`Registration deadline has passed`);
    }

    const { data: user, error } = await this.supabase
      .from("users")
      .select(
        `
            id, 
            participant_wallets (
                wallet_address,
                primary_wallet
            )
      `
      )
      .eq("id", user_id)
      .maybeSingle();

    const walletAddress = user?.participant_wallets?.find(
      (wallet) => wallet.primary_wallet === true
    )?.wallet_address;

    if (!user || !walletAddress || error) {
      throw new Error(`Please Connect your Primary Wallet`);
    }
    // const { data: existingStake, error: stakeError } = await this.supabase
    //   .from("stakes")
    //   .select("*")
    //   .eq("hackathon_id", hackathonId)
    //   .eq("user_id", user_id)
    //   .single();

    // if (stakeError && stakeError.code !== "PGRST116") {
    //   console.error("Error checking existing stake:", stakeError);
    //   throw new Error(`Error checking existing stake - ${stakeError}`);
    // }

    // if (existingStake && existingStake.status === "confirmed") {
    //   throw new Error(`You have already staked for this hackathon`);
    // }

    const charge = await coinbaseAPI.createCharge({
      name: `Stake for ${hackathon.name}`,
      description: `Stake ${hackathon.stake_amount} USD to participate in ${hackathon.name}`,
      local_price: {
        amount: hackathon.stake_amount.toString(),
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        hackathon_id: hackathonId.toString(),
        user_id,
        wallet_address: walletAddress,
        type: "hackathon_stake",
      },
    });

    let stake;
    // if (existingStake) {
    //   // Update existing stake
    //   const { data: updatedStake, error: updateError } = await this.supabase
    //     .from("stakes")
    //     .update({
    //       wallet_address: walletAddress,
    //       coinbase_charge_id: charge.id,
    //       status: "pending",
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("id", existingStake.id)
    //     .select()
    //     .single();

    //   if (updateError) {
    //     console.error("Error updating stake:", updateError);
    //     throw new Error(`Error updating stake - ${updateError}`);
    //   }
    //   stake = updatedStake;
    // } else {
    //   // Create new stake
    //   const { data: newStake, error: createError } = await this.supabase
    //     .from("stakes")
    //     .insert({
    //       hackathon_id: hackathonId,
    //       user_id,
    //       wallet_address: walletAddress,
    //       amount_usd: hackathon.stake_amount,
    //       coinbase_charge_id: charge.id,
    //       status: "pending",
    //       created_at: new Date().toISOString(),
    //       updated_at: new Date().toISOString(),
    //     })
    //     .select()
    //     .single();

    //   if (createError) {
    //     console.error("Error creating stake:", createError);
    //     throw new Error(`Error creating stake - ${createError}`);
    //   }
    //   stake = newStake;
    // }

    return {
      // stakeId: stake?.id??1,
      chargeId: charge.id,
      hostedUrl: charge.hosted_url,
      amount: hackathon.stake_amount,
    };
  }

  async fetch_stake_status(hackathonId: number, user_id: string) {
    // const { data: stake, error: stakeError } = await this.supabase
    //   .from("stakes")
    //   .select("*")
    //   .eq("hackathon_id", hackathonId)
    //   .eq("user_id", user_id)
    //   .single();

    // if (stakeError && stakeError.code !== "PGRST116") {
    //   console.error("Error fetching stake:", stakeError);
    //   throw new Error(`Error fetching stake - ${stakeError}`);
    // }

    // if (!stake) return null;

    // if (stake.status === "pending" && stake.coinbase_charge_id) {
    //   try {
    //     const charge = await coinbaseAPI.getCharge(stake.coinbase_charge_id);
    //     console.log({ charge });

    //     if (charge.timeline) {
    //       const confirmedEvent = charge.timeline.find(
    //         (event: any) => event.status === "CONFIRMED"
    //       );

    //       if (confirmedEvent) {
    //         // Update stake status to confirmed
    //         const { data: updatedStake, error: updateError } =
    //           await this.supabase
    //             .from("stakes")
    //             .update({
    //               status: "confirmed",
    //               transaction_hash:
    //                 confirmedEvent.payment?.transaction_id || null,
    //               updated_at: new Date().toISOString(),
    //             })
    //             .eq("id", stake.id)
    //             .select()
    //             .single();

    //         if (updateError) {
    //           console.error("Error updating stake:", updateError);
    //           throw new Error(`Error updating stake - ${updateError}`);
    //         }

    //         // Create hackathon participant record
    //         const { error: participantError } = await this.supabase
    //           .from("hackathon_participants")
    //           .insert({
    //             hackathon_id: hackathonId,
    //             user_id,
    //             joined_at: new Date().toISOString(),
    //           });

    //         if (participantError) {
    //           console.error("Error creating participant:", participantError);
    //           // Don't return error here as the stake update was successful
    //           // The participant creation might fail due to duplicate key constraint
    //           // which is acceptable if they're already a participant
    //         }

    //         return { stake: updatedStake };
    //       }
    //     }
    //   } catch (coinbaseError) {
    //     console.error("Error checking Coinbase status:", coinbaseError);
    //   }
    // }
    return { stake:{} };
  }
}
