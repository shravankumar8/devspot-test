import { get_winner_assigner_challenges } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { judgingId: string } }
) => {
  const judging_id = parseInt(params.judgingId);

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }

  return await get_winner_assigner_challenges(judging_id);
};
