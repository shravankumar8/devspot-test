import {
  remove_header_image,
  update_header_image,
} from "@/lib/services/projects";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);

  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }

  const formData = await request.formData();
  return await update_header_image(project_id, formData);
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);

  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }

  return await remove_header_image(project_id);
};
