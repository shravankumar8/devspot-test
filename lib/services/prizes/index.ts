import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import * as yup from "yup";
import { validatePrizeData } from "./schema";
import PrizeService from "./services/prize.service";

export const get_projects_for_challenge = async (challenge_id: number) => {
  try {
    const supabase = await createClient();
    const service = new PrizeService(supabase);

    const result = await service.getProjectsForChallenge(challenge_id);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to fetch projects for challenge"
    );
  }
};

/**
 * Get all challenges for a hackathon with prizes, judges, and assigned projects
 *
 * @param hackathonId The ID of the hackathon
 * @param technologyOwnerId The ID of the technology owner
 * @returns Success or error response with challenges data
 */
export const get_hackathon_challenges_with_prizes = async (
  hackathonId: number,
  technologyOwnerId: number
) => {
  try {
    const supabase = await createClient();
    const service = new PrizeService(supabase);

    const result = await service.getHackathonChallengesWithPrizes(hackathonId, technologyOwnerId);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to fetch hackathon challenges with prizes",
      500
    );
  }
};

/**
 * Delete a prize from a hackathon challenge
 *
 * @param prizeId The ID of the prize to delete
 * @param technologyOwnerId The ID of the technology owner
 * @param hackathonId The ID of the hackathon
 * @returns Success or error response
 */
export const delete_prize = async (
  prizeId: number,
  technologyOwnerId: number,
  hackathonId: number
) => {
  try {
    const supabase = await createClient();
    const service = new PrizeService(supabase);

      const result = await service.deletePrize(prizeId, technologyOwnerId, hackathonId);

    return successResponse({
      message: "Prize deleted successfully",
        data: result
    });
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to delete prize", 500);
  }
};

/**
 * Create or update a prize for a hackathon challenge
 *
 * @param prizeData The prize data including optional id for updates
 * @param technologyOwnerId The ID of the technology owner
 * @param hackathonId The ID of the hackathon
 * @returns Success or error response
 */
export const create_or_update_prize = async (
  body: FormData,
  technologyOwnerId: number,
  hackathonId: number
) => {
  try {
    const supabase = await createClient();
    const service = new PrizeService(supabase);

    const validation = await validatePrizeData(body);

    if (!validation.isValid) {
      return errorResponse(
        validation.errors?.join(", ") || "Validation failed",
        400
      );
    }

    const prizeData = validation.data!;
    console.log({prizeData})

    const result = await service.createOrUpdatePrize(prizeData, technologyOwnerId, hackathonId);

    return successResponse({
      message: result.message,
      data: result.prize,
      action: result.action
    });
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to create or update prize", 500);
  }
};

export const publish_winners_for_challenges = async (
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const winnerSchema = yup.object().shape({
      winners: yup
        .array()
        .of(
          yup.object().shape({
            challenge_id: yup.number().required("Challenge ID is required"),
            project_id: yup.number().required("Project ID is required"),
            prize_id: yup.number().required("Prize ID is required"),
          })
        )
        .required("Winners array is required"),
    });

    await winnerSchema.validate(body);

    // const { user, error: authError } = await getAuthenticatedUser();
    // if (authError) return authError;

    const service = new PrizeService(supabase);
    const result = await service.publishWinnersForChallenges(
      hackathon_id,
      body.winners
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to publish winners");
  }
};
