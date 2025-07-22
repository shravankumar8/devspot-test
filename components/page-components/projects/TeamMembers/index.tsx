import { Switch } from "@/components/ui/switch";
import { Projects } from "@/types/entities";
import EditProfileIcon from "../../profile/EditProfileIcon";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import EditProjectTeamMembersModal from "./EditProjectTeamMembersModal";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import { toast } from "sonner";

interface TeamMembersSectionProps {
  project: Projects;
  isOwner: boolean;
}

export const TeamMembersSection = ({ project, isOwner }: TeamMembersSectionProps) => {
  const { mutate } = useSWRConfig();
  const [switchLoader, setSwitchLoader] = useState(false)

  if (!Boolean(project.project_team_members.length)) return null;

  const toggleSwitch = async () => {
    setSwitchLoader(true);
    try {
      await axios.patch(`/api/projects/${project?.id}`, {
        accepting_participants: !project.accepting_participants
      });

      mutate(`/api/projects/${project?.id}`);

    } catch (error: any) {
      console.log("Error updating Looking for Team mates:", error);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Update Looking for Team mates ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );

        return;
      }

      toast.error(
        `Could not Update Looking for Team mates  ${error?.message}`,
        {
          position: "top-right",
        }
      );
    } finally {
      setTimeout(() => {
        setSwitchLoader(false);
      }, 1500);
    }
  };
  const teamMembers = project?.project_team_members?.filter((member) => member.status == 'confirmed')
  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Team members</h1>
        {isOwner && <EditProjectTeamMembersModal project={project} />}
      </div>

      {isOwner && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            {switchLoader ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4075FF] rounded-full animate-spin"></div>
            ) : (
              <Switch
                checked={project.accepting_participants}
                onClick={toggleSwitch}
              />
            )}
            <p className="text-xs text-white">I'm looking for team members</p>
          </div>

          <p className="text-secondary-text text-xs">
            Let other participants know that they can send you a request to team
            up.{" "}
            <Link href={`/en/hackathons/${project?.hackathon_id}`}>
              Browse participants
            </Link>{" "}
            to find team members.
          </p>
        </div>
      )}

      <Separator className="h-0.5 bg-[#2B2B31]" />

      {teamMembers.map((member) => (
        <div key={member.id} className="flex items-center gap-4">
          <Avatar className="w-8 h-8 bg-black">
            <AvatarImage
              src={member.users?.avatar_url || "/default-profile.png"}
              alt={member.users?.full_name ?? ""}
              className="object-contain"
            />
          </Avatar>

          <div>
            <h3 className="text-base font-medium text-white">
              {member.users?.full_name}
            </h3>
            <p className="text-xs text-gray-400">{member.users?.main_role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
