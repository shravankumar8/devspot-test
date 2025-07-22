"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

const options = [
  "This project does not follow the submission requirements",
  "This project includes something inappropriate",
  "This project looks like spam",
  "Other",
];

const FlagModal = ({
  judgingId,
  projectId,
  challengeId,
}: {
  judgingId: number | null;
  projectId: number;
  challengeId: number | null;
}) => {
  const {
    closeModal: onClose,
    isOpen,
    openModal: onOpen,
  } = UseModal("flag-project");

  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [flagComments, setFlagComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleChange = (label: string, checked: boolean) => {
    setSelectedReasons((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handleSubmit = async () => {
    if (!judgingId || !projectId) return toast.error("Invalid Judging State");

    if (selectedReasons.length === 0) {
      return toast.error("Please select at least one reason.");
    }

    setSubmitting(true);
    try {
      await axios.post(
        `/api/judgings/${judgingId}/projects/${projectId}/flag`,
        {
          challenge_id: challengeId,
          flag_reason: selectedReasons.join(", "),
          flag_comments: flagComments.trim() || undefined,
        }
      );

      toast.success("Project successfully flagged.", {
        position: "top-right",
      });
      mutate(
        `/api/judgings/${judgingId}/projects/${projectId}?challengeId=${challengeId}`
      );

      onClose();
    } catch (error: any) {
      console.error("Error flagging project:", error);
      toast.error(
        `Could not flag project: ${
          error?.response?.data?.error || error.message
        }`,
        { position: "top-right" }
      );
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
          Let us know why you want to flag this project.
        </DialogTitle>
      </DialogHeader>

      <form className="flex flex-col gap-5 overflow-y-scroll pb-5 mt-5">
        <ul className="flex flex-col gap-3">
          {options.map((label) => (
            <li key={label}>
              <label className="text-secondary-text text-sm flex font-semibold items-center gap-3">
                <Checkbox
                  checked={selectedReasons.includes(label)}
                  onCheckedChange={(checked) => handleChange(label, !!checked)}
                />
                {label}
              </label>
            </li>
          ))}
        </ul>

        <textarea
          value={flagComments}
          onChange={(e) => setFlagComments(e.target.value)}
          placeholder="Please provide any additional comments."
          className="bg-tertiary-bg border border-tertiary-text rounded-md p-3 text-white placeholder:text-secondary-text text-sm resize-none h-[100px] focus:outline-none focus:border-main-primary"
        />
      </form>

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

export default FlagModal;
