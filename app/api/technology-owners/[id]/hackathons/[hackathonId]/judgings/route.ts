import JudgingService from "@/lib/services/judging/services/judging.service";
import TechnologyOwnerService from "@/lib/services/technology_owner/services/technology_owner.service";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string } }
) {
  try {
    const supabase = await createClient();
    const judgingService = new JudgingService(supabase);

    // Verify the technology owner has access to this hackathon
    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", params.hackathonId)
      .single();

    if (hackathonError) {
      return errorResponse("Hackathon not found", 404);
    }

    if (hackathon.organizer_id !== parseInt(params.id)) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const judges = await judgingService.getHackathonJudges(
      parseInt(params.hackathonId)
    );
    return successResponse(judges);
  } catch (error) {
    console.error("Error fetching hackathon judges:", error);
    return errorResponse("Failed to fetch hackathon judges", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; hackathonId: string } }
) {
  try {
    const supabase = await createClient();
    const judgingService = new TechnologyOwnerService(supabase);

    // Verify the technology owner has access to this hackathon
    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", params.hackathonId)
      .single();

    if (hackathonError) {
      return errorResponse("Hackathon not found", 404);
    }

    if (hackathon.organizer_id !== parseInt(params.id)) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const body = await request.json();

    if (!body?.email) {
      return errorResponse("Email is required", 400);
    }

    const judges = await judgingService.invite_judge(
      body.email,
      parseInt(params.hackathonId)
    );
    return successResponse(judges);
  } catch (error) {
    console.error("Error inviting hackathon judges:", error);
    return errorResponse("Failed to Invite hackathon judges", 500);
  }
}
