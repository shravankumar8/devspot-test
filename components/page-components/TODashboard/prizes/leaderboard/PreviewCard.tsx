import {
  BronzeTrophyIcon,
  GoldTrophyIcon,
  SilverTrophyIcon,
} from "@/components/icons/TrophyIcon";
import {
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "@/components/page-components/projects/constants/bacakground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { LeaderboardEntry } from "./Preview";

interface PreviewCardProps {
  leadershipEntry: LeaderboardEntry;
  showComments?: boolean;
  showScore?: boolean;
  isPreview?: boolean;
}

const PreviewCard = ({
  leadershipEntry,
  showComments = true,
  showScore = true,
  isPreview = false,
}: PreviewCardProps): JSX.Element => {
  const router = useRouter();

  const getLogoSource = () => {
    if (!leadershipEntry?.project?.logo_url) return null;

    let selectedLogoIndex = LOGO_TEMPLATES.indexOf(
      leadershipEntry?.project?.logo_url
    );

    if (selectedLogoIndex >= 0) {
      return (
        <div
          className={`${cn(
            selectedLogoIndex % 2 == 0 ? "bg-[#13131a] " : "bg-[#E7E7E8]",
            "w-full h-full flex justify-center items-center"
          )}`}
        >
          <LogoPlaceholder index={selectedLogoIndex} />
        </div>
      );
    }

    return leadershipEntry?.project?.logo_url;
  };

  const logoSource = useMemo(getLogoSource, [getLogoSource]);

  const handleCardClick = () => {
    router.push(`/en/projects/${leadershipEntry.projectId}`);
  };

  const renderTrophyIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <GoldTrophyIcon />;
      case 2:
        return <SilverTrophyIcon />;
      case 3:
        return <BronzeTrophyIcon />;
      default:
        return null;
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "rounded-xl relative h-full min-w-[286px border-2 border-solid font-roboto flex flex-col overflow-hidden bg-primary-bg",
        "cursor-pointer",
        isPreview ? "border-tertiary-bg" : " sponsor-border"
      )}
    >
      <CardHeader className="flex flex-col justify-between items-end gap-3 space-y-0 bg-secondary-bg !px-4 !py-3 rounded-t-xl">
        <div className="flex items-end gap-3 w-full">
          <div className="flex-shrink-0 border-2 border-tertiary-bg rounded-[12px] w-[76px] min-w-[76px] h-[76px] overflow-hidden">
            {logoSource && typeof logoSource === "string" ? (
              <Image
                className="rounded-xl w-full h-full object-cover"
                src={logoSource || "/placeholder.svg"}
                alt="Project logo"
                width={76}
                height={76}
              />
            ) : (
              logoSource
            )}
          </div>

          <div className="flex flex-col items-start gap-0.5 w-full overflow-hidden">
            <p className="w-full font-medium text-white text-base truncate capitalize">
              {leadershipEntry.projectName}
            </p>

            <p className="w-full font-medium text-secondary-text text-sm truncate">
              {leadershipEntry.challengeName}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3 w-full h-[45px]">
          <div className="flex flex-1 items-center">
            {leadershipEntry?.project.project_team_members?.map(
              (member, index) => (
                <div
                  key={index}
                  style={{ zIndex: 3 - index }}
                  className={`relative w-[40px] h-[40px] ${
                    index > 0 ? "-ml-2" : "ml-[-1.00px]"
                  } border-0 border-none flex-shrink-0`}
                >
                  <Avatar className="-top-0.5 -left-0.5 absolute w-[40px] h-[40px]">
                    <AvatarImage
                      src={member?.users?.avatar_url ?? ""}
                      alt={member?.users?.full_name ?? ""}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(member?.users?.full_name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            {leadershipEntry.rank && renderTrophyIcon(leadershipEntry.rank)}
            <h6 className="font-roboto font-medium text-xs uppercase">
              {leadershipEntry.rank
                ? `${leadershipEntry.rank}${
                    leadershipEntry.rank === 1
                      ? "st"
                      : leadershipEntry.rank === 2
                      ? "nd"
                      : leadershipEntry.rank === 3
                      ? "rd"
                      : "th"
                  } place`
                : ""}
            </h6>
          </div>
        </div>
      </CardHeader>

      <Separator className="bg-tertiary-bg h-0.5" />

      <CardContent className="flex flex-col justify-between items-start gap-4 bg-primary-bg !p-4 ">
        {showComments && (
          <div className="h-[90px] overflow-y-scroll font-normal text-secondary-text text-sm line-clamp-8 leading-6">
            {leadershipEntry.comments || leadershipEntry.projectDescription}
          </div>
        )}

        {!showComments && !showScore && (
          <>
            <div className="h-[90px] overflow-y-scroll font-normal text-secondary-text text-sm line-clamp-8 leading-6">
              {leadershipEntry.projectDescription}
            </div>
            {/* 
            {leadershipEntry.project.technologies?.length > 0 && (
              <div className="flex gap-2 items-center w-full flex-wrap  mt-auto">
                {leadershipEntry.project.technologies.map((tech, index) => (
                  <>
                    <Badge
                      variant={"secondary"}
                      key={index}
                      className="text-xs"
                    >
                      {tech}
                    </Badge>
                  </>
                ))}
              </div>
            )} */}
          </>
        )}

        {(showComments || showScore) && (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage
                  src={
                    leadershipEntry.commentJudge?.avatar_url ??
                    "https://i.pravatar.cc/300"
                  }
                  alt={leadershipEntry.commentJudge?.name ?? "User"}
                  className="object-cover"
                />
                <AvatarFallback>
                  {leadershipEntry.commentJudge?.name
                    ?.split(" ")
                    .map((s) => s[0])
                    .join("") ?? "JD"}
                </AvatarFallback>
              </Avatar>
              <p className="font-roboto font-medium text-xs underline">
                {leadershipEntry.commentJudge?.name ?? "John Doe"}
              </p>
            </div>

            {showScore && (
              <Badge className="flex items-center gap-1 bg-gradient-to-r from-[#9667FA] to-[#4075FF] px-2 py-0 rounded-2xl h-7 !text-white bgb">
                {leadershipEntry.averageScore}/10
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {!showComments && !showScore && (
        <CardFooter className="pt-auto flex bg-primary-bg">
          {leadershipEntry.project.technologies?.length > 0 && (
            <div className="flex gap-2 items-center w-full flex-wrap  pt-auto">
              {leadershipEntry.project.technologies
                ?.slice(0, 4)
                ?.map((tech, index) => (
                  <Badge variant={"secondary"} key={index} className="text-xs">
                    {tech}
                  </Badge>
                ))}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PreviewCard;
