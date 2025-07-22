import {
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "@/components/page-components/projects/constants/bacakground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/state";
import { Projects } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import MoreSkillsTooltip from "../../MoreSkillsTooltip";
import ProjectBadge from "./ProjectBadge";

// Inside your component:

interface ProjectCardProps {
  props: Projects;
  builtWith?: string[];
  judgingStatus?: "needs_review" | "judged" | "flagged";
  score?: number;
  botScore?: number | null;
  showBadge?: boolean;
}

const ProjectCard = ({
  props,
  builtWith,
  judgingStatus,
  score,
  botScore,
  showBadge = false,
}: ProjectCardProps): JSX.Element => {
  // Project data

  const technologies = props.technologies ?? [];
  const { session } = useAuthStore();


  const getLogoSource = () => {
    if (!props?.logo_url) return null;

    let selectedLogoIndex = LOGO_TEMPLATES.indexOf(props.logo_url);

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

    return props.logo_url;
  };

  const logoSource = useMemo(getLogoSource, [getLogoSource]);

  const router = useRouter();

  const handleCardClick = () => {
    if (judgingStatus) return;

    if (!props.submitted && !props.is_owner) return;

    router.push(`/en/projects/${props?.id}`);
  };

  const handleTeamUpProject = () => {};

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "rounded-xl relative min-w-[286px] border-2 border-solid border-[#2b2b31] font-roboto flex flex-col",
        props.submitted || props.is_owner ? "cursor-pointer" : ""
      )}
    >
      <CardHeader className="flex flex-col items-end justify-between space-y-0 gap-3 !py-3 !px-4 rounded-t-xl bg-secondary-bg">
        <div className="flex items-end gap-3 w-full">
          <div className="min-w-[76px] w-[76px] h-[76px] rounded-[12px] overflow-hidden border-2 border-tertiary-bg flex-shrink-0">
            {logoSource &&
              (typeof logoSource === "string" ? (
                <Image
                  className="rounded-xl w-full h-full object-cover"
                  src={logoSource || "/placeholder.svg"}
                  alt="Project logo"
                  width={76}
                  height={76}
                />
              ) : (
                logoSource
              ))}
          </div>

          <div className="flex flex-col items-start gap-0.5 overflow-hidden w-full">
            {showBadge && props.submitted && (
              <div className="flex self-end justify-end">
                <ProjectBadge judgingStatus={judgingStatus} score={score} botScore={botScore}/>
              </div>
            )}

            <p className="text-white text-base font-medium capitalize truncate w-full">
              {props?.name}
            </p>

            {judgingStatus && props?.project_challenge && (
              <p className="text-secondary-text text-sm font-medium truncate w-full">
                {props?.project_challenge?.hackathon_challenges?.challenge_name}
              </p>
            )}

            {!judgingStatus && (
              <>
                <p className="text-secondary-text text-sm font-medium truncate w-full">
                  {props?.hackathons?.name}
                </p>

                <p className="text-secondary-text text-sm font-medium truncate w-full">
                  By {props?.hackathons?.organizer?.name}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full h-[45px]">
          <div className="flex items-center flex-1">
            {props?.project_team_members?.slice(0, 3).map((member, index) => (
              <div
                key={index}
                style={{ zIndex: 3 - index }}
                className={`relative w-[40px] h-[40px] ${
                  index > 0 ? "-ml-2" : "ml-[-1.00px]"
                } border-0 border-none flex-shrink-0`}
              >
                <Avatar className="absolute w-[40px] h-[40px] -top-0.5 -left-0.5">
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
            ))}

            {props?.project_team_members.length > 3 && (
              <div className="flex-col w-[40px] h-[40px] items-center justify-center p-2.5 -ml-2 z-0 bg-primary-bg rounded-full border-[2.5px] border-solid border-[#13131a] flex flex-shrink-0">
                <div className="text-secondary-text text-lg font-semibold">
                  +{props?.project_team_members.length - 3}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col items-start justify-between !p-4 bg-primary-bg gap-4 rounded-b-xl">
        <div
          className="text-secondary-text text-sm font-normal leading-6 line-clamp-[8] h-[140px] whitespace-normal"
          style={{
            wordBreak: "break-all",
            wordWrap: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {props?.description ?? `Project for ${props?.hackathons?.name}.`}
        </div>

        <div className="flex items-center gap-3 w-[98%] overflow-x-auto scrollbar-hide">
          {technologies.slice(0, 3).map((tech, index) => (
            <Badge
              key={index}
              className={cn(
                "h-7 px-2 py-0 rounded-2xl",
                `${
                  builtWith?.includes(tech)
                    ? "!bg-gradient-to-tr from-[#4075FF] to-[#9667FA]"
                    : "!bg-[#2B2B31] "
                }`
              )}
            >
              <span className="font-normal text-sm text-neutral-100 whitespace-nowrap">
                {tech}
              </span>
            </Badge>
          ))}

          {technologies.length > 3 && (
            <MoreSkillsTooltip
              additionalSkills={technologies.slice(3)}
              count={technologies.length - 3}
            />
          )}
        </div>
      </CardContent>

      {!props?.submitted && !props?.is_owner && (
        <div className="absolute inset-0 bg-[#13131A] bg-opacity-60 rounded-xl pointer-events-none" />
      )}

      {props?.accepting_participants &&
        !props?.is_owner &&
        session &&
        !props.submitted &&
        !judgingStatus && (
          <Button
            size="xs"
            className="flex items-center gap-2 absolute top-[109px] right-4  z-10"
          >
            Team up
          </Button>
        )}
    </Card>
  );
};

export default ProjectCard;
