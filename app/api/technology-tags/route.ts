import {
  create_tag,
  get_technology_tag_options,
} from "@/lib/services/utils/tagService";
import { type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request?.json();

  return await create_tag(body);
};

export const GET = async (request: NextRequest) => {
  return await get_technology_tag_options();
};
