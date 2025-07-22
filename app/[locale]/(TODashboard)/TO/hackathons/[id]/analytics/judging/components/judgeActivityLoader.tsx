import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export default function ActivityLoader() {
  return (
    <div className="font-roboto">
      {/* Stats Cards Skeleton */}
      <div className="overflow-x-scroll mb-6">
        <div className="w-full flex gap-6 min-w-[900px]">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="p-5 h-full w-full gradient-border !rounded-2xl flex flex-col justify-center gap-1"
            >
              <div className="flex gap-2 items-center text-secondary-text">
                <Info width="24px" height="24px" className="animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-12 mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Latest Judging Activity Skeleton */}
        <Card className="bg-secondary-bg border-tertiary-bg p-5 h-[330px] !rounded-2xl overflow-y-scroll overflow-x-hidden">
          <CardHeader className="!p-0">
            <CardTitle className="text-white text-base font-medium">
              Latest Judging Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 !p-0">
            {/* Date Group Skeleton */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-400 rounded w-16 mt-3 animate-pulse"></div>

              {/* Activity Items Skeleton */}
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {/* Judge Image Skeleton */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>

                    {/* Project Image and Name Skeleton */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-6 h-6 rounded bg-gray-300 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                    </div>

                    {/* Challenge Badge Skeleton */}
                    <div className="flex items-center gap-1 bg-transparent rounded-full border-white border px-3 py-1">
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                    </div>

                    {/* Score Badge Skeleton */}
                    <div className="bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white text-xs font-normal px-3 py-1 rounded-full">
                      <div className="h-3 bg-white/30 rounded w-8 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring Chart Skeleton */}
        <Card className="bg-secondary-bg border-tertiary-bg p-5 h-[330px] rounded-2xl">
          <CardHeader className="!p-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base font-medium">
                Scoring
              </CardTitle>
              <div className="flex gap-2">
                {[...Array(3)].map((_, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-transparent !border-white text-white"
                  >
                    <div className="h-3 bg-white/30 rounded w-12 animate-pulse"></div>
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="!p-0">
            {/* Chart Skeleton */}
            <div className="h-[240px] flex items-end justify-center gap-2 px-4 py-8">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-[#4075FF] to-[#9667FA] rounded-t-full animate-pulse"
                  style={{
                    width: "12px",
                    height: `${Math.random() * 150 + 20}px`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Chart Labels Skeleton */}
            <div className="flex justify-between px-4 mb-2">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="h-2 bg-gray-400 rounded w-2 animate-pulse"
                ></div>
              ))}
            </div>

            <div className="text-center mt-2">
              <span className="text-secondary-text text-sm">SCORE</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
