import { NextRequest } from "next/server";

import { update_project_allocation } from "@/lib/services/projects";
import { errorResponse } from "@/utils/response-helpers";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);

  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }

  const body = await request.json();

  return await update_project_allocation(project_id, body);
};
