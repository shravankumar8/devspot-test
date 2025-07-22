import { assign_challenges_to_projects } from "@/lib/services/technology_owner";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string } }
) => {
  try {
    const hackathonId = parseInt(params.hackathonId);
    const technologyOwnerId = parseInt(params.id);

    if (isNaN(hackathonId)) {
      return errorResponse("Invalid hackathon ID", 400);
    }

    if (isNaN(technologyOwnerId)) {
      return errorResponse("Invalid technology owner ID", 400);
    }

    const body = await request.json();
    const { project_ids, challenge_ids } = body;

    if (!project_ids || !Array.isArray(project_ids) || project_ids.length === 0) {
      return errorResponse("project_ids is required and must be a non-empty array", 400);
    }

    if (!challenge_ids || !Array.isArray(challenge_ids) || challenge_ids.length === 0) {
      return errorResponse("challenge_ids is required and must be a non-empty array", 400);
    }

    // Validate that all IDs are numbers
    if (!project_ids.every(id => typeof id === 'number' && !isNaN(id))) {
      return errorResponse("All project_ids must be valid numbers", 400);
    }

    if (!challenge_ids.every(id => typeof id === 'number' && !isNaN(id))) {
      return errorResponse("All challenge_ids must be valid numbers", 400);
    }

    return await assign_challenges_to_projects(hackathonId, project_ids, challenge_ids);
  } catch (error: any) {
    console.error("Error assigning challenges to projects:", error);
    return errorResponse(
      error?.message ?? "Failed to assign challenges to projects",
      500
    );
  }
}; 