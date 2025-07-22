import { createClient } from "@/lib/supabase/server";
import { ParticipantProfile } from "@/types/entities";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import * as Yup from "yup";
import ParticipantRolesService from "./services/participant_roles.service";
import ProfileService from "./services/profile.service";
import UserService from "./services/user.service";

export const get_all_participant_roles = async () => {
  try {
    const supabase = await createClient();

    const partcipant_roles_service = new ParticipantRolesService(supabase);

    const data = await partcipant_roles_service.get_all_participant_roles();

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Participant Roles");
  }
};

export const update_participant_roles = async (body: any) => {
  const schema = Yup.object({
    ids: Yup.array().of(Yup.number().required().defined()).required(),
    primaryRoleId: Yup.number().required(),
  });

  try {
    const supabase = await createClient();

    const partcipant_roles_service = new ParticipantRolesService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const roles_data = await schema.validate(body);

    if (roles_data.ids.length < 1 && !roles_data.primaryRoleId)
      throw new Error("Must have atleast one role");

    await partcipant_roles_service.update_roles_for_participant(
      user?.id,
      roles_data.ids ?? [],
      roles_data.primaryRoleId
    );

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Participant Roles");
  }
};

export const get_user_profile = async (participant_id: string) => {
  try {
    const supabase = await createClient();

    const profile_service = new ProfileService(supabase);

    const data = await profile_service.get_participant_profile(participant_id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get User Profile");
  }
};

export const get_auth_user_profile = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const profileService = new ProfileService(supabase);

    const data = await profileService.get_participant_profile(user.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get User Profile");
  }
};

export const get_skills_data = async () => {
  try {
    const supabase = await createClient();

    const profileService = new ProfileService(supabase);

    const data = await profileService.get_skills_data();

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Skills");
  }
};

export const get_profile_completion_percentage = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const profile_service = new ProfileService(supabase);

    const data = await profile_service.get_profile_completion_percentage(
      user.id
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to fetch completion percentage"
    );
  }
};

export const get_user_token_balance = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const profile_service = new ProfileService(supabase);

    const data = await profile_service.get_user_token_balance(user.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to fetch token balance");
  }
};

export const get_auth_user_transactions = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const profileService = new ProfileService(supabase);

    const data = await profileService.get_auth_user_transactions(user.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get User Transactions");
  }
};

export const update_participant_profile = async (body: any) => {
  const schema = Yup.object({
    description: Yup.string().nullable(),
    location: Yup.string().nullable(),
    linkedin_url: Yup.string().nullable(),
    x_url: Yup.string().nullable(),
    lensfrens_url: Yup.string().nullable(),
    warpcast_url: Yup.string().nullable(),
    portfolio_website: Yup.string().nullable(),
    is_open_to_project: Yup.boolean(),
    is_open_to_work: Yup.boolean(),
    connected_accounts: Yup.array().nullable(),
    skills: Yup.mixed().nullable(),
    roles: Yup.object({
      ids: Yup.array().of(Yup.number()).nullable(),
      primaryRoleId: Yup.number().nullable(),
    }).nullable(),
  }) as Yup.Schema<Partial<Omit<ParticipantProfile, "roles">>>;

  try {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const { full_name, display_wallet_id, ...participantOnlyFields } = body;

    const profile_service = new ProfileService(supabase);
    const user_service = new UserService(supabase);

    const participant_data = await schema.validate(participantOnlyFields);

    if (full_name !== undefined) {
      await user_service.update_user_fields(user.id, {
        full_name,
        display_wallet_id,
      });
    }

    const data = await profile_service.update_participant_profile(
      user.id,
      participant_data
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update User Profile");
  }
};

export const sign_user_terms_of_acceptance = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const user_service = new UserService(supabase);

    const data = await user_service.update_terms_of_acceptance(user?.id, true);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get User Profile");
  }
};

export const get_user_terms_of_acceptance = async (body: any) => {
  const schema = Yup.object({
    user_id: Yup.string().required("User id is required"),
  });

  try {
    const supabase = await createClient();

    const user_service = new UserService(supabase);

    const validatedData = await schema.validate(body);

    const data = await user_service.get_terms_of_acceptance(
      validatedData.user_id
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get User Profile");
  }
};

export const update_profile_image = async (form_data: FormData) => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const user_service = new UserService(supabase);

    const data = await user_service.update_profile_image(user?.id, form_data);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update profile image");
  }
};

export const remove_profile_image = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const user_service = new UserService(supabase);

    const data = await user_service.remove_profile_image(user?.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to remove profile image");
  }
};

export const update_header_image = async (form_data: FormData) => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const user_service = new UserService(supabase);

    const data = await user_service.update_header_image(user?.id, form_data);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update header image");
  }
};

export const remove_header_image = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const user_service = new UserService(supabase);

    const data = await user_service.remove_header_image(user?.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to remove header image");
  }
};

export const delete_account = async () => {
  try {
    const supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const user_service = new UserService(supabase);

    const data = await user_service.delete_account(user?.id);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to delete user");
  }
};
