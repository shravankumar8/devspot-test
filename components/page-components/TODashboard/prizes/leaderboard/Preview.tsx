"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { usePreviewStore } from "@/state/TODashboard";
import axios from "axios";
import { ChevronDown, InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import PreviewCard from "./PreviewCard";
import PreviewCardSkeleton from "./PreviewCardSkeleton";

interface PreviewProps {
  hackathonId: string;
  technologyOwnerId: number;
}

type SortByType = "standing" | "score" | "challenge";

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

const SORT_OPTIONS: SortByType[] = ["standing", "score", "challenge"];

const Preview = ({ hackathonId, technologyOwnerId }: PreviewProps) => {
  const { previewAssignments } = usePreviewStore();
  const [isUpdatingOptions, setIsUpdatingOptions] = useState(false);

  const fetchLeaderboardData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as LeaderboardResponse;
  };

  const {
    data: leaderboardData,
    isLoading: leadershipIsLoading,
    mutate,
  } = useSWR<LeaderboardResponse>(
    `/api/hackathons/${hackathonId}/leaderboard`,
    fetchLeaderboardData
  );

  // Get options from API or use defaults
  const {
    show_leaderboard_comments: showComments,
    show_leaderboard_score: showScores,
    leaderboard_standing_by: sortBy,
  } = leaderboardData?.options || {
    show_leaderboard_comments: true,
    show_leaderboard_score: true,
    leaderboard_standing_by: "standing" as SortByType,
  };

  const mergedData = useMemo(() => {
    if (!leaderboardData) return [];

    // Mark all API data as published
    const publishedData = leaderboardData.projects.map((item) => ({
      ...item,
      isPreview: false,
    }));

    // Add preview assignments
    const previewData = Object.entries(previewAssignments).flatMap(
      ([challengeId, assignments]) =>
        assignments
          .map(({ prizeId, projectId, projectData, isPreview }) => {
            if (!projectData) return null;

            return {
              projectId: projectId,
              challengeId: Number(challengeId),
              projectName: projectData.projectName,
              projectDescription: projectData.projectDescription,
              challengeName: projectData.challengeName, // Get from challenge data if available
              rank: projectData.rank,
              averageScore: projectData.averageScore,
              comments: projectData.comments,
              isPreview: true, // Mark as preview
              project: {
                id: projectData.project.id,
                name: projectData.project.name,
                logo_url: projectData.project.logo_url,
                tagline: projectData.project.tagline,
                demo_url: projectData.project.demo_url,
                submitted: projectData.project.submitted,
                video_url: projectData.project.video_url,
                created_at: projectData.project.created_at,
                updated_at: projectData.project.updated_at,
                header_url: projectData.project.header_url,
                description: projectData.project.description,
                project_url: projectData.project.project_url,
                hackathon_id: projectData.project.hackathon_id,
                technologies: projectData.project.technologies,
                project_code_type: projectData.project.project_code_type,
                accepting_participants:
                  projectData.project.accepting_participants,
                project_team_members: projectData.project.project_team_members,
              },
            };
          })
          .filter(Boolean) as LeaderboardEntry[]
    );

    // Combine the data
    const combinedData = [...publishedData];

    // Replace any published entries with preview versions
    previewData.forEach((previewItem) => {
      const existingIndex = combinedData.findIndex(
        (item) =>
          item.challengeId === previewItem.challengeId &&
          item.projectId === previewItem.projectId
      );

      if (existingIndex >= 0) {
        combinedData[existingIndex] = previewItem;
      } else {
        combinedData.push(previewItem);
      }
    });

    return combinedData;
  }, [leaderboardData, previewAssignments]);

  const handleCommentsSwitch = async () => {
    const newValue = !showComments;
    await updateLeaderboardOptions({
      comments: newValue,
      score: showScores,
      sortBy: sortBy,
    });
  };

  const handleScoresSwitch = async () => {
    const newValue = !showScores;
    await updateLeaderboardOptions({
      comments: showComments,
      score: newValue,
      sortBy: sortBy,
    });
  };

  const handleSortChange = async (newSort: SortByType) => {
    await updateLeaderboardOptions({
      comments: showComments,
      score: showScores,
      sortBy: newSort,
    });
  };

  const updateLeaderboardOptions = async (options: {
    comments: boolean;
    score: boolean;
    sortBy: SortByType;
  }) => {
    setIsUpdatingOptions(true);
    try {
      await axios.put(
        `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/leaderboard-options`,
        options
      );
      mutate(); // Refresh the data
      toast.success("Leaderboard options updated successfully");
    } catch (error) {
      console.error("Error updating leaderboard options:", error);
      toast.error("Failed to update leaderboard options");
    } finally {
      setIsUpdatingOptions(false);
    }
  };

  return (
    <div className="border border-tertiary-bg rounded-xl w-full">
      <header className="flex md:flex-row flex-col justify-between items-center bg-secondary-bg px-4 py-3 rounded-tl-xl rounded-tr-xl">
        <h3 className="font-roboto font-semibold">Leaderboard Preview</h3>

        {/* Filters + Sorts */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 mt-3 md:mt-0">
          <div className="flex flex-1 items-center gap-3 bg-tertiary-bg px-4 py-2 border border-tertiary-text rounded-xl">
            <Switch
              checked={showComments}
              onCheckedChange={handleCommentsSwitch}
              disabled={isUpdatingOptions}
            />
            <p className="font-roboto font-medium text-sm">Comments</p>
          </div>

          <div className="flex flex-1 items-center gap-3 bg-tertiary-bg px-4 py-2 border border-tertiary-text rounded-xl">
            <Switch
              checked={showScores}
              onCheckedChange={handleScoresSwitch}
              disabled={isUpdatingOptions}
            />
            <p className="font-roboto font-medium text-sm">Scores</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="relative flex justify-between items-center !border !border-tertiary-text !font-roboto !font-medium text-secondary-text !text-sm bg-tertiary-bg px-4 py-2 rounded-xl w-full"
                disabled={isUpdatingOptions}
              >
                Sort by{" "}
                <span className="mx-2 text-white capitalize">{sortBy}</span>
                <ChevronDown color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="left-0 !bg-tertiary-bg p-0 min-w-[200px] max-h-[200px] overflow-y-scroll font-roboto text-gray-300 text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className="p-3 border-b border-b-tertiary-text cursor-pointer hover:!bg-[#3B3B4F]"
                >
                  <label className="flex items-center gap-3 text-secondary-text text-sm capitalize">
                    <Checkbox checked={sortBy === option} />
                    {option}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() =>
              updateLeaderboardOptions({
                comments: showComments,
                score: showScores,
                sortBy: sortBy,
              })
            }
            size="lg"
            disabled={isUpdatingOptions}
            className="flex-shrink-0"
          >
            {isUpdatingOptions ? "Saving..." : "Save Options"}
          </Button>
        </div>
      </header>

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
        ) : mergedData?.length === 0 ? (
          <div className="h-[200px] justify-center col-span-12 flex items-center gap-3 text-secondary-text text-base font-roboto">
            <InfoIcon className="stroke-main-primary flex-shrink-0" />
            <span>
              When judges start awarding projects, the leaderboard will populate
              with winning projects.
            </span>
          </div>
        ) : (
          mergedData?.map((leadershipEntry) => (
            <div
              key={`${leadershipEntry.projectId}-${leadershipEntry.challengeId}`}
              className="col-span-12 lg:col-span-6 xl:col-span-4 items-stretch"
            >
              <PreviewCard
                leadershipEntry={leadershipEntry}
                showScore={showScores}
                showComments={showComments}
                isPreview={leadershipEntry?.isPreview}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Preview;
