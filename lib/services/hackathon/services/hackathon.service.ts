import {
  HackathonChallenges,
  JudgingBotScores,
  Projects,
  TeamMemberships,
} from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";

interface User {
  full_name: string;
  avatar_url: string | null;
}

interface ProjectTeamMember {
  user_id: string;
  status: string;
  users: User;
}

interface HackathonChallenge {
  challenge_name: string;
  sponsors: any[];
}

interface ProjectChallenge {
  challenge_id: number;
  hackathon_challenges: HackathonChallenges;
}

interface Judging {
  id: number;
  users: User;
}

interface JudgingEntry {
  score: number | null;
  standing: string | null;
  challenge_id: number;
  judgings: Judging;
  judging_bot_scores: JudgingBotScores;
}

interface Project extends Projects {
  project_team_members: TeamMemberships[];
  project_challenges: ProjectChallenge[];
  judging_entries: JudgingEntry[];
}

export class HackathonService {
  constructor(private supabase: SupabaseClient) {}

  async getHackathonProjects(hackathon_id: number) {
    try {
      const { data: projects, error: projectsError } = await this.supabase
        .from("projects")
        .select(
          `
          *,
          project_team_members!inner (
            *,
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
          ),
          judging_entries (
            id,
            score,
            standing,
            challenge_id,
            judgings!inner (
              id,
              users!inner (
                full_name,
                avatar_url
              )
            )
          )
        `
        )
        .eq("hackathon_id", hackathon_id)
        .eq("project_team_members.status", "confirmed");

      if (projectsError) {
        console.error("Supabase query error:", projectsError);
        throw new Error(`Failed to fetch projects: ${projectsError.message}`);
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      // Fetch all bot scores for the projects
      const { data: botScores, error: botScoresError } = await this.supabase
        .from("judging_bot_scores")
        .select("*")
        .in(
          "project_id",
          (projects as unknown as Project[]).map((p) => p.id)
        );

      if (botScoresError) {
        console.error("Error fetching bot scores:", botScoresError);
        throw new Error(
          `Failed to fetch bot scores: ${botScoresError.message}`
        );
      }

      const processedProjects = (projects as unknown as Project[]).map(
        ({ project_team_members, project_challenges, ...project }) => {
          const team_members = project_team_members.map(
            ({ id, users, created_at, updated_at, project_id, ...member }) => ({
              ...member,
              user_id: member.user_id,
              full_name: users.full_name,
              avatar_url: users.avatar_url,
            })
          );

          const challenges = project_challenges.map((challenge) => {
            const challengeJudgingEntries = project.judging_entries.filter(
              (entry) => entry.challenge_id === challenge.challenge_id
            );

            const scores = challengeJudgingEntries
              .filter((entry) => entry.score !== null)
              .map((entry) => entry.score as number);
            const averageScore =
              scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : null;

            const standing =
              challengeJudgingEntries.find((entry) => entry.standing !== null)
                ?.standing || null;

            const judges = challengeJudgingEntries
              .map((entry) => entry.judgings)
              .filter(Boolean)
              .map((judging) => ({
                judging_id: judging.id,
                full_name: judging.users.full_name,
                avatar_url: judging.users.avatar_url,
              }));

            // Find bot score for this project and challenge
            const botScore = botScores?.find(
              (score) =>
                score.project_id === project.id &&
                score.challenge_id === challenge.challenge_id
            );

            return {
              challenge_id: challenge.challenge_id,
              challenge_name: challenge.hackathon_challenges.challenge_name,
              sponsors: challenge.hackathon_challenges.sponsors,
              score: averageScore,
              bot_score: botScore?.score ?? 0,
              standing,
              judges,
            };
          });

          // Calculate the percentage of challenges that have bot scores
          const totalChallenges = challenges.length;
          const challengesWithBotScores = challenges.filter(
            (challenge) => challenge.bot_score > 0
          ).length;
          const botScorePercentage =
            totalChallenges > 0
              ? (challengesWithBotScores / totalChallenges) * 100
              : 0;

          return {
            ...project,
            project_id: project.id,
            name: project.name,
            tagline: project.tagline,
            submitted: project.submitted,
            team_members,
            challenges,
            botScorePercentage,
          };
        }
      );

      // Sort projects by bot score percentage in descending order
      return processedProjects.sort(
        (a, b) => b.botScorePercentage - a.botScorePercentage
      );
    } catch (error) {
      console.error("Error in getHackathonProjects:", error);
      throw error;
    }
  }
}
