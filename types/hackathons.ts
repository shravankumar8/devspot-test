import { ReactNode } from "react";
import { HackathonChallenges, Projects } from "./entities";

export type Hackathon = {
  hackathon: {
    id: string;
    name: string;
    description: string;
    date: string;
    deadline: string;
    location: string;
    about: string;
    judges: { name: string; role: string; pics: string }[];
    theme?: string;
    dateStarted: string;
    HQ?: string;
    resources?: { title: string; link: string }[];
    challenges: {
      index: number;
      title: string;
      description: string;
      technologies: string[];
      sponsors: { name: string; logo: string }[];
      prizes: { position: number; amount: string; tokens: string }[];
    }[];
    organizer?: {
      name: string;
      logo: string;
    };
    image?: string;
    isUpcomingOrLive?: boolean;
    type?: string;
    numberOfParticipants?: number;
  };
};

export type IHackathonData = {
  id: number;
  name: string;
  description: string;
  avatar_url: string;
  banner_url: string;
  organizer_id: number;
  start_date: string;
  end_date: string;
  location: string | null;
  type: "virtual" | "physical";
  status: "upcoming" | "live";
  tags: string[] | null;
  technologies: string[] | null;
  sponsors: { logo: string; name: string }[];
  deadline_to_submit: string;
  deadline_to_join: string;
  application_method: string;
  team_limit: number | null;
  created_at: string;
  updated_at: string;
  challenges: {
    challenge_name: string;
    id: number;
    description: string;
    technologies: string[];
    created_at: string;
    updated_at: string;
    sponsors: { name: string; logo: string }[];
  }[];
  resources: { title: string; url: string; description?: string }[];
  participant_amount: number;
  vips: { pics: string; name: string; role: string }[];
  application_status: "pending" | "accepted" | null;
};

export type HackathonData = {
  name: string;
  date: string;
  organizer: {
    name: string;
    logo: string;
  };
  image: string;
  isUpcomingOrLive: boolean;
  type: string;
  description: string;
  numberOfParticipants: number;
  location: string;
  id: string;
  applicationMethod: string;
  deadline: string;
  about: string;
  judges: { name: string; role: string; pics: string }[];
  dateStarted: string;
  HQ: string;
  resources: { title: string; link: string; description?: string }[];
  challenges: {
    index: number;
    title: string;
    description: string;
    prizes: { position: number; amount: string; tokens: string }[];
    technologies: string[];
    sponsors: { name: string; logo: string }[];
  }[];
};

export type ApplicationStatus =
  | "in_progress"
  | "pending"
  | "completed"
  | "rejected";

export interface UserHackathon {
  hackathonId: string;
  status: ApplicationStatus;
  applicationProgress: number;
}

export interface TagsProps {
  text: string | ReactNode;
  bgColor?: string;
  color?: string;
  radius?: string;
}

export interface EventType {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  description?: string;
  link?: string;
  location?: string;
  tags?: string[];
}

export type HackathonCardProps = {
  id?: number;
  organizer_logo?: string | null;
  organizer_name: string;
  hackathon_name: string;
  location: string;
  start_date: string;
  number_of_participant: number;
  type: string;
  status: string;
  registration_start_date?: string;
  deadline_to_join?: string;
  submission_start_date?: string;
  deadline_to_submit?: string;
};

export type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  logo: string;
  technologies: string[];
  challenge: string;
  teamMembers: { name: string; image: string }[];
  rank?: number;
  winningTags?: string[];
};

export type ParticipantCardProps = {
  id: string;
  name: string;
  skills: string[];
  role: string;
  location: string;
  image: string;
  tokens: number;
  projectsNumber?: number;
  lookingForTeammates?: boolean;
};

export type FAQItem = {
  question: string;
  answer: string;
};

type Bounty = {
  cash?: number;
  tokens?: number;
  custom_prize?: string;
  position?: number;
  sponsor: { name: string; logo: string };
  custom_category?: string;
};

export type PrizeData = {
  challenge: string;
  total_prize: string;
  bounty: Bounty[];
};

export type PrizeCardProps = {
  prize: {
    cash?: number;
    tokens?: string | null;
    custom_prize?: string | null;
    position?: number;
    company_partner_url: string;
    custom_category?: string;
    sponsor: {
      name: string;
      logo: string;
    };
  };
};

export type PrizeListProps = {
  prizes: PrizeData[];
};

export interface UserHackathonType {
  id: number;
  hackathon_id: number;
  application_status: "accepted" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
  participant_id: string;
  looking_for_teammates: boolean;
  hackathon: {
    id: number;
    name: string;
    tags: string[] | null;
    type: "virtual" | "physical";
    status: "upcoming" | "live" | "ended" | "draft";
    end_date: string;
    location: string | null;
    sponsors: {
      logo: string;
      name: string;
    }[];
    subdomain: string;
    avatar_url: string;
    banner_url: string;
    created_at: string;
    start_date: string;
    team_limit: number;
    updated_at: string;
    description: string;
    organizer_id: number;
    technologies: null;
    deadline_to_join: string;
    application_method: string;
    deadline_to_submit: string;
    allow_multiple_teams: false;
  };
}

export interface ChallengeResponseType {
  items: HackathonChallenges[];
}

export interface ProjectsResponseType {
  items: Projects[];
}
