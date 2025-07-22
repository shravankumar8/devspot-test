import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse } from "@/utils/response-helpers";

export const canUserAccessTechnologyOwner = async (
  technology_owner_id: number
) => {
  const supabase = await createClient();
  const { error: authError, user } = await getAuthenticatedUser();
  if (authError || !user) {
    return errorResponse("Authentication required. Please sign in to access this resource.", 401);
  }

  const { data: access, error: accessError } = await supabase
    .from("technology_owner_users")
    .select("technology_owner_id")
    .eq("user_id", user.id)
    .eq("technology_owner_id", technology_owner_id)
    .single();

  if (!access || accessError) {
    return errorResponse(
      "You do not have permission to access this technology owner's resources",
      403
    );
  }
  return null;
};
export const canTechOwnerAccessHackathon = async (
  technology_owner_id: number,
  hackathon_id: number,
) => {
  const supabase = await createClient();

  const { data: hackathon, error: hackathonError } = await supabase
    .from("hackathons")
    .select("organizer_id")
    .eq("id", hackathon_id)
    .eq("organizer_id", technology_owner_id)
    .maybeSingle();

  if (!hackathon || hackathonError) {
    return errorResponse(
      "You do not have permission to access this hackathon. Please ensure you are the organizer of this hackathon.",
      403
    );
  }
};
