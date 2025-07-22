import JudgingService from "@/lib/services/judging/services/judging.service";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string; judgingId: string } }
) => {
  try {
    const judging_id = parseInt(params.judgingId);
    const hackathon_id = parseInt(params.hackathonId);
    const technology_owner_id = parseInt(params.id);

    if (!judging_id || isNaN(judging_id)) {
      return errorResponse("Invalid Judging Id", 400);
    }

    if (!hackathon_id || isNaN(hackathon_id)) {
      return errorResponse("Invalid Hackathon Id", 400);
    }

    if (!technology_owner_id || isNaN(technology_owner_id)) {
      return errorResponse("Invalid Technology Owner Id", 400);
    }

    const supabase = await createClient();
    const service = new JudgingService(supabase);
    const result = await service.getJudgingChallenges(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to get judging challenges", 500);
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string; judgingId: string } }
) => {
  try {
    const judgingId = parseInt(params.judgingId);
    const hackathonId = parseInt(params.hackathonId);
    const technologyOwnerId = parseInt(params.id);

    if (isNaN(judgingId)) {
      return errorResponse("Invalid judging ID", 400);
    }

    if (isNaN(hackathonId)) {
      return errorResponse("Invalid hackathon ID", 400);
    }

    if (isNaN(technologyOwnerId)) {
      return errorResponse("Invalid technology owner ID", 400);
    }

    const body = await request.json();
    if (!body.challenge_ids || !Array.isArray(body.challenge_ids)) {
      return errorResponse("Request body must include challenge_ids array", 400);
    }

    // Validate that all items in the array are numbers
    if (!body.challenge_ids.every((id: number) => typeof id === 'number' && !isNaN(id))) {
      return errorResponse("All challenge IDs must be valid numbers", 400);
    }

    const supabase = await createClient();
    const service = new JudgingService(supabase);

    // Get current challenges for this judge
    const currentChallenges = await service.getJudgingChallenges(judgingId);
    const currentChallengeIds = currentChallenges.map((challenge: any) => challenge.id);

    const newChallengeIds = body.challenge_ids;
    const challengesToAdd = newChallengeIds.filter((id: number) => !currentChallengeIds.includes(id));
    const challengesToRemove = currentChallengeIds.filter((id: number) => !newChallengeIds.includes(id));

    let addResult = null;
    let removeResult = null;

    // Add new challenges
    if (challengesToAdd.length > 0) {
      addResult = await service.addChallengesToJudging(judgingId, challengesToAdd);
    }

    // Remove challenges not in new list
    if (challengesToRemove.length > 0) {
      removeResult = await service.removeChallengesFromJudging(judgingId, challengesToRemove);
    }

    return successResponse({
      judging_id: judgingId,
      challenges_added: challengesToAdd.length,
      challenges_removed: challengesToRemove.length,
      total_challenges: newChallengeIds.length,
      add_result: addResult,
      remove_result: removeResult
    });

  } catch (error: any) {
    console.error("Error updating judge challenges:", error);
    return errorResponse(
      error?.message ?? "Failed to update judge challenges",
      500
    );
  }
}; 