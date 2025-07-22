import { DevToken } from "@/components/icons/DevToken";
import { Project } from "@/components/icons/Project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/state";
import { Users } from "@/types/entities";
import { getInitials } from "@/utils/url-validator";
import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import MoreSkillsTooltip from "../../MoreSkillsTooltip";

type PeopleCardProps = {
  participant: Users;
  showTeamUp?: boolean;
  hackathonId?: number;
};

const PeopleCard = (props: PeopleCardProps): JSX.Element => {
  const { user } = useAuthStore();
  const { participant, showTeamUp } = props;
  const [teamingUp, setTeamingUp] = useState(false);

  const participantExperiences = useMemo(() => {
    const technology = participant?.profile?.skills?.technology;
    const experience = participant?.profile?.skills?.experience;

    if (technology && Boolean(technology.length)) return technology;

    if (experience && Boolean(experience.length)) return experience;

    return [];
  }, [participant]);

  const isTeamupActive = useMemo(() => {
    return showTeamUp && user?.id && user?.id !== participant.id;
  }, [user, showTeamUp]);

  const {
    data: teamUpData,
    error,
    mutate,
  } = useSWR(
    isTeamupActive
      ? `/api/hackathons/${props?.hackathonId}/participants/${participant.id}/team-up/status`
      : null,
    (url: string) => axios.get(url).then((res) => res.data)
  );

  const handleTeamUpWithUser = async () => {
    if (!showTeamUp) return;
    setTeamingUp(true);

    try {
      const response = await axios.post(
        `/api/hackathons/${props?.hackathonId}/participants/${participant.id}/team-up`
      );

      if (!response) throw new Error("Could not Team up with Participant");

      toast.success("Team up Notification Sent Successfully!");
      mutate();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Team up with Participant: ${error?.response?.data?.error}`
        );
        return;
      }
      toast.error(`Could not Team up with Participant`);
    } finally {
      setTeamingUp(false);
    }
  };

  const getUserPrimaryRole = () => {
    if (!participant?.roles) return null;

    const primaryRole = participant?.roles?.find((role) => role?.is_primary);

    return primaryRole?.participant_roles.name;
  };

  const userPrimaryRole = getUserPrimaryRole();

  const project_count = participant?.project_count ?? 0;

  return (
    <Card className="flex font-roboto flex-col rounded-xl min-h-[186px] min-w-[286px] border-2 border-solid border-[#2b2b31] cursor-pointer h-full">
      <div className="flex items-center gap-3 px-4 py-3 bg-secondary-bg h-24 rounded-t-xl">
        <Avatar className="w-[72px] h-[72px] border-2 border-tertiary-bg rounded-full">
          <AvatarImage
            src={participant?.avatar_url ?? "/default-profile.png"}
            alt={participant?.full_name!}
            className="z-0 object-cover"
          />
          <AvatarFallback>
            {participant?.full_name && getInitials(participant?.full_name!)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start gap-1 w-full">
          <p className="text-white text-base font-medium truncate max-w-[80%] capitalize">
            {participant?.full_name}
          </p>

          <p className="text-secondary-text text-xs font-medium capitalize">
            {participant?.main_role ?? userPrimaryRole}
          </p>

          <p className="text-secondary-text text-xs font-meduim truncate max-w-[70%]">
            {participant?.profile?.location}
          </p>
        </div>
      </div>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col items-start gap-3 !px-4 !py-3 bg-primary-bg justify-between rounded-b-xl flex-grow">
        <div className="flex items-center gap-1 flex-wrap w-full">
          {participantExperiences.slice(0, 2).map((skill, index) => (
            <Badge
              key={index}
              className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl"
            >
              <span className="font-normal text-xs text-neutral-100">
                {skill}
              </span>
            </Badge>
          ))}

          {participantExperiences.length > 2 && (
            <MoreSkillsTooltip
              additionalSkills={participantExperiences?.slice(2)}
              count={participantExperiences?.length - 2}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-end justify-between self-stretch w-full">
          <div className="flex items-center gap-1">
            <Badge className="h-6 px-2 py-1 !bg-primary-900 rounded-2xl !border-none !outline-none">
              <DevToken width="16px" height="16px" />
              <span className="text-primary-300 font-medium text-xs">
                {participant?.profile?.token_balance}
              </span>
            </Badge>

            {project_count ? (
              <Badge className="h-6 px-2 py-0 gap-1 !bg-secondary-900 rounded-2xl !border-none !outline-none">
                <Project width="16px" height="16px" />
                <span className="text-secondary-400 font-normal text-xs">
                  {project_count} {project_count > 1 ? "projects" : "project"}
                </span>
              </Badge>
            ) : (
              ""
            )}
          </div>

          {isTeamupActive && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTeamUpWithUser();
              }}
              size="xs"
              disabled={teamUpData || teamingUp || error}
              className="flex items-center gap-2"
            >
              {teamingUp && <Spinner size="tiny" />}{" "}
              {!teamUpData ? "Team up" : "Request Sent"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeopleCard;
