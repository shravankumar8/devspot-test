import { HackathonChallenges, Hackathons } from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";
import ApiBaseService, { QueryModifierOptions } from "../../utils/baseService";

interface GlobalHackathonFeedback {
  id: number;
  hackathon_id: number;
  user_id: string;
  overall_hackathon_rating: number;
  recommend_hackathon_rating: number;
  overall_devspot_rating: number;
  recommend_devspot_rating: number;
  comments: string | null;
  created_at: string;
}

interface HackathonChallengeFeedback {
  id: number;
  hackathon_id: number;
  challenge_id: number;
  user_id: string;
  overall_rating: number | null;
  docs_rating: number | null;
  support_rating: number | null;
  challenge_recommendation_rating: number | null;
  comments: string | null;
  created_at: string;
  challenges?: Partial<HackathonChallenges>;
}

interface GlobalAverages {
  overall_hackathon_rating: number;
  recommend_hackathon_rating: number;
  overall_devspot_rating: number;
  recommend_devspot_rating: number;
  total_responses: number;
}

interface ChallengeAverages {
  [challengeName: string]: {
    overall_rating: number;
    docs_rating: number;
    support_rating: number;
    challenge_recommendation_rating: number;
    total_responses: number;
  };
}

interface OverallChallengeAverages {
  overall_rating: number;
  docs_rating: number;
  support_rating: number;
  challenge_recommendation_rating: number;
}

type RemoveflagsProps =
  | { judging_entry_id: number }
  | {
      project_id: number;
      challenge_id: number;
    };

class TechnologyOwnerService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async search_technology_owner(search_term: string) {
    const { data, error } = await this.supabase
      .from("technology_owners")
      .select("*")
      .ilike("name", `%${search_term}%`);

    if (error) {
      throw new Error(`Failed to search technology owners: ${error.message}`);
    }

    if (!data) return [];

    const searchTermNormalized = search_term.toLowerCase().trim();
    const exactMatches = data.filter(
      (owner) => owner.name.toLowerCase().trim() === searchTermNormalized
    );

    return exactMatches;
  }

  async get_all_technology_owners() {
    const { data, error: fetch_error } = await this.supabase
      .from("technology_owners")
      .select("*");

    if (fetch_error) {
      throw new Error(
        `Failed to fetch technology owners: ${fetch_error.message}`
      );
    }

    const owners = data ?? [];

    // Sort the array so that owner with id 1 comes first
    return owners.sort((a, b) => {
      if (a.id === 1) return -1;
      if (b.id === 1) return 1;
      return 0;
    });
  }

  /**
   * Get all hackathons with pagination, filtering, and sorting
   *
   * @param options Query modifier options for filtering, sorting, and pagination
   * @returns Array of hackathons matching the criteria
   */
  async get_all_hackathons(
    technology_owner_id: number,
    options?: Partial<QueryModifierOptions>
  ) {
    const query = () => {
      let baseQuery = this.supabase
        .from("hackathons")
        .select(
          "*, organizer:technology_owners(*), participants:hackathon_participants(count)"
        )
        .eq("organizer_id", technology_owner_id);

      let countQuery = this.supabase
        .from("hackathons")
        .select("id", { count: "exact" });

      return { baseQuery, countQuery };
    };
    const item = query();

    const paginatedData = await this.fetch_paginated_data<Hackathons>(
      item.baseQuery,
      options,
      item.countQuery
    );

    const mapped = paginatedData.items.map((hackathon: any) => {
      return {
        ...hackathon,
        number_of_participants: hackathon?.participants?.[0]?.count ?? 0,
      };
    });

    return {
      ...paginatedData,
      items: mapped,
    };
  }

  async get_technology_owner_flagged_projects(hackathon_id: number) {
    try {
      const { data: flaggedEntries, error: flaggedEntriesError } =
        await this.supabase
          .from("judging_entries")
          .select(
            `
              id,
              project_hidden,
              project_id,
              challenge_id,
              flagged_reason,
              judging_id,
              judging_bot_scores_id,
              judging_bot_scores!inner (
                id,
                score,
                flagged_reason
              ),
              projects!inner (
                id,
                name,
                hackathon_id
              ),
              judgings!inner (
                id,
                users!inner (
                  full_name,
                  avatar_url
                )
              )
            `
          )
          .eq("projects.hackathon_id", hackathon_id)
          .not("flagged_reason", "is", null);
      if (flaggedEntriesError) {
        console.error("Supabase query error:", flaggedEntriesError);
        throw new Error(
          `Failed to fetch flagged projects: ${flaggedEntriesError.message}`
        );
      }
      if (!flaggedEntries || flaggedEntries.length === 0) {
        return [];
      }
      // Get unique project IDs from flagged entries
      const projectIds = [
        ...new Set(flaggedEntries.map((entry) => entry.project_id)),
      ];
      // Fetch detailed project information separately
      const { data: projectDetails, error: projectDetailsError } =
        await this.supabase
          .from("projects")
          .select(
            `
              id,
              name,
              project_team_members!inner (
                user_id,
                status,
                users!inner (
                  full_name,
                  avatar_url
                )
              ),
              project_challenges!inner (
                challenge_id,
                hackathon_challenges!inner (
                  challenge_name,
                  sponsors
                )
              )
          `
          )
          .in("id", projectIds)
          .eq("project_team_members.status", "confirmed");
      if (projectDetailsError) {
        console.error(
          "Supabase project details query error:",
          projectDetailsError
        );
        throw new Error(
          `Failed to fetch project details: ${projectDetailsError.message}`
        );
      }
      // Group by project_id and then by challenge_id
      const projectsMap = new Map();
      // Initialize projects map with detailed information
      projectDetails.forEach((project) => {
        const team_members = project.project_team_members.map((member) => ({
          user_id: member.user_id,
          full_name: member.users.full_name,
          avatar_url: member.users.avatar_url,
        }));
        // Create challenges map for this project
        const challengesMap = new Map();
        project.project_challenges.forEach((challenge) => {
          challengesMap.set(challenge.challenge_id, {
            challenge_id: challenge.challenge_id,
            challenge_name: challenge.hackathon_challenges.challenge_name,
            sponsors: challenge.hackathon_challenges.sponsors,
            bot_score: null,
            judges: new Map(),
            flags: [],
          });
        });

        projectsMap.set(project.id, {
          project_id: project.id,
          name: project.name,
          team_members,
          challenges: challengesMap,
        });
      });

      // Process flagged entries and organize by challenge
      flaggedEntries.forEach((entry) => {
        const projectId = entry.project_id;
        const challengeId = entry.challenge_id;

        if (!projectsMap.has(projectId)) {
          // Skip if project not found in detailed query (shouldn't happen)
          return;
        }

        const projectData = projectsMap.get(projectId);

        if (!projectData.challenges.has(challengeId)) {
          return;
        }

        const challengeData = projectData.challenges.get(challengeId);

        challengeData.project_hidden = entry.project_hidden;

        // Add human judge flag if exists
        if (entry.flagged_reason) {
          challengeData.flags.push({
            flagged_reason: entry.flagged_reason,
            flagged_by: {
              judging_id: entry.judgings.id,
              judge_name: entry.judgings.users.full_name,
              judge_avatar: entry.judgings.users.avatar_url,
              judging_entry_id: entry.id,
            },
          });
        }

        // Add bot flag if exists
        if (entry.judging_bot_scores?.flagged_reason) {
          challengeData.flags.push({
            flagged_reason: entry.judging_bot_scores.flagged_reason,
            flagged_by: {
              judging_id: "bot",
              judge_name: "DevSpot",
              judge_avatar: "",
            },
          });
        }

        if (entry.judgings) {
          challengeData.judges.set(entry.judgings.id, {
            judging_id: entry.judgings.id,
            full_name: entry.judgings.users.full_name,
            avatar_url: entry.judgings.users.avatar_url,
          });
        }

        if (entry.judging_bot_scores && challengeData.bot_score === null) {
          challengeData.bot_score = entry.judging_bot_scores.score;
        }
      });

      // Convert the maps to arrays and finalize the structure
      const result = Array.from(projectsMap.values()).map((project) => ({
        project_id: project.project_id,
        name: project.name,
        team_members: project.team_members,
        challenges: Array.from(project.challenges.values())
          .map((challenge: any) => ({
            challenge_id: challenge.challenge_id,
            challenge_name: challenge.challenge_name,
            sponsors: challenge.sponsors,
            judges: Array.from(challenge.judges.values()),
            flags: challenge.flags,
            project_hidden: challenge.project_hidden,
            bot_score: challenge.bot_score,
          }))
          .filter((challenge) => challenge.flags.length > 0),
      }));

      return result;
    } catch (error) {
      console.error("Error in getTechnologyOwnerFlaggedProjects:", error);
      throw error;
    }
  }

  async invite_judge(email: string, hackathon_id: number) {
    let { data: existingInvite, error: lookupError } = await this.supabase
      .from("pending_invitations")
      .select()
      .eq("email", email)
      .eq("hackathon_id", hackathon_id)
      .single();

    if (lookupError && lookupError.code !== "PGRST116") {
      throw new Error(
        `Failed to check existing invitation: ${lookupError.message}`
      );
    }

    if (existingInvite?.invitation_status === "accepted") {
      return {
        success: true,
        data: existingInvite,
      };
    }

    if (!existingInvite) {
      const { data, error } = await this.supabase
        .from("pending_invitations")
        .insert({
          email,
          hackathon_id,
          role: "judge",
          invitation_status: "pending",
        })
        .select()
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to create judge invitation: ${error.message}`);
      }

      existingInvite = data;
    }

    // Send/resend invitation email
    await axios.post(
      "https://app.loops.so/api/v1/transactional",
      {
        transactionalId: "cmcvpv6232ywhyh0jkjtkjzv9",
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      }
    );

    return {
      success: true,
      data: existingInvite,
    };
  }

  async remove_flags(props: RemoveflagsProps) {
    try {
      if ("judging_entry_id" in props) {
        // Update judging entries to remove flags
        const { error: updateError } = await this.supabase
          .from("judging_entries")
          .update({
            flagged_reason: null,
            flagged_comments: null,
          })
          .eq("id", props.judging_entry_id);

        if (updateError) {
          throw new Error(`Failed to remove flags: ${updateError.message}`);
        }
      } else {
        // Update bot scores to remove flags
        const { error: botUpdateError } = await this.supabase
          .from("judging_bot_scores")
          .update({
            flagged_reason: null,
          })
          .eq("project_id", props.project_id)
          .eq("challenge_id", props.challenge_id);

        if (botUpdateError) {
          throw new Error(
            `Failed to remove bot flags: ${botUpdateError.message}`
          );
        }
      }

      return {
        success: true,
        message: "Flags removed successfully",
      };
    } catch (error) {
      console.error("Error in remove_flags:", error);
      throw error;
    }
  }

  async get_technology_owner_projects(technology_owner_id: number) {
    const { data, error } = await this.supabase
      .from("projects")
      .select(
        `
          id,
          name,
          description,
          tagline,
          logo_url,
          hackathon_id,
          technologies,
          hackathons (
            id,
            name
          ),
          project_team_members (
            id,
            users (
              id,
              full_name,
              avatar_url
            )
          ),
          project_challenges (
            hackathon_challenges (
              id,
              challenge_name
            )
          )
        `
      )
      .eq("hackathons.organizer_id", technology_owner_id)
      .eq("submitted", true);

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data ?? [];
  }

  async assignChallengesToProjects(
    hackathon_id: number,
    project_ids: number[],
    challenge_ids: number[]
  ) {
    // Validate that projects and challenges exist and belong to the hackathon
    const { data: projects, error: projectsError } = await this.supabase
      .from("projects")
      .select("id, submitted")
      .eq("hackathon_id", hackathon_id)
      .in("id", project_ids);

    if (projectsError) {
      throw new Error(`Failed to validate projects: ${projectsError.message}`);
    }

    const { data: challenges, error: challengesError } = await this.supabase
      .from("hackathon_challenges")
      .select("id")
      .eq("hackathon_id", hackathon_id)
      .in("id", challenge_ids);

    if (challengesError) {
      throw new Error(
        `Failed to validate challenges: ${challengesError.message}`
      );
    }

    if (projects.length !== project_ids.length) {
      throw new Error(
        "Some projects do not exist or do not belong to this hackathon"
      );
    }

    if (challenges.length !== challenge_ids.length) {
      throw new Error(
        "Some challenges do not exist or do not belong to this hackathon"
      );
    }

    // Get all judges for each challenge
    const { data: judgingChallenges, error: judgingChallengesError } =
      await this.supabase
        .from("judging_challenges")
        .select(
          `
        judging_id,
        challenge_id,
        judgings (
          id,
          user_id
        )
      `
        )
        .in("challenge_id", challenge_ids);

    if (judgingChallengesError) {
      throw new Error(
        `Failed to fetch judging challenges: ${judgingChallengesError.message}`
      );
    }

    // Get existing project-challenge combinations to skip
    const {
      data: existingProjectChallenges,
      error: existingProjectChallengesError,
    } = await this.supabase
      .from("project_challenges")
      .select("project_id, challenge_id")
      .in("project_id", project_ids)
      .in("challenge_id", challenge_ids);

    if (existingProjectChallengesError) {
      throw new Error(
        `Failed to check existing project challenges: ${existingProjectChallengesError.message}`
      );
    }

    const existingCombinations = new Set(
      existingProjectChallenges.map(
        (pc) => `${pc.project_id}-${pc.challenge_id}`
      )
    );

    // TODO: Get bot scores for copying - this will be implemented later
    // For now, we'll use empty defaults since project-challenge combinations won't exist in bot scores yet
    // const { data: botScores, error: botScoresError } = await this.supabase
    //   .from("judging_bot_scores")
    //   .select("*")
    //   .in("project_id", project_ids)
    //   .in("challenge_id", challenge_ids);

    // Get existing judging entries to skip
    const { data: existingJudgingEntries, error: existingJudgingEntriesError } =
      await this.supabase
        .from("judging_entries")
        .select("judging_id, project_id, challenge_id")
        .in("project_id", project_ids)
        .in("challenge_id", challenge_ids);

    if (existingJudgingEntriesError) {
      throw new Error(
        `Failed to check existing judging entries: ${existingJudgingEntriesError.message}`
      );
    }

    const existingJudgingCombinations = new Set(
      existingJudgingEntries.map(
        (je) => `${je.judging_id}-${je.project_id}-${je.challenge_id}`
      )
    );

    // Prepare data for insertion
    const projectChallengesToInsert: Array<{
      project_id: number;
      challenge_id: number;
    }> = [];
    const judgingEntriesToInsert: Array<any> = [];

    let totalAssignmentsCreated = 0;
    let totalJudgingEntriesCreated = 0;
    let skippedAssignments = 0;

    for (const project_id of project_ids) {
      for (const challenge_id of challenge_ids) {
        const combinationKey = `${project_id}-${challenge_id}`;

        // Skip if project-challenge combination already exists
        if (existingCombinations.has(combinationKey)) {
          skippedAssignments++;
          continue;
        }

        // Add to project_challenges
        projectChallengesToInsert.push({ project_id, challenge_id });
        totalAssignmentsCreated++;

        // Get project details to check submitted status
        const project = projects.find((p) => p.id === project_id);

        // Only create judging entries if project is submitted
        if (project?.submitted === true) {
          // Get judges for this challenge
          const challengeJudges = judgingChallenges.filter(
            (jc) => jc.challenge_id === challenge_id
          );

          // Create judging entries for each judge
          for (const judgeChallenge of challengeJudges) {
            const judgingEntryKey = `${judgeChallenge.judging_id}-${project_id}-${challenge_id}`;

            // Skip if judging entry already exists
            if (existingJudgingCombinations.has(judgingEntryKey)) {
              continue;
            }

            const judgingEntry = {
              judging_id: judgeChallenge.judging_id,
              project_id,
              challenge_id,
              score: 0,
              technical_feedback: "",
              technical_score: 0,
              technical_summary: "",
              business_feedback: "",
              business_score: 0,
              business_summary: "",
              innovation_feedback: "",
              innovation_score: 0,
              innovation_summary: "",
              ux_feedback: "",
              ux_score: 0,
              ux_summary: "",
              general_comments: "",
              general_comments_summary: "",
              judging_status: "needs_review" as const,
              flagged_comments: null,
              flagged_reason: null,
            };

            judgingEntriesToInsert.push(judgingEntry);
            totalJudgingEntriesCreated++;
          }
        }
        // If project is not submitted, only add to project_challenges (already done above)
      }
    }

    // Insert project_challenges
    if (projectChallengesToInsert.length > 0) {
      const { error: insertProjectChallengesError } = await this.supabase
        .from("project_challenges")
        .insert(projectChallengesToInsert);

      if (insertProjectChallengesError) {
        throw new Error(
          `Failed to insert project challenges: ${insertProjectChallengesError.message}`
        );
      }
    }

    // Insert judging_entries (only for submitted projects)
    if (judgingEntriesToInsert.length > 0) {
      const { error: insertJudgingEntriesError } = await this.supabase
        .from("judging_entries")
        .insert(judgingEntriesToInsert);

      if (insertJudgingEntriesError) {
        throw new Error(
          `Failed to insert judging entries: ${insertJudgingEntriesError.message}`
        );
      }
    }

    return {
      total_assignments_created: totalAssignmentsCreated,
      total_judging_entries_created: totalJudgingEntriesCreated,
      skipped_assignments: skippedAssignments,
    };
  }

  async get_hackathon_feedback_overview(hackathon_id: number) {
    const { data: globalFeedback, error: globalError } = await this.supabase
      .from("global_hackathon_feedback")
      .select(
        `
            overall_hackathon_rating,
            recommend_hackathon_rating,
            overall_devspot_rating,
            recommend_devspot_rating,
            comments
          `
      )
      .eq("hackathon_id", hackathon_id);

    if (globalError) {
      throw new Error(
        `Failed to fetch global hackathon feedback: ${globalError.message}`
      );
    }
    const globalFeedbackComments: string[] = [];
    const globalAverages = {
      overall_hackathon_rating: 0,
      recommend_hackathon_rating: 0,
      overall_devspot_rating: 0,
      recommend_devspot_rating: 0,
      total_responses: globalFeedback?.length || 0,
    };

    if (globalFeedback && globalFeedback.length > 0) {
      const count = globalFeedback.length;
      globalAverages.overall_hackathon_rating =
        globalFeedback.reduce(
          (sum, item) => sum + (item.overall_hackathon_rating || 0),
          0
        ) / count;
      globalAverages.recommend_hackathon_rating =
        globalFeedback.reduce(
          (sum, item) => sum + (item.recommend_hackathon_rating || 0),
          0
        ) / count;
      globalAverages.overall_devspot_rating =
        globalFeedback.reduce(
          (sum, item) => sum + (item.overall_devspot_rating || 0),
          0
        ) / count;
      globalAverages.recommend_devspot_rating =
        globalFeedback.reduce(
          (sum, item) => sum + (item.recommend_devspot_rating || 0),
          0
        ) / count;

      globalFeedback.forEach((feedback) => {
        feedback.comments && globalFeedbackComments.push(feedback.comments);
      });
    }

    const { data: challengeFeedback, error: challengeError } =
      await this.supabase
        .from("hackathon_challenge_feedback")
        .select(
          `
            challenge_id,
            overall_rating,
            docs_rating,
            support_rating,
            challenge_recommendation_rating,
            comments,
            challenges: hackathon_challenges(*)
          `
        )
        .eq("hackathon_id", hackathon_id);

    if (challengeError) {
      throw new Error(
        `Failed to fetch hackathon challenge feedback: ${challengeError.message}`
      );
    }

    const challengeAverages: Record<
      number,
      {
        challenge_id: number;
        challenge: Partial<HackathonChallenges>;
        overall_rating: number[];
        docs_rating: number[];
        support_rating: number[];
        challenge_recommendation_rating: number[];
        comments: string[];
        total_responses: number;
      }
    > = {};

    if (challengeFeedback && challengeFeedback.length > 0) {
      challengeFeedback.forEach((feedback) => {
        const challengeId = feedback.challenge_id;

        if (!challengeAverages[challengeId]) {
          challengeAverages[challengeId] = {
            challenge: feedback.challenges,
            challenge_id: challengeId,
            overall_rating: [],
            docs_rating: [],
            support_rating: [],
            challenge_recommendation_rating: [],
            comments: [],
            total_responses: 0,
          };
        }

        challengeAverages[challengeId].total_responses++;

        if (feedback.overall_rating !== null) {
          challengeAverages[challengeId].overall_rating.push(
            feedback.overall_rating
          );
        }
        if (feedback.docs_rating !== null) {
          challengeAverages[challengeId].docs_rating.push(feedback.docs_rating);
        }
        if (feedback.support_rating !== null) {
          challengeAverages[challengeId].support_rating.push(
            feedback.support_rating
          );
        }
        if (feedback.challenge_recommendation_rating !== null) {
          challengeAverages[challengeId].challenge_recommendation_rating.push(
            feedback.challenge_recommendation_rating
          );
        }
        if (feedback.comments) {
          challengeAverages[challengeId].comments.push(feedback.comments);
        }
      });
    }

    const challengeOverview = Object.values(challengeAverages).map(
      (challenge) => ({
        challenge_id: challenge.challenge_id,
        challenge: challenge.challenge,
        overall_rating:
          challenge.overall_rating.length > 0
            ? challenge.overall_rating.reduce(
                (sum, rating) => sum + rating,
                0
              ) / challenge.overall_rating.length
            : 0,
        docs_rating:
          challenge.docs_rating.length > 0
            ? challenge.docs_rating.reduce((sum, rating) => sum + rating, 0) /
              challenge.docs_rating.length
            : 0,
        support_rating:
          challenge.support_rating.length > 0
            ? challenge.support_rating.reduce(
                (sum, rating) => sum + rating,
                0
              ) / challenge.support_rating.length
            : 0,
        challenge_recommendation_rating:
          challenge.challenge_recommendation_rating.length > 0
            ? challenge.challenge_recommendation_rating.reduce(
                (sum, rating) => sum + rating,
                0
              ) / challenge.challenge_recommendation_rating.length
            : 0,
        total_responses: challenge.total_responses,
        comments: challenge.comments,
      })
    );

    // Round all averages to 1 decimal place
    const roundedGlobalAverages = {
      overall_hackathon_rating:
        Math.round(globalAverages.overall_hackathon_rating * 10) / 10,
      recommend_hackathon_rating:
        Math.round(globalAverages.recommend_hackathon_rating * 10) / 10,
      overall_devspot_rating:
        Math.round(globalAverages.overall_devspot_rating * 10) / 10,
      recommend_devspot_rating:
        Math.round(globalAverages.recommend_devspot_rating * 10) / 10,
      comments: globalFeedbackComments,
      total_responses: globalAverages.total_responses,
    };

    const roundedChallengeOverview = challengeOverview.map((challenge) => ({
      ...challenge,
      overall_rating: Math.round(challenge.overall_rating * 10) / 10,
      docs_rating: Math.round(challenge.docs_rating * 10) / 10,
      support_rating: Math.round(challenge.support_rating * 10) / 10,
      challenge_recommendation_rating:
        Math.round(challenge.challenge_recommendation_rating * 10) / 10,
    }));

    return {
      hackathon_id,
      global_feedback: roundedGlobalAverages,
      challenge_feedback: roundedChallengeOverview,
      summary: {
        total_global_responses: globalAverages.total_responses,
        total_challenge_responses: challengeFeedback?.length || 0,
        challenges_with_feedback: Object.keys(challengeAverages).length,
      },
    };
  }

  async generate_feedback_csv(hackathon_id: number): Promise<string> {
    try {
      const { data: global_feedback, error: global_error } = await this.supabase
        .from("global_hackathon_feedback")
        .select("*")
        .eq("hackathon_id", hackathon_id);

      if (global_error) {
        throw new Error(
          `Failed to fetch global hackathon feedback: ${global_error.message}`
        );
      }

      const { data: challenge_feedback, error: challenge_error } =
        await this.supabase
          .from("hackathon_challenge_feedback")
          .select("*, challenges: hackathon_challenges(*)")
          .eq("hackathon_id", hackathon_id);

      if (challenge_error) {
        throw new Error(
          `Failed to fetch challenge hackathon feedback: ${challenge_error.message}`
        );
      }

      const csv_rows = this.build_csv_rows(global_feedback, challenge_feedback);
      const averages = this.calculate_averages(
        global_feedback,
        challenge_feedback
      );

      csv_rows.push(...this.build_average_rows(averages));

      return csv_rows.join("\n");
    } catch (error) {
      throw new Error(`Failed to generate feedback CSV: ${error}`);
    }
  }

  private build_csv_rows(
    global_feedback: GlobalHackathonFeedback[],
    challenge_feedback: HackathonChallengeFeedback[]
  ): string[] {
    const headers = [
      "Feedback_Type",
      "Challenge_Name",
      "Overall_Rating",
      "Docs_Rating",
      "Support_Rating",
      "Recommendation_Rating",
      "DevSpot_Rating",
      "Comments",
      "Created_At",
    ];

    const csv_rows = [headers.join(",")];

    global_feedback.forEach((feedback) => {
      const row = [
        "Global_Hackathon",
        "N/A",
        feedback.overall_hackathon_rating?.toString() || "",
        "N/A",
        "N/A",
        feedback.recommend_hackathon_rating?.toString() || "",
        feedback.overall_devspot_rating?.toString() || "",
        this.escape_csv(feedback.comments || ""),
        feedback.created_at,
      ];
      csv_rows.push(row.join(","));
    });

    challenge_feedback.forEach((feedback) => {
      const row = [
        "Challenge_Specific",
        this.escape_csv(
          feedback.challenges?.challenge_name || "Unknown Challenge"
        ),
        feedback.overall_rating?.toString() || "",
        feedback.docs_rating?.toString() || "",
        feedback.support_rating?.toString() || "",
        feedback.challenge_recommendation_rating?.toString() || "",
        "N/A",
        this.escape_csv(feedback.comments || ""),
        feedback.created_at,
      ];
      csv_rows.push(row.join(","));
    });

    return csv_rows;
  }

  private calculate_averages(
    global_feedback: GlobalHackathonFeedback[],
    challenge_feedback: HackathonChallengeFeedback[]
  ): {
    global: GlobalAverages;
    challenge: ChallengeAverages;
    overallChallenge: OverallChallengeAverages;
  } {
    const global_averages = this.calculate_global_averages(global_feedback);
    const challenge_averages =
      this.calculate_challenge_averages(challenge_feedback);
    const overall_challenge_averages =
      this.calculate_overall_challenge_averages(challenge_feedback);

    return {
      global: global_averages,
      challenge: challenge_averages,
      overallChallenge: overall_challenge_averages,
    };
  }

  private calculate_global_averages(
    global_feedback: GlobalHackathonFeedback[]
  ): GlobalAverages {
    const averages: GlobalAverages = {
      overall_hackathon_rating: 0,
      recommend_hackathon_rating: 0,
      overall_devspot_rating: 0,
      recommend_devspot_rating: 0,
      total_responses: global_feedback.length,
    };

    if (global_feedback.length === 0) return averages;

    const count = global_feedback.length;

    averages.overall_hackathon_rating =
      Math.round(
        (global_feedback.reduce(
          (sum, item) => sum + (item.overall_hackathon_rating || 0),
          0
        ) /
          count) *
          10
      ) / 10;

    averages.recommend_hackathon_rating =
      Math.round(
        (global_feedback.reduce(
          (sum, item) => sum + (item.recommend_hackathon_rating || 0),
          0
        ) /
          count) *
          10
      ) / 10;

    averages.overall_devspot_rating =
      Math.round(
        (global_feedback.reduce(
          (sum, item) => sum + (item.overall_devspot_rating || 0),
          0
        ) /
          count) *
          10
      ) / 10;

    averages.recommend_devspot_rating =
      Math.round(
        (global_feedback.reduce(
          (sum, item) => sum + (item.recommend_devspot_rating || 0),
          0
        ) /
          count) *
          10
      ) / 10;

    return averages;
  }

  private calculate_challenge_averages(
    challenge_feedback: HackathonChallengeFeedback[]
  ): ChallengeAverages {
    const challenge_groups: Record<string, HackathonChallengeFeedback[]> = {};

    challenge_feedback.forEach((feedback) => {
      const name = feedback.challenges?.challenge_name || "Unknown Challenge";
      if (!challenge_groups[name]) challenge_groups[name] = [];
      challenge_groups[name].push(feedback);
    });

    const averages: ChallengeAverages = {};

    Object.entries(challenge_groups).forEach(([name, feedbacks]) => {
      const get_avg = (arr: number[]) =>
        arr.length > 0
          ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
          : 0;

      averages[name] = {
        overall_rating: get_avg(
          feedbacks
            .filter((f) => f.overall_rating !== null)
            .map((f) => f.overall_rating!)
        ),
        docs_rating: get_avg(
          feedbacks
            .filter((f) => f.docs_rating !== null)
            .map((f) => f.docs_rating!)
        ),
        support_rating: get_avg(
          feedbacks
            .filter((f) => f.support_rating !== null)
            .map((f) => f.support_rating!)
        ),
        challenge_recommendation_rating: get_avg(
          feedbacks
            .filter((f) => f.challenge_recommendation_rating !== null)
            .map((f) => f.challenge_recommendation_rating!)
        ),
        total_responses: feedbacks.length,
      };
    });

    return averages;
  }

  private calculate_overall_challenge_averages(
    feedbacks: HackathonChallengeFeedback[]
  ): OverallChallengeAverages {
    const get_avg = (arr: number[]) =>
      arr.length > 0
        ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        : 0;

    return {
      overall_rating: get_avg(
        feedbacks
          .filter((f) => f.overall_rating !== null)
          .map((f) => f.overall_rating!)
      ),
      docs_rating: get_avg(
        feedbacks
          .filter((f) => f.docs_rating !== null)
          .map((f) => f.docs_rating!)
      ),
      support_rating: get_avg(
        feedbacks
          .filter((f) => f.support_rating !== null)
          .map((f) => f.support_rating!)
      ),
      challenge_recommendation_rating: get_avg(
        feedbacks
          .filter((f) => f.challenge_recommendation_rating !== null)
          .map((f) => f.challenge_recommendation_rating!)
      ),
    };
  }

  private build_average_rows(averages: {
    global: GlobalAverages;
    challenge: ChallengeAverages;
    overallChallenge: OverallChallengeAverages;
  }): string[] {
    const rows: string[] = [];

    rows.push("");
    rows.push("AVERAGES");
    rows.push("");

    rows.push("Global Hackathon Averages");
    rows.push(
      `Average Overall Rating,${averages.global.overall_hackathon_rating}`
    );
    rows.push(
      `Average Recommendation Rating,${averages.global.recommend_hackathon_rating}`
    );
    rows.push(
      `Average DevSpot Rating,${averages.global.overall_devspot_rating}`
    );
    rows.push(
      `Average DevSpot Recommendation Rating,${averages.global.recommend_devspot_rating}`
    );
    rows.push(`Total Responses,${averages.global.total_responses}`);
    rows.push("");

    rows.push("Challenge Averages");
    Object.entries(averages.challenge).forEach(([name, avgs]) => {
      rows.push(`${this.escape_csv(name)}`);
      rows.push(`  Average Overall Rating,${avgs.overall_rating}`);
      rows.push(`  Average Docs Rating,${avgs.docs_rating}`);
      rows.push(`  Average Support Rating,${avgs.support_rating}`);
      rows.push(
        `  Average Recommendation Rating,${avgs.challenge_recommendation_rating}`
      );
      rows.push(`  Total Responses,${avgs.total_responses}`);
      rows.push("");
    });

    rows.push("Overall Challenge Averages (All Challenges Combined)");
    rows.push(
      `Average Overall Rating,${averages.overallChallenge.overall_rating}`
    );
    rows.push(`Average Docs Rating,${averages.overallChallenge.docs_rating}`);
    rows.push(
      `Average Support Rating,${averages.overallChallenge.support_rating}`
    );
    rows.push(
      `Average Recommendation Rating,${averages.overallChallenge.challenge_recommendation_rating}`
    );

    return rows;
  }

  private escape_csv(value: string | null | undefined): string {
    if (!value) return "";
    const string_value = String(value);
    return /,|"|\n/.test(string_value)
      ? `"${string_value.replace(/"/g, '""')}"`
      : string_value;
  }

  async toggleProjectHidden(
    technology_owner_id: number,
    body: {
      project_id: number;
      challenge_id: number;
      hidden: boolean;
    }
  ) {
    const { project_id, challenge_id, hidden } = body;

    // Validate that the project belongs to a hackathon owned by this technology owner
    const { data: project, error: projectError } = await this.supabase
      .from("projects")
      .select(
        `
        id,
        hackathon_id,
        hackathons!inner (
          id,
          organizer_id
        )
      `
      )
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      throw new Error("Project not found");
    }

    if (project.hackathons.organizer_id !== technology_owner_id) {
      throw new Error("Unauthorized access to project");
    }

    // Validate that the challenge exists and belongs to the same hackathon
    const { data: challenge, error: challengeError } = await this.supabase
      .from("hackathon_challenges")
      .select("id")
      .eq("id", challenge_id)
      .eq("hackathon_id", project.hackathon_id)
      .single();

    if (challengeError || !challenge) {
      throw new Error(
        "Challenge not found or does not belong to this hackathon"
      );
    }

    // Find all judging entries for this project-challenge combination
    const { data: judgingEntries, error: judgingEntryError } =
      await this.supabase
        .from("judging_entries")
        .select("*")
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id);

    if (judgingEntryError) {
      throw new Error(
        `Failed to fetch judging entries: ${judgingEntryError.message}`
      );
    }

    if (!judgingEntries || judgingEntries.length === 0) {
      throw new Error(
        "No judging entries found for this project-challenge combination"
      );
    }

    // Update all judging entries for this project-challenge combination
    const { data: updatedEntries, error: updateError } = await this.supabase
      .from("judging_entries")
      .update({
        project_hidden: hidden,
        updated_at: new Date().toISOString(),
      })
      .eq("project_id", project_id)
      .eq("challenge_id", challenge_id)
      .select();

    if (updateError) {
      throw new Error(
        `Failed to update project hidden status: ${updateError.message}`
      );
    }

    // Return the first updated entry as representative
    return updatedEntries[0];
  }
}

export default TechnologyOwnerService;
