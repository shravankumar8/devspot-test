import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import {
  ai_project_validation_schema,
  project_request_validation,
  project_validation_schema,
  teamMemberFormSchema,
  update_project_allocation_validation_schema,
} from "./schema";
import ProjectService from "./services/project.service";

export const get_all_submitted_projects = async () => {
  try {
    const supabase = await createClient();

    const service = new ProjectService(supabase);

    const data = await service.get_all_submitted_projects();

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Projects");
  }
};

export const create_ai_project = async (body: any) => {
  try {
    const supabase = await createClient();

    const service = new ProjectService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const validated_body = await ai_project_validation_schema.validate(body);

    const result = await service.create_project({
      ai: true,
      creator_id: user.id,
      hackathonId: validated_body.hackathonId,
      projectUrl: validated_body.projectUrl,
      name: validated_body?.name ?? undefined,
    });

    return successResponse(result);
  } catch (error: any) {
    console.log(error)
    return errorResponse(error?.message ?? "Failed to create project");
  }
};

export const create_project = async (body: any) => {
  try {
    const supabase = await createClient();

    const service = new ProjectService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const validated_body = await project_validation_schema.validate(body);

    const result = await service.create_project({
      ai: false,
      creator_id: user.id,
      hackathonId: validated_body.hackathonId,
      projectUrl: validated_body.projectUrl,
      name: validated_body.name,
      challengeIds: validated_body.challengeIds,
      project_code_type:validated_body.projectCodeType,
      logo_url: validated_body.logo_url
      
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to create project");
  }
};

export const get_a_project = async (project_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const { user } = await getAuthenticatedUser();

    const result = await service.get_a_project(project_id, user?.id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get project");
  }
};

export const update_project = async (
  projectId: number,
  updates: Partial<{
    name: string;
    description: string;
    demo_url: string;
    video_url: string;
    project_url: string;
    logo_url: string;
    header_url: string;
    submitted: boolean;
    technologies: string[];
    challenge_ids: number[];
    project_code_type?: "fresh_code" | "existing_code";
  }>
) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const updated = await service.update_project(projectId, updates);

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update project");
  }
};

export const delete_project = async (projectId: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const result = await service.delete_project(projectId);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to delete project");
  }
};

export const invite_team_mate = async (project_id: number, body: any) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const validated_body = await project_request_validation.validate(body);

    const result = await service.invite_team_mate(
      project_id,
      validated_body?.participant_id
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to invite teammate");
  }
};

export const update_project_team = async (
  project_id: number,
  body: any,
  origin: string
) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const validated_body = await teamMemberFormSchema.validate(body);

    const result = await service.update_project_team(
      project_id,
      user,
      origin,
      validated_body
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update project team");
  }
};

export const request_to_join_project = async (project_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const result = await service.request_to_join_project(project_id, user.id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to request to join project");
  }
};

export const handle_invitation = async (
  project_id: number,
  handler_type: "approve" | "reject",
  transaction_id: string
) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    if (handler_type === "approve") {
      const result = await service.user_accept_project_invitation(
        project_id,
        user.id,
        transaction_id
      );
      return successResponse(result);
    }

    const result = await service.user_reject_project_invitation(
      project_id,
      user.id,
      transaction_id
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update invitation");
  }
};

export const submit_project = async (project_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const { error } = await getAuthenticatedUser();

    if (error) return error;

    const result = await service.submit_project(project_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Submit project");
  }
};

export const update_project_allocation = async (
  project_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const validated_body =
      await update_project_allocation_validation_schema.validate(body);

    const result = await service.update_project_allocation(
      project_id,
      user?.id,
      validated_body
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to Update project Allocation"
    );
  }
};

export const update_project_logo = async (
  project_id: number,
  form_data: FormData
) => {
  try {
    const supabase = await createClient();

    const { error } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ProjectService(supabase);

    const data = await service.update_project_logo(project_id, form_data);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update project image");
  }
};

export const update_project_video = async (
  project_id: number,
  form_data: FormData
) => {
  try {
    const supabase = await createClient();

    const { error } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ProjectService(supabase);

    const data = await service.update_project_video(project_id, form_data);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update project video");
  }
};

export const remove_project_logo = async (project_id: number) => {
  try {
    const supabase = await createClient();

    const { error } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ProjectService(supabase);

    const data = await service.remove_project_logo(project_id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to remove project image");
  }
};

export const update_header_image = async (
  project_id: number,
  form_data: FormData
) => {
  try {
    const supabase = await createClient();

    const { error } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ProjectService(supabase);

    const data = await service.update_project_header(project_id, form_data);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update header image");
  }
};

export const remove_header_image = async (project_id: number) => {
  try {
    const supabase = await createClient();

    const { error } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ProjectService(supabase);

    const data = await service.remove_project_header(project_id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to remove header image");
  }
};

export const leave_project = async (project_id: number) => {
  try {
    const supabase = await createClient();

    const { error, user } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ProjectService(supabase);

    const data = await service.leave_project(project_id, user?.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to leave project");
  }
};

export const get_challenge_submission_stats = async (hackathonId: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const result = await service.getProjectSubmissionStatsForHackathon(hackathonId);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to fetch submission stats");
  }
};

export const get_project_statuses = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const result = await service.getProjectStatuses(hackathon_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to fetch project statuses");
  }
};

export const get_projects_per_challenge = async (hackathonId: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const result = await service.getProjectsPerChallenge(hackathonId);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to fetch projects per challenge");
  }
};

export const get_technologies_from_challenges = async (hackathonId: number) => {
  try {
    const supabase = await createClient();
    const service = new ProjectService(supabase);

    const result = await service.getTechnologiesFromChallenges(hackathonId);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to fetch technologies from challenges");
  }
};
