import TechnologyOwnerService from "@/lib/services/technology_owner/services/technology_owner.service";
import { build_response } from "@/lib/services/utils/buildResponse";
import parseRequestParams from "@/lib/services/utils/parseRequestParams";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { type NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const search_params = request.nextUrl.searchParams;

    const paramsObject = parseRequestParams(search_params);

    if (!paramsObject.search_term)
      return errorResponse("Invalid Search Term", 400);

    const supabase = await createClient();
    const service = new TechnologyOwnerService(supabase);
    const data = await service.search_technology_owner(
      paramsObject.search_term
    );

    const response = build_response(
      "Technology Owner Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve Technology Owner"
    );
  }
};
