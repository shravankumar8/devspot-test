import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface SubmitModalProps {
  judgingId: string;
}

const SubmitModal = ({ judgingId }: SubmitModalProps) => {
  const {
    closeModal: onClose,
    isOpen,
    openModal: onOpen,
  } = UseModal("submit-judging");

  const [submitting, setSubmitting] = useState(false);

  //   Todo: Implement submit feature
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await fetch(`/api/judgings/${judgingId}/submit`, {
        method: "POST",
      });

      toast.success("Scores submitted successfully.", {
        position: "top-right",
      });

      onClose();
    } catch (error: any) {
      console.error("Error submitting scores:", error);
      setSubmitting(false);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not submit scores: ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );
        return;
      }

      toast.error(`Could not submit scores: ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GenericModal
      hasSidebar={false}
      hasMinHeight={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Are you sure you’re ready to submit?
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-5 overflow-y-scroll pb-5 mt-5">
        <p className="text-white">
          You won’t be able to edit your scores after you click submit.
        </p>
      </div>

      <div className="w-full flex sm:justify-end justify-center mt-4 gap-6">
        <Button
          type="button"
          className="w-fit font-roboto text-sm gap-2"
          disabled={submitting}
          onClick={onClose}
          variant={"secondary"}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-fit font-roboto text-sm gap-2"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting && <Spinner size="small" />} Confirm
        </Button>
      </div>
    </GenericModal>
  );
};

export default SubmitModal;
