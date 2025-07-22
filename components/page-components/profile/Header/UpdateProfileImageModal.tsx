import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../EditProfileIcon";
import ImageCropper from "./ImageCropper";

interface UpdateProfileImageModalProps {
  profileSrc: string | null;
}

const UpdateProfileImageModal = (props: UpdateProfileImageModalProps) => {
  const { profileSrc } = props;
  const { mutate } = useSWRConfig();
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileSrc, setUploadedFileSrc] = useState<string | null>(null);

  const {
    isOpen: isProfileImageModalOpen,
    openModal: openProfileImageModal,
    closeModal: closeProfileImageModal,
  } = UseModal("profileImage");

  const {
    isOpen: isCropModalOpen,
    openModal: openCropModal,
    closeModal: closeCropModal,
  } = UseModal();

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
        openCropModal();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    setRemovingPhoto(true);
    try {
      await axios.delete("/api/profile/profile-image");
      closeProfileImageModal();
      toast.success("Removed Profile Image Successfully", {
        position: "top-right",
      });

      mutate("/api/profile");
      mutate("/api/profile/profile-completion");
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Remove Profile Image ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );
        return;
      }
      toast.error(`Could not Remove Profile Image`);
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handleUpdateImage = async (file: File) => {
    setUpdatingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/api/profile/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Updated Profile Image Successfully", {
        position: "top-right",
      });
      mutate("/api/profile");
      mutate("/api/profile/profile-completion");

      closeCropModal();
    } catch (error: any) {
      console.log("Error updating profile image:", error);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Update Profile Image: ${error?.response?.data?.error}`
        );
        return;
      }

      toast.error(`Could not Update Profile Image ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setUpdatingPhoto(false);
    }
  };
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const handleAvatarSelection = async (src: string) => {
    try {
      setUploading(true);
      setSelectedAvatar(src);

      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File(
        [blob],
        src.split("/").pop() || "/default-img.png",
        {
          type: blob.type,
        }
      );

      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/api/profile/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Default avatar selected successfully", {
        position: "top-right",
      });
      mutate("/api/profile");
      mutate("/api/profile/profile-completion");
    } catch (error: any) {
      toast.error("Failed to select avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <GenericModal
      trigger={
        <div className="absolute bottom-0 right-0">
          <EditProfileIcon size="lg" />
        </div>
      }
      controls={{
        isOpen: isProfileImageModalOpen,
        onClose: closeProfileImageModal,
        onOpen: openProfileImageModal,
      }}
    >
      <div className="h-full flex flex-col justify-between">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold">
            Edit profile photo
          </DialogTitle>
          <DialogDescription className="!text-base !text-white !mt-5">
            Select an avatar or upload your own photo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-2 md:gap-10">
          <div className="col-span-12 md:col-span-6 flex items-center justify-center">
            <Avatar className="w-[160px] h-[160px] md:w-[284px] md:h-[284px] bg-black">
              <AvatarImage
                src={profileSrc ?? "/default-profile.png"}
                alt={"User profile"}
                className="object-contain"
              />
            </Avatar>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-4 gap-2 md:gap-6 place-items-center">
              {Array.from({ length: 4 }).map((_, index) => {
                const src = `/default-robot-${index + 1}.png`;
                const isSelected = selectedAvatar === src;
                return (
                  <div
                    className="col-span-2 flex items-center justify-center w-full"
                    key={index}
                  >
                    <Avatar
                      onClick={() => handleAvatarSelection(src)}
                      className={`w-[120px] md:w-[120px] h-[120px] md:h-[120px] bg-black border-2 transition-all duration-100 cursor-pointer ${
                        isSelected
                          ? "border-main-primary"
                          : "border-tertiary-bg hover:border-main-primary"
                      }`}
                    >
                      <AvatarImage
                        src={src}
                        alt={`Default avatar ${index + 1}`}
                        className="object-contain"
                      />
                    </Avatar>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full flex sm:justify-end justify-center gap-6 mt-12">
          <Button
            variant="secondary"
            onClick={() => handleRemoveImage()}
            disabled={!profileSrc || removingPhoto}
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
              disabled={removingPhoto || updatingPhoto || uploading}
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
          isLoading={updatingPhoto}
          handleFileCropped={handleUpdateImage}
          circularCrop
          isOpen={isCropModalOpen}
          onOpen={openCropModal}
          onClose={() => {
            setUploadedFileSrc(null);
            closeCropModal();
          }}
          className="w-fit h-fit self-center"
        />
      )}
    </GenericModal>
  );
};

export default UpdateProfileImageModal;
