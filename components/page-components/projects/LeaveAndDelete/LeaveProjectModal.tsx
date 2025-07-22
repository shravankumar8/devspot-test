import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useAuthStore } from "@/state";
import { Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import useIsProjectManager from "../useIsProjectManager";

interface LeaveProjectModalProps {
  project: Projects;
}

const LeaveProjectModal = (props: LeaveProjectModalProps) => {
  const { project } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { user } = useAuthStore();
  const is_project_manager = useIsProjectManager(project);
  const [leavingProject, setLeavingProject] = useState(false);
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const getNextMember = project.project_team_members.find(
    (member) => member.user_id !== user?.id
  );

  const handleLeaveProject = async () => {
    setLeavingProject(true);

    try {
      await axios.post(`/api/projects/${project?.id}/leave-project`, {});

      mutate(`/api/projects/${project?.id}`);
      mutate(`/api/people/${user?.id}/projects`);

      toast.success("Left Project Successfully", {
        position: "top-right",
      });
      router.back();
    } catch (error: any) {
      console.log("Error leaving Project:", error);

      setLeavingProject(false);

      if (error instanceof AxiosError) {
        toast.error(`Could not Leave Project ${error?.response?.data?.error}`, {
          position: "top-right",
        });

        return;
      }

      toast.error(`Could not Leave Project ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setLeavingProject(false);
    }
  };

  return (
    <GenericModal
      hasMinHeight={false}
      hasSidebar={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <button className="text-xs text-[#C81E17] hover:text-red-400 transition-colors flex items-center gap-3">
          <LogOut color="#C81E17" size={20} />
          Leave project
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] pt-2 pb-5">
        <DialogTitle className="!text-[24px] font-semibold font-roboto">
          Are you sure you want to leave this project?
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 ">
        <p className="font-roboto font-medium">
          {is_project_manager 
            ? `${getNextMember?.users?.full_name} will replace you as the Project Manager. You won’t be able to access this project anymore unless someone adds you.`
            : "You won’t be able to access this project anymore unless someone adds you."}
        </p>

        <div className="w-full flex sm:justify-end justify-center gap-6">
          <Button
            variant="secondary"
            disabled={leavingProject}
            onClick={onClose}
            className="gap-2 font-roboto text-base"
          >
            Cancel
          </Button>

          <Button
            className="font-roboto text-base gap-2"
            disabled={leavingProject}
            onClick={handleLeaveProject}
          >
            {leavingProject && <Spinner size="small" />} Leave Project
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default LeaveProjectModal;
