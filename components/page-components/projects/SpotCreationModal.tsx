"use client";
import { SpotCreationIllustration } from "@/components/icons/SpotCreationIllustration";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal, { ModalControls } from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import { useProjectStore } from "@/state/project";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";

interface SpotCreationProps extends ModalControls {
  hackathonId: string;
  submittedProjectUrl?: string | null;
  setSubmittedProjectUrl: Dispatch<SetStateAction<string | null>>;
}

const SpotCreationModal = (props: SpotCreationProps) => {
  const router = useRouter();
  const { setProjectCreation } = useProjectStore();
  const {
    isOpen,
    onClose,
    onOpen,
    submittedProjectUrl,
    hackathonId,
    setSubmittedProjectUrl,
  } = props;

  const closeModal = () => {
    setProjectCreation({
      hackathonName: "",
      projectUrl: submittedProjectUrl,
    });

    onClose();
  };

  const handleSubmitProject = async () => {
    try {
      const response = await axios.post(`/api/projects/bot`, {
        projectUrl: submittedProjectUrl,
        hackathonId,
      });

      router.push(`/en/projects/${response.data?.id}`);

      toast.success("Project Created Successfully", {
        position: "bottom-right",
        id: "project-creation-success-toast",
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error
          : `Could not Create Project ${error?.message}`;

      toast.error(errorMessage, {
        position: "bottom-right",
        id: "project-creation-error-toast",
        dismissible: true,
      });
    } finally {
      setSubmittedProjectUrl(null);
      setProjectCreation(null);
      onClose();
    }
    // TODO: Implement submission logic
  };

  useEffect(() => {
    if (submittedProjectUrl) {
      handleSubmitProject();
    }
  }, [submittedProjectUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GenericModal
      hasMinHeight={false}
      hasSidebar={false}
      controls={{
        isOpen,
        onClose: closeModal,
        onOpen,
      }}
    >
      <div className="-p-5">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold flex items-center gap-3">
            <Spinner size="medium" className="text-main-primary" />
            Spot’s cooking up your project page…
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 overflow-y-scroll">
          <div className="flex items-center gap-5 justify-between">
            <p className="font-normal leading-6 font-roboto md:w-[50%]">
              Give it up to 3 minutes, but it’s usually faster. You can dip —
              we’ll ping you when it’s live. Go hydrate or hack something cool.
            </p>

            <div className="hidden md:block">
              <SpotCreationIllustration />
            </div>
          </div>

          <div className="w-full gap-2 flex sm:justify-end justify-center mt-4">
            <Button
              autoFocus={false}
              onClick={closeModal}
              className="w-fit font-roboto text-sm gap-2 focus-visible:ring-0"
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default SpotCreationModal;
