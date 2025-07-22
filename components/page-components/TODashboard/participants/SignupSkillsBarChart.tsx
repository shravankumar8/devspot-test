import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";
import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import FadeTransitionLoader from "./FadeTransitionLoader";

type Granularity = "day" | "week" | "month" | "year";
type Registration = { date: string; registrations: number };

interface RegistrationData {
  validGranularity: Granularity[];
  response: Registration[];
}

const fetcher = (url: string) =>
  axios.get<{ data: RegistrationData }>(url).then((res) => res.data?.data);

interface RegistrationBarChartProps extends ParticipantsAnalyticsPropsBase {}

const SignupSkillsBarChart = (props: RegistrationBarChartProps) => {
  const { hackathonId, technologyOwnerId } = props;

  const [gran, setGran] = useState<Granularity>("week");
  const [options, setOptions] = useState<Granularity[]>(["week"]);
  const [data, setData] = useState<Registration[]>([]);

  const {
    data: registrations,
    isLoading,
    mutate,
  } = useSWR<RegistrationData>(
    `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/analytics/participants/registration?granularity=${gran}`,
    fetcher
  );

  useEffect(() => {
    if (registrations?.validGranularity) {
      setOptions(registrations.validGranularity);
    }

    if (registrations?.response) {
      setData(registrations.response);
    }
  }, [registrations]);

  useEffect(() => {
    mutate();
  }, [gran]);

  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] border border-black-terciary !font-roboto">
      <header className="flex justify-between items-center">
        <h4 className="text-white font-semibold font-roboto">Sign Ups</h4>

        <div>
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
                <span className="text-white ml-1 capitalize">{gran}</span>
                <ChevronDown className="ml-2 flex-shrink-0" color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="left-0 !bg-tertiary-bg p-0 min-w-[272px] overflow-y-scroll font-roboto text-gray-300 text-sm"
            >
              {options.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="p-3 border-b border-b-tertiary-text"
                  onClick={() => setGran(item)}
                >
                  <label className="flex items-center gap-3 text-secondary-text text-sm capitalize">
                    <Checkbox checked={item === gran} />
                    {item}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <FadeTransitionLoader
        isLoading={isLoading}
        loader={<CommonSkillsSkeletonLoader />}
      >
        <div className="mt-4 w-full -translate-x-8 !font-roboto">
          <ChartContainer
            config={{
              registrations: { label: "Registrations", color: "#9667FA" },
            }}
            className="h-[274px] w-full !font-roboto"
          >
            <BarChart data={data} className="!font-roboto">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="!font-roboto"
              />
              <YAxis
                dataKey="registrations"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                className="!font-roboto"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "rgba(150, 103, 250, 0.1)" }}
              />
              <Bar
                dataKey="registrations"
                fill="#9667FA"
                radius={[6, 6, 0, 0]}
                barSize={20}
                className="!font-roboto"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </FadeTransitionLoader>
    </div>
  );
};

export default SignupSkillsBarChart;

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
