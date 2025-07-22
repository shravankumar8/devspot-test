import { NextRequest } from "next/server";
import { get_judging_progress } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";

export const GET = async (
  request: NextRequest,
  { params }: { params: { judgingId: string } }
) => {
  const judging_id = parseInt(params.judgingId);
  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }

  return await get_judging_progress(judging_id);
};
