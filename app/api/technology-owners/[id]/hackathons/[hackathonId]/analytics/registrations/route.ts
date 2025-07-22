import { get_hackathon_registrations } from "@/lib/services/technology_owner";
import parseRequestParams from "@/lib/services/utils/parseRequestParams";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string } }
) => {
  const hackathonId = parseInt(params.hackathonId);

  if (isNaN(hackathonId)) {
    return errorResponse("Invalid hackathon ID", 400);
  }

  const hackathon_id = parseInt(params.hackathonId);

  if (!hackathon_id) return errorResponse("Invalid Hackathon Id", 400);

  const search_params = request.nextUrl.searchParams;
  const paramsObject = parseRequestParams(search_params);

  return await get_hackathon_registrations(hackathon_id, paramsObject);
};
