import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import FeedbackService from "./services/feedback.service";

export const get_feedback_by_challenge = async (hackathonId: number, challengeId: number) => {
  try {
    const supabase = await createClient();
    const service = new FeedbackService(supabase);
    const result = await service.getFeedbackByChallenge(hackathonId, challengeId);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to fetch feedback for challenge");
  }
};

export const submit_feedback_for_challenge = async (
  hackathon_id: number,
  challenge_id: number,
  body: {
    project_id: number;
    overall_rating: number;
    docs_rating: number;
    support_rating: number;
    comments?: string;
  }
) => {
  try {
    const supabase = await createClient();
    const service = new FeedbackService(supabase);
    const result = await service.createFeedbackForChallenge({
      ...body,
      hackathon_id,
      challenge_id
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to submit feedback");
  }
};

export const update_feedback_for_challenge = async (
  hackathon_id: number,
  challenge_id: number,
  body: {
    project_id: number;
    overall_rating: number;
    docs_rating: number;
    support_rating: number;
    comments?: string;
  }
) => {
  try {
    const supabase = await createClient();
    const service = new FeedbackService(supabase);
    const result = await service.updateFeedbackForChallenge({
      ...body,
      hackathon_id,
      challenge_id
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to update feedback");
  }
};

  