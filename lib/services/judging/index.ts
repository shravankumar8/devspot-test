import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import * as yup from "yup";
import JudgingService from "./services/judging.service";

export const get_user_judgings = async (user_id: string) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);
    const result = await service.getUserJudgings(user_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

export const get_judging_projects = async (
  judging_id: number,
  user_id: string
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    await service.validateJudgingOwnership(judging_id, user_id);

    const result = await service.getJudgingProjects(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

export const get_judging_projects_ungrouped = async (
  judging_id: number,
  user_id: string
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    await service.validateJudgingOwnership(judging_id, user_id);

    const result = await service.getJudgingProjectsUngrouped(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

;
export const get_hackathon_challenges_with_judge_progress = async (
  judging_id: number
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    await service.validateJudgingOwnership(judging_id, user.id);

    const result = await service.getHackathonChallengesJudgesProgress(
      1,
      judging_id
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to fetch hackathon challenges with prizes",
      500
    );
  }
};

export const get_judging_project_details = async (
  judging_id: number,
  project_id: number,
  challenge_id: number
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);
    const result = await service.getJudgingProjectDetails(
      judging_id,
      project_id,
      challenge_id
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

export const create_judging = async (body: {
  user_id: string;
  hackathon_id: number;
}) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.createJudging(body);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

export const get_judging_progress = async (judging_id: number) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.getJudgingProgress(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

export const submit_judging_entry = async (
  judging_id: number,
  project_id: number,
  body: {
    challenge_id: number;
    score: number;
    technical_feedback: string;
    technical_score: number;
    business_feedback: string;
    business_score: number;
    innovation_feedback: string;
    innovation_score: number;
    ux_feedback: string;
    ux_score: number;
    general_comments: string;
  }
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);
    const result = await service.submitJudgingEntry({
      judging_id,
      project_id,
      ...body,
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to submit judging entry");
  }
};

export const update_judging_entry = async (
  judging_id: number,
  project_id: number,
  body: {
    challenge_id: number;
    score?: number;
    technical_feedback?: string;
    business_feedback?: string;
    innovation_feedback?: string;
    ux_feedback?: string;
    general_comments?: string;
    business_score?: number;
    innovation_score?: number;
    ux_score?: number;
    technical_score?: number;
    judging_status?: "judged" | "needs_review";
  }
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }

    const service = new JudgingService(supabase);
    const result = await service.updateJudgingEntry({
      judging_id,
      project_id,
      ...body,
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to update judging entry");
  }
};

export const flag_judging_entry = async (
  judging_id: number,
  project_id: number,
  body: {
    challenge_id: number;
    flag_reason: string;
    flag_comments?: string;
    status?: "unflag";
  }
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }

    const service = new JudgingService(supabase);
    const result = await service.flagJudgingEntry({
      judging_id,
      project_id,
      challenge_id: body.challenge_id,
      flag_reason: body.flag_reason,
      flag_comments: body.flag_comments,
      status: body.status,
    });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to flag judging entry");
  }
};

export const submit_all_scores = async (judging_id: number) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }

    const service = new JudgingService(supabase);
    const result = await service.submitAllScores(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to submit all scores");
  }
};

export const get_judging_challenges = async (judging_id: number) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);
    const result = await service.getJudgingChallenges(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
};

export const add_challenges_to_judging = async (
  judging_id: number,
  challenge_ids: number[]
) => {
  const supabase = await createClient();
  const judgingService = new JudgingService(supabase);
  return await judgingService.addChallengesToJudging(judging_id, challenge_ids);
};

export const remove_challenges_from_judging = async (
  judging_id: number,
  challenge_ids: number[]
) => {
  const supabase = await createClient();
  const judgingService = new JudgingService(supabase);
  return await judgingService.removeChallengesFromJudging(
    judging_id,
    challenge_ids
  );
};

export const delete_project_challenge_pairs = async (
  hackathon_id: number,
  pairs: { projectId: number; challengeId: number }[]
) => {
  const supabase = await createClient();
  const judgingService = new JudgingService(supabase);
  return await judgingService.deleteProjectChallengePairs(hackathon_id, pairs);
};

export const assign_winner_assigner = async (
  challenge_id: number,
  judge_id: string,
  is_winner_assigner: boolean
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: challenge, error: challengeError } = await supabase
      .from("hackathon_challenges")
      .select("hackathon_id")
      .eq("id", challenge_id)
      .single();

    if (challengeError || !challenge) {
      return errorResponse("Challenge not found", 404);
    }

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", challenge.hackathon_id)
      .single();

    if (hackathonError || !hackathon) {
      return errorResponse("Hackathon not found", 404);
    }

    // TODO: Add technology owner verification here

    const service = new JudgingService(supabase);
    const result = await service.assignWinnerAssigner(
      challenge_id,
      judge_id,
      is_winner_assigner
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to assign winner assigner");
  }
};

export const get_projects_a_judge_is_judging = async (judging_id: number) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.get_projects_a_judge_is_judging(judging_id);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to fetch projects");
  }
};

export const add_judge_to_projects = async (
  judging_id: number,
  project_challenge_pairs: { project_id: number; challenge_id: number }[]
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.addJudgeToProjects(
      judging_id,
      project_challenge_pairs
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to add judge to projects");
  }
};

export const delete_judge_from_projects = async (
  judging_id: number,
  project_challenge_pairs: { project_id: number; challenge_id: number }[]
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.removeJudgeFromProjects(
      judging_id,
      project_challenge_pairs
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to remove judge from projects"
    );
  }
};

export const add_judges_to_projects = async (
  judging_project_challenge_pairs: {
    judging_id: number;
    project_id: number;
    challenge_id: number;
  }[]
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.addJudgesToProjects(
      judging_project_challenge_pairs
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to assign judges to projects"
    );
  }
};

export const remove_judges_from_projects = async (
  judging_project_challenge_pairs: {
    judging_id: number;
    project_id: number;
    challenge_id: number;
  }[]
) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const result = await service.removeJudgesFromProjects(
      judging_project_challenge_pairs
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to remove judges from projects"
    );
  }
};

export const assign_projects_to_judges = async (botScoreIds: number[]) => {
  try {
    const supabase = await createClient();
    const service = new JudgingService(supabase);

    // const { user, error: authError } = await getAuthenticatedUser();
    // if (authError) return authError;

    const result = await service.assignProjectsToJudges(botScoreIds);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to assign projects to judges"
    );
  }
};

export const get_hackathon_judging_statistics = async (hackathonId: number) => {
  try {
    const supabase = await createClient();
    const judgingService = new JudgingService(supabase);
    const data = await judgingService.getHackathonJudgingStatistics(
      hackathonId
    );
    return successResponse(data);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon judging statistics"
    );
  }
};

export const get_winner_assigner_challenges = async (judging_id: number) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }

    const service = new JudgingService(supabase);
    const result = await service.getWinnerAssignerChallenges(judging_id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(
      error.message ?? "Failed to get winner assigner challenges"
    );
  }
};

export const get_assign_winner_button_status = async (judging_id: number) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }

    const { data: judging_challenges, error: judging_challenges_error } =
      await supabase
        .from("judging_challenges")
        .select(
          `
            judging_id,
            is_winner_assigner,
            submitted_winners,
            challenge_id,
            judgings (
              *,
              user:users (*)
            )
          `
        )
        .eq("judging_id", judging_id)
        .eq("is_winner_assigner", true);

    if (
      judging_challenges_error ||
      !judging_challenges ||
      !Boolean(judging_challenges.length)
    )
      return successResponse({ status: false });

    // Check if winners have been submitted for all challenges
    const allWinnersSubmitted = judging_challenges.every(
      (challenge) => challenge.submitted_winners === true
    );

    if (allWinnersSubmitted) {
      return successResponse({ status: "view-winners" });
    }

    return successResponse({ status: true });
  } catch (error: any) {
    console.log(
      errorResponse(
        error.message ?? "Failed to get winner assigner button status"
      )
    );

    return successResponse({ status: false });
  }
};

export const get_challenge_projects_for_winner_assignment = async (
  judging_id: number,
  challenge_id: number
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }
    const service = new JudgingService(supabase);
    const result = await service.getChallengeProjectsForWinnerAssignment(
      challenge_id
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to fetch challenge projects");
  }
};

export const get_challenge_judges_for_winner_assignment = async (
  judging_id: number,
  challenge_id: number
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }
    const service = new JudgingService(supabase);
    const result = await service.getChallengeJudgesForWinnerAssignment(
      challenge_id
    );
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to fetch challenge judges");
  }
};

export const assign_winners_for_challenges = async (
  judging_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const winnerSchema = yup.object().shape({
      winners: yup
        .array()
        .of(
          yup.object().shape({
            challenge_id: yup.number().required("Challenge ID is required"),
            project_id: yup.number().required("Project ID is required"),
            prize_id: yup.number().required("Prize ID is required"),
          })
        )
        .required("Winners array is required"),
    });

    await winnerSchema.validate(body);

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }

    const { winners } = body;

    const service = new JudgingService(supabase);
    const result = await service.assignWinnersForChallenges(winners);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to assign winners");
  }
};

export const get_project_submission_status = async (
  judging_id: number,
  challenge_id: number
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: judging, error: judgingError } = await supabase
      .from("judgings")
      .select("user_id")
      .eq("id", judging_id)
      .single();

    if (judgingError || !judging) {
      return errorResponse("Judging not found", 404);
    }

    if (judging.user_id !== user.id) {
      return errorResponse(
        "Unauthorized - You are not assigned to this judging",
        403
      );
    }
    const { data: project_challenges, error: project_challenges_error } =
      await supabase
        .from("project_challenges")
        .select(
          `
          project_id,
          projects:projects!inner (
            id,
            submitted
          )
        `
        )
        .eq("challenge_id", challenge_id);

    if (project_challenges_error || !project_challenges) {
      return errorResponse(
        `Error not getting Project Challenges - ${project_challenges_error}`,
        404
      );
    }

    let val = true;

    project_challenges.map((project) => {
      const projects = project.projects as unknown as {
        id: number;
        submitted: boolean;
      };

      if (!projects.submitted) val = false;
    });

    return successResponse({ status: val });
  } catch (error: any) {
    return errorResponse(error.message ?? "Failed to assign winners");
  }
};
