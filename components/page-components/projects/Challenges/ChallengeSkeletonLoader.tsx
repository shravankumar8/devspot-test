import { Separator } from "@/components/ui/separator";

export const ChallengeSectionSkeleton = () => {
  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-4">
      {/* Hackathon title section */}
      <div className="flex flex-col gap-1 items-start">
        <div className="flex items-center justify-between w-full">
          <div className="h-5 bg-gray-700/50 rounded-md w-24 animate-pulse" />
          {/* Edit button placeholder */}
          <div className="h-8 w-8 bg-gray-700/50 rounded-full animate-pulse" />
        </div>

        {/* Hackathon link placeholder */}
        <div className="h-4 bg-gray-700/50 rounded-md w-40 mt-1 animate-pulse" />
      </div>

      {/* Challenges section */}
      <div className="flex flex-col gap-1 items-start">
        <div className="h-5 bg-gray-700/50 rounded-md w-28 mb-1 animate-pulse" />

        <div className="flex flex-wrap gap-2">
          {/* Challenge links placeholders */}
          <div className="h-4 bg-gray-700/50 rounded-md w-32 animate-pulse" />
          <div className="h-4 bg-gray-700/50 rounded-md w-24 animate-pulse" />
          <div className="h-4 bg-gray-700/50 rounded-md w-28 animate-pulse" />
        </div>
      </div>

      <Separator className="h-0.5 bg-[#2B2B31]" />

      {/* Created date section */}
      <div className="flex items-center gap-2">
        {/* Calendar icon placeholder */}
        <div className="h-4 w-4 bg-gray-700/50 rounded-md animate-pulse" />
        {/* Date text placeholder */}
        <div className="h-4 bg-gray-700/50 rounded-md w-36 animate-pulse" />
      </div>
    </div>
  );
};
