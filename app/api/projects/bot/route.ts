import { create_ai_project } from "@/lib/services/projects";
import { type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  return await create_ai_project(body);
};
