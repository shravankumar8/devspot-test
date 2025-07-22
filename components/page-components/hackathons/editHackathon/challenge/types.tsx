import {
  HackathonChallengeBounties,
  HackathonChallenges,
} from "@/types/entities";

export interface Judge {
  id: string;
  name: string;
  avatar_url: string;
}

export interface JudgingCriteria {
  key: string;
  label: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
interface Sponsor {
  logo: string | File;
  name: string;
  website: string;
  tier: string;
}
interface EditHackathonChallengePrize
  extends Omit<Partial<HackathonChallengeBounties>, "company_partner_logo"> {
  company_partner_logo: string | File | null;
  challenge_id: number;
}

export interface EditChallengePayload
  extends Omit<Partial<HackathonChallenges>, "sponsors" | "prizes"> {
  sponsors: Sponsor[];
  prizes: EditHackathonChallengePrize[];
}
export interface ChallengeFormPayload {
  challenge: EditChallengePayload;
  judges: {
    judgingCriteria: string[];
    judges: number[];
    customJudgeEmail: string;
  };
}
