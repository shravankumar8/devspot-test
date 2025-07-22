"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignupStore } from "@/state";
import axios, { AxiosError } from "axios";
import { UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export default function SelectAvatar() {
  const { setActiveStep } = useSignupStore();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setActiveStep(3);
  }, []);

  const handleOpenFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported file type. Upload JPEG, PNG, or GIF.");
      return;
    }

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 25MB limit.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/api/profile/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile image uploaded successfully");
      mutate("/api/profile");
      mutate("/api/profile/profile-completion");

      router.push("/sign-up/participants/select-skills");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log("Error uploading profile image:", error);
        toast.error(
          `Upload failed: ${error?.response?.data?.error || error.message}`
        );
      } else {
        toast.error("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

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
    <div className="flex flex-col gap-7 mt-[100px] md:mt-[155px] w-[90vw] sm:w-[500px]">
      <h4 className="font-bold text-[22px] sm:text-[28px] md:text-[32px] leading-[28px] sm:leading-[32px]">
        Choose an avatar or upload your own photo
      </h4>
      <p className="font-roboto font-medium text-[#89898C] text-sm sm:text-base">
        You can change this any time.
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-7"
      >
        <div className="grid grid-cols-12 gap-8 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="h-[264px] w-full flex flex-col items-center justify-center gap-4 bg-secondary-bg rounded-xl border-tertiary-bg border-2">
              <Avatar className="w-[132px] h-[132px] bg-black border-2 border-tertiary-bg">
                <AvatarImage
                  src={selectedAvatar || "/default-profile.png"}
                  alt="User profile"
                  className="object-contain"
                />
              </Avatar>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenFileUpload}
                disabled={uploading}
              >
                {uploading && <Spinner size="small" />}{" "}
                <UploadIcon size={14} className="mr-2" /> Upload
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files?.[0] as File)}
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="grid grid-cols-4 gap-8 md:gap-6 place-items-center">
              {Array.from({ length: 4 }).map((_, index) => {
                const src = `/default-robot-${index + 1}.png`;
                const isSelected = selectedAvatar === src;
                return (
                  <div className="col-span-2" key={index}>
                    <Avatar
                      onClick={() => handleAvatarSelection(src)}
                      className={`w-[120px] h-[120px] bg-black border-2 transition-all duration-100 cursor-pointer ${
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
        <div className="flex justify-end w-full">
          <Button
            onClick={() => {
              router.push("/sign-up/participants/select-skills");
            }}
            disabled={uploading || !selectedAvatar}
            className="flex gap-2 font-roboto !text-base"
          >
            {uploading && <Spinner size="small" />}
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
