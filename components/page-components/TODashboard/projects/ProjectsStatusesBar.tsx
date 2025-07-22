"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
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
import BarChartSkeleton from "./projectsStatusSkeletonLoader";
import { useTechOwnerStore } from "@/state/techOwnerStore";

interface statsDataType {
  totalCount: number;
  statuses: {
    status: "Submitted" | "Draft" | "Deleted";
    count: 20;
    percentage: 18;
  }[];
}
const statusColors = {
  Submitted: "#4F46E5",
  Draft: "#A78BFA",
  Deleted: "#C4B5FD",
};

const chartConfig = {
  Submitted: { color: "#4F46E5", label: "Submitted" },
  Draft: { color: "#A78BFA", label: "Draft" },
  Deleted: { color: "#C4B5FD", label: "Deleted" },
};

export default function ProjectsStatusesBar({
  hackathon_id,
}: {
  hackathon_id: number | string;
}) {
  const fetchHandler = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };
  const { selectedOrg } = useTechOwnerStore();


  const { data: statusStats, isLoading: isStatsLoading } =
    useSWR<statsDataType>(
      `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathon_id}/projects/statuses`,
      fetchHandler
    );
  const chartData =
    statusStats?.statuses?.map((status) => ({
      name: status.status,
      value: status.count,
      color: statusColors[status.status] || "#C4B5FD", // Default color if status not found
      percentage: status.percentage,
    })) || [];

  return isStatsLoading ? (
    <BarChartSkeleton />
  ) : (
    <div className="flex flex-row sm:flex-col md:flex-row gap-4 w-full items-center justify-evenly flex-wrap">
      <ChartContainer
        config={chartConfig}
        className="h-[250px] w-full max-w-[280px] flex-shrink-0"
      >
        <BarChart
          width={250}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis dataKey="name" tick={{ fill: "#E5E7EB", fontSize: 12 }} />
          <YAxis hide />
          <Tooltip content={<ChartTooltipContent nameKey="name" />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="flex flex-col sm:flex-row md:flex-col gap-2 pr-4">
        {chartData.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-white text-sm"
          >
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-white text-sm mt-2">
          <span className="w-3 h-3 rounded-sm opacity-0" /> {/* Spacer */}
          <span>Total: {statusStats?.totalCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
