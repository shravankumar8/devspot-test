import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import EditProfileIcon from "../EditProfileIcon";

const AddCertificateModal = () => {
  return (
    <GenericModal
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="sticky left-6 top-0  bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Add Certificate
        </DialogTitle>
      </DialogHeader>
    </GenericModal>
  );
};

export default AddCertificateModal;
