import { NextRequest } from "next/server";
import { flag_judging_entry } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";

export const POST = async (
  request: NextRequest,
  { params }: { params: { judgingId: string; projectId: string } }
) => {
  const judging_id = parseInt(params.judgingId);
  const project_id = parseInt(params.projectId);

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }

  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }

  const body = await request.json();
  return await flag_judging_entry(judging_id, project_id, body);
}; 