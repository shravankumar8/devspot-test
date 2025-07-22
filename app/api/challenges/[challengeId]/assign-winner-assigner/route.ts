import { assign_winner_assigner } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { challengeId: string } }
) => {
  try {
    const challengeId = parseInt(params.challengeId);
    if (isNaN(challengeId)) {
      return errorResponse("Invalid challenge ID", 400);
    }

    const body = await request.json();
    const { judgeId, isWinnerAssigner } = body;

    if (!judgeId || typeof isWinnerAssigner !== "boolean") {
      return errorResponse("Missing required fields: judgeId and isWinnerAssigner", 400);
    }

    return await assign_winner_assigner(challengeId, judgeId, isWinnerAssigner);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to assign winner assigner", 500);
  }
}; 