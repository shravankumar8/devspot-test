import {
  delete_account,
  get_auth_user_profile,
  update_participant_profile,
} from "@/lib/services/profile";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  return await get_auth_user_profile();
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();

  return await update_participant_profile(body);
};

export const DELETE = async (request: NextRequest) => {
  return await delete_account();
};
