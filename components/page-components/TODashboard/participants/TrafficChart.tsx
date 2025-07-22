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
import { ChevronDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const trafficData = [
  { month: "JAN", traffic: 8000 },
  { month: "FEB", traffic: 6000 },
  { month: "MAR", traffic: 9500 },
  { month: "APR", traffic: 20000 },
  { month: "MAY", traffic: 23000 },
  { month: "JUN", traffic: 18000 },
  { month: "JUL", traffic: 21000 },
  { month: "AUG", traffic: 26000 },
  { month: "SEP", traffic: 24000 },
  { month: "OCT", traffic: 22000 },
  { month: "NOV", traffic: 28000 },
  { month: "DEC", traffic: 30000 },
];

const TrafficChart = () => {
  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] border border-black-terciary">
      <header className="flex justify-between items-center">
        <h4 className="text-white font-semibold font-roboto">Traffic</h4>
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
                  Day
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem
                key={"todo-implement-project"}
                className="p-3 border-b border-b-tertiary-text"
                // onClick={onAssignProject}
              >
                <label className="flex items-center gap-3 text-secondary-text text-sm">
                  <Checkbox checked={false} />
                  Week
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem
                key={"todo-implement-project"}
                className="p-3 border-b border-b-tertiary-text"
                // onClick={onAssignProject}
              >
                <label className="flex items-center gap-3 text-secondary-text text-sm">
                  <Checkbox checked={false} />
                  Month
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Todo: Chart */}
      <div className="mt-4">
        <ChartContainer
          config={{
            traffic: {
              label: "Monthly Traffic",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[260px] w-full"
        >
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
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
              domain={[0, 30000]}
              tickFormatter={(v) => `${v / 1000}K`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: "#6B7280", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="traffic"
              stroke="#9CA3AF"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TrafficChart;
