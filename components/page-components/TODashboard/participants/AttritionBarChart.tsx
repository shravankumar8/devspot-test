import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import FadeTransitionLoader from "./FadeTransitionLoader";

const attritionData = [
  {
    name: "Sign ups",
    value: 45,
    color: "#6366F1", // Indigo
  },
  {
    name: "Participants who\ncreated a project",
    value: 2,
    color: "#A855F7", // Violet
  },
];

interface AttritionResponse {
  registrations: number;
  participantsWithProject: number;
  attritionPercentage: number;
}

const fetcher = (url: string) =>
  axios.get<{ data: AttritionResponse }>(url).then((res) => res.data?.data);

interface AttritionBarChartProps extends ParticipantsAnalyticsPropsBase {}
const AttritionBarChart = ({
  hackathonId,
  technologyOwnerId,
}: AttritionBarChartProps) => {
  const { data: attritionData, isLoading } = useSWR<AttritionResponse>(
    `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/analytics/participants/attrition`,
    fetcher
  );

  const legends = [
    {
      label: "Signups",
      value: attritionData?.registrations,
    },
    {
      label: "Participants who created a project",
      value: attritionData?.participantsWithProject,
    },
  ];

  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] overflow-y-scroll border border-black-terciary flex flex-col justify-between">
      <header className="flex flex-col gap-2">
        <h4 className="text-secondary-text font-roboto">Attrition</h4>
        <h3 className="text-2xl font-bold text-white font-roboto">
          {attritionData?.attritionPercentage ?? 100}%{" "}
        </h3>
      </header>

      <FadeTransitionLoader
        isLoading={isLoading}
        loader={<AttritionBarChartSkeletonLoader />}
        className={`h-[110px] ${!isLoading ? "-translate-x-20" : ""}`}
      >
        <ChartContainer
          config={{
            percent: {
              label: "Attrition %",
              color: "#6366F1",
            },
          }}
          className="h-full w-full"
        >
          <BarChart
            layout="vertical"
            data={[attritionData]}
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
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="!font-roboto"
            />
            <YAxis
              dataKey="registrations"
              type="category"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
              className="!font-roboto"
            />
            <Tooltip
              cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
              contentStyle={{
                background: "#1F2937",
                border: "none",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#E5E7EB" }}
            />
            <Bar
              dataKey="participantsWithProject"
              radius={[0, 8, 8, 0]}
              barSize={16}
              isAnimationActive={false}
              className="!font-roboto"
            >
              <Cell key={`cell-signup`} fill="#6366F1" />
              <Cell key={`cell-participants`} fill="#A855F7" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </FadeTransitionLoader>

      {/* Legend */}
      <ul className="mt-4 flex flex-col gap-3 text-sm text-secondary-text font-roboto font-medium">
        {legends.map((item, index) => (
          <li className="flex items-center justify-between" key={index}>
            <div className="flex items-center gap-2 shrink-0 w-[70%]">
              <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
              <span className="leading-4 max-w-[70%]">{item.label}</span>
            </div>
            <FadeTransitionLoader
              isLoading={isLoading}
              loader={
                <Skeleton className="w-full h-full rounded-full bg-gray-600" />
              }
              className="w-[20%] h-4 justify-self-end text-end"
            >
              <span className="text-white font-semibold">{item.value}</span>
            </FadeTransitionLoader>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttritionBarChart;

const AttritionBarChartSkeletonLoader = () => {
  return (
    <div className="mt-6 h-[110px]">
      <div className="h-full flex flex-col justify-around">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-3 w-8 bg-tertiary-bg" />
            <Skeleton
              className="h-4 bg-tertiary-bg rounded-r-lg"
              style={{
                width: `${Math.random() * 60 + 40}%`,
              }}
            />
          </div>
        ))}

        {/* X-axis skeleton */}
        <div className="flex justify-between mt-2 px-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-5 bg-tertiary-bg" />
          ))}
        </div>
      </div>
    </div>
  );
};
