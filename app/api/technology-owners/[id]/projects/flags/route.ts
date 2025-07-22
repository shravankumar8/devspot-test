import TechnologyOwnerService from "@/lib/services/technology_owner/services/technology_owner.service";
import { build_response } from "@/lib/services/utils/buildResponse";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { type NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const technology_owner_id = parseInt(params.id);

    if (!technology_owner_id || isNaN(technology_owner_id)) {
      return errorResponse("Invalid Technology Owner ID", 400);
    }

    const supabase = await createClient();
    const service = new TechnologyOwnerService(supabase);
    const data = await service.get_technology_owner_flagged_projects(1);

    const response = build_response(
      "Technology Owner Flagged projects retrieved Successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get Technology Owner's Flagged projects"
    );
  }
};
