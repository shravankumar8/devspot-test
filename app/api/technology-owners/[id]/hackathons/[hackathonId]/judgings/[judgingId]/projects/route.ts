import { NextRequest } from "next/server";
import { errorResponse } from "@/utils/response-helpers";
import { get_projects_a_judge_is_judging, add_judge_to_projects, delete_judge_from_projects } from "@/lib/services/judging";

export const GET = async (
  request: NextRequest,
  { params }: { params: { judgingId: string } }
) => {
  const judging_id = parseInt(params.judgingId);

  if (!judging_id || isNaN(judging_id)) {
    return errorResponse("Invalid Judging Id", 400);
  }

  const result = await get_projects_a_judge_is_judging(judging_id);
  
  return result;
};

export const POST = async (
    request: NextRequest,
    { params }: { params: { judgingId: string } }
  ) => {
    const judging_id = parseInt(params.judgingId);
  
    if (!judging_id || isNaN(judging_id)) {
        return errorResponse("Invalid Judging Id", 400);
    }

    const body = await request.json();
    const { project_challenge_pairs } = body;
  
    if (!Array.isArray(project_challenge_pairs)) {
      return errorResponse("Invalid request body: project_challenge_pairs missing or invalid", 400);
    }
  
    const result = await add_judge_to_projects(judging_id, project_challenge_pairs);
  
    return result;
  };

  export const DELETE = async (
    request: NextRequest,
    { params }: { params: { judgingId: string } }
  ) => {
    const judging_id = parseInt(params.judgingId);
    if (!judging_id) return errorResponse("Invalid Judging Id", 400);
  
    const body = await request.json();
    const { project_challenge_pairs } = body;
  
    if (!Array.isArray(project_challenge_pairs)) {
      return errorResponse("Invalid request body", 400);
    }
  
    const result = await delete_judge_from_projects(judging_id, project_challenge_pairs);
  
    return result;
  };
