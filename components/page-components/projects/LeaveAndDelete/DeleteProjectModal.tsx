import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

interface DeleteProjectModalProps {
  project: Projects;
}

const DeleteProjectModal = (props: DeleteProjectModalProps) => {
  const { project } = props;
  const { mutate } = useSWRConfig();
  const router = useRouter()
  const [deletingProject, setDeletingProject] = useState(false);
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const handleDeleteProject = async () => {
    setDeletingProject(true);

    try {
      await axios.delete(`/api/projects/${project?.id}`);

      mutate(`/api/projects/${project?.id}`);

      toast.success("Deleted Project Successfully", {
        position: "top-right",
      });
      router.back()
    } catch (error: any) {
      console.log("Error deleting Project:", error);

      setDeletingProject(false);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Delete Project ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );

        return;
      }

      toast.error(`Could not Delete Project ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setDeletingProject(false);
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
          <Trash2 color="#C81E17" size={20} />
          Delete project
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] pt-2 pb-5">
        <DialogTitle className="!text-[24px] font-semibold font-roboto">
          Are you sure you want to delete this project?
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 font-roboto">
        <p>
          This is permanent. No one will be able to access this project anymore.
        </p>

        <div className="w-full flex sm:justify-end justify-center gap-6">
          <Button
            variant="secondary"
            disabled={deletingProject}
            onClick={onClose}
            className="gap-2 font-roboto text-base"
          >
            Cancel
          </Button>

          <Button
            className="font-roboto text-base gap-2"
            disabled={deletingProject}
            onClick={handleDeleteProject}
          >
            {deletingProject && <Spinner size="small" />} Delete Project
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default DeleteProjectModal;
