import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";
import * as Yup from "yup";
import { build_response } from "../utils/buildResponse";
import {
  bodySchema,
  createHackathonValidationSchema,
  query_validators,
  submitUserHackathonFeedbackSchema,
} from "./schema";
import ReadHackathonService from "./services/hackathon.service";
import JoinHackathonService from "./services/join.services";
import { getHackathonById } from "./utils";

export const join_hackathon = async (
  hackathonId: number,
  body: { joinType: string }
) => {
  try {
    const supabase = await createClient();

    const service = new JoinHackathonService(supabase);

    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const { hackathon, error: hackathonError } = await getHackathonById(
      hackathonId
    );
    if (hackathonError) return hackathonError;

    const result = await service.joinHackathon(
      hackathon,
      hackathonId,
      user.id,
      body.joinType
    );

    return successResponse(result);
  } catch (err: any) {
    return errorResponse(err?.message ?? "Failed to join hackathon");
  }
};

export const answer_hackathon_questionnaire = async (
  hackathonId: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validated_body = await bodySchema.validate(body);

    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const result = await service.answer_hackathon_application_questions(
      hackathonId,
      user.id,
      validated_body
    );
    return successResponse(result);
  } catch (err: any) {
    return errorResponse(
      err?.message ?? "Failed to Answer hackathon Questions"
    );
  }
};

export const create_hackathon = async (body: any) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validated_body = await createHackathonValidationSchema.validate(body);

    const data = await service.create_hackathon(validated_body);

    const response = build_response("Hackathon Created Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to create Hackathon");
  }
};

export const get_all_hackathons = async (body: any) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validated_body = await query_validators.validate(body);

    const data = await service.get_all_hackathons(validated_body);

    const response = build_response("Hackathons Retrieved Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get All Hackathons");
  }
};

export const get_all_participant_hackathons = async (
  user_id: string,
  body: any
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validated_body = await query_validators.validate(body);

    const data = await service.get_hackathons_by_participant(
      user_id,
      validated_body
    );

    const response = build_response(
      "Hackathons for Participant Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get Hackathon Participants"
    );
  }
};

export const get_a_hackathon = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user } = await getAuthenticatedUser();

    const data = await service.get_hackathon_by_id(hackathon_id, user?.id);

    const response = build_response("Hackathon Retrieved Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Hackathon");
  }
};
export const update_hackathon_participate_membership_status = async (
  hackathon_id: number,
  body: any
) => {
  const schema = Yup.object({
    status: Yup.boolean().required(),
  });
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const requestBody = await schema.validate(body);

    const data = await service.update_hackathon_participant_membership(
      hackathon_id,
      user.id,
      requestBody.status
    );

    const response = build_response(
      "Updated Hackathon Membership Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to update Hackathon Membership"
    );
  }
};

export const get_a_hackathon_overview = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user } = await getAuthenticatedUser();

    const data = await service.get_hackathon_by_id_overview(
      hackathon_id,
      user?.id
    );

    const response = build_response(
      "Hackathon Overview Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Hackathon Overview");
  }
};

export const get_hackathons_by_vip = async (user_id: string, body: any) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validatedOptions = await query_validators.validate(body);

    const data = await service.get_hackathons_by_vip(user_id, validatedOptions);

    const response = build_response(
      "Hackathons for VIP Retrieved Successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathons by VIP");
  }
};

export const get_hackathon_schedule = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user } = await getAuthenticatedUser();

    const data = await service.get_hackathon_schedule(hackathon_id, user?.id);

    const response = build_response(
      "Hackathon Schedule Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon schedule");
  }
};

export const rsvp_hackathon_session = async (session_id: number, body: any) => {
  const schema = Yup.object({
    status: Yup.boolean().required(),
  });
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const requestBody = await schema.validate(body);

    const data = await service.rsvp_hackathon_schedule(
      session_id,
      user?.id,
      requestBody.status
    );

    const response = build_response(
      "Hackathon Schedule Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon schedule");
  }
};

export const get_hackathon_upcoming_session = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_upcoming_session(hackathon_id);

    const response = build_response(
      "Hackathon Upcoming Session Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon upcoming session"
    );
  }
};

export const get_hackathon_challenges = async (
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validatedOptions = await query_validators.validate(body);

    const data = await service.get_hackathon_challenges(
      hackathon_id,
      validatedOptions
    );

    const response = build_response(
      "Hackathon Challenges Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon challenges"
    );
  }
};

export const get_challenge_with_bounties = async (challenge_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_challenge_with_bounties(challenge_id);

    const response = build_response(
      "Challenge with Bounties Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get challenge with bounties"
    );
  }
};

export const get_hackathon_participants = async (
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validatedOptions = await query_validators.validate(body);

    const data = await service.get_hackathon_participants(
      hackathon_id,
      validatedOptions
    );

    const response = build_response(
      "Hackathon Participants Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon participants"
    );
  }
};

export const get_hackathon_projects = async (
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();
    const service = new ReadHackathonService(supabase);

    const { user } = await getAuthenticatedUser();

    const validatedOptions = await query_validators.validate(body);

    const data = await service.get_hackathon_projects(
      hackathon_id,
      validatedOptions,
      user?.id
    );

    const response = build_response(
      "Hackathon Projects Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon projects");
  }
};

export const get_participant_application_status = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const status = await service.get_participant_application_status(
      hackathon_id,
      user?.id
    );

    const response = build_response(
      "Participant Application Status Retrieved Successfully",
      status
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get participant application status"
    );
  }
};

export const get_hackathon_vips = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_vips(hackathon_id);

    const response = build_response(
      "Hackathon VIPs Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon VIPs");
  }
};

export const get_hackathon_application_questions = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_application_questions(
      hackathon_id
    );

    const response = build_response(
      "Hackathon Application Questions Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon application questions"
    );
  }
};

export const search_hackathons = async (body: any) => {
  try {
    const { search_term, ...options } = body;

    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validatedOptions = await query_validators.validate(options);

    const data = await service.search_hackathons(search_term, validatedOptions);

    const response = build_response("Hackathons Retrieved Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to search hackathons");
  }
};

export const get_hackathon_faqs = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_faqs(hackathon_id);

    const response = build_response(
      "Hackathon FAQs Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon FAQs");
  }
};
export const handle_click_hackathon_faq = async (faq_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.handle_click_hackathon_faq(faq_id);

    const response = build_response(
      "Hackathon FAQ Updated Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to update hackathon faq"
    );
  }
};

export const get_hackathon_resources = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_resources(hackathon_id);

    const response = build_response(
      "Hackathon Resources Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon resources");
  }
};
export const get_hackathon_sponsors = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_sponsors(hackathon_id);

    const response = build_response(
      "Hackathon Sponsors Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon sponsors");
  }
};

export const get_hackathon_community_partners = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_community_partners(hackathon_id);

    const response = build_response(
      "Hackathon Community Partners Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon community partners"
    );
  }
};

export const handle_click_hackathon_resource = async (resource_id: number) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.handle_click_hackathon_resource(resource_id);

    const response = build_response(
      "Hackathon Resources Updated Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update hackathon resources");
  }
};

export const send_team_up_request = async (
  hackathon_id: number,
  participant_id: string,
  origin: string
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const data = await service.send_team_up_request_to_participant(
      user.id,
      participant_id,
      hackathon_id,
      origin
    );

    const response = build_response("Sent Request to User Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    console.log(error);
    return errorResponse(
      error?.message ?? "Failed to send request to hackathon participant"
    );
  }
};

export const get_hackathon_prizes = async (hackathon_id: number, body: any) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const validatedOptions = await query_validators.validate(body);

    const data = await service.get_hackathon_prizes(
      hackathon_id,
      validatedOptions
    );

    const response = build_response(
      "Hackathon Prizes Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon prizes");
  }
};

export const get_available_teammates = async (
  hackathon_id: number,
  search_term?: string
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);

    const data = await service.get_available_teammates(
      hackathon_id,
      search_term
    );

    const response = build_response(
      "Hackathon Available Teammates Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon team mates"
    );
  }
};

export const create_challenge_prize = async (
  challenge_id: number,
  prizeData: {
    title: string;
    rank: number;
    prize_usd?: number;
    prize_tokens?: number;
    prize_custom?: string;
    company_partner_logo?: string;
  }
) => {
  try {
    const supabase = await createClient();
    const service = new ReadHackathonService(supabase);

    const data = await service.create_challenge_prize(challenge_id, prizeData);

    const response = build_response("Prize Created Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to create prize");
  }
};

export const get_hackathon_projects_search = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_projects_search(hackathon_id);

    return successResponse({
      message: "Hackathon Projects Retrieved Successfully",
      data,
    });
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon projects");
  }
};

export const get_hackathon_challenges_search = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_challenges_search(hackathon_id);

    return successResponse({
      message: "Hackathon Challenges Retrieved Successfully",
      data,
    });
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon challenges"
    );
  }
};

export const get_hackathon_judges_search = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();
    const service = new ReadHackathonService(supabase);

    const data = await service.get_hackathon_judges_search(hackathon_id);

    return successResponse({
      message: "Hackathon Judges Retrieved Successfully",
      data,
    });
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon judges");
  }
};

export const get_user_hackathon_feedback = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();

    const { error, user } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ReadHackathonService(supabase);

    const data = await service.get_user_hackathon_feedback(
      hackathon_id,
      user?.id
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Get User Feedback");
  }
};

export const submit_user_hackathon_feedback = async (
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const validated_body = await submitUserHackathonFeedbackSchema.validate(
      body
    );

    const { error, user } = await getAuthenticatedUser();

    if (error) return error;

    const service = new ReadHackathonService(supabase);
    const data = await service.submit_user_hackathon_feedback(
      hackathon_id,
      user?.id,
      validated_body
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Submit User Feedback");
  }
};

export const toggle_hackathon_judge_bot = async (
  hackathon_id: number,
  value?: boolean
) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const { error, user } = await getAuthenticatedUser();
    if (error) return error;

    const { data: hackathon, error: hackathonFetchError } = await supabase
      .from("hackathons")
      .select("use_judge_bot")
      .eq("id", hackathon_id)
      .single();

    if (hackathonFetchError) {
      throw new Error(
        `Error fetching hackathon with ID ${hackathon_id}: ${hackathonFetchError.message}`
      );
    }

    const status = value ?? !hackathon?.use_judge_bot;

    const { error: updateHackathonError, data: updatedData } = await supabase
      .from("hackathons")
      .update({ use_judge_bot: status })
      .eq("id", hackathon_id)
      .single();

    if (updateHackathonError) {
      throw new Error(
        `Error updating hackathon for hackathon id ${hackathon_id}: ${updateHackathonError.message}`
      );
    }

    const BASE_URL = "ec2-54-172-24-214.compute-1.amazonaws.com:3000";

    const val = status ? "resume" : "pause";

    await axios.post(`${BASE_URL}/queue/${val}`);

    return successResponse(updatedData);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Update Hackathon Toggle");
  }
};

export const toggle_hackathon_multi_project = async (
  hackathon_id: number,
  value?: boolean
) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const { error } = await getAuthenticatedUser();
    if (error) return error;

    const { data: hackathon, error: hackathonFetchError } = await supabase
      .from("hackathons")
      .select("multi_projects")
      .eq("id", hackathon_id)
      .single();

    if (hackathonFetchError) {
      throw new Error(
        `Error fetching hackathon with ID ${hackathon_id}: ${hackathonFetchError.message}`
      );
    }

    const status = value ?? !hackathon?.multi_projects;

    const { error: updateHackathonError, data: updatedData } = await supabase
      .from("hackathons")
      .update({ multi_projects: status })
      .eq("id", hackathon_id)
      .single();

    if (updateHackathonError) {
      throw new Error(
        `Error updating hackathon for hackathon id ${hackathon_id}: ${updateHackathonError.message}`
      );
    }

    return successResponse(updatedData);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Update Hackathon Toggle");
  }
};

export const get_hackathon_multi_project_status = async (
  hackathon_id: number
) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const { error, user } = await getAuthenticatedUser();
    if (error) return error;

    const { data: hackathon, error: fetchError } = await supabase
      .from("hackathons")
      .select("multi_projects")
      .eq("id", hackathon_id)
      .single();

    if (fetchError || !hackathon) {
      throw new Error(
        `Error fetching hackathon multi project status for hackathon ${hackathon_id}: ${fetchError?.message}`
      );
    }

    return successResponse({ multi_projects: hackathon.multi_projects });
  } catch (err: any) {
    return errorResponse(
      err?.message ?? "Failed to fetch hackathon multi project status"
    );
  }
};

export const get_hackathon_judge_bot_status = async (hackathon_id: number) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const { error, user } = await getAuthenticatedUser();
    if (error) return error;

    const { data: hackathon, error: fetchError } = await supabase
      .from("hackathons")
      .select("use_judge_bot")
      .eq("id", hackathon_id)
      .single();

    if (fetchError || !hackathon) {
      throw new Error(
        `Error fetching judge bot status for hackathon ${hackathon_id}: ${fetchError?.message}`
      );
    }

    return successResponse({ use_judge_bot: hackathon.use_judge_bot });
  } catch (err: any) {
    return errorResponse(
      err?.message ?? "Failed to fetch hackathon judge bot status"
    );
  }
};

export const get_hackathon_leaderboard = async (
  hackathon_id: number,
  sortBy?: "standing" | "score" | "challenge"
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);
    const data = await service.get_hackathon_leaderboard(hackathon_id, sortBy);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon Leaderboard"
    );
  }
};
export interface HackathonLeaderboardOptions {
  comments: boolean;
  score: boolean;
  sortBy?: "standing" | "score" | "challenge";
}

export const update_hackathon_leaderboard_options = async (
  hackathon_id: number,
  options: HackathonLeaderboardOptions
) => {
  try {
    const supabase = await createClient();

    const service = new ReadHackathonService(supabase);
    const data = await service.update_hackathon_leaderboard_options(
      hackathon_id,
      options
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to update hackathon Leaderboard Options"
    );
  }
};

export const handle_vip_invitation = async (
  hackathon_id: number,
  handler_type: "approve" | "reject",
  transaction_id: string
) => {
  try {
    const supabase = await createClient();
    const service = new ReadHackathonService(supabase);

    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    if (handler_type === "approve") {
      const result = await service.user_accept_vip_invitation(
        hackathon_id,
        user.id,
        transaction_id
      );
      return successResponse(result);
    }

    const result = await service.user_reject_vip_invitation(
      hackathon_id,
      user.id,
      transaction_id
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to update invitation");
  }
};