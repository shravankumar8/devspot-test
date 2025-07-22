import { CalendarSvg } from "@/components/icons/Calendar";
import { Separator } from "@/components/ui/separator";
import { Projects } from "@/types/entities";
import Link from "next/link";
import EditChallengeModal from "./EditChallengeModal";

interface ChallengeSectionProps {
  project: Projects;
  isOwner: boolean;
}

export const ChallengeSection = ({
  project,
  isOwner,
}: ChallengeSectionProps) => {
  function formatCreatedDate(dateStr: string): string {
    const trimmedDateStr = dateStr.split(".")[0];

    const date = new Date(trimmedDateStr);
    if (isNaN(date.getTime())) return dateStr;

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    return `${formattedDate}`;
  }

  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-4">
      <div className="flex flex-col gap-1 items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-base font-semibold text-white">Hackathon</h1>
          {isOwner && <EditChallengeModal project={project} />}
        </div>

        <Link
          href={`/hackathons/${project?.hackathon_id}`}
          className="text-sm text-secondary-text underline capitalize"
        >
          {project.hackathons?.name}
        </Link>
      </div>

      {project?.project_challenges && project?.project_challenges.length ? (
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-base font-semibold text-white mb-1 ">
            Challenge(s)
          </h1>

          <div className="flex flex-wrap gap-1">
            {project.project_challenges.map((challenge, index) => {
              const sponsorName =
                // @ts-ignore
                challenge?.hackathon_challenges?.sponsors[0]?.name;
              const sponsorValue = sponsorName
                ?.toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <>
                  {challenge.hackathon_challenges && (
                    <Link
                      href={`/hackathons/${project?.hackathon_id}?challenge=${sponsorValue}`}
                      key={index}
                      className="text-sm text-secondary-text underline"
                    >
                      {challenge?.hackathon_challenges.challenge_name},
                    </Link>
                  )}
                </>
              );
            })}
          </div>
        </div>
      ) : null}

      <Separator className="h-0.5 bg-[#2B2B31]" />

      <div className="flex items-center gap-2">
        <CalendarSvg />
        <p className="text-secondary-text text-xs font-medium">{`Created ${formatCreatedDate(
          project.created_at
        )}`}</p>
      </div>
    </div>
  );
};
