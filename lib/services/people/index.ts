import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { query_validators } from "../hackathons/schema";
import { build_response } from "../utils/buildResponse";
import UserService from "./services/user.service";

export const get_all_users = async (body: any) => {
  try {
    const supabase = await createClient();
    const user_service = new UserService(supabase);
    const validated_body = await query_validators.validate(body);

    const data = await user_service.get_all_users(validated_body);

    const response = build_response("Users Retrieved Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Users");
  }
};

export const get_user_hackathons = async (user_id: string) => {
  try {
    const supabase = await createClient();

    const user_service = new UserService(supabase);

    const data = await user_service.get_user_hackathons(user_id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get user's hackathons");
  }
};

export const get_user_projects = async (user_id: string) => {
  try {
    const supabase = await createClient();

    const user_service = new UserService(supabase);
    const { user } = await getAuthenticatedUser();

    const data = await user_service.get_user_projects(
      user_id,
      user?.id === user_id
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get user's projects");
  }
};
