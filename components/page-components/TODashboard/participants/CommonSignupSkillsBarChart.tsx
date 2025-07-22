import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import FadeTransitionLoader from "./FadeTransitionLoader";

interface SkillItem {
  name: string;
  percentage: number;
  color?: string;
}

const fetcher = (url: string) =>
  axios.get<{ data: SkillItem[] }>(url).then((res) => res.data?.data);

const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

interface CommonSkillsProps extends ParticipantsAnalyticsPropsBase {}

const CommonSignupSkillsBarChart = (props: CommonSkillsProps) => {
  const { hackathonId, technologyOwnerId } = props;

  const { data: rawSkills = [], isLoading } = useSWR<SkillItem[]>(
    `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/analytics/participants/common-skills`,
    fetcher
  );

  const [skills, setSkills] = useState<SkillItem[]>([]);

  useEffect(() => {
    if (rawSkills.length > 0) {
      const coloredSkills = rawSkills.map((skill) => ({
        ...skill,
        color: getRandomColor(),
      }));
      setSkills(coloredSkills);
    }
  }, [rawSkills]);

  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] border border-black-terciary">
      <header className="flex justify-between items-center">
        <h4 className="text-white font-semibold font-roboto">
          Most Common Skills Amongst Participants
        </h4>
        {/* <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="relative flex justify-between items-center bg-tertiary-bg px-4 py-2 border-secondary-text rounded-xl w-full"
            >
              <Button
                variant="ghost"
                size="lg"
                className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium truncate w-full flex items-center justify-between"
              >
                <span className="truncate">{"Sort by"}</span>
                <span className="text-white ml-1">Week</span>
                <ChevronDown className="ml-2 flex-shrink-0" color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="left-0 !bg-tertiary-bg p-0 min-w-[272px] overflow-y-scroll font-roboto text-gray-300 text-sm"
            >
              <DropdownMenuItem
                key={"todo-implement-project"}
                className="p-3 border-b border-b-tertiary-text"
                // onClick={onAssignProject}
              >
                <label className="flex items-center gap-3 text-secondary-text text-sm">
                  <Checkbox checked={false} />
                  Todo: implement sort
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </header>

      <FadeTransitionLoader
        isLoading={isLoading}
        loader={<CommonSkillsSkeletonLoader />}
      >
        <div className="mt-4 flex gap-5">
          {/* Chart: 50% width */}
          <div className="w-1/2 h-[264px]">
            <ChartContainer
              config={{
                percent: {
                  label: "Skill %",
                  color: "#6366F1",
                },
              }}
              className="h-full w-full"
            >
              <BarChart
                layout="vertical"
                data={skills}
                barCategoryGap={12}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 40]}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  className="!font-roboto"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  hide
                  className="!font-roboto"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                />
                <Bar
                  dataKey="percentage"
                  radius={[0, 8, 8, 0]}
                  barSize={16}
                  className="!font-roboto"
                >
                  {skills.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Legend: 50% width */}
          <ul className="w-1/2 ml-6 flex flex-col justify-around text-sm text-secondary-text font-roboto">
            {skills.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="text-white font-semibold">
                  {item.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeTransitionLoader>
    </div>
  );
};

export default CommonSignupSkillsBarChart;

const CommonSkillsSkeletonLoader = () => {
  return (
    <div className="mt-4 flex gap-5">
      {/* Chart Area: 50% width */}
      <div className="w-1/2 h-[264px] flex flex-col justify-around">
        {/* Horizontal Bar Skeletons */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Y-axis label skeleton */}
            <Skeleton className="h-4 w-12 bg-tertiary-bg" />
            {/* Bar skeleton with varying widths */}
            <Skeleton
              className="h-4 bg-tertiary-bg rounded-r-lg"
              style={{
                width: `${Math.random() * 60 + 40}%`, // Random width between 40-100%
              }}
            />
          </div>
        ))}

        {/* X-axis skeleton */}
        <div className="flex justify-between mt-2 px-12">
          <Skeleton className="h-3 w-8 bg-tertiary-bg" />
          <Skeleton className="h-3 w-8 bg-tertiary-bg" />
          <Skeleton className="h-3 w-8 bg-tertiary-bg" />
          <Skeleton className="h-3 w-8 bg-tertiary-bg" />
        </div>
      </div>

      {/* Legend Area: 50% width */}
      <ul className="w-1/2 ml-6 flex flex-col justify-around">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Color dot skeleton */}
              <Skeleton className="w-3 h-3 rounded-full bg-tertiary-bg" />
              {/* Skill name skeleton */}
              <Skeleton className="h-4 w-16 bg-tertiary-bg" />
            </div>
            {/* Percentage skeleton */}
            <Skeleton className="h-4 w-10 bg-tertiary-bg" />
          </li>
        ))}
      </ul>
    </div>
  );
};
