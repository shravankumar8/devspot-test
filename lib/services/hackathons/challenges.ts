import { createClient } from "@/lib/supabase/server";

// import { getHackathonById } from "./hackathon";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";

export async function getChallenges(hackathonId: string) {
  const supabase = await createClient();

  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const hackathonResponse = null;
  if (!hackathonResponse || "error" in hackathonResponse)
    return hackathonResponse;

  const { data, error: challengesError } = await supabase
    .from("challenges")
    .select("*")
    .eq("hackathon_id", hackathonId)
    .order("order", { ascending: true });

  if (challengesError) {
    return errorResponse(
      `Failed to fetch challenges: ${challengesError.message}`
    );
  }

  return successResponse(data);
}

export async function upsertChallenge(data: {
  hackathonId: string;
  id?: string;
  title: string;
  description: string;
  order: number;
}) {
  const supabase = await createClient();

  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const { hackathonId, id, title, description, order } = data;

  const hackathonResponse = null;
  if (!hackathonResponse || "error" in hackathonResponse)
    return hackathonResponse;

  if (!title || !description || order === undefined) {
    return errorResponse("Missing required fields: title, description, order");
  }

  // If ID is provided, check if challenge exists and belongs to this hackathon
  if (id) {
    const { data: existingChallenge, error: checkError } = await supabase
      .from("challenges")
      .select("id")
      .eq("id", id)
      .eq("hackathon_id", hackathonId)
      .single();

    if (checkError || !existingChallenge) {
      return errorResponse(
        "Invalid challenge ID or challenge does not belong to this hackathon"
      );
    }
  }

  const challengeData = {
    title,
    description,
    order,
    hackathon_id: hackathonId,
  };

  const { data: challenge, error: upsertError } = await supabase
    .from("challenges")
    .upsert(id ? { ...challengeData, id } : challengeData, { onConflict: "id" })
    .select()
    .single();

  if (upsertError) {
    return errorResponse(
      `Failed to ${id ? "update" : "add"} challenge: ${upsertError.message}`
    );
  }

  return successResponse({
    message: `Challenge ${id ? "updated" : "added"} successfully`,
    data: challenge,
  });
}

export async function deleteChallenge(
  hackathonId: string,
  challengeId: string
) {
  const supabase = await createClient();

  const { user, error } = await getAuthenticatedUser();
  if (error) return error;

  const hackathonResponse = null;
  if (!hackathonResponse || "error" in hackathonResponse)
    return hackathonResponse;

  // Check if challenge exists and belongs to this hackathon
  const { data: existingChallenge, error: checkError } = await supabase
    .from("challenges")
    .select("id")
    .eq("id", challengeId)
    .eq("hackathon_id", hackathonId)
    .single();

  if (checkError || !existingChallenge) {
    return errorResponse(
      "Invalid challenge ID or challenge does not belong to this hackathon"
    );
  }

  const { error: deleteError } = await supabase
    .from("challenges")
    .delete()
    .eq("id", challengeId);

  if (deleteError) {
    return errorResponse(`Failed to delete challenge: ${deleteError.message}`);
  }

  return successResponse({ message: "Challenge deleted successfully" });
}
