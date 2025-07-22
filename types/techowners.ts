import { TechnologyOwners } from "./entities";

export interface TechOwnersType extends TechnologyOwners {
  description: string | null;
  no_of_upcoming_hackathons: number;
  domain: string;
}

export interface JudgePrizes {
  id: string;
  name: string;
  avatar_url: string;
  is_prize_allocator: boolean;
  status: string;
  progress_percentage: number;
}

export interface AssignedProject {
  id: number;
  name: string;
  logo_url: string;
  winner_assigner_score: number;
  assigned_by_judge: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export interface Prize {
  id: number;
  title: string;
  rank: number | null;
  prize_type: "usd" | "custom" | "token";
  prize_usd: number | null;
  prize_tokens: number | null;
  prize_custom: string | null;
  amount: number;
  company_partner_logo: string | null;
  assigned_project?: AssignedProject | null;
  winner_project_id?: number | null;
}

export interface ChallengPrizeType {
  id: number;
  challenge_name: string;
  description: string;
  judges: JudgePrizes[];
  prizes: Prize[];
}
