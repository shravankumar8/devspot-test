import { Users } from "./entities";

interface TeamMembers {
  prize_allocated: number;
  avatar_url: string | null;
  email: string;
  full_name: string;
  id: string;
  role: string;
}

export interface ProjectDetails {
  tagline: string | null;
  project_name: string | null;
  project_links: { id: string; label: string; url: string }[];
  hackathon_name: string;
  challenge_name: string;
  description: string | null;
  looking_for_team_members: boolean;
  technollogies: string[];
  logo_url: string | null;
  date_created: string;
  challenge_ids: number[];
  header_url: string | null;
  team_members: TeamMembers[];
  feedbackQuestions: { id: string; question: string }[];
}
