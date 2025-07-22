import { TextArea } from "@/components/common/form/textarea";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { Hackathons } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import EditProfileIcon from "../profile/EditProfileIcon";

export const EditHackathonAbout = ({
  hackathonData,
}: {
  hackathonData: Hackathons;
}) => {
  const { selectedOrg } = useTechOwnerStore();
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const [about, setAbout] = useState(hackathonData?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);

    try {
      await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonData?.id}/edit/about`,
        { about }
      );
      mutate(`/api/hackathons/${hackathonData?.id}/overview`);

      toast.success("Updated Hackathon About Information Successfully", {
        position: "top-right",
      });

      onClose();
      setAbout(hackathonData.description ?? "");
    } catch (error: any) {
      console.log("Error updating Hackathon About information:", error);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Update Hackathon About Information ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );

        return;
      }

      toast.error(
        `Could not Update Project About Information  ${error?.message}`,
        {
          position: "top-right",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setAbout(hackathonData.description ?? "");
  }, [hackathonData.description]);

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <button className="absolute top-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit About
        </DialogTitle>
      </DialogHeader>

      <form className="flex flex-col overflow-y-scroll">
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Describe your hackathon
        </p>
        <TextArea
          required
          name="about"
          label="about"
          rows={20}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          showMaxLength={false}
          readOnly={submitting}
        />

        <div className="w-full flex sm:justify-end justify-center my-4">
          <Button
            type="button"
            className="w-fit font-roboto text-sm gap-2"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};
