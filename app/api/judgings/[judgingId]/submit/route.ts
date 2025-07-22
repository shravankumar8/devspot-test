import { NextRequest } from "next/server";
import { submit_all_scores } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";

export const POST = async (
  request: NextRequest,
  { params }: { params: { judgingId: string } }
) => {
  const judging_id = parseInt(params.judgingId);

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }

  return await submit_all_scores(judging_id);
}; 