import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { SupabaseClient } from "@supabase/supabase-js";
import { build_response } from "../utils/buildResponse";

type Supabase = SupabaseClient<Database>;

export const get_hackathons_discover_page = async () => {
  try {
    const supabase: Supabase = await createClient();

    const { data } = await supabase
      .from("hackathons_discover_view")
      .select("*")
      .neq("id", 1)
      .order("registration_start_date", { ascending: true });

    let { data: plInitialData } = await supabase
      .from("hackathons")
      .select(
        "*, organizer:technology_owners(*), participants:hackathon_participants(count)"
      )
      .eq("id", 1)
      .single();

    let plHackathon = {
      ...plInitialData,
      number_of_participants: plInitialData?.participants?.[0]?.count ?? 0,
    };

    const hackathonsCount = await supabase
      .from("hackathons")
      .select("*", { count: "exact", head: true });

    const response = build_response(
      "Hackathons for Discover Page retrieved Successfully",
      {
        data: [plHackathon, ...(data ?? [])],
        count: hackathonsCount.count,
      }
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathons for Discover Page"
    );
  }
};

export const get_people_discover_page = async () => {
  try {
    const supabase: Supabase = await createClient();
    const { user } = await getAuthenticatedUser();

    // Get top users query builder
    const getTopUsersQuery = (userId?: string) => {
      const query = supabase
        .from("top_people_view")
        .select("*")
        .order("completion_percentage", { ascending: false })
        .order("full_name", { ascending: true })
        .limit(10);

      return userId ? query.not("id", "eq", userId) : query;
    };

    // Get total people count query builder
    const getPeopleCountQuery = (userId?: string) => {
      return supabase.from("users").select("*", { count: "exact", head: true });
    };

    // Fetch users and process their profiles
    const { data: users } = await getTopUsersQuery(user?.id);

    const processUserProfile = async (user: any) => {
      const profile = Array.isArray(user.profile)
        ? user.profile[0]
        : user.profile;

      const { count: project_count = 0, error: countError } = await supabase
        .from("project_team_members")
        .select("project_id", { head: true, count: "exact" })
        .eq("user_id", user.id);

      if (countError) {
        console.error("couldn't load project_count for", user.id, countError);
      }

      return {
        ...user,
        profile,
        project_count,
      };
    };

    const scored = await Promise.all(users?.map(processUserProfile) ?? []);
    const peopleCount = await getPeopleCountQuery(user?.id);

    const response = build_response(
      "People for Discover Page retrieved Successfully",
      {
        data: scored,
        count: peopleCount.count,
      }
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get people for Discover Page"
    );
  }
};

export const get_projects_discover_page = async () => {
  try {
    const supabase: Supabase = await createClient();

    const { data } = await supabase
      .from("projects")
      .select(
        `
          *, 
          hackathons (name, organizer:technology_owners(*)),
          project_team_members!inner (
            id,
            is_project_manager,
            users (
              id,
              full_name,
              avatar_url
            )
          ),
          project_challenges (
            hackathon_challenges (
              id,
              challenge_name
            )
          )
        `
      )
      .order("created_at", { ascending: false })
      .eq("submitted", true)
      .eq("project_team_members.status", "confirmed");

    const projectsCount = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("submitted", true);

    const response = build_response(
      "Projects for Discover Page retrieved Successfully",
      {
        data: data ?? [],
        count: projectsCount.count,
      }
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get projects for Discover Page"
    );
  }
};
