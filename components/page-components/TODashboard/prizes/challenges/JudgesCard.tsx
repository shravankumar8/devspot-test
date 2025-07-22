import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { JudgePrizes } from "@/types/techowners";
import { getInitials } from "@/utils/url-validator";
import { CrownIcon } from "lucide-react";
import CircularProgress from "./CircularProgress";

interface JudgeCardProps {
  judgeData: JudgePrizes;
  bgColor: string;
  isLast: boolean;
}

export const JudgeCard = ({ judgeData, bgColor, isLast }: JudgeCardProps) => {
  return (
    <div
      className={`col-span-1 flex flex-col font-roboto gap-1 justify-center p-3 border-none  flex-1 min-w-[250px] z-0 relative
          ${bgColor === "primary" ? "bg-primary-bg" : "bg-secondary-bg"}
          ${isLast ? "rounded-tr-2xl rounded-br-2xl" : ""}`}
    >
      <div className="flex items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={judgeData?.avatar_url}
            className="w-full object-cover"
            alt={judgeData?.name}
          />
          <AvatarFallback>
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
              {getInitials(judgeData.name)}
            </div>
          </AvatarFallback>
        </Avatar>
        <h3 className="mr-2 ml-3 font-semibold text-base">{judgeData?.name}</h3>
        {judgeData?.is_prize_allocator && (
          <CrownIcon className="stroke-yellow-400" size={24} />
        )}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <CircularProgress percentage={judgeData?.progress_percentage} />
        <Badge variant={"secondary"}>{judgeData?.status}</Badge>
      </div>
    </div>
  );
};
