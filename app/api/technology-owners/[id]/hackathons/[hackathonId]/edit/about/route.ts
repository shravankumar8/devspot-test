import { edit_hackathon_description } from "@/lib/services/technology_owner";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const PUT = async (
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

  const body = await request.json();

  if (!body.about) {
    return errorResponse("Invalid Hackathon Description", 400);
  }

  return await edit_hackathon_description(
    technology_owner_id,
    hackathon_id,
    body.about
  );
};
