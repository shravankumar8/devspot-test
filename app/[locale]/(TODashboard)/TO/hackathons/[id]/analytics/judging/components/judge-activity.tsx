"use client";

import {
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "@/components/page-components/projects/constants/bacakground";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import axios from "axios";
import { InfoIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import ActivityLoader from "./judgeActivityLoader";
import { useTechOwnerStore } from "@/state/techOwnerStore";

// Sample data for the scoring chart
export const scoringData = [
  { score: 1, projects: 2 },
  { score: 2, projects: 1 },
  { score: 3, projects: 3 },
  { score: 4, projects: 5 },
  { score: 5, projects: 8 },
  { score: 6, projects: 12 },
  { score: 7, projects: 15 },
  { score: 8, projects: 10 },
  { score: 9, projects: 6 },
  { score: 10, projects: 4 },
];

// Add helper functions
const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "TODAY";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "YESTERDAY";
  } else {
    return date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/(\d+)/, "$1th");
  }
};

const groupActivitiesByDate = (activities: JudgeActivityDataInterface) => {
  const grouped = activities.latest_activity?.reduce(
    (acc, activity) => {
      const date = new Date(activity.judged_at ?? "");
      const dateKey = formatDate(date);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(activity);
      return acc;
    },
    {} as Record<
      string,
      {
        project_id: number;
        project_name: string;
        project_image: string;
        challenge_name: string;
        challenge_image: string;
        score: number;
        judge_name: string;
        judge_image: string;
        judged_at: string | null;
      }[]
    >
  );

  return grouped;
};

interface JudgeActivityDataInterface {
  unassigned_projects: number;
  projects_needing_review: number;
  complete_judgings: number;
  flagged_projects: number;
  total_project_challenge_pairs: number;
  total_submitted_projects: number;
  latest_activity: {
    project_id: number;
    project_name: string;
    project_image: string;
    challenge_name: string;
    challenge_image: string;
    score: number;
    judge_name: string;
    judge_image: string;
    judged_at: string | null;
  }[];
  score_statistics: {
    mean: number;
    median: number;
    mode: number;
  };
  score_distribution: {
    x_axis: number[];
    y_axis: number[];
  };
}
export default function JudgingActivity({hackathonId}: {hackathonId: string}) {
  const fetchJudgingStatistics = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };
  const {selectedOrg} = useTechOwnerStore()

  const getLogoSource = (logo_url: string) => {
    if (!logo_url) return null;

    let selectedLogoIndex = LOGO_TEMPLATES.indexOf(logo_url);

    if (selectedLogoIndex >= 0) {
      return (
        <div
          className={`${cn(
            selectedLogoIndex % 2 == 0 ? "bg-[#13131a] " : "bg-[#E7E7E8]",
            "w-6 h-6 rounded flex justify-center items-center"
          )}`}
        >
          <LogoPlaceholder index={selectedLogoIndex} />
        </div>
      );
    }

    return logo_url;
  };

  const { data: activityData, isLoading: isJudgesDataLoading } =
    useSWR<JudgeActivityDataInterface>(
      `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judging-statistics`,
      fetchJudgingStatistics
    );

  const getChartData = () => {
    if (!activityData?.score_distribution) return [];

    return activityData.score_distribution.x_axis.map((score, index) => ({
      score,
      projects: activityData.score_distribution.y_axis[index] || 0,
    }));
  };

  return (
    <div className="font-roboto">
      {isJudgesDataLoading ? (
        <ActivityLoader />
      ) : (
        <>
          <div className="overflow-x-scroll mb-6">
            <div className="w-full flex gap-6 min-w-[900px]">
              <div className="p-5 h-full min-w-[250px] w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1">
                <div className="flex gap-2 items-center text-secondary-text">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon width="20px" height="20px" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
                        <p className="  mb-1 text-white">
                          The total number of unique projects submitted to the
                          hackathon.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <p className="text-sm whitespace-nowrap  font-roboto ">
                    Total Projects Submitted
                  </p>
                </div>

                <p className="font-meduim text-base font-roboto truncate mt-2">
                  {activityData?.total_submitted_projects}
                </p>
              </div>
              <div className="p-5 h-full min-w-[250px] w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1">
                <div className="flex gap-2 items-center text-secondary-text">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon width="20px" height="20px" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
                        <p className="  mb-1 text-white">
                          The number of total project-to-challenge submissions.
                          This number is higher if teams submit to multiple
                          sponsor challenges. (Only applicable if teams are
                          allowed to submit to multiple challenges.) [only if
                          multiple projects is toggled on by TO]
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <p className="text-sm whitespace-nowrap font-roboto ">
                    Total Project-Challenge Pairs
                  </p>
                </div>

                <p className="font-meduim text-base font-roboto truncate mt-2">
                  {activityData?.total_project_challenge_pairs}
                </p>
              </div>
              <div className="p-5 h-full min-w-[250px] w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1">
                <div className="flex gap-2 items-center text-secondary-text">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon width="20px" height="20px" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
                        <p className="  mb-1 text-white">
                          The number of submitted projects that have not yet
                          been assigned to a judge for evaluation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <p className="text-sm whitespace-nowrap font-roboto ">
                    Unassigned
                  </p>
                </div>

                <p className="font-meduim text-base font-roboto truncate mt-2">
                  {activityData?.unassigned_projects}
                </p>
              </div>

              <div className="p-5 h-full min-w-[250px] w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1">
                <div className="flex gap-2 items-center text-secondary-text">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon width="20px" height="20px" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
                        <p className="text-sm mb-1 text-white">
                          The number of judging assignments that have been
                          started but not yet submitted. These may be in draft
                          or incomplete status.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-sm whitespace-nowrap font-roboto ">
                    Judging Needs Review
                  </p>
                </div>

                <p className="font-meduim text-base font-roboto truncate mt-2">
                  {activityData?.projects_needing_review}
                </p>
              </div>
              <div className="p-5 h-full min-w-[250px] w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1">
                <div className="flex gap-2 items-center text-secondary-text">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon width="20px" height="20px" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
                        <p className="text-sm mb-1 text-white">
                          The total number of judging assignments that have been
                          submitted and finalized.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-sm whitespace-nowrap font-roboto ">
                    Judging Completed
                  </p>
                </div>

                <p className="font-meduim text-base font-roboto truncate mt-2">
                  {activityData?.complete_judgings}
                </p>
              </div>
              <div className="p-5 h-full min-w-[250px] w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1">
                <div className="flex gap-2 items-center text-secondary-text">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon width="20px" height="20px" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
                        <p className="  mb-1 text-white">
                          The total number of submitted projects that have been
                          flagged for issues (e.g. plagiarism, inappropriate
                          content, or broken links).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-sm whitespace-nowrap font-roboto ">
                    Flagged Projects
                  </p>
                </div>

                <p className="font-meduim text-base font-roboto truncate mt-2">
                  {activityData?.flagged_projects}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1500px] mx-auto">
            {/* Latest Judging Activity */}
            <Card className="bg-secondary-bg border-tertiary-bg p-5 h-[330px] !rounded-2xl overflow-y-scroll overflow-x-hidden">
              <CardHeader className="!p-0">
                <CardTitle className="text-white text-base font-medium">
                  Latest Judging Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 !p-0">
                {activityData?.latest_activity &&
                activityData?.latest_activity?.length > 0 ? (
                  Object.entries(groupActivitiesByDate(activityData)).map(
                    ([dateGroup, activities]) => (
                      <div key={dateGroup} className="space-y-3">
                        <h3 className="text-secondary-text text-xs font-medium uppercase tracking-wide mt-3">
                          {dateGroup}
                        </h3>
                        <div className="space-y-2">
                          {activities.map((activity) => {
                            const logoSource = getLogoSource(
                              activity.project_image
                            );
                            return (
                              <div
                                key={activity.project_id}
                                className="flex items-center gap-3"
                              >
                                {/* Judge Image */}
                                {activity?.judge_image ? (
                                  <img
                                    src={activity.judge_image}
                                    alt={activity.judge_name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                    {getInitials(activity.judge_name)}
                                  </div>
                                )}

                                {/* Project Image and Name */}
                                <div className="flex items-center gap-2 flex-1">
                                  {logoSource &&
                                  typeof logoSource === "string" ? (
                                    <img
                                      src={
                                        activity.project_image ||
                                        "/placeholder.svg"
                                      }
                                      alt={activity.project_name}
                                      className="w-6 h-6 rounded object-contain"
                                    />
                                  ) : (
                                    logoSource
                                  )}

                                  <span className="text-white font-normal text-sm max-w-[100px] truncate">
                                    {activity.project_name}
                                  </span>
                                </div>

                                {/* Challenge Badge */}
                                <div className="flex items-center gap-1 bg-transparent rounded-full border-white border px-3 py-1">
                                  <img
                                    src={
                                      activity.challenge_image ||
                                      "/placeholder.svg"
                                    }
                                    alt={activity.challenge_name}
                                    className="w-4 h-4 object-contain"
                                  />
                                  <span className="text-white text-sm max-w-[100px] truncate">
                                    {activity.challenge_name}
                                  </span>
                                </div>

                                {/* Score Badge */}
                                <div
                                  className={`bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white text-xs font-normal px-3 py-1 rounded-full`}
                                >
                                  {activity.score}/10
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="flex h-[200px] w-full items-center gap-2 justify-center">
                    <InfoIcon color="#4E52F5" />
                    <p className="text-sm font-roboto">
                      When the judging period begins, latest judged projects
                      will be listed here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scoring Chart */}
            <Card className="bg-secondary-bg border-tertiary-bg p-5 h-[330px] rounded-2xl">
              <CardHeader className="!p-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base font-medium">
                    Scoring
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-transparent !border-white text-white"
                    >
                      Mode: {activityData?.score_statistics?.mode}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-transparent !border-white text-white"
                    >
                      Median: {activityData?.score_statistics?.median}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="!bg-transparent !border-white text-white"
                    >
                      Mean: {activityData?.score_statistics?.mean}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="!p-0">
                <ChartContainer
                  config={{
                    projects: {
                      label: "# of Projects",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={getChartData()}>
                    <CartesianGrid
                      horizontal={true}
                      vertical={false}
                      stroke="#2B2B31"
                    />
                    <XAxis
                      dataKey="score"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      label={{
                        value: "# OF PROJECTS",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                          fill: "#9CA3AF",
                          fontSize: "12px",
                        },
                      }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                    />
                    <Bar
                      dataKey="projects"
                      radius={[26, 26, 26, 26]} // 4px radius on top corners
                      barSize={12}
                      fill="url(#barGradient)"
                    />

                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#9667FA" />
                        <stop offset="100%" stopColor="#4075FF" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ChartContainer>
                <div className="text-center mt-2">
                  <span className="text-secondary-text text-sm">SCORE</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
