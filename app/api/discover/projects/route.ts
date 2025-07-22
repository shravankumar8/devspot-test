import { get_projects_discover_page } from "@/lib/services/discover";
import { type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  return await get_projects_discover_page();
};
