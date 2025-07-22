"use client";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useAuthStore } from "@/state";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SettingsConfirmationModal = () => {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);

    try {
      await axios.delete("/api/profile");

      setSession(null);

      toast.success("Deleted Account Successfully", {
        position: "top-right",
      });
      const url = ` ${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/login`;

      router.push(url);

      onClose();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Delete Account ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );
        return;
      }

      toast.error(`Could not Delete Account ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setDeletingAccount(false);
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
        <div>
          <button className="flex items-center gap-2 h-6 bg-[#9a271d] text-white hover:bg-[#7a1d17] text-sm w-fit font-roboto p-2 rounded-lg ">
            <TrashIcon />
            Delete account
          </button>
        </div>
      }
    >
      <div className="-p-5">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold font-roboto">
            Are you sure you want to delete your account?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <p className="text-sm font-normal text-white font-roboto">
            This action cannot be undone.
          </p>

          <div className="w-full flex flex-col md:flex-row sm:justify-end justify-center gap-6">
            <Button
              variant="secondary"
              disabled={deletingAccount}
              onClick={onClose}
              className="gap-2 font-roboto text-base h-10 font-medium"
            >
              Cancel
            </Button>

            <Button
              className="font-roboto text-base gap-2 !bg-[#9a271d] hover:!bg-[#7a1d17] h-10"
              disabled={deletingAccount}
              onClick={handleDeleteAccount}
            >
              <TrashIcon />
              Delete account
              {deletingAccount && <Spinner size="small" />}
            </Button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default SettingsConfirmationModal;
