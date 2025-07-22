import { createClient } from "@/lib/supabase/server";
import { authenticateAndAuthorizeUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";

export async function getAllProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return errorResponse(`Failed to fetch all projects: ${error.message}`);
  }

  return successResponse(data);
}

export async function getUserProjects(userId: string) {
  const supabase = await createClient();

  const { user, error } = await authenticateAndAuthorizeUser(userId);
  if (error) return error;

  const { data, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId);

  if (fetchError) {
    return errorResponse(`Failed to fetch projects: ${fetchError.message}`);
  }

  return successResponse(data);
}
