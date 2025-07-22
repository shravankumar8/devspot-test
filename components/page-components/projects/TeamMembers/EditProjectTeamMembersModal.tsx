import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";

import Label from "@/components/common/form/label";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects, Users } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";
import { TeamMembers } from "./TeamMembers";
import UsersDropdown from "./UsersDropdown";
import { isTeamDirty } from "./isDirty";

interface EditProjectTeamMembersModalProps {
  project: Projects;
}

export interface TeamMemberFormPayload {
  user_data: Users;
  is_project_manager: boolean;
  is_new: boolean;
  is_deleted: boolean;
}

const EditProjectTeamMembersModal = (
  props: EditProjectTeamMembersModalProps
) => {
  const { project } = props;
  const { mutate } = useSWRConfig();
  const [teamMembers, setTeamMembers] = useState<TeamMemberFormPayload[]>([]);

  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const [submitting, setSubmitting] = useState(false);

  const isDirty = useMemo(
    () => isTeamDirty(project.project_team_members ?? [], teamMembers),
    [project.project_team_members, teamMembers]
  );

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = teamMembers.map(({ user_data, ...member }) => {
        return {
          ...member,
          user_id: user_data.id,
        };
      });

      await axios.patch(`/api/projects/${project?.id}/team`, payload);

      mutate(`/api/projects/${project?.id}`);

      toast.success("Updated Project Team Successfully", {
        position: "top-right",
      });

      onClose();
    } catch (error: any) {
      console.log("Error updating Project Team:", error);

      setSubmitting(false);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Update Project Team ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );

        return;
      }

      toast.error(`Could not Update Project Team  ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const members: TeamMemberFormPayload[] = project?.project_team_members?.map(
      (item) => {
        return {
          user_data: item.users,
          is_deleted: false,
          is_new: false,
          is_project_manager: item.is_project_manager,
        };
      }
    );

    setTeamMembers(members);
  }, [project.project_team_members]);

  const handleAddUser = (user: Users) => {
    setTeamMembers((prev) => [
      ...prev,
      {
        user_data: user,
        is_deleted: false,
        is_new: true,
        is_project_manager: false,
      },
    ]);
  };

  const handleDeleteExistingUser = (user: Users) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.user_data.id === user.id
          ? { ...member, is_deleted: true }
          : member
      )
    );
  };

  const updateProjectManagerStatus = (user: Users) => {
    setTeamMembers((prev) =>
      prev.map((member) => ({
        ...member,
        is_project_manager: member.user_data.id === user.id,
      }))
    );
  };
  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit Team Members
        </DialogTitle>
      </DialogHeader>

      <form className="flex flex-col h-full">
        <div className="flex flex-col gap-5 overflow-y-scroll pb-5">
          <div className="flex w-full flex-col gap-3">
            <Label>
              Looking for anyone who doesn’t have a team yet? Browse{" "}
              {project?.hackathons?.name}’s participants to send them a team-up
              invite.
            </Label>
            <Link href={`/en/hackathons/${project?.hackathon_id}`}>
              <Button
                className="flex gap-2 items-center h-[36px] w-[210px] font-medium text-white text-sm"
                variant="ghost"
              >
                Browse Participants
                <ExternalLink size={16} className="text-white" />
              </Button>
            </Link>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Label>Already know who you want to team up with?</Label>

            {project?.hackathons?.team_limit && (
              <p className="flex gap-3 items-center text-white text-sm font-medium">
                The max number of participants per team is{" "}
                {project?.hackathons?.team_limit}. You can add{" "}
                {project?.hackathons?.team_limit -
                  project?.project_team_members?.length}{" "}
                people.
              </p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 w-full items-start md:h-[300px] overflow-y-scroll">
              <aside className="lg:col-span-3 bg-primary-bg h-full p-3 rounded-[12px]">
                <UsersDropdown
                  teamMembers={teamMembers}
                  handleAddUser={handleAddUser}
                  hackathon_id={project?.hackathon_id}
                />
              </aside>

              <section className="lg:col-span-7 flex flex-col gap-3 p-3 bg-primary-bg h-full rounded-[12px]">
                <TeamMembers
                  handleDeleteExistingUser={handleDeleteExistingUser}
                  updateProjectManagerStatus={updateProjectManagerStatus}
                  teamMembers={teamMembers}
                  project={project}
                />
              </section>
            </div>
          </div>
        </div>

        <div className="w-full flex sm:justify-end justify-center my-4">
          <Button
            type="submit"
            className="w-fit font-roboto text-sm gap-2"
            disabled={submitting || !isDirty}
            onClick={handleSubmit}
          >
            {submitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};

export default EditProjectTeamMembersModal;
