import { get_hackathon_registration_analytics } from "@/lib/services/technology_owner";
import { Granularity } from "@/lib/services/technology_owner/services/analytics.service";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string } }
) => {
  const hackathon_id = parseInt(params.hackathonId);
  const { searchParams } = new URL(request.url);

  if (!hackathon_id || isNaN(hackathon_id))
    return errorResponse("Invalid Hackathon Id", 400);

  const granularity = (searchParams.get("granularity") ?? "day") as Granularity;

  if (!["day", "week", "month", "year"].includes(granularity as string)) {
    return errorResponse(
      "Invalid Granularity. Granularity must be either between day, week, month or year"
    );
  }
  
  return await get_hackathon_registration_analytics(hackathon_id, granularity);
};
