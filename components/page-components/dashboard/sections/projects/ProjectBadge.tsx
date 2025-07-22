import { Badge } from "@/components/ui/badge";

const ProjectBadge = ({
  judgingStatus,
  score,
  botScore
}: {
  judgingStatus?: "needs_review" | "judged" | "flagged";
  score?: number;
  botScore?: number | null;
}): JSX.Element => {
  if (judgingStatus === "flagged") {
    return (
      <Badge
        variant={"destructive"}
        className="flex items-center gap-1  px-2 py-0 rounded-2xl h-7"
      >
        Flagged
      </Badge>
    );
  }

  if (judgingStatus === "judged") {
    return (
      <Badge className="flex items-center gap-1 bgb px-2 py-0 bg-gradient-to-r from-[#9667FA] to-[#4075FF] !text-white rounded-2xl h-7">
        Judged {score && `${score}/10`}
      </Badge>
    );
  }

  return (
    <Badge className="flex items-center gap-1 !bg-[#6E5B1B] px-2 py-0 rounded-2xl h-7">
      <span className="font-roboto font-medium text-[#EFC210] text-xs truncate whitespace-nowrap overflow-hidden">
        Needs Review {botScore && `${botScore}/10`}
      </span>
    </Badge>
  );
};

export default ProjectBadge;
