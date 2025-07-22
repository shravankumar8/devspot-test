import { NextRequest } from "next/server";

import { invite_team_mate } from "@/lib/services/projects";
import { errorResponse } from "@/utils/response-helpers";

export const POST = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);

  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }

  const body = await request.json();

  return await invite_team_mate(project_id, body);
};
