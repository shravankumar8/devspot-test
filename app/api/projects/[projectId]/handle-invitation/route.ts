import { handle_invitation } from "@/lib/services/projects";
import { errorResponse } from "@/utils/response-helpers";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { projectId: string } }
) => {
  const project_id = parseInt(params.projectId);
  const search_params = request.nextUrl.searchParams;

  const handlerType = search_params.get("handler_type") as "approve" | "reject";
  const transactionId = search_params.get("transaction_id");

  if (!project_id || isNaN(project_id) || !handlerType || !transactionId) {
    return errorResponse("project_id and handler_type are required", 400);
  }

  return await handle_invitation(project_id, handlerType, transactionId);
};
