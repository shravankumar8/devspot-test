import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../EditProfileIcon";
import ImageCropper from "./ImageCropper";

interface UpdateHeaderImageModalProps {
  headerSrc: string | null;
}

const UpdateHeaderImageModal = (props: UpdateHeaderImageModalProps) => {
  const { headerSrc } = props;
  const { mutate } = useSWRConfig();
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileSrc, setUploadedFileSrc] = useState<string | null>(null);

  const {
    isOpen: isHeaderImageModalOpen,
    openModal: openHeaderImageModal,
    closeModal: closeHeaderImageModal,
  } = UseModal("headerImage");

  const handleOpenFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleConvertFileUploadToString = (file: File) => {
    console.log(file);
    if (!file) toast.error("File was not uploaded");

    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!validTypes.includes(file.type)) {
      alert("Unsupported file type. Please upload a JPEG, PNG, or GIF image.");
      return;
    }

    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result == "string") {
        setUploadedFileSrc(reader?.result?.toString() || null);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    setRemovingPhoto(true);
    try {
      await axios.delete("/api/profile/header-image");
      closeHeaderImageModal();
      toast.success("Removed Header Image Successfully", {
        position: "top-right",
      });
      mutate("/api/profile");
      mutate("/api/profile/profile-completion");
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Remove Header Image ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );
        return;
      }
      toast.error(`Could not Remove Header Image`);
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handleUpdateImage = async (file: File) => {
    setUpdatingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/api/profile/header-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Updated Header Image Successfully", {
        position: "top-right",
      });
      mutate("/api/profile");
      mutate("/api/profile/profile-completion");
      setCropModalOpen(false);
      closeHeaderImageModal();
    } catch (error: any) {
      console.log("Error updating header image:", error);
      setCropModalOpen(false);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Update Header Image: ${error?.response?.data?.error}`
        );
        return;
      }
      toast.error(`Could not Update Header Image ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setUpdatingPhoto(false);
    }
  };
  return (
    <GenericModal
      trigger={
        <div className="absolute top-4 right-4 ">
          <EditProfileIcon size="lg" />
        </div>
      }
      controls={{
        isOpen: isHeaderImageModalOpen,
        onClose: closeHeaderImageModal,
        onOpen: openHeaderImageModal,
      }}
    >
      <div className="h-full flex flex-col justify-between">
        <DialogHeader className="sticky left-6 top-0  bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold">
            Edit header photo
          </DialogTitle>
        </DialogHeader>

        <div className="w-full relative h-[200px] border-2 border-tertiary-bg bg-secondary-bg rounded-[20px]">
          {headerSrc && (
            <Image
              src={headerSrc}
              alt="User Header"
              fill
              className="object-cover rounded-[20px]"
            />
          )}
        </div>

        <div className="w-full flex sm:justify-end justify-center gap-6 mt-12">
          <Button
            variant="secondary"
            onClick={() => handleRemoveImage()}
            disabled={!headerSrc || removingPhoto}
            className="gap-2 font-roboto text-base"
          >
            {removingPhoto && <Spinner size="small" />}
            Remove photo
          </Button>

          <>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) =>
                handleConvertFileUploadToString(e.target.files?.[0] as File)
              }
            />

            <Button
              disabled={removingPhoto}
              className="font-roboto text-base"
              onClick={handleOpenFileUpload}
            >
              Upload a photo
            </Button>
          </>
        </div>
      </div>

      {uploadedFileSrc && (
        <ImageCropper
          src={uploadedFileSrc}
          aspectRatio={16 / 9}
          isLoading={updatingPhoto}
          handleFileCropped={handleUpdateImage}
          isOpen={cropModalOpen}
          onOpen={() => setCropModalOpen(true)}
          onClose={() => {
            setUploadedFileSrc(null);
            setCropModalOpen(false);
          }}
          isHeader
          className="w-full h-fit self-center"
        />
      )}
    </GenericModal>
  );
};

export default UpdateHeaderImageModal;
