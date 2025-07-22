import { SupabaseClient } from "@supabase/supabase-js";
import ApiBaseService from "../../utils/baseService";
import { uploadImage } from "../../utils/uploadImage";
 interface PrizeData {
    id?: number;
    challenge_id: number;
    title: string;
    company_partner_logo: File;
    rank: number;
    prize_usd?: number;
    prize_tokens?: number;
    prize_custom?: string;
  }
    
  interface PrizeResult {
    prize: any;
    action: 'created' | 'updated';
    message: string;
  }

class PrizeService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  /**
   * Delete a prize and handle related project assignments
   * 
   * @param prizeId The ID of the prize to delete
   * @param technologyOwnerId The ID of the technology owner for authorization
   * @param hackathonId The ID of the hackathon for authorization
   * @returns Object containing deletion results
   */
  async deletePrize(
    prizeId: number,
    technologyOwnerId: number,
    hackathonId: number
  ) {
    // First, verify the prize exists and get its challenge info
    const { data: prize, error: prizeError } = await this.supabase
      .from("hackathon_challenge_bounties")
      .select(`
        id,
        challenge_id,
        title,
        challenge:hackathon_challenges (
          id,
          hackathon_id
        )
      `)
      .eq("id", prizeId)
      .single();

    if (prizeError) {
      throw new Error(`Prize not found: ${prizeError.message}`);
    }

    if (!prize) {
      throw new Error(`Prize with ID ${prizeId} not found`);
    }

    // Verify the challenge belongs to the specified hackathon
    if (prize.challenge.hackathon_id !== hackathonId) {
      throw new Error("Prize does not belong to the specified hackathon");
    }

    // Verify the hackathon belongs to the technology owner
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathonId)
      .single();

    if (hackathonError) {
      throw new Error(`Failed to verify hackathon ownership: ${hackathonError.message}`);
    }

    if (hackathon.organizer_id !== technologyOwnerId) {
      throw new Error("Unauthorized: You do not own this hackathon");
    }

    // Check if any projects are assigned to this prize
    const { data: assignedProjects, error: projectsError } = await this.supabase
      .from("project_challenges")
      .select("id, project_id, challenge_id")
      .eq("prize_id", prizeId);

    if (projectsError) {
      throw new Error(`Failed to check prize assignments: ${projectsError.message}`);
    }

    // Update project_challenges to set prize_id to null for affected projects
    if (assignedProjects && assignedProjects.length > 0) {
      const { error: updateError } = await this.supabase
        .from("project_challenges")
        .update({ prize_id: null })
        .eq("prize_id", prizeId);

      if (updateError) {
        throw new Error(`Failed to update project assignments: ${updateError.message}`);
      }
    }

    // Delete the prize
    const { error: deleteError } = await this.supabase
      .from("hackathon_challenge_bounties")
      .delete()
      .eq("id", prizeId);

    if (deleteError) {
      throw new Error(`Failed to delete prize: ${deleteError.message}`);
    }

    return {
      deleted_prize_id: prizeId,
      deleted_prize_title: prize.title,
      affected_projects: assignedProjects?.length || 0,
      challenge_id: prize.challenge_id
    };
  }

  async getProjectsForChallenge(challenge_id: number) {
    // Get all submitted projects for this challenge via project_challenges join
    const { data: projectChallenges, error: pcError } = await this.supabase
      .from("project_challenges")
      .select(
        `
          project_id,
          rank,
          projects!inner (
            *,
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
          ),
          hackathon_challenges (
            challenge_name,
            description,
            sponsors,
            hackathon_id
          )
        `
      )
      .eq("challenge_id", challenge_id)
      .eq("projects.submitted", true);
  
    if (pcError) {
      throw new Error(`Error fetching projects for challenge: ${pcError.message}`);
    }
  
    // For each project, calculate average score and get a random comment
    const results = await Promise.all(
      projectChallenges.map(async (pc) => {
        const { data: entries, error: entriesError } = await this.supabase
          .from("judging_entries")
          .select("score, general_comments_summary")
          .eq("project_id", pc.project_id)
          .eq("challenge_id", challenge_id);
  
        if (entriesError) {
          throw new Error(
            `Error fetching scores/comments for project ${pc.project_id}: ${entriesError.message}`
          );
        }
  
        const scores = entries.map((e) => e.score).filter((s) => s !== null);
        const averageScore = scores.length
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;
  
        const randomComment =
          entries.length > 0
            ? entries[Math.floor(Math.random() * entries.length)]
                ?.general_comments_summary || ""
            : "";
  
        return {
          projectId: pc.project_id,
          challengeId: challenge_id,
          projectName: pc.projects.name,
          projectDescription: pc.projects.description,
          rank: pc.rank,
          averageScore,
          project: pc.projects,
          comments: randomComment,
          challengeName: pc.hackathon_challenges.challenge_name,
          challengeDescription: pc.hackathon_challenges.description,
          sponsors: pc.hackathon_challenges.sponsors,
          hackathonId: pc.hackathon_challenges.hackathon_id,
        };
      })
    );
  
    return results;
  }  

  /**
   * Get all challenges for a hackathon with prizes, judges, and assigned projects
   * 
   * @param hackathonId The ID of the hackathon
   * @param technologyOwnerId The ID of the technology owner for authorization
   * @returns Array of challenges with prizes, judges, and assigned projects
   */
  async getHackathonChallengesWithPrizes(
    hackathonId: number,
    technologyOwnerId: number
  ) {
    // Verify the hackathon belongs to the technology owner
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select("id, organizer_id, start_date, deadline_to_submit")
      .eq("id", hackathonId)
      .single();

    if (hackathonError) {
      throw new Error(`Failed to verify hackathon: ${hackathonError.message}`);
    }

    if (hackathon.organizer_id !== technologyOwnerId) {
      throw new Error("Unauthorized: You do not own this hackathon");
    }

    // Get all challenges for the hackathon
    const { data: challenges, error: challengesError } = await this.supabase
      .from("hackathon_challenges")
      .select(`
        id,
        challenge_name,
        description
      `)
      .eq("hackathon_id", hackathonId);

    if (challengesError) {
      throw new Error(`Error fetching challenges: ${challengesError.message}`);
    }

    const currentDate = new Date().toISOString();
    const isJudgingLive = hackathon.deadline_to_submit && new Date(hackathon.deadline_to_submit) <= new Date(currentDate);

    // Process each challenge
    const challengesWithPrizes = await Promise.all(
      challenges.map(async (challenge) => {
        // Get judges for this challenge
        const { data: judges, error: judgesError } = await this.supabase
          .from("judgings")
          .select(`
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
          `)
          .eq("hackathon_id", hackathonId);

        if (judgesError) {
          throw new Error(`Error fetching judges for hackathon: ${judgesError.message}`);
        }

        // Filter judges who are assigned to this specific challenge
        const challengeJudges = judges.filter(judge => 
          judge.judging_challenges.some(jc => jc.challenge_id === challenge.id)
        );

        // Process judges and calculate progress
        const processedJudges = await Promise.all(
          challengeJudges.map(async (judge) => {
            // Get the judging_challenge record for this specific challenge
            const judgingChallenge = judge.judging_challenges.find(jc => jc.challenge_id === challenge.id);
            
            let status: string;
            let progressPercentage: number;

            // Always calculate progress percentage first
            const { count: totalEntries, error: totalError } = await this.supabase
              .from("judging_entries")
              .select("*", { count: "exact", head: true })
              .eq("judging_id", judge.id)
              .eq("challenge_id", challenge.id);

            const { count: judgedEntries, error: judgedError } = await this.supabase
              .from("judging_entries")
              .select("*", { count: "exact", head: true })
              .eq("judging_id", judge.id)
              .eq("challenge_id", challenge.id)
              .eq("judging_status", "judged");

            if (totalError || judgedError) {
              throw new Error(`Error calculating progress for judge ${judge.id}`);
            }

            progressPercentage = (totalEntries || 0) > 0 ? Math.round(((judgedEntries || 0) / (totalEntries || 1)) * 1000) / 10 : 0;

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
              progress_percentage: progressPercentage
            };
          })
        );

        // Sort judges: prize allocator first, then alphabetically
        processedJudges.sort((a, b) => {
          if (a.is_prize_allocator && !b.is_prize_allocator) return -1;
          if (!a.is_prize_allocator && b.is_prize_allocator) return 1;
          return (a.name || "").localeCompare(b.name || "");
        });

        // Get prizes for this challenge
        const { data: prizes, error: prizesError } = await this.supabase
          .from("hackathon_challenge_bounties")
          .select(`
            id,
            title,
            rank,
            prize_usd,
            prize_tokens,
            prize_custom,
            company_partner_logo
          `)
          .eq("challenge_id", challenge.id)
          .order("rank", { ascending: true });

        if (prizesError) {
          throw new Error(`Error fetching prizes for challenge ${challenge.id}: ${prizesError.message}`);
        }

        // Process prizes and get assigned projects
        const processedPrizes = await Promise.all(
          prizes.map(async (prize) => {
            // Check if any project is assigned to this prize
            const { data: assignedProject, error: projectError } = await this.supabase
              .from("project_challenges")
              .select(`
                project_id,
                projects (
                  id,
                  name,
                  logo_url
                )
              `)
              .eq("challenge_id", challenge.id)
              .eq("prize_id", prize.id)
              .maybeSingle();

            let assignedProjectData = null;

            if (assignedProject && !projectError) {
              // Get the winner assigner's score for this project
              const { data: winnerAssigner, error: winnerError } = await this.supabase
                .from("judging_challenges")
                .select(`
                  judgings (
                    id,
                    user_id,
                    users (
                      id,
                      full_name,
                      avatar_url
                    )
                  )
                `)
                .eq("challenge_id", challenge.id)
                .eq("is_winner_assigner", true)
                .maybeSingle();

              // Start with basic project data
              assignedProjectData = {
                id: assignedProject.projects.id,
                name: assignedProject.projects.name,
                logo_url: assignedProject.projects.logo_url,
                winner_assigner_score: null,
                assigned_by_judge: null
              };

              // Try to get winner assigner score if available
              if (!winnerError && winnerAssigner) {
                const { data: scoreData, error: scoreError } = await this.supabase
                  .from("judging_entries")
                  .select("score")
                  .eq("judging_id", winnerAssigner.judgings.id)
                  .eq("project_id", assignedProject.project_id)
                  .eq("challenge_id", challenge.id)
                  .maybeSingle();

                if (!scoreError && scoreData) {
                  assignedProjectData = {
                    id: assignedProject.projects.id,
                    name: assignedProject.projects.name,
                    logo_url: assignedProject.projects.logo_url,
                    winner_assigner_score: Math.round(scoreData.score * 10) / 10,
                    assigned_by_judge: {
                      id: winnerAssigner.judgings.user_id,
                      name: winnerAssigner.judgings.users.full_name,
                      avatar_url: winnerAssigner.judgings.users.avatar_url
                    }
                  };
                }
              }
            }

            return {
              id: prize.id,
              title: prize.title,
              rank: prize.rank,
              amount: prize.prize_usd || prize.prize_tokens || prize.prize_custom || 0,
              prize_type: prize.prize_usd ? 'usd' : prize.prize_tokens ? 'tokens' : prize.prize_custom ? 'custom' : null,
              prize_usd: prize.prize_usd,
              prize_tokens: prize.prize_tokens,
              prize_custom: prize.prize_custom,
              company_partner_logo: prize.company_partner_logo,
              assigned_project: assignedProjectData
            };
          })
        );

        return {
          id: challenge.id,
          challenge_name: challenge.challenge_name,
          description: challenge.description,
          judges: processedJudges,
          prizes: processedPrizes
        };
      })
    );

    return challengesWithPrizes;
  }

    /**
   * Create or update a prize for a challenge (upsert pattern)
   *
   * @param prizeData The prize data including optional id for updates
   * @param technologyOwnerId The ID of the technology owner for authorization
   * @param hackathonId The ID of the hackathon for authorization
   * @returns The created or updated prize
   */
   
    
      /**
   * Create or update a prize for a challenge (upsert pattern)
   *
   * @param prizeData The prize data including optional id for updates
   * @param technologyOwnerId The ID of the technology owner for authorization
   * @param hackathonId The ID of the hackathon for authorization
   * @returns The created or updated prize
   */

  async createOrUpdatePrize(
    prizeData: PrizeData,
    technologyOwnerId: number,
    hackathonId: number
  ): Promise<PrizeResult> {
    await this.validateHackathonOwnership(hackathonId, technologyOwnerId);
    await this.validateChallengeAndRank(prizeData, hackathonId);

    const logoUrl = await this.uploadLogoIfProvided(
      prizeData.company_partner_logo
    );
    const prizePayload = this.buildPrizePayload(prizeData);

    const isUpdate = Boolean(prizeData.id);
    const result = isUpdate
      ? await this.updatePrize(prizeData.id!, prizePayload, logoUrl)
      : await this.createPrize(prizePayload, logoUrl);

    return {
      prize: result,
      action: isUpdate ? "updated" : "created",
      message: `Prize "${result.title}" ${
        isUpdate ? "updated" : "created"
      } successfully`,
    };
  }

  private async validateHackathonOwnership(
    hackathonId: number,
    technologyOwnerId: number
  ): Promise<void> {
    const { data: hackathon, error } = await this.supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathonId)
      .single();

    if (error) {
      throw new Error(`Failed to verify hackathon: ${error.message}`);
    }

    if (hackathon.organizer_id !== technologyOwnerId) {
      throw new Error("Unauthorized: You do not own this hackathon");
    }
  }

  private async validateChallengeAndRank(
    prizeData: PrizeData,
    hackathonId: number
  ): Promise<void> {
    if (!prizeData.challenge_id) return;

    await this.validateChallenge(prizeData.challenge_id, hackathonId);

    if (prizeData.rank) {
      await this.validateRankAvailability(
        prizeData.challenge_id,
        prizeData.rank,
        prizeData.id
      );
    }
  }

  private async validateChallenge(
    challengeId: number,
    hackathonId: number
  ): Promise<void> {
    const { data: challenge, error } = await this.supabase
      .from("hackathon_challenges")
      .select("hackathon_id")
      .eq("id", challengeId)
      .single();

    if (error) {
      throw new Error(`Challenge not found: ${error.message}`);
    }

    if (challenge.hackathon_id !== hackathonId) {
      throw new Error("Challenge does not belong to the specified hackathon");
    }
  }

  private async validateRankAvailability(
    challengeId: number,
    rank: number,
    excludeId?: number
  ): Promise<void> {
    let query = this.supabase
      .from("hackathon_challenge_bounties")
      .select("id, title")
      .eq("rank", rank)
      .eq("challenge_id", challengeId);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data: existingPrize, error } = await query.maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error checking rank availability: ${error.message}`);
    }

    if (existingPrize) {
      throw new Error(
        `Rank ${rank} is already taken by prize "${existingPrize.title}" in this challenge`
      );
    }
  }

  private async uploadLogoIfProvided(logo?: File): Promise<string | undefined> {
    if (!logo) return undefined;

    const { publicUrl } = await uploadImage({
      file: logo,
      userId: "COMPANY_LOGO",
      bucketName: "profile-assets",
      folderPath: "company-logos",
    });

    return publicUrl;
  }

  private buildPrizePayload(prizeData: PrizeData) {
    return {
      challenge_id: prizeData.challenge_id,
      title: prizeData.title,
      rank: prizeData.rank,
      prize_usd: prizeData.prize_usd ?? null,
      prize_tokens: prizeData.prize_tokens ?? null,
      prize_custom: prizeData.prize_custom ?? null,
    };
  }

  private async updatePrize(
    prizeId: number,
    prizePayload: any,
    logoUrl?: string
  ): Promise<any> {
    const { data: existingPrize, error: fetchError } = await this.supabase
      .from("hackathon_challenge_bounties")
      .select("*")
      .eq("id", prizeId)
      .single();

    if (fetchError) {
      throw new Error(`Prize not found: ${fetchError.message}`);
    }

    const { data: updatedPrize, error: updateError } = await this.supabase
      .from("hackathon_challenge_bounties")
      .update({
        ...prizePayload,
        company_partner_logo:
          logoUrl ?? existingPrize.company_partner_logo ?? "",
      })
      .eq("id", prizeId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update prize: ${updateError.message}`);
    }

    return updatedPrize;
  }

  private async createPrize(prizePayload: any, logoUrl?: string): Promise<any> {
    const { data: newPrize, error } = await this.supabase
      .from("hackathon_challenge_bounties")
      .insert({
        ...prizePayload,
        company_partner_logo: logoUrl ?? "",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create prize: ${error.message}`);
    }

    return newPrize;
  }
  async publishWinnersForChallenges(
    hackathon_id: number,
    winners: Array<{
      challenge_id: number;
      project_id: number;
      prize_id: number;
    }>
  ) {
    if (!winners.length) {
      throw new Error("No winners provided");
    }
  
    const challengeIds = [...new Set(winners.map((w) => w.challenge_id))];
    const projectIds = winners.map((w) => w.project_id);
    const prizeIds = winners.map((w) => w.prize_id);
  
    // Validate project-challenge associations
    const { data: projectChallenges, error: pcError } = await this.supabase
      .from("project_challenges")
      .select("project_id, challenge_id")
      .in("challenge_id", challengeIds)
      .in("project_id", projectIds);
  
    if (pcError) {
      throw new Error(`Failed to validate projects: ${pcError.message}`);
    }
  
    const validProjectChallenges = new Set(
      projectChallenges.map((pc) => `${pc.project_id}-${pc.challenge_id}`)
    );
  
    for (const winner of winners) {
      const key = `${winner.project_id}-${winner.challenge_id}`;
      if (!validProjectChallenges.has(key)) {
        throw new Error(
          `Project ${winner.project_id} does not belong to challenge ${winner.challenge_id}`
        );
      }
    }
  
    // Validate prizes and their ranks
    const { data: prizes, error: prizeError } = await this.supabase
      .from("hackathon_challenge_bounties")
      .select("id, challenge_id, rank")
      .in("id", prizeIds)
      .in("challenge_id", challengeIds);
  
    if (prizeError) {
      throw new Error(`Failed to validate prizes: ${prizeError.message}`);
    }
  
    const prizeMap = new Map(
      prizes.map((prize) => [`${prize.id}-${prize.challenge_id}`, prize])
    );
  
    // Process prize assignments
    for (const winner of winners) {
      const prizeKey = `${winner.prize_id}-${winner.challenge_id}`;
      const prize = prizeMap.get(prizeKey);
  
      if (!prize) {
        throw new Error(
          `Prize ${winner.prize_id} does not exist or does not belong to challenge ${winner.challenge_id}`
        );
      }
  
      // 1️⃣ Clear this prize from any other project in this challenge
      const { error: clearError } = await this.supabase
        .from("project_challenges")
        .update({
          prize_id: null,
          rank: null,
        })
        .eq("challenge_id", winner.challenge_id)
        .eq("prize_id", winner.prize_id);
  
      if (clearError) {
        throw new Error(
          `Failed to clear existing prize assignment for prize ${winner.prize_id}, challenge ${winner.challenge_id}: ${clearError.message}`
        );
      }
  
      // 2️⃣ Assign prize to selected project
      const { error: assignError } = await this.supabase
        .from("project_challenges")
        .update({
          prize_id: winner.prize_id,
          rank: prize.rank,
        })
        .eq("project_id", winner.project_id)
        .eq("challenge_id", winner.challenge_id);
  
      if (assignError) {
        throw new Error(
          `Failed to assign prize ${winner.prize_id} to project ${winner.project_id}: ${assignError.message}`
        );
      }
    }
  
    return {
      success: true,
      message: `Successfully published winners for ${winners.length} project(s)`,
    };
  }  
}

export default PrizeService; 