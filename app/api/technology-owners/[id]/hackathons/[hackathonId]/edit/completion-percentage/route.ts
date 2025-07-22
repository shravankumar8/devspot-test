import { get_hackathon_completion_percentage } from "@/lib/services/technology_owner";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string } }
) => {
  const hackathon_id = parseInt(params.hackathonId);
  const technology_owner_id = parseInt(params.id);

  if (!hackathon_id || isNaN(hackathon_id)) {
    return errorResponse("Invalid Hackathon Id", 400);
  }
  if (!technology_owner_id || isNaN(technology_owner_id)) {
    return errorResponse("Invalid technology owner ID", 400);
  }

  return await get_hackathon_completion_percentage(
    technology_owner_id,
    hackathon_id
  );
};
