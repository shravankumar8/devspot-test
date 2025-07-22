import { NextRequest } from "next/server";

import { request_to_join_project } from "@/lib/services/projects";
import { errorResponse } from "@/utils/response-helpers";

export const POST = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);

  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }

  return await request_to_join_project(project_id);
};
