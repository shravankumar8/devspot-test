import { assign_winners_for_challenges } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { judgingId: string } }
) => {
  const judging_id = parseInt(params.judgingId);

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }

  const body = await request.json();
  return await assign_winners_for_challenges(judging_id, body);
};
