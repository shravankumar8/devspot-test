import { get_all_submitted_projects, create_project } from "@/lib/services/projects";
import { type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  return await get_all_submitted_projects();
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  return await create_project(body);
};
