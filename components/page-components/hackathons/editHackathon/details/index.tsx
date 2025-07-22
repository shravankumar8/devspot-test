import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import UseModal from "@/hooks/useModal";
import { Hackathons } from "@/types/entities";
import HackathonForm from "./form";
import { HackathonFormData } from "./types";
import { useHackathonSubmission } from "./useHackathonSubmission";

interface EditHackathonDetailsProps {
  hackathonData: Hackathons;
}

export const EditHackathonDetails = ({
  hackathonData,
}: EditHackathonDetailsProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const { submitHackathon } = useHackathonSubmission(hackathonData.id);

  const handleSubmit = async (values: HackathonFormData) => {
    const data = await submitHackathon(values);
    onClose();
    return data
  };

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
          Edit hackathon details
        </DialogTitle>
      </DialogHeader>

      <HackathonForm
        hackathonData={hackathonData}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </GenericModal>
  );
};
