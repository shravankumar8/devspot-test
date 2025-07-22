import { assign_projects_to_judges } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body.botScoreIds)) {
      return errorResponse("botScoreIds must be an array", 400);
    }

    if (body.botScoreIds.length === 0) {
      return errorResponse("botScoreIds array cannot be empty", 400);
    }

    if (!body.botScoreIds.every((id: number) => typeof id === 'number')) {
      return errorResponse("All botScoreIds must be numbers", 400);
    }

    return await assign_projects_to_judges(body.botScoreIds);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to process request", 500);
  }
}; 