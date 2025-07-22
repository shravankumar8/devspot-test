"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import useSWR from "swr";
import ChartSkeleton from "./projectPerSkeletonLoader";

interface PerChallengeType {
  challenge_id: number;
  challenge_name: string;
  project_count: number;
  percentage: number;
}
// Color palette for challenges (you can expand this as needed)
const challengeColors = [
  "#4F46E5",
  "#A78BFA",
  "#C4B5FD",
  "#818CF8",
  "#6366F1",
  "#8B5CF6",
  "#7C3AED",
  "#6D28D9",
  "#5B21B6",
  "#4C1D95",
  "#9333EA",
  "#7E22CE",
  "#6B21A8",
  "#581C87",
  "#4A1C81",
];

export default function ProjectsPerChallengePie({
  hackathon_id,
}: {
  hackathon_id: number | string;
}) {
  const { selectedOrg } = useTechOwnerStore();

  const fetchHandler = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data: challengesData, isLoading: isStatsLoading } = useSWR<
    PerChallengeType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathon_id}/projects/per-challenge`,
    fetchHandler
  );

  // Transform the API data to match the expected format
  const chartData =
    challengesData?.map((challenge: any, index: number) => ({
      name: challenge.challenge_name.replace(/^[⚡️🧪🔁🧠]+/, "").trim(), // Remove emoji prefixes
      value: challenge.project_count,
      percent: `${challenge.percentage}%`,
      color: challengeColors[index % challengeColors.length], // Cycle through colors
    })) || [];

  // Create chart config dynamically
  const chartConfig = chartData.reduce((acc: any, item: any) => {
    acc[item.name] = { color: item.color, label: item.name };
    return acc;
  }, {});

  return isStatsLoading ? (
    <ChartSkeleton />
  ) : (
    <div className="flex flex-row sm:flex-col md:flex-row gap-4 w-full items-center justify-evenly flex-wrap">
      <ChartContainer
        config={chartConfig}
        className="h-[250px] w-full max-w-[220px] flex-shrink-0"
      >
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            isAnimationActive={false}
            stroke="none"
            cx="50%"
            cy="50%"
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltipContent nameKey="name" labelKey="percent" />}
          />
        </PieChart>
      </ChartContainer>

      <div className="flex flex-col sm:flex-row md:flex-col gap-2 pr-4 max-h-[250px] overflow-y-auto">
        {chartData.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 text-white text-sm"
          >
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate max-w-[180px]">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
