import { Users } from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import ApiBaseService, { QueryModifierOptions } from "../../utils/baseService";

class UserService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async get_all_users(options?: Partial<QueryModifierOptions>) {
    const getBaseQuery = () => {
      let baseQuery = this.supabase
        .from("top_people_view")
        .select("*")
        .order("completion_percentage", { ascending: false })
        .order("full_name", { ascending: true });

      if (options?.search_term && options?.search_term.trim() !== "") {
        baseQuery = baseQuery.ilike("full_name", `%${options?.search_term}%`);
      }

      return baseQuery;
    };

    const getCountQuery = () => {
      let countQuery = this.supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (options?.search_term && options?.search_term.trim() !== "") {
        countQuery = countQuery.ilike("full_name", `%${options?.search_term}%`);
      }

      return countQuery;
    };

    // Get paginated data
    const paginatedData = await this.fetch_paginated_data<Users>(
      getBaseQuery(),
      options,
      getCountQuery()
    );

    // Helper function to get project count for a user
    const getProjectCount = async (userId: string) => {
      const { count, error } = await this.supabase
        .from("project_team_members")
        .select("project_id", { head: true, count: "exact" })
        .eq("user_id", userId);

      if (error) {
        console.error("couldn't load project_count for", userId, error);
        return 0
      }

      return count ?? 0;
    };

    // Process user data with project counts
    const processedUsers = await Promise.all(
      (paginatedData.items ?? []).map(async (user) => ({
        ...user,
        profile: Array.isArray(user.profile) ? user.profile[0] : user.profile,
        project_count: await getProjectCount(user.id),
      }))
    );

    return { ...paginatedData, items: processedUsers };
  }

  async get_user_hackathons(user_id: string) {
    const { data, error: fetch_error } = await this.supabase
      .from("hackathon_participants")
      .select(
        `
        *,
        hackathon:hackathons(
          *,
          organizer:technology_owners(name),
          participants:hackathon_participants(count)
        )
      `
      )
      .eq("participant_id", user_id);

    if (fetch_error) {
      throw new Error(
        `Failed to fetch user's hackathons: ${fetch_error.message}`
      );
    }

    const tdata = data.map((item) => {
      return {
        ...item.hackathon,
        number_of_participants: item.hackathon.participants[0]?.count ?? 0,
      };
    });

    return tdata ?? [];
  }

  async get_user_projects(user_id: string, isOwner: boolean) {
    let query = this.supabase
      .from("projects")
      .select(
        `
      *,
      hackathons (
        name, organizer:technology_owners(*)
      ),
      project_challenges (
        hackathon_challenges (
          id,
          challenge_name
        )
      ),
      project_team_members!inner (
        id,
        is_project_manager,
        user_id,              
        users (
          id,
          full_name,
          email,
          avatar_url
        )
      )
    `
      )
      .eq("project_team_members.user_id", user_id)
      .eq("project_team_members.status", "confirmed");

    if (!isOwner) {
      query = query.eq("submitted", true);
    }

    const { data, error: fetch_error } = await query;

    if (fetch_error) {
      throw new Error(
        `Failed to fetch user's projects: ${fetch_error.message}`
      );
    }

    return data ?? [];
  }
}

export default UserService;
