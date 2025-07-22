import { ParticipantProfile, UserSkills } from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import ApiBaseService from "../../utils/baseService";
import { TokenService } from "../../utils/tokenService";
import ParticipantRolesService from "./participant_roles.service";

interface UpdateRolesInterface {
  ids: number[];
  primaryRoleId: number;
}
class ProfileService extends ApiBaseService {
  private participantRolesService: ParticipantRolesService;

  constructor(supabase: SupabaseClient) {
    super(supabase);
    this.participantRolesService = new ParticipantRolesService(supabase);
  }

  async get_participant_profile(participant_id: string) {
    const { data: user_data, error: user_data_error } = await this.supabase
      .from("users")
      .select(
        `
          *,
          roles:user_participant_roles(*, participant_roles(*)),
          wallets:participant_wallets(*),
          technology_organizations:technology_owner_users(
            id,
            technology_owner_id,
            technology_owners(*)
          )
        `
      )
      .eq("id", participant_id)
      .maybeSingle();

    if (user_data_error) {
      throw new Error(
        `Failed to retrieve user data: ${user_data_error.message}`
      );
    }

    const { data: user_profile, error: user_profile_data } = await this.supabase
      .from("participant_profile")
      .select("*")
      .eq("participant_id", participant_id)
      .single();

    if (user_profile_data) {
      throw new Error(
        `Failed to retrieve user data: ${user_profile_data.message}`
      );
    }
    const tokenService = new TokenService(this.supabase);
    const tokenBalance = await tokenService.getBalance(participant_id);

    const response = {
      ...user_data,
      profile: {
        ...user_profile,
        token_balance: tokenBalance,
      },
    };

    return response;
  }

  async update_participant_profile(
    participant_id: string,
    participant_data: Partial<ParticipantProfile> & {
      roles?: UpdateRolesInterface;
    }
  ) {
    if (
      participant_data.roles &&
      Object.keys(participant_data.roles).length > 0
    ) {
      const roles = participant_data.roles;

      await this.participantRolesService.update_roles_for_participant(
        participant_id,
        roles.ids,
        roles.primaryRoleId
      );
    }

    delete participant_data?.roles;

    const { error } = await this.supabase
      .from("participant_profile")
      .update(participant_data)
      .eq("participant_id", participant_id)
      .single();

    if (error) {
      throw new Error(
        `Error updating participant profile for participant id ${participant_id}: ${error.message}`
      );
    }

    // update roles
    return null;
  }

  async get_profile_completion_percentage(participant_id: string) {
    const { data: userData, error: fetchError } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", participant_id)
      .single();

    const { data: user_profile, error: fetch_profile_error } =
      await this.supabase
        .from("participant_profile")
        .select("*")
        .eq("participant_id", participant_id)
        .single();

    const { data: user_wallets, error: fetch_wallet_error } =
      await this.supabase
        .from("participant_wallets")
        .select("*")
        .eq("participant_id", participant_id);

    if (fetchError || fetch_wallet_error || fetch_profile_error) {
      throw new Error(
        `Failed to fetch profile: ${fetchError?.message} - ${fetch_wallet_error?.message} - ${fetch_profile_error?.message}`
      );
    }

    let newBonus = 0;

    // 1. Basic Information (full_name & avatar_url): 20 tokens
    if (userData?.full_name && userData?.avatar_url) {
      newBonus += 20;
    }

    // 2. Wallet Connection: 20 tokens (ensure wallet_address exists)
    if (user_wallets && user_wallets.length <= 1) {
      newBonus += 20;
    }

    // 3. About: 20 tokens (non-empty about field)
    if (
      user_profile?.description &&
      user_profile.description.trim().length > 0
    ) {
      newBonus += 20;
    }

    const userSkills = user_profile?.skills as UserSkills | null;

    // 4. Skills: 10 tokens (experience array is non-empty)
    if (
      userSkills?.experience &&
      Array.isArray(userSkills?.experience) &&
      userSkills?.experience.length > 0
    ) {
      newBonus += 10;
    }

    // 5. Technologies: 10 tokens (technologies array is non-empty)
    if (
      userSkills?.technology &&
      Array.isArray(userSkills?.technology) &&
      userSkills.technology.length > 0
    ) {
      newBonus += 10;
    }

    // 6. External Accounts: 5 tokens per account (up to 4 accounts)
    if (
      user_profile?.connected_accounts &&
      Array.isArray(user_profile.connected_accounts)
    ) {
      const externalCount = Math.min(user_profile.connected_accounts.length, 4);
      newBonus += externalCount * 5;
    }

    const tokenService = new TokenService(this.supabase);

    let updatedTokenBalance = user_profile.token_balance;

    const ref = `profile_bonus_${participant_id}`;
    let profileCompletionTokenBalance = await tokenService.getTransactionByRef(
      ref
    );

    const bonusDifference =
      newBonus - (profileCompletionTokenBalance?.amount ?? 0);

    if (bonusDifference > 0) {
      await tokenService.awardTokens({
        userId: participant_id,
        amount: newBonus,
        category: "profile_completion",
        referenceId: ref,
        update: true,
      });
    }

    // Update the profile with the new bonus and the updated overall token balance.
    const { error: update_error } = await this.supabase
      .from("participant_profile")
      .update({
        token_balance: updatedTokenBalance,
      })
      .eq("participant_id", participant_id);

    if (update_error) {
      throw new Error(
        `Failed to update token balance: ${update_error.message}`
      );
    }

    return {
      completionPercentage: newBonus,
    };
  }

  async get_user_token_balance(user_id: string) {
    const tokenService = new TokenService(this.supabase);
    const tokenBalance = await tokenService.getBalance(user_id);

    return tokenBalance;
  }

  async get_auth_user_transactions(user_id: string) {
    const tokenService = new TokenService(this.supabase);
    const tokenBalance = await tokenService.getAllTransactions(user_id);

    return tokenBalance;
  }

  async get_skills_data() {
    const { data: profiles, error } = await this.supabase.from(
      "participant_profile"
    ).select(`
      skills
    `);

    if (error) throw error;
    if (!profiles) return [];

    const arr = Array.isArray(profiles) ? profiles : [profiles];

    const topExp = arr.flatMap((p) => (p.skills as UserSkills)?.experience);
    const topTech = arr.flatMap((p) => (p.skills as UserSkills)?.technology);

    return {
      experience: Array.from(new Set(topExp)),
      technologies: Array.from(new Set(topTech)),
    };
  }
}

export default ProfileService;
