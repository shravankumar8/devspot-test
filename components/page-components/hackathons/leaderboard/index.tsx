"use client";

import { Input } from "@/components/common/form/input";
import Search from "@/components/icons/Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronDown, InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import PreviewCardSkeleton from "../../TODashboard/prizes/leaderboard/PreviewCardSkeleton";
import PreviewCard from "../../TODashboard/prizes/leaderboard/PreviewCard";


interface ParticipantLeaderboardProps {
  hackathonId: string;
}

type SortByType = "standing" | "score" | "challenge" | "skills";

interface LeaderboardResponse {
  projects: LeaderboardEntry[];
  options: {
    show_leaderboard_comments: boolean;
    show_leaderboard_score: boolean;
    leaderboard_standing_by: SortByType;
  };
}

export interface LeaderboardEntry {
  projectId: number;
  challengeId: number;
  projectName: string;
  projectDescription: string;
  challengeName: string;
  rank: number | null;
  averageScore: number;
  isPreview: boolean;
  comments: string;
  commentJudge?: {
    name: string;
    avatar_url: string;
  };
  project: {
    id: number;
    name: string;
    tagline: string;
    demo_url: string;
    logo_url: string | null;
    submitted: boolean;
    video_url: string;
    created_at: string;
    updated_at: string;
    header_url: string | null;
    description: string;
    project_url: string;
    hackathon_id: number;
    technologies: string[];
    project_code_type: "fresh_code" | "existing_code";
    accepting_participants: boolean;
    project_team_members: {
      id: number;
      status: string;
      is_project_manager: boolean;
      users: {
        id: string;
        email: string;
        full_name: string;
        avatar_url: string | null;
      };
    }[];
  };
}

const SORT_OPTIONS: SortByType[] = ["standing", "score", "challenge", "skills"];

export const HackathonLeaderboard = ({ hackathonId }: ParticipantLeaderboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortByType>("standing");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchLeaderboardData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as LeaderboardResponse;
  };

  const {
    data: leaderboardData,
    isLoading: leadershipIsLoading,
    error,
  } = useSWR<LeaderboardResponse>(
    `/api/hackathons/${hackathonId}/leaderboard`,
    fetchLeaderboardData
  );

  // Get display options from API response
  const {
    show_leaderboard_comments: showComments,
    show_leaderboard_score: showScores,
  } = leaderboardData?.options || {
    show_leaderboard_comments: true,
    show_leaderboard_score: true,
  };

  const filteredAndSortedData = useMemo(() => {
    if (!leaderboardData?.projects) return [];

    let result = [...leaderboardData.projects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.projectName.toLowerCase().includes(query) ||
          entry.projectDescription.toLowerCase().includes(query) ||
          entry.challengeName.toLowerCase().includes(query) ||
          entry.project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          ) ||
          entry.project.project_team_members.some((member) =>
            member.users.full_name.toLowerCase().includes(query)
          )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "standing":
        result.sort((a, b) => {
          if (a.rank === null && b.rank === null) return 0;
          if (a.rank === null) return 1;
          if (b.rank === null) return -1;
          return a.rank - b.rank;
        });
        break;
      case "score":
        result.sort((a, b) => b.averageScore - a.averageScore);
        break;
      case "challenge":
        result.sort((a, b) => a.challengeName.localeCompare(b.challengeName));
        break;
      case "skills":
        result.sort((a, b) => {
          const aTech = a.project.technologies[0] || "";
          const bTech = b.project.technologies[0] || "";
          return aTech.localeCompare(bTech);
        });
        break;
      default:
        break;
    }

    return result;
  }, [leaderboardData, searchQuery, sortBy]);

  return (
    <div className="border border-tertiary-bg rounded-xl w-full">
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-secondary-bg rounded-tl-xl rounded-tr-xl">
        <div className="relative flex-grow">
          <Input
            prefixIcon={<Search />}
            name="projects"
            type="text"
            placeholder="Search projects"
            value={searchQuery}
            className="!px-3 !py-2 !text-sm !font-medium !h-[40px] !placeholder:text-secondary-text"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="bg-tertiary-bg !border-tertiary-text !border !text-sm text-secondary-text !font-medium"
              >
                Sort by{" "}
                <span className="text-white ml-1 capitalize">{sortBy}</span>
                <ChevronDown color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[200px] overflow-y-scroll !border-tertiary-text min-w-[272px] !bg-tertiary-bg"
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className="text-secondary-text border-b border-b-tertiary-text text-sm p-3 capitalize"
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards Container */}
      <div className="gap-6 grid grid-cols-12 p-5">
        {leadershipIsLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="col-span-12 lg:col-span-6 xl:col-span-4"
              >
                <PreviewCardSkeleton />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="h-[200px] justify-center col-span-12 flex items-center gap-3 text-secondary-text text-base">
            <InfoIcon className="stroke-main-primary flex-shrink-0" />
            <span>Error loading leaderboard data</span>
          </div>
        ) : filteredAndSortedData?.length === 0 ? (
          <div className="h-[200px] justify-center col-span-12 flex items-center gap-3 text-secondary-text text-base">
            <InfoIcon className="stroke-main-primary flex-shrink-0" />
            <span>
              {searchQuery
                ? "No projects match your search criteria."
                : "When judges start awarding projects, the leaderboard will populate with winning projects."}
            </span>
          </div>
        ) : (
          filteredAndSortedData?.map((leadershipEntry) => (
            <div
              key={`${leadershipEntry.projectId}-${leadershipEntry.challengeId}`}
              className="col-span-12 lg:col-span-6 xl:col-span-4 items-stretch"
            >
              <PreviewCard
                leadershipEntry={leadershipEntry}
                showScore={showScores}
                showComments={showComments}
                isPreview={false}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
