import {
  delete_project,
  get_a_project,
  update_project,
} from "@/lib/services/projects";
import { errorResponse } from "@/utils/response-helpers";
import { type NextRequest } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const projectId = parseInt(params.projectId);
  if (isNaN(projectId)) {
    return new Response(JSON.stringify({ error: "Invalid project ID" }), {
      status: 400,
    });
  }

  const body = await request.json();
  return await update_project(projectId, body);
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);

  if (!project_id) return errorResponse("Invalid Project Id", 400);

  return await get_a_project(project_id);
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const projectId = parseInt(params.projectId);
  if (isNaN(projectId)) {
    return new Response(JSON.stringify({ error: "Invalid project ID" }), {
      status: 400,
    });
  }

  return await delete_project(projectId);
};
