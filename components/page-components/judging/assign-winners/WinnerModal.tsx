import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

interface SubmitModalProps {
  judgingId: string;
  challengeName: string;
  submissionStatus: { status: boolean | "view-winners" };
  submittedWinners: boolean;
  selections: {
    [prizeId: number]: {
      projectId: number;
      challengeId: number;
      judgingId: string;
      prizeId: number;
    };
  };
}

const WinnerModal = ({
  judgingId,
  selections,
  challengeName,
  submittedWinners,
  submissionStatus,
}: SubmitModalProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const { mutate } = useSWRConfig();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    console.log(selections);
    const winners = Object.values(selections).map((entry) => ({
      challenge_id: entry.challengeId,
      project_id: entry.projectId,
      prize_id: entry.prizeId,
    }));
    console.log(winners);


    try {
      const res = await fetch(
        `/api/judgings/${judgingId}/assign-winner/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ winners }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Something went wrong");
      }

      mutate(`/api/judgings/${judgingId}/assign-winner/get-challenges`);

      toast.success("Winners submitted successfully.", {
        position: "top-right",
      });

      onClose();
    } catch (error: any) {
      console.error("Error submitting winners:", error);
      toast.error(`Could not submit winners: ${error.message}`, {
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
      trigger={
        <Button disabled={submittedWinners} size="sm">
          {submittedWinners ? "Winners submitted" : "Submit Winners"}
          <CheckCircle className="ml-2" size={20} />
        </Button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[22px] font-semibold font-roboto">
          Are you sure you’re ready to submit winners for {challengeName}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-5 overflow-y-scroll pb-5 mt-5">
        <p className="text-white font-roboto">
          The organizer of this hackathon will now receive your prize
          allocations. You won’t be able to modify your prize allocation,
          although the hackathon organizer will have the ability to do so.
        </p>
      </div>

      <div className="w-full flex sm:justify-end justify-center mt-4 gap-6">
        <Button
          type="button"
          size="md"
          className="w-fit font-roboto text-sm gap-2"
          disabled={submitting}
          onClick={onClose}
          variant={"secondary"}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="md"
          className="w-fit font-roboto text-sm gap-2"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting && <Spinner size="small" />} Submit
        </Button>
      </div>
    </GenericModal>
  );
};

export default WinnerModal;
