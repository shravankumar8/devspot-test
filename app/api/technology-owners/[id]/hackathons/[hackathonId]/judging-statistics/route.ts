import { get_hackathon_judging_statistics } from "@/lib/services/judging";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const GET = async (
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

    return await get_hackathon_judging_statistics(hackathonId);
  } catch (error: any) {
    console.error("Error fetching hackathon judging statistics:", error);
    return errorResponse(
      error?.message ?? "Failed to fetch hackathon judging statistics",
      500
    );
  }
}; 