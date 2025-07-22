import { get_challenge_judges_for_winner_assignment } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { judgingId: string; challengeId: string } }
) => {
  const judging_id = parseInt(params.judgingId);
  const challenge_id = parseInt(params.challengeId);

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }
  if (!challenge_id || isNaN(challenge_id)) {
    return errorResponse("Invalid Challenge Id", 400);
  }
  return await get_challenge_judges_for_winner_assignment(
    judging_id,
    challenge_id
  );
};
