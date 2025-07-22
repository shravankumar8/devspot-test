import { Separator } from "@/components/ui/separator";

export const TeamMembersSectionSkeleton = ({
  isOwner = false,
}: {
  isOwner?: boolean;
}) => {
  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-4">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-700/50 rounded-md w-32 animate-pulse" />
        {isOwner && (
          <div className="h-8 w-8 bg-gray-700/50 rounded-full animate-pulse" />
        )}
      </div>

      {/* Looking for team members section (only for owners) */}
      {isOwner && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            {/* Switch placeholder */}
            <div className="h-5 w-10 bg-gray-700/50 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-700/50 rounded-md w-48 animate-pulse" />
          </div>

          {/* Description text placeholder */}
          <div className="h-4 bg-gray-700/50 rounded-md w-full mt-1 animate-pulse" />
          <div className="h-4 bg-gray-700/50 rounded-md w-3/4 mt-1 animate-pulse" />
        </div>
      )}

      <Separator className="h-0.5 bg-[#2B2B31]" />

      {/* Team members list - showing 3 placeholder members */}
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 bg-gray-700/50 rounded-full animate-pulse" />

          <div className="flex flex-col gap-1">
            {/* Name placeholder */}
            <div className="h-5 bg-gray-700/50 rounded-md w-32 animate-pulse" />
            {/* Role placeholder */}
            <div className="h-3 bg-gray-700/50 rounded-md w-24 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
