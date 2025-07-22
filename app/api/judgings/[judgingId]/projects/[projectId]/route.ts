import { get_judging_project_details, submit_judging_entry, update_judging_entry } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { judgingId: string; projectId: string } }
) => {
  const judging_id = parseInt(params.judgingId);
  const project_id = parseInt(params.projectId);
  const searchParams = request.nextUrl.searchParams;
  const challenge_id = parseInt(searchParams.get("challengeId") ?? "");

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }
  if (!project_id || isNaN(project_id)) {
    return errorResponse("Invalid Project Id", 400);
  }
  if (!challenge_id || isNaN(challenge_id)) {
    return errorResponse("Invalid Challenge Id", 400);
  }

  return await get_judging_project_details(judging_id, project_id, challenge_id);
};

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
  return await submit_judging_entry(judging_id, project_id, body);
};

export const PUT = async (
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
  return await update_judging_entry(judging_id, project_id, body);
}; 