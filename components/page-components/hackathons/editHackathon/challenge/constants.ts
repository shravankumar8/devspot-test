import { JudgingCriteria, SelectOption } from "./types";

export const JUDGING_CRITERIA: JudgingCriteria[] = [
  { key: "innovation", label: "Innovation/Creativity" },
  { key: "impact", label: "Impact/Usefulness" },
  { key: "technical", label: "Technical Execution" },
  { key: "completeness", label: "Completeness/Functionality" },
  { key: "relevance", label: "Relevance to Theme/Challenge" },
  { key: "scalability", label: "Scalability/Future Potential" },
  { key: "userExperience", label: "User Experience (UX)" },
  { key: "presentation", label: "Presentation/Demo Quality" },
  { key: "teamCollaboration", label: "Team Collaboration" },
  { key: "userSponsorTech", label: "User of Sponsor Tech/APIs" },
];

export const AVAILABLE_SUBMISSION_REQUIREMENTS: SelectOption[] = [
  { label: "Project summary", value: "summary" },
  { label: "Video", value: "video" },
  { label: "GitHub", value: "github" },
  { label: "Demo", value: "demo" },
  { label: "Documentation", value: "documentation" },
];

export const SPONSOR_TIERS: SelectOption[] = [
  { label: "Gold Sponsor", value: "gold" },
  { label: "Silver Sponsor", value: "silver" },
  { label: "Ruby Sponsor", value: "ruby" },
];

export const MAX_JUDGING_CRITERIA = 4;
export const MAX_CHALLENGE_NAME_LENGTH = 20;
