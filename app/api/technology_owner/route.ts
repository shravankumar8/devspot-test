import { get_all_technology_owners } from "@/lib/services/technology_owner";
import { type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  return await get_all_technology_owners();
};
