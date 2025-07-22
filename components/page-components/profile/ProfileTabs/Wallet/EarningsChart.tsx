import { cn } from "@/utils/tailwind-merge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for the chart
const generateWeekData = (week: number) => {
  // Starting from May 18 + week offset
  const startDate = new Date(2025, 4, 20 + week * 7);

  const dateStr = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    const dateStr = `May ${day.getDate()}`;

    return dateStr;
  });

  const value = Math.floor(Math.random() * 80) + 40;

  return [
    {
      date: dateStr,
      value: value,
    },
  ];
};

const periodOptions = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

interface EarningHistoryChartProps {
  className?: string;
}

const EarningHistoryChart: React.FC<EarningHistoryChartProps> = ({
  className,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [chartData, setChartData] = useState(generateWeekData(0));
  const [isPrev, setIsPrev] = useState(true);
  const [isNext, setIsNext] = useState(true);

  const handlePrevious = () => {
    const newWeek = currentWeek - 1;
    setCurrentWeek(newWeek);
    setChartData(generateWeekData(newWeek));
  };

  const handleNext = () => {
    const newWeek = currentWeek + 1;
    setCurrentWeek(newWeek);
    setChartData(generateWeekData(newWeek));
  };

  const handlePeriodChange = (e: { target: { value: string } }) => {
    setSelectedPeriod(e.target.value);
    // In a real application, we would fetch data for the selected period
    // For now, we'll just use the same weekly data
    setChartData(generateWeekData(currentWeek));
  };

  return (
    <div className={cn("w-full rounded-lg bg-background p-6", className)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-roboto font-bold">Earning history</h2>

        {/* <MobileDropdown
          options={periodOptions}
          handleDropdownChange={handlePeriodChange}
          selectedTab={selectedPeriod}
          className="border border-tertiary-text !bg-tertiary-bg font-roboto"
        /> */}
      </div>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="text-secondary-text font-roboto text-sm"
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#333"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888", fontSize: 12 }}
              domain={[0, 140]}
              ticks={[0, 20, 40, 60, 80, 100, 120, 140]}
            />
            <Bar
              dataKey="value"
              fill="#A076FF"
              radius={[20, 20, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={true}
          className="flex items-center disabled:text-[#424248] hover:text-white/90 text-white font-roboto text-sm"
        >
          <ChevronLeft
            className="h-5 w-5 mr-1"
            // color={isPrev ? "#4E52F5" : "#424248"}
            color="#424248"
          />
          PREV
        </button>

        <button
          onClick={handleNext}
          disabled={true}
          className="flex items-center disabled:text-[#424248] hover:text-white/90 text-white font-roboto text-sm"
        >
          NEXT
          <ChevronRight
            className="h-5 w-5 ml-1"
            // color={isNext ? "#4E52F5" : "#424248"}
            color="#424248"
          />
        </button>
      </div>
    </div>
  );
};

export default EarningHistoryChart;
