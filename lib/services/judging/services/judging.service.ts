import { JudgingEntries } from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import ApiBaseService from "../../utils/baseService";

class JudgingService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async getUserJudgings(user_id: string) {
    const { data, error } = await this.supabase
      .from("judgings")
      .select(
        "*, hackathons(*, organizer:technology_owners(*), participants:hackathon_participants(count))"
      )
      .eq("user_id", user_id);

    if (error) throw new Error(error.message);

    const mappedHackathons = data.map((judging) => {
      return {
        ...judging,
        hackathons: {
          ...judging.hackathons,
          number_of_participants:
            judging.hackathons?.participants?.[0]?.count ?? 0,
        },
      };
    });

    return mappedHackathons;
  }

  async validateJudgingOwnership(judging_id: number, user_id: string) {
    const { data, error } = await this.supabase
      .from("judgings")
      .select("id")
      .eq("id", judging_id)
      .eq("user_id", user_id)
      .single();

    if (error) throw new Error("Judging not found for this user");
    return data;
  }

  canBeEdited = (entries: JudgingEntries, ai_judged?: boolean) => {
    // If bot hasn't judged, cannot be edited
    if (ai_judged) return false;

    const fieldsToCheck: (keyof typeof entries)[] = [
      "business_feedback",
      "business_score",
      "business_summary",
      "general_comments",
      "general_comments_summary",
      "innovation_feedback",
      "innovation_score",
      "innovation_summary",
      "score",
      "technical_feedback",
      "technical_score",
      "technical_summary",
      "ux_feedback",
      "ux_score",
      "ux_summary",
    ];

    return fieldsToCheck.some((field) => {
      const value = entries?.[field];

      if (typeof value === "string") {
        return value.trim() !== "";
      }

      if (typeof value === "number") {
        return value !== 0;
      }

      return false;
    });
  };

  async getJudgingProjects(judging_id: number) {
    // 1️⃣ Get judging entries for this judging_id
    const { data: entries, error: entriesError } = await this.supabase
      .from("judging_entries")
      .select(
        `
        id,
        judging_status,
        judging_id,
        project_id,
        challenge_id,
        score,
        project_hidden,
        judging_bot_scores:judging_bot_scores_id (
          id,
          ai_judged,
          score
        ),
        projects!inner(
          *,
          hackathons (
            name,
            organizer:technology_owners(*)
          ),
          project_challenges (
            id,
            challenge_id,
            hackathon_challenges (
              id,
              challenge_name
            )
          ),
          project_team_members (
            id,
            is_project_manager,
            status,
            users (
              id,
              full_name,
              email,
              avatar_url
            )
          )
        )
      `
      )
      .eq("judging_id", judging_id)
      .eq("projects.submitted", true)
      .is("project_hidden", false);

    if (entriesError) throw new Error(entriesError.message);

    // 2️⃣ Get all challenge_ids for this judging_id
    const { data: judgeChallenges, error: challengesError } =
      await this.supabase
        .from("judging_challenges")
        .select("challenge_id")
        .eq("judging_id", judging_id);

    if (challengesError) throw new Error(challengesError.message);

    const challengeIds = judgeChallenges.map((jc) => jc.challenge_id);

    // 3️⃣ Get all projects submitted for those challenges from project_challenges
    const { data: projectChallengeRows, error: projChallengeError } =
      await this.supabase
        .from("project_challenges")
        .select("project_id, challenge_id")
        .in("challenge_id", challengeIds);

    if (projChallengeError) throw new Error(projChallengeError.message);

    const projectIds = projectChallengeRows.map((pc) => pc.project_id);

    // 4️⃣ Get projects with submitted = false and their relationships
    const { data: unsubmittedProjects, error: unsubmittedError } =
      await this.supabase
        .from("projects")
        .select(
          `
        *,
        hackathons (
          name,
          organizer:technology_owners(*)
        ),
        project_challenges (
          id,
          challenge_id,
          hackathon_challenges (
            id,
            challenge_name
          )
        ),
        project_team_members (
          id,
          is_project_manager,
          status,
          users (
            id,
            full_name,
            email,
            avatar_url
          )
        )
      `
        )
        .in("id", projectIds)
        .eq("submitted", false);

    if (unsubmittedError) throw new Error(unsubmittedError.message);

    // 5️⃣ Flatten judging_entries projects
    const flattenedEntries = entries.map((entry) => {
      const { projects, challenge_id, ...judgingFields } = entry;
      const { project_challenges, project_team_members, ...projFields } =
        projects;

      const confirmedTeamMembers = project_team_members.filter(
        (member) => member.status === "confirmed"
      );

      const matchedChallenge = project_challenges?.find(
        (ch) => ch.challenge_id === challenge_id
      );

      return {
        ...judgingFields,
        challenge_id,
        can_be_edited: this.canBeEdited(
          entry as any,
          judgingFields?.judging_bot_scores?.ai_judged
        ),
        projects: {
          ...projFields,
          project_team_members: confirmedTeamMembers,
          project_challenge: matchedChallenge ?? null,
        },
      };
    });

    // 6️⃣ Flatten unsubmitted projects in same format
    const flattenedUnsubmitted = unsubmittedProjects.map((proj) => {
      const { project_challenges, project_team_members, ...projFields } = proj;

      const confirmedTeamMembers = project_team_members.filter(
        (member) => member.status === "confirmed"
      );

      const matchedChallenge = project_challenges?.find((ch) =>
        challengeIds.includes(ch.challenge_id)
      );

      return {
        id: null,
        // judging_status: "needs_review",
        judging_id: judging_id,
        project_id: proj.id,
        challenge_id: matchedChallenge?.challenge_id ?? null,
        score: null,
        projects: {
          ...projFields,
          project_team_members: confirmedTeamMembers,
          project_challenge: matchedChallenge ?? null,
        },
      };
    });

    // 7️⃣ Sort and combine all projects based on status priority
    // Group all projects by challenge
    const projectsByChallenge = [
      ...flattenedEntries,
      ...flattenedUnsubmitted,
    ].reduce((acc, project) => {
      const challengeId = project.challenge_id;
      const challengeName =
        project.projects?.project_challenge?.hackathon_challenges
          ?.challenge_name;

      if (!challengeId || !challengeName) return acc;

      if (!acc[challengeId]) {
        acc[challengeId] = {
          challenge_name: challengeName,
          projects: [],
        };
      }

      // Sort projects by status within each challenge
      if (
        "judging_status" in project &&
        project.judging_status === "needs_review"
      ) {
        acc[challengeId].projects.unshift(project);
      } else if (
        "judging_status" in project &&
        project.judging_status === "judged"
      ) {
        acc[challengeId].projects.push(project);
      } else {
        acc[challengeId].projects.push(project);
      }

      return acc;
    }, {} as Record<number, { challenge_name: string; projects: any }>);

    // 7️⃣ Sort and combine all projects based on status priority
    const needsReviewProjects = flattenedEntries.filter(
      (entry) => entry.judging_status === "needs_review"
    );
    const judgedProjects = flattenedEntries.filter(
      (entry) => entry.judging_status === "judged"
    );

    const draftProjects = flattenedUnsubmitted;

    return projectsByChallenge;
  }

  async getJudgingProjectsUngrouped(judging_id: number) {
    // 1️⃣ Get judging entries for this judging_id
    const { data: entries, error: entriesError } = await this.supabase
      .from("judging_entries")
      .select(
        `
        id,
        judging_status,
        judging_id,
        project_id,
        challenge_id,
        score,
        project_hidden,
        judging_bot_scores:judging_bot_scores_id (
          id,
          ai_judged,
          score
        ),
        projects!inner(
          *,
          hackathons (
            name,
            organizer:technology_owners(*)
          ),
          project_challenges (
            id,
            challenge_id,
            hackathon_challenges (
              id,
              challenge_name
            )
          ),
          project_team_members (
            id,
            is_project_manager,
            status,
            users (
              id,
              full_name,
              email,
              avatar_url
            )
          )
        )
      `
      )
      .eq("judging_id", judging_id)
      .eq("projects.submitted", true)
      .is("project_hidden", false);

    if (entriesError) throw new Error(entriesError.message);

    // 2️⃣ Get all challenge_ids for this judging_id
    const { data: judgeChallenges, error: challengesError } =
      await this.supabase
        .from("judging_challenges")
        .select("challenge_id")
        .eq("judging_id", judging_id);

    if (challengesError) throw new Error(challengesError.message);

    const challengeIds = judgeChallenges.map((jc) => jc.challenge_id);

    // 3️⃣ Get all projects submitted for those challenges from project_challenges
    const { data: projectChallengeRows, error: projChallengeError } =
      await this.supabase
        .from("project_challenges")
        .select("project_id, challenge_id")
        .in("challenge_id", challengeIds);

    if (projChallengeError) throw new Error(projChallengeError.message);

    // 5️⃣ Flatten judging_entries projects
    const flattenedEntries = entries.map((entry) => {
      const { projects, challenge_id, ...judgingFields } = entry;
      const { project_challenges, project_team_members, ...projFields } =
        projects;

      const confirmedTeamMembers = project_team_members.filter(
        (member) => member.status === "confirmed"
      );

      const matchedChallenge = project_challenges?.find(
        (ch) => ch.challenge_id === challenge_id
      );

      return {
        ...judgingFields,
        challenge_id,
        can_be_edited: this.canBeEdited(
          entry as any,
          judgingFields?.judging_bot_scores?.ai_judged
        ),
        projects: {
          ...projFields,
          project_team_members: confirmedTeamMembers,
          project_challenge: matchedChallenge ?? null,
        },
      };
    });

    // 7️⃣ Sort and combine all projects based on status priority
    const needsReviewProjects = flattenedEntries.filter(
      (entry) => entry.judging_status === "needs_review"
    );
    const judgedProjects = flattenedEntries.filter(
      (entry) => entry.judging_status === "judged"
    );

    return [...judgedProjects, ...needsReviewProjects];
  }

  async getHackathonChallengesJudgesProgress(
    hackathonId: number,
    judging_id: number
  ) {
    // Verify the hackathon belongs to the technology owner
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select("id, start_date, deadline_to_submit")
      .eq("id", hackathonId)
      .single();

    if (hackathonError) {
      throw new Error(`Failed to verify hackathon: ${hackathonError.message}`);
    }

    // Get all challenges for the hackathon
    const { data: challenges, error: challengesError } = await this.supabase
      .from("hackathon_challenges")
      .select(
        `
        id,
        challenge_name,
        description
      `
      )
      .eq("hackathon_id", hackathonId);

    if (challengesError) {
      throw new Error(`Error fetching challenges: ${challengesError.message}`);
    }

    const currentDate = new Date().toISOString();
    const isJudgingLive =
      hackathon.deadline_to_submit &&
      new Date(hackathon.deadline_to_submit) <= new Date(currentDate);

    // Process each challenge
    const challengesWithPrizes = await Promise.all(
      challenges.map(async (challenge) => {
        // Get judges for this challenge
        const { data: judges, error: judgesError } = await this.supabase
          .from("judgings")
          .select(
            `
            id,
            user_id,
            is_submitted,
            users (
              id,
              full_name,
              avatar_url
            ),
            judging_challenges (
              id,
              challenge_id,
              is_winner_assigner
            )
          `
          )
          .eq("hackathon_id", hackathonId)
          .neq("id", judging_id);

        if (judgesError) {
          throw new Error(
            `Error fetching judges for hackathon: ${judgesError.message}`
          );
        }

        // Filter judges who are assigned to this specific challenge
        const challengeJudges = judges.filter((judge) =>
          judge.judging_challenges.some(
            (jc) => jc.challenge_id === challenge.id
          )
        );

        // Process judges and calculate progress
        const processedJudges = await Promise.all(
          challengeJudges.map(async (judge) => {
            // Get the judging_challenge record for this specific challenge
            const judgingChallenge = judge.judging_challenges.find(
              (jc) => jc.challenge_id === challenge.id
            );

            let status: string;
            let progressPercentage: number;

            // Always calculate progress percentage first
            const { count: totalEntries, error: totalError } =
              await this.supabase
                .from("judging_entries")
                .select("*", { count: "exact", head: true })
                .eq("judging_id", judge.id)
                .eq("challenge_id", challenge.id);

            const { count: judgedEntries, error: judgedError } =
              await this.supabase
                .from("judging_entries")
                .select("*", { count: "exact", head: true })
                .eq("judging_id", judge.id)
                .eq("challenge_id", challenge.id)
                .eq("judging_status", "judged");

            if (totalError || judgedError) {
              throw new Error(
                `Error calculating progress for judge ${judge.id}`
              );
            }

            progressPercentage =
              (totalEntries || 0) > 0
                ? Math.round(
                    ((judgedEntries || 0) / (totalEntries || 1)) * 1000
                  ) / 10
                : 0;

            // Determine status
            if (!isJudgingLive) {
              status = "Judging not live";
            } else if (judge.is_submitted) {
              status = "Submitted";
            } else {
              status = "In progress";
            }

            return {
              id: judge.user_id,
              name: judge.users.full_name || "Unknown",
              avatar_url: judge.users.avatar_url,
              is_prize_allocator: judgingChallenge?.is_winner_assigner || false,
              status,
              progress_percentage: progressPercentage,
            };
          })
        );

        // Sort judges: prize allocator first, then alphabetically
        processedJudges.sort((a, b) => {
          if (a.is_prize_allocator && !b.is_prize_allocator) return -1;
          if (!a.is_prize_allocator && b.is_prize_allocator) return 1;
          return (a.name || "").localeCompare(b.name || "");
        });

        return {
          id: challenge.id,
          challenge_name: challenge.challenge_name,
          description: challenge.description,
          judges: processedJudges,
        };
      })
    );

    return challengesWithPrizes;
  }

  // @drex double check impl
  async getJudgingProjectDetails(
    judging_id: number,
    project_id: number,
    challengeId: number
  ) {
    const { data, error } = await this.supabase
      .from("judging_entries")
      .select(
        `
      *,
      judging_bot_scores:judging_bot_scores_id (
        ai_judged
      ),
      projects(
        *,
        hackathons(name, team_limit),
        project_challenges (*, hackathon_challenges(*)),
        project_team_members(
          id,
          is_project_manager,
          prize_allocation,
          status,
          user_id,
          users(id, full_name, email, avatar_url)
        )
      )
      `
      )
      .eq("judging_id", judging_id)
      .eq("project_id", project_id)
      .eq("challenge_id", challengeId);

    if (error) throw new Error(error.message);

    const entry = Array.isArray(data) ? data[0] ?? null : data;
    if (!entry) return null;

    const { projects, challenge_id, judging_bot_scores, ...judgingFields } =
      entry;
    const { project_challenges, project_team_members, ...projFields } =
      projects;

    const confirmedTeamMembers = project_team_members.filter(
      (member) => member.status === "confirmed"
    );

    const matchedChallenge = project_challenges?.find(
      (ch) => ch.challenge_id === challenge_id
    );

    // Only pass the fields that JudgingEntries expects (omit 'projects')
    const judgingEntriesForEdit = { ...judgingFields, challenge_id };

    const can_be_edited = this.canBeEdited(
      judgingEntriesForEdit as any,
      judging_bot_scores?.ai_judged ?? false
    );

    return {
      ...judgingFields,
      challenge_id,
      can_be_edited,
      judging_bot_scores,
      projects: {
        ...projFields,
        project_team_members: confirmedTeamMembers,
        project_challenge: matchedChallenge ?? null,
        project_challenges,
      },
    };
  }

  async createJudging({
    user_id,
    hackathon_id,
    challenge_id,
  }: {
    user_id: string;
    hackathon_id: number;
    challenge_id?: number;
  }) {
    const { data: existing, error: findError } = await this.supabase
      .from("judgings")
      .select("id")
      .eq("user_id", user_id)
      .eq("hackathon_id", hackathon_id)
      .maybeSingle();

    if (findError) throw new Error(findError.message);
    if (existing) throw new Error("Judge already assigned to this hackathon");

    const is_submitted = false;
    const { data, error } = await this.supabase
      .from("judgings")
      .insert([{ user_id, hackathon_id, is_submitted }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getJudgingProgress(judging_id: number) {
    const { count: total, error: totalError } = await this.supabase
      .from("judging_entries")
      .select("*", { count: "exact", head: true })
      .eq("judging_id", judging_id);

    const { count: judged, error: judgedError } = await this.supabase
      .from("judging_entries")
      .select("*", { count: "exact", head: true })
      .eq("judging_id", judging_id)
      .eq("judging_status", "judged");

    const { count: flagged, error: flaggedError } = await this.supabase
      .from("judging_entries")
      .select("*", { count: "exact", head: true })
      .eq("judging_id", judging_id)
      .eq("judging_status", "flagged");

    if (totalError || judgedError || flaggedError)
      throw new Error(
        totalError?.message || judgedError?.message || flaggedError?.message
      );

    return {
      total,
      judged,
      flagged,
    };
  }

  async submitJudgingEntry({
    judging_id,
    project_id,
    challenge_id,
    score,
    technical_feedback,
    technical_score,
    business_feedback,
    business_score,
    innovation_feedback,
    innovation_score,
    ux_feedback,
    ux_score,
    general_comments,
  }: {
    judging_id: number;
    project_id: number;
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
  }) {
    const { data, error } = await this.supabase
      .from("judging_entries")
      .insert({
        judging_id,
        project_id,
        challenge_id,
        score,
        technical_feedback,
        technical_score,
        business_feedback,
        business_score,
        innovation_feedback,
        innovation_score,
        ux_feedback,
        ux_score,
        general_comments,
        judging_status: "needs_review",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit judging entry: ${error.message}`);
    }

    return data;
  }

  async updateJudgingEntry({
    judging_id,
    project_id,
    challenge_id,
    score,
    technical_feedback,
    business_feedback,
    innovation_feedback,
    ux_feedback,
    general_comments,
    business_score,
    innovation_score,
    ux_score,
    technical_score,
    judging_status,
  }: {
    judging_id: number;
    project_id: number;
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
  }) {
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (score !== undefined) updates.score = score;
    if (technical_feedback !== undefined)
      updates.technical_feedback = technical_feedback;
    if (business_feedback !== undefined)
      updates.business_feedback = business_feedback;
    if (innovation_feedback !== undefined)
      updates.innovation_feedback = innovation_feedback;
    if (ux_feedback !== undefined) updates.ux_feedback = ux_feedback;
    if (general_comments !== undefined)
      updates.general_comments = general_comments;
    if (judging_status !== undefined) updates.judging_status = judging_status;
    if (business_score !== undefined) updates.business_score = business_score;
    if (innovation_score !== undefined)
      updates.innovation_score = innovation_score;
    if (ux_score !== undefined) updates.ux_score = ux_score;
    if (technical_score !== undefined)
      updates.technical_score = technical_score;

    const { data, error } = await this.supabase
      .from("judging_entries")
      .update(updates)
      .eq("judging_id", judging_id)
      .eq("project_id", project_id)
      .eq("challenge_id", challenge_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update judging entry: ${error.message}`);
    }

    return data;
  }

  async flagJudgingEntry({
    judging_id,
    project_id,
    challenge_id,
    flag_reason,
    flag_comments,
    status,
  }: {
    judging_id: number;
    project_id: number;
    challenge_id: number;
    flag_reason: string;
    flag_comments?: string;
    status?: "unflag";
  }) {
    let updates: Record<string, any> = {};
    let message = "";
    if (status === "unflag") {
      updates = {
        flagged_reason: null,
        flagged_comments: null,
        judging_status: "needs_review",
      };
      message = "Successfully unflagged.";
    } else {
      updates = {
        flagged_reason: flag_reason,
        judging_status: "flagged",
      };
      if (flag_comments !== undefined) {
        updates.flagged_comments = flag_comments;
      }
      message = "Successfully flagged.";
    }

    const { data, error } = await this.supabase
      .from("judging_entries")
      .update(updates)
      .eq("judging_id", judging_id)
      .eq("project_id", project_id)
      .eq("challenge_id", challenge_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to flag judging entry: ${error.message}`);
    }

    return { message };
  }

  async submitAllScores(judging_id: number) {
    const { data, error } = await this.supabase
      .from("judgings")
      .update({ is_submitted: true })
      .eq("id", judging_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit all scores: ${error.message}`);
    }

    return data;
  }

  async getHackathonJudges(hackathonId: number) {
    // Get all judges for the hackathon with their basic info
    const { data: judges, error: judgesError } = await this.supabase
      .from("judgings")
      .select(
        `
        id,
        user_id,
        is_submitted,
        users (
          id,
          full_name,
          avatar_url
        ),
        judging_challenges (
          id,
          challenge_id,
          is_winner_assigner,
          hackathon_challenges (
            id,
            challenge_name
          )
        ),
        judging_entries (
          id,
          score,
          judging_status
        )
      `
      )
      .eq("hackathon_id", hackathonId);

    if (judgesError) throw new Error(judgesError.message);

    // Transform the data to match the required format
    return judges.map((judge) => {
      const challenges = judge.judging_challenges.map((challenge) => ({
        id: challenge.challenge_id,
        name: challenge.hackathon_challenges.challenge_name,
        is_winner_assigner: challenge.is_winner_assigner,
      }));

      const totalProjects = judge.judging_entries.length;
      const judgedProjects = judge.judging_entries.filter(
        (entry) => entry.judging_status === "judged"
      ).length;
      const progress =
        totalProjects > 0 ? (judgedProjects / totalProjects) * 100 : 0;

      // Calculate score statistics
      const scores = judge.judging_entries
        .filter((entry) => entry.score !== null)
        .map((entry) => entry.score);

      const mean =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : null;

      // Calculate median
      const sortedScores = [...scores].sort((a, b) => a - b);
      const median =
        sortedScores.length > 0
          ? sortedScores.length % 2 === 0
            ? (sortedScores[sortedScores.length / 2 - 1] +
                sortedScores[sortedScores.length / 2]) /
              2
            : sortedScores[Math.floor(sortedScores.length / 2)]
          : null;

      // Calculate mode
      const mode =
        scores.length > 0
          ? scores.reduce((a, b, i, arr) =>
              arr.filter((v) => v === a).length >=
              arr.filter((v) => v === b).length
                ? a
                : b
            )
          : null;

      return {
        id: judge.user_id,
        judging_id: judge.id,
        name: judge.users.full_name,
        avatar_url: judge.users.avatar_url,
        challenges,
        total_projects: totalProjects,
        progress,
        score_stats: {
          mean,
          median,
          mode,
        },
      };
    });
  }

  async getJudgingChallenges(judging_id: number) {
    const { data, error } = await this.supabase
      .from("judging_challenges")
      .select(
        `
        id,
        challenge_id,
        hackathon_challenges (
          id,
          challenge_name,
          sponsors
        )
      `
      )
      .eq("judging_id", judging_id);

    if (error) throw new Error(error.message);

    return data.map((challenge) => ({
      id: challenge.challenge_id,
      challenge_name: challenge.hackathon_challenges.challenge_name,
      sponsors: challenge.hackathon_challenges.sponsors,
    }));
  }

  async addChallengesToJudging(judging_id: number, challenge_ids: number[]) {
    // Get the judging to check is_submitted
    const { data: judging, error: judgingError } = await this.supabase
      .from("judgings")
      .select("*")
      .eq("id", judging_id)
      .single();

    if (judgingError) {
      throw new Error("Failed to fetch judging");
    }

    // Start a transaction
    const { data: existingChallenges, error: existingError } =
      await this.supabase
        .from("judging_challenges")
        .select("challenge_id")
        .eq("judging_id", judging_id);

    if (existingError) {
      throw new Error("Failed to fetch existing challenges");
    }

    const existingChallengeIds = new Set(
      existingChallenges.map((c) => c.challenge_id)
    );
    const newChallengeIds = challenge_ids.filter(
      (id) => !existingChallengeIds.has(id)
    );

    // Insert new challenges
    if (newChallengeIds.length > 0) {
      const { error: insertError } = await this.supabase
        .from("judging_challenges")
        .insert(
          newChallengeIds.map((challenge_id) => ({
            judging_id,
            challenge_id,
            is_winner_assigner: false,
          }))
        );

      if (insertError) {
        throw new Error("Failed to insert new challenges");
      }
    }

    // Get all bot scores for the new challenges
    const { data: botScores, error: botScoresError } = await this.supabase
      .from("judging_bot_scores")
      .select("*")
      .in("challenge_id", newChallengeIds);

    if (botScoresError) {
      throw new Error("Failed to fetch bot scores");
    }

    // Create judging entries for each bot score
    if (botScores && botScores.length > 0) {
      const judgingEntries = botScores.map((score) => ({
        judging_id,
        project_id: score.project_id,
        challenge_id: score.challenge_id,
        score: score.score,
        technical_feedback: score.technical_feedback,
        technical_score: score.technical_score,
        technical_summary: score.technical_summary,
        business_feedback: score.business_feedback,
        business_score: score.business_score,
        business_summary: score.business_summary,
        innovation_feedback: score.innovation_feedback,
        innovation_score: score.innovation_score,
        innovation_summary: score.innovation_summary,
        ux_feedback: score.ux_feedback,
        ux_score: score.ux_score,
        ux_summary: score.ux_summary,
        general_comments: score.general_comments,
        general_comments_summary: score.general_comments_summary,
        judging_status: "needs_review" as const,
        flagged_comments: null,
        flagged_reason: null,
      }));

      const { error: entriesError } = await this.supabase
        .from("judging_entries")
        .insert(judgingEntries);

      if (entriesError) {
        throw new Error("Failed to create judging entries");
      }
    }

    // Update is_submitted if it was true
    if (judging.is_submitted) {
      const { error: updateError } = await this.supabase
        .from("judgings")
        .update({ is_submitted: false })
        .eq("id", judging_id);

      if (updateError) {
        throw new Error("Failed to update judging status");
      }
    }

    return {
      judging_id,
      challenges_added: newChallengeIds.length,
      total_challenges: existingChallengeIds.size + newChallengeIds.length,
    };
  }

  async removeChallengesFromJudging(
    judging_id: number,
    challenge_ids: number[]
  ) {
    // Validate judging exists
    const { data: judging, error: judgingError } = await this.supabase
      .from("judgings")
      .select("*")
      .eq("id", judging_id)
      .single();

    if (judgingError) {
      throw new Error("Failed to fetch judging");
    }

    // Get existing challenges for this judge
    const { data: existingChallenges, error: existingError } =
      await this.supabase
        .from("judging_challenges")
        .select("challenge_id")
        .eq("judging_id", judging_id);

    if (existingError) {
      throw new Error("Failed to fetch existing challenges");
    }

    const existingChallengeIds = new Set(
      existingChallenges.map((c) => c.challenge_id)
    );
    const challengesToRemove = challenge_ids.filter((id) =>
      existingChallengeIds.has(id)
    );
    const challengesSkipped = challenge_ids.filter(
      (id) => !existingChallengeIds.has(id)
    );

    // Use transaction to delete from both tables
    if (challengesToRemove.length > 0) {
      // Delete from judging_challenges
      const { error: deleteChallengesError } = await this.supabase
        .from("judging_challenges")
        .delete()
        .eq("judging_id", judging_id)
        .in("challenge_id", challengesToRemove);

      if (deleteChallengesError) {
        throw new Error("Failed to delete challenges");
      }

      // Delete from judging_entries
      const { error: deleteEntriesError } = await this.supabase
        .from("judging_entries")
        .delete()
        .eq("judging_id", judging_id)
        .in("challenge_id", challengesToRemove);

      if (deleteEntriesError) {
        throw new Error("Failed to delete judging entries");
      }
    }

    return {
      judging_id,
      challenges_removed: challengesToRemove.length,
      challenges_skipped: challengesSkipped.length,
      remaining_challenges:
        existingChallengeIds.size - challengesToRemove.length,
    };
  }

  async deleteProjectChallengePairs(
    hackathon_id: number,
    pairs: { projectId: number; challengeId: number }[]
  ) {
    if (!pairs || pairs.length === 0) {
      return {
        deleted_judging_entries: 0,
        deleted_project_challenges: 0,
        deleted_projects: 0,
      };
    }

    // First, verify which pairs actually exist
    const orFilter = pairs
      .map(
        (pair) =>
          `and(project_id.eq.${pair.projectId},challenge_id.eq.${pair.challengeId})`
      )
      .join(",");

    const { data: existingPairs, error: existingError } = await this.supabase
      .from("project_challenges")
      .select("project_id, challenge_id")
      .or(orFilter);

    if (existingError) {
      throw new Error("Failed to verify existing project-challenge pairs");
    }

    // If no pairs exist, return early
    if (!existingPairs || existingPairs.length === 0) {
      return {
        deleted_judging_entries: 0,
        deleted_project_challenges: 0,
        deleted_projects: 0,
      };
    }

    // Create filter for existing pairs only
    const validPairsFilter = existingPairs
      .map(
        (pair) =>
          `and(project_id.eq.${pair.project_id},challenge_id.eq.${pair.challenge_id})`
      )
      .join(",");

    // Delete from judging_entries
    const { data: deletedEntries, error: entriesError } = await this.supabase
      .from("judging_entries")
      .delete()
      .or(validPairsFilter)
      .select();

    if (entriesError) {
      throw new Error("Failed to delete judging entries");
    }

    // Delete from project_challenges
    const { data: deletedPairs, error: pairsError } = await this.supabase
      .from("project_challenges")
      .delete()
      .or(validPairsFilter)
      .select();

    if (pairsError) {
      throw new Error("Failed to delete project-challenge pairs");
    }

    // Get unique project IDs from actually deleted pairs
    const affectedProjectIds = Array.from(
      new Set(deletedPairs?.map((p) => p.project_id) ?? [])
    );

    // Check which projects have no remaining pairs
    const { data: remainingProjects, error: remainingError } =
      await this.supabase
        .from("project_challenges")
        .select("project_id")
        .in("project_id", affectedProjectIds);

    if (remainingError) {
      throw new Error("Failed to check remaining project-challenge pairs");
    }

    const remainingProjectIds = new Set(
      remainingProjects?.map((p) => p.project_id) ?? []
    );
    const projectsToDelete = affectedProjectIds.filter(
      (id) => !remainingProjectIds.has(id)
    );

    // Delete projects that have no remaining pairs
    if (projectsToDelete.length > 0) {
      const { error: deleteProjectsError } = await this.supabase
        .from("projects")
        .delete()
        .in("id", projectsToDelete);

      if (deleteProjectsError) {
        throw new Error("Failed to delete projects");
      }
    }

    return {
      deleted_judging_entries: deletedEntries?.length ?? 0,
      deleted_project_challenges: deletedPairs?.length ?? 0,
      deleted_projects: projectsToDelete.length,
    };
  }

  async assignWinnerAssigner(
    challenge_id: number,
    judge_id: string,
    is_winner_assigner: boolean
  ) {
    // First verify the challenge exists
    const { data: challenge, error: challengeError } = await this.supabase
      .from("hackathon_challenges")
      .select("id")
      .eq("id", challenge_id)
      .single();

    if (challengeError || !challenge) {
      throw new Error("Challenge not found");
    }

    // Get the judging_id for this judge
    const { data: judging, error: judgingError } = await this.supabase
      .from("judgings")
      .select("id")
      .eq("id", parseInt(judge_id))
      .single();

    if (judgingError || !judging) {
      throw new Error("Judge not found");
    }

    // Check if the judge is assigned to this challenge
    const { data: existingAssignment, error: assignmentError } =
      await this.supabase
        .from("judging_challenges")
        .select("id")
        .eq("judging_id", judging.id)
        .eq("challenge_id", challenge_id)
        .single();

    if (assignmentError || !existingAssignment) {
      throw new Error("Judge is not assigned to this challenge");
    }

    // If setting to true, first disable any existing winner assigner
    if (is_winner_assigner) {
      const { error: updateError } = await this.supabase
        .from("judging_challenges")
        .update({ is_winner_assigner: false })
        .eq("challenge_id", challenge_id)
        .eq("is_winner_assigner", true);

      if (updateError) {
        throw new Error("Failed to update existing winner assigner");
      }
    }

    const { data, error } = await this.supabase
      .from("judging_challenges")
      .update({ is_winner_assigner })
      .eq("judging_id", judging.id)
      .eq("challenge_id", challenge_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign winner assigner: ${error.message}`);
    }

    return data;
  }

  async get_projects_a_judge_is_judging(judgingId: number) {
    // Fetch all judging_entries with related project and challenge info
    const { data: entries, error } = await this.supabase
      .from("judging_entries")
      .select(
        `
        project_id,
        standing,
        projects (
          name,
          submitted
        ),
        hackathon_challenges:challenge_id (
          id,
          challenge_name,
          sponsors
        )
      `
      )
      .eq("judging_id", judgingId);

    if (error) {
      throw new Error(`Error fetching judging entries: ${error.message}`);
    }

    // Enrich each entry
    const results = await Promise.all(
      entries.map(async (e) => {
        // Fetch confirmed team members
        const { data: teamMembers, error: tmError } = await this.supabase
          .from("project_team_members")
          .select(
            `
          user_id,
          users ( full_name, avatar_url )
        `
          )
          .eq("project_id", e.project_id)
          .eq("status", "confirmed");

        if (tmError) {
          throw new Error(
            `Error fetching team members for project ${e.project_id}: ${tmError.message}`
          );
        }

        // Fetch judges for this project + challenge
        const { data: judgeEntries, error: jeError } = await this.supabase
          .from("judging_entries")
          .select("judging_id")
          .eq("project_id", e.project_id)
          .eq("challenge_id", e.hackathon_challenges.id);

        if (jeError) {
          throw new Error(
            `Error fetching judges for project ${e.project_id}, challenge ${e.hackathon_challenges.id}: ${jeError.message}`
          );
        }

        const judges = await Promise.all(
          judgeEntries.map(async (je) => {
            if (!je.judging_id) {
              throw new Error(
                `Missing judging_id for project ${e.project_id}, challenge ${e.hackathon_challenges.id}`
              );
            }

            const { data: j, error: jError } = await this.supabase
              .from("judgings")
              .select("user_id")
              .eq("id", je.judging_id)
              .single();
            if (jError)
              throw new Error(
                `No judging record for ${je.judging_id}: ${jError.message}`
              );

            const { data: u, error: uError } = await this.supabase
              .from("users")
              .select("full_name, avatar_url")
              .eq("id", j.user_id)
              .single();
            if (uError)
              throw new Error(`No user for ${j.user_id}: ${uError.message}`);

            return {
              judging_id: je.judging_id,
              full_name: u.full_name,
              avatar_url: u.avatar_url,
            };
          })
        );

        // Fetch all scores for this project + challenge pair and compute average
        const { data: scoreEntries, error: scoreError } = await this.supabase
          .from("judging_entries")
          .select("score")
          .eq("project_id", e.project_id)
          .eq("challenge_id", e.hackathon_challenges.id);

        if (scoreError) {
          throw new Error(
            `Error fetching scores for project ${e.project_id}, challenge ${e.hackathon_challenges.id}: ${scoreError.message}`
          );
        }

        const scores = scoreEntries
          .map((s) => s.score)
          .filter((s) => s !== null && s !== undefined);
        const averageScore =
          scores.length > 0
            ? scores.reduce((sum, s) => sum + s, 0) / scores.length
            : null;

        return {
          project_id: e.project_id,
          name: e.projects.name,
          submitted: e.projects.submitted,
          team_members: teamMembers.map((tm) => ({
            user_id: tm.user_id,
            full_name: tm.users.full_name,
            avatar_url: tm.users.avatar_url,
          })),
          challenges: [
            {
              challenge_id: e.hackathon_challenges.id,
              challenge_name: e.hackathon_challenges.challenge_name,
              sponsors: e.hackathon_challenges.sponsors,
              score: averageScore,
              standing: e.standing,
              judges,
            },
          ],
        };
      })
    );

    return results;
  }

  async addJudgeToProjects(
    judgingId: number,
    projectChallengePairs: { project_id: number; challenge_id: number }[]
  ) {
    const successfully_added: { project_id: number; challenge_id: number }[] =
      [];
    const skipped: { project_id: number; challenge_id: number }[] = [];

    for (const pair of projectChallengePairs) {
      const { project_id, challenge_id } = pair;

      // Check if entry exists
      const { data: existing, error: existingError } = await this.supabase
        .from("judging_entries")
        .select("id")
        .eq("judging_id", judgingId)
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      if (existingError) {
        throw new Error(
          `Error checking existing judging entry: ${existingError.message}`
        );
      }

      if (existing) {
        skipped.push({ project_id, challenge_id });
        continue;
      }

      // Get bot score to copy
      const { data: botScore, error: botScoreError } = await this.supabase
        .from("judging_bot_scores")
        .select("*")
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      if (botScoreError) {
        throw new Error(`Error fetching bot score: ${botScoreError.message}`);
      }

      if (!botScore) {
        skipped.push({ project_id, challenge_id });
        continue;
      }

      const { error: insertError } = await this.supabase
        .from("judging_entries")
        .insert([
          {
            judging_id: judgingId,
            project_id,
            challenge_id,
            score: botScore.score,

            technical_feedback: botScore.technical_feedback,
            technical_score: botScore.technical_score,
            technical_summary: botScore.technical_summary,

            innovation_feedback: botScore.innovation_feedback,
            innovation_score: botScore.innovation_score,
            innovation_summary: botScore.innovation_summary,

            ux_feedback: botScore.ux_feedback,
            ux_score: botScore.ux_score,
            ux_summary: botScore.ux_summary,

            business_feedback: botScore.business_feedback,
            business_score: botScore.business_score,
            business_summary: botScore.business_summary,

            general_comments: botScore.general_comments,
            general_comments_summary: botScore.general_comments_summary,

            judging_status: "needs_review",
            flagged_comments: null,
            flagged_reason: null,
            standing: null,
          },
        ]);

      if (insertError) {
        throw new Error(`Error creating judging entry: ${insertError.message}`);
      }

      successfully_added.push({ project_id, challenge_id });
    }

    return { successfully_added, skipped };
  }

  async removeJudgeFromProjects(
    judgingId: number,
    projectChallengePairs: { project_id: number; challenge_id: number }[]
  ) {
    const successfully_removed: { project_id: number; challenge_id: number }[] =
      [];
    const skipped: { project_id: number; challenge_id: number }[] = [];

    for (const pair of projectChallengePairs) {
      const { project_id, challenge_id } = pair;

      // Check if entry exists
      const { data: existing, error: existingError } = await this.supabase
        .from("judging_entries")
        .select("id")
        .eq("judging_id", judgingId)
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      if (existingError) {
        throw new Error(
          `Error checking existing judging entry: ${existingError.message}`
        );
      }

      if (!existing) {
        skipped.push({ project_id, challenge_id });
        continue;
      }

      const { error: deleteError } = await this.supabase
        .from("judging_entries")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        throw new Error(`Error deleting judging entry: ${deleteError.message}`);
      }

      successfully_removed.push({ project_id, challenge_id });
    }

    return { successfully_removed, skipped };
  }

  async addJudgesToProjects(
    pairs: { judging_id: number; project_id: number; challenge_id: number }[]
  ) {
    const successfully_added: typeof pairs = [];
    const skipped: typeof pairs = [];

    for (const { judging_id, project_id, challenge_id } of pairs) {
      // Check if entry exists
      const { data: existing, error: existingError } = await this.supabase
        .from("judging_entries")
        .select("id")
        .eq("judging_id", judging_id)
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      if (existingError) {
        throw new Error(
          `Error checking existing judging entry: ${existingError.message}`
        );
      }

      if (existing) {
        skipped.push({ judging_id, project_id, challenge_id });
        continue;
      }

      // Fetch bot score
      const { data: botScore, error: botScoreError } = await this.supabase
        .from("judging_bot_scores")
        .select("*")
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      if (botScoreError) {
        throw new Error(`Error fetching bot score: ${botScoreError.message}`);
      }

      if (!botScore) {
        skipped.push({ judging_id, project_id, challenge_id });
        continue;
      }

      const { error: insertError } = await this.supabase
        .from("judging_entries")
        .insert([
          {
            judging_id,
            project_id,
            challenge_id,
            score: botScore.score,

            technical_feedback: botScore.technical_feedback,
            technical_score: botScore.technical_score,
            technical_summary: botScore.technical_summary,

            innovation_feedback: botScore.innovation_feedback,
            innovation_score: botScore.innovation_score,
            innovation_summary: botScore.innovation_summary,

            ux_feedback: botScore.ux_feedback,
            ux_score: botScore.ux_score,
            ux_summary: botScore.ux_summary,

            business_feedback: botScore.business_feedback,
            business_score: botScore.business_score,
            business_summary: botScore.business_summary,

            general_comments: botScore.general_comments,
            general_comments_summary: botScore.general_comments_summary,

            judging_status: "needs_review",
            flagged_comments: null,
            flagged_reason: null,
            standing: null,
          },
        ]);

      if (insertError) {
        throw new Error(`Error creating judging entry: ${insertError.message}`);
      }

      successfully_added.push({ judging_id, project_id, challenge_id });
    }

    return { successfully_added, skipped };
  }

  async removeJudgesFromProjects(
    pairs: { judging_id: number; project_id: number; challenge_id: number }[]
  ) {
    const successfully_removed: typeof pairs = [];
    const skipped: typeof pairs = [];

    for (const { judging_id, project_id, challenge_id } of pairs) {
      const { data: existing, error: existingError } = await this.supabase
        .from("judging_entries")
        .select("id")
        .eq("judging_id", judging_id)
        .eq("project_id", project_id)
        .eq("challenge_id", challenge_id)
        .maybeSingle();

      if (existingError) {
        throw new Error(
          `Error checking existing judging entry: ${existingError.message}`
        );
      }

      if (!existing) {
        skipped.push({ judging_id, project_id, challenge_id });
        continue;
      }

      const { error: deleteError } = await this.supabase
        .from("judging_entries")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        throw new Error(`Error deleting judging entry: ${deleteError.message}`);
      }

      successfully_removed.push({ judging_id, project_id, challenge_id });
    }

    return { successfully_removed, skipped };
  }

  async assignProjectsToJudges(botScoreIds: number[]) {
    const successfully_assigned: number[] = [];
    const skipped: number[] = [];
    const errors: Array<{ botScoreId: number; error: string }> = [];

    for (const botScoreId of botScoreIds) {
      try {
        // Get bot score data
        const { data: botScore, error: botScoreError } = await this.supabase
          .from("judging_bot_scores")
          .select("*")
          .eq("id", botScoreId)
          .single();

        if (botScoreError || !botScore) {
          errors.push({ botScoreId, error: "Bot score not found" });
          continue;
        }

        // Get all judges for this challenge
        const { data: judgingChallenges, error: judgingChallengesError } =
          await this.supabase
            .from("judging_challenges")
            .select("judging_id")
            .eq("challenge_id", botScore.challenge_id);

        if (judgingChallengesError) {
          errors.push({
            botScoreId,
            error: "Failed to fetch judging challenges",
          });
          continue;
        }

        // For each judge, create a judging entry if it doesn't exist
        for (const judgingChallenge of judgingChallenges) {
          // Check if entry already exists
          const { data: existingEntry, error: existingError } =
            await this.supabase
              .from("judging_entries")
              .select("id")
              .eq("judging_id", judgingChallenge.judging_id)
              .eq("project_id", botScore.project_id)
              .eq("challenge_id", botScore.challenge_id)
              .eq("judging_bot_scores_id", botScore.id)
              .maybeSingle();

          if (existingError) {
            errors.push({
              botScoreId,
              error: "Failed to check existing entry",
            });
            continue;
          }

          if (existingEntry) {
            skipped.push(botScoreId);
            continue;
          }

          // Create new judging entry
          const { error: insertError } = await this.supabase
            .from("judging_entries")
            .insert({
              judging_id: judgingChallenge.judging_id,
              project_id: botScore.project_id,
              challenge_id: botScore.challenge_id,
              score: botScore.score,
              technical_feedback: botScore.technical_feedback,
              technical_score: botScore.technical_score,
              technical_summary: botScore.technical_summary,
              business_feedback: botScore.business_feedback,
              business_score: botScore.business_score,
              business_summary: botScore.business_summary,
              innovation_feedback: botScore.innovation_feedback,
              innovation_score: botScore.innovation_score,
              innovation_summary: botScore.innovation_summary,
              ux_feedback: botScore.ux_feedback,
              ux_score: botScore.ux_score,
              ux_summary: botScore.ux_summary,
              general_comments: botScore.general_comments,
              general_comments_summary: botScore.general_comments_summary,
              judging_status: "needs_review",
              flagged_comments: null,
              flagged_reason: null,
              standing: null,
              judging_bot_scores_id: botScore.id,
            });

          if (insertError) {
            errors.push({
              botScoreId,
              error: "Failed to create judging entry",
            });
            continue;
          }

          successfully_assigned.push(botScoreId);
        }
      } catch (error: any) {
        errors.push({ botScoreId, error: error.message });
      }
    }

    return {
      successfully_assigned: successfully_assigned.length,
      skipped: skipped.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async getHackathonJudgingStatistics(hackathonId: number) {
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select("id")
      .eq("id", hackathonId)
      .single();

    if (hackathonError) throw new Error("Hackathon not found");

    const { count: totalSubmittedProjects, error: projectsCountError } =
      await this.supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("hackathon_id", hackathonId)
        .eq("submitted", true);

    if (projectsCountError) throw new Error(projectsCountError.message);

    const { data: pairs, error: pairsError } = await this.supabase
      .from("project_challenges")
      .select("id, projects(submitted)")
      .eq("projects.hackathon_id", hackathonId);

    if (pairsError) throw new Error(pairsError.message);

    const totalProjectChallengePairs = pairs.filter(
      (pair) => pair.projects?.submitted === true
    ).length;

    const { data: judgings, error: judgingsError } = await this.supabase
      .from("judgings")
      .select("id")
      .eq("hackathon_id", hackathonId);

    if (judgingsError) throw new Error(judgingsError.message);

    const judgingIds = judgings?.map((j) => j.id) ?? [];

    if (judgingIds.length === 0) {
      return {
        unassigned_projects: 0,
        projects_needing_review: 0,
        complete_judgings: 0,
        flagged_projects: 0,
        latest_activity: [],
        score_statistics: { mean: 0, median: 0, mode: 0 },
        score_distribution: {
          x_axis: Array.from({ length: 10 }, (_, i) => i + 1),
          y_axis: Array.from({ length: 10 }, () => 0),
        },
      };
    }

    const { data: statusCounts, error: statusError } = await this.supabase
      .from("judging_entries")
      .select(
        `
          judging_status,
          projects!inner (
            submitted
          )
          `
      )
      .in("judging_id", judgingIds)
      .eq("projects.submitted", true);

    if (statusError) throw new Error(statusError.message);

    const projectsNeedingReview =
      statusCounts?.filter((s) => s.judging_status === "needs_review").length ??
      0;
    const completeJudgings =
      statusCounts?.filter((s) => s.judging_status === "judged").length ?? 0;
    const flaggedProjects =
      statusCounts?.filter((s) => s.judging_status === "flagged").length ?? 0;

    const { data: allProjectChallenges, error: projectChallengesError } =
      await this.supabase
        .from("project_challenges")
        .select(
          `
            project_id, 
            challenge_id,
            projects!inner (
              hackathon_id,
              submitted
            )
          `
        )
        .eq("projects.hackathon_id", hackathonId)
        .eq("projects.submitted", true);

    if (projectChallengesError) throw new Error(projectChallengesError.message);

    const { data: assignedProjectChallenges, error: assignedError } =
      await this.supabase
        .from("judging_entries")
        .select(
          `project_id, challenge_id, projects!inner (
          hackathon_id,
          submitted
        )`
        )
        .in("judging_id", judgingIds)
        .eq("projects.submitted", true);

    if (assignedError) throw new Error(assignedError.message);

    const assignedSet = new Set(
      assignedProjectChallenges?.map(
        (pc) => `${pc.project_id}-${pc.challenge_id}`
      ) ?? []
    );
    const unassignedCount =
      allProjectChallenges?.filter(
        (pc) => !assignedSet.has(`${pc.project_id}-${pc.challenge_id}`)
      ).length ?? 0;

    const { data: latestActivity, error: latestError } = await this.supabase
      .from("judging_entries")
      .select(
        `
        project_id,
        score,
        updated_at,
        projects (
          name,
          logo_url,
          submitted
        ),
        hackathon_challenges:challenge_id (
          challenge_name,
          sponsors
        ),
        judgings (
          users (
            full_name,
            avatar_url
          )
        )
      `
      )
      .in("judging_id", judgingIds)
      .eq("judging_status", "judged")
      .eq("projects.submitted", true)
      .order("updated_at", { ascending: false })
      .limit(10);

    if (latestError) throw new Error(latestError.message);

    const { data: allScores, error: scoresError } = await this.supabase
      .from("judging_entries")
      .select(
        `
          score,
          projects (
            submitted
          )
        `
      )
      .in("judging_id", judgingIds)
      .eq("judging_status", "judged")
      .eq("projects.submitted", true)
      .not("score", "is", null);

    if (scoresError) throw new Error(scoresError.message);

    const scores =
      allScores?.map((s) => s.score).filter((s) => s !== null) ?? [];

    const mean =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const sortedScores = [...scores].sort((a, b) => a - b);
    const median =
      sortedScores.length > 0
        ? sortedScores.length % 2 === 0
          ? (sortedScores[sortedScores.length / 2 - 1] +
              sortedScores[sortedScores.length / 2]) /
            2
          : sortedScores[Math.floor(sortedScores.length / 2)]
        : 0;

    const scoreCounts = scores.reduce((acc, score) => {
      acc[score] = (acc[score] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mode =
      Object.keys(scoreCounts).length > 0
        ? parseInt(
            Object.keys(scoreCounts).reduce((a, b) =>
              scoreCounts[parseInt(a)] > scoreCounts[parseInt(b)] ? a : b
            )
          )
        : 0;

    const scoreDistribution = {
      x_axis: Array.from({ length: 10 }, (_, i) => i + 1),
      y_axis: Array.from({ length: 10 }, (_, i) => scoreCounts[i + 1] || 0),
    };

    const formattedLatestActivity =
      latestActivity?.map((activity) => {
        const sponsors = activity.hackathon_challenges?.sponsors as any[];
        return {
          project_id: activity.project_id,
          project_name: activity.projects?.name ?? "",
          project_image: activity.projects?.logo_url ?? "",
          challenge_name: activity.hackathon_challenges?.challenge_name ?? "",
          challenge_image: sponsors?.[0]?.logo ?? "",
          score: activity.score,
          judge_name: activity.judgings?.users?.full_name ?? "",
          judge_image: activity.judgings?.users?.avatar_url ?? "",
          judged_at: activity.updated_at,
        };
      }) ?? [];

    return {
      unassigned_projects: unassignedCount,
      projects_needing_review: projectsNeedingReview,
      complete_judgings: completeJudgings,
      flagged_projects: flaggedProjects,
      total_submitted_projects: totalSubmittedProjects ?? 0,
      total_project_challenge_pairs: totalProjectChallengePairs ?? 0,
      latest_activity: formattedLatestActivity,
      score_statistics: {
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        mode,
      },
      score_distribution: scoreDistribution,
    };
  }

  async getWinnerAssignerChallenges(judging_id: number) {
    const { data, error } = await this.supabase
      .from("judging_challenges")
      .select(
        `
          id,submitted_winners,
          hackathon_challenges (id, challenge_name, prizes:hackathon_challenge_bounties (*))
        `
      )
      .eq("judging_id", judging_id)
      .eq("is_winner_assigner", true);

    if (error) throw new Error(error.message);

    const response = data.map((challenge) => ({
      ...challenge.hackathon_challenges,
      submitted_winners: challenge.submitted_winners,
    }));

    const { data: projectChallenges } = await this.supabase
      .from("project_challenges")
      .select("project_id, prize_id")
      .in(
        "prize_id",
        response.flatMap((item) => item.prizes.map((prize) => prize.id))
      );

    // Create map of prize_id to project_id for O(1) lookup
    const prizeToProjectMap =
      projectChallenges?.reduce((acc, pc) => {
        if (pc.prize_id) {
          acc[pc.prize_id] = pc.project_id;
        }
        return acc;
      }, {} as Record<string, number>) || {};

    response.forEach((item) => {
      item.prizes = item.prizes.map((prize) => ({
        ...prize,
        winner_project_id: prizeToProjectMap[prize.id] || null,
      }));
    });

    return response;
  }

  async getChallengeProjectsForWinnerAssignment(challenge_id: number) {
    // Fetch only required fields from judging entries and related tables
    const { data: entries, error: entriesError } = await this.supabase
      .from("judging_entries")
      .select(
        `
        project_id,
        judging_id,
        score,
        projects!inner (*),
        judging_bot_scores:judging_bot_scores_id (*),
        judgings (
          users (
            id,
            full_name,
            avatar_url
          )
        )
      `
      )
      .eq("challenge_id", challenge_id);

    if (entriesError) throw new Error(entriesError.message);

    // Use reduce instead of forEach for better performance
    const projectMap = entries.reduce((acc, entry) => {
      // Initialize project data if not exists
      if (!acc.has(entry.project_id)) {
        acc.set(entry.project_id, {
          ...entry.projects,
          judges_scores: [],
          average_score: 0,
        });
      }

      const projectData = acc.get(entry.project_id);

      projectData.judges_scores.push({
        judge_id: "bot",
        score: this.customRound(entry.judging_bot_scores?.score ?? 0),
      });

      // Add judge score information
      projectData.judges_scores.push({
        judge_id: entry.judging_id,
        judge_user_information: {
          id: entry.judgings?.users?.id,
          full_name: entry.judgings?.users?.full_name,
          avatar_url: entry.judgings?.users?.avatar_url,
        },
        score: this.customRound(entry.score),
      });

      const validScores = projectData.judges_scores.filter(
        (s: { score: number | null; judge_id: string | number }) =>
          s.score !== null && s.score !== undefined && s.judge_id !== "bot"
      );

      const averageScore = validScores?.length
        ? this.customRound(
            validScores.reduce(
              (sum: number, curr: { score: number }) => sum + curr.score,
              0
            ) / validScores.length
          )
        : 0;

      projectData.average_score = averageScore;

      return acc;
    }, new Map());

    // Convert map to array and sort by average score
    return Array.from(projectMap.values()).sort(
      (a, b) => b.average_score - a.average_score
    );
  }
  customRound(num: number) {
    const decimal = num % 1;
    if (decimal < 0.5) return Math.floor(num);
    return Math.ceil(num);
  }

  async getChallengeJudgesForWinnerAssignment(challenge_id: number) {
    const { data: judges, error: judgesError } = await this.supabase
      .from("judging_challenges")
      .select(
        `
      judging_id,
      is_winner_assigner,
      judgings (
        *,
        user:users (*)
      )
    `
      )
      .eq("challenge_id", challenge_id);

    if (judgesError) throw new Error(judgesError.message);

    return judges.map((judge) => ({
      ...judge.judgings,
    }));
  }

  async assignWinnersForChallenges(
    winners: Array<{
      challenge_id: number;
      project_id: number;
      prize_id: number;
    }>
  ) {
    if (!winners.length) {
      throw new Error("No winners provided");
    }

    // Extract unique challenge IDs and prize IDs for batch validation
    const challengeIds = [...new Set(winners.map((w) => w.challenge_id))];
    const projectIds = winners.map((w) => w.project_id);
    const prizeIds = winners.map((w) => w.prize_id);

    // Batch validate all project-challenge relationships
    const { data: projectChallenges, error: projectsError } =
      await this.supabase
        .from("project_challenges")
        .select("project_id, challenge_id")
        .in("challenge_id", challengeIds)
        .in("project_id", projectIds);

    if (projectsError) {
      throw new Error(`Failed to validate projects: ${projectsError.message}`);
    }

    // Create a set for O(1) lookup of valid project-challenge combinations
    const validProjectChallenges = new Set(
      projectChallenges.map((pc) => `${pc.project_id}-${pc.challenge_id}`)
    );

    // Validate all project-challenge combinations exist
    for (const winner of winners) {
      const key = `${winner.project_id}-${winner.challenge_id}`;
      if (!validProjectChallenges.has(key)) {
        throw new Error(
          `Project ${winner.project_id} does not belong to challenge ${winner.challenge_id}`
        );
      }
    }

    // Batch validate all prizes and get their ranks
    const { data: prizes, error: prizesError } = await this.supabase
      .from("hackathon_challenge_bounties")
      .select("id, challenge_id, rank")
      .in("challenge_id", challengeIds)
      .in("id", prizeIds);

    if (prizesError) {
      throw new Error(`Failed to validate prizes: ${prizesError.message}`);
    }

    // Create a map for O(1) lookup of prize details
    const prizeMap = new Map(
      prizes.map((prize) => [`${prize.id}-${prize.challenge_id}`, prize])
    );

    // Validate all prizes exist and belong to their respective challenges
    const updates = [];
    for (const winner of winners) {
      const prizeKey = `${winner.prize_id}-${winner.challenge_id}`;
      const prize = prizeMap.get(prizeKey);

      if (!prize) {
        throw new Error(
          `Prize ${winner.prize_id} does not exist or does not belong to challenge ${winner.challenge_id}`
        );
      }

      updates.push({
        project_id: winner.project_id,
        challenge_id: winner.challenge_id,
        prize_id: winner.prize_id,
        rank: prize.rank || null,
      });
    }

    // Batch update all project_challenges in a single transaction
    const updatePromises = updates.map((update) =>
      this.supabase
        .from("project_challenges")
        .update({
          prize_id: update.prize_id,
          rank: update.rank,
        })
        .eq("project_id", update.project_id)
        .eq("challenge_id", update.challenge_id)
    );

    const updateChallengePromises = challengeIds.map((challengeId) =>
      this.supabase
        .from("judging_challenges")
        .update({
          submitted_winners: true,
        })
        .eq("challenge_id", challengeId)
    );

    await Promise.all(updateChallengePromises);

    const results = await Promise.all(updatePromises);

    // Check for any update errors
    const updateErrors = results.filter((result) => result.error);

    if (updateErrors.length > 0) {
      throw new Error(
        `Failed to update ${updateErrors.length} project challenge(s): ${
          updateErrors[0]?.error?.message ?? "Unknown error"
        }`
      );
    }

    return {
      success: true,
      message: `Successfully assigned winners for ${updates.length} project(s) across ${challengeIds.length} challenge(s)`,
    };
  }
}

export default JudgingService;
