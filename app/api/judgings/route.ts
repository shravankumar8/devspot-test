import { NextRequest } from "next/server";
import { create_judging } from "@/lib/services/judging";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  return await create_judging(body);
};