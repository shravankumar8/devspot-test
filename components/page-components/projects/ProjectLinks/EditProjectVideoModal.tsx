import Label from "@/components/common/form/label";
import { WebsiteLink } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";

interface EditProjectVideoModalProps {
  project: Projects;
}

const EditProjectVideoModal = (props: EditProjectVideoModalProps) => {
  const { project } = props;
  const { mutate } = useSWRConfig();

  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const formik = useFormik({
    initialValues: {
      video_url: project?.video_url ?? undefined,
      video_file: null as File | null,
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        const { video_file, video_url } = values;

        if (video_file) {
          const videoFormData = new FormData();
          videoFormData.append("video", video_file);

          await axios.post(
            `/api/projects/${project?.id}/video`,
            videoFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        if (video_url && !video_file) {
          await axios.patch(`/api/projects/${project?.id}`, {
            video_url,
          });
        }

        mutate(`/api/projects/${project?.id}`);

        toast.success("Updated Project Video Information Successfully", {
          position: "top-right",
        });

        onClose();
        resetForm();
      } catch (error: any) {
        console.log("Error updating Project Video information:", error);

        setSubmitting(false);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update Project Video Information ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(
          `Could not Update Project Video Information  ${error?.message}`,
          {
            position: "top-right",
          }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (file: File) => {
    formik.setFieldValue("video_file", file);
    formik.setFieldValue("video_url", file?.name);
  };

  const handleVideoDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(false);
  };

  const handleVideoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleVideoUpload(file);
      }
    }
  };

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10 mb
    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      toast.success("Video is too large. Maximum size is 10 MB.");
      e.target.value = "";
      return;
    }

    handleVideoUpload(file);
  };

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit Video
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="flex flex-col gap-4 md:h-[400px] overflow-y-scroll py-5">
          <div className="flex w-full flex-col gap-3">
            <Label className="text-sm text-secondary-text">
              A demo video is required. Videos must be:
              <ul>
                <li>no more than [3] minutes long</li>
              </ul>
            </Label>

            <Input
              id="video_url"
              name="video_url"
              placeholder="https://youtube.com/your-project"
              height="20px"
              value={formik.values.video_url ?? ""}
              className="font-roboto text-sm"
              prefixIcon={<WebsiteLink color="#4E52F5" />}
              onChange={formik.handleChange}
              error={formik.errors.video_url}
              readOnly={Boolean(formik.values.video_file)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-[#2b2b31] flex-grow"></div>
            <div className="text-[#89898c]">or</div>
            <div className="h-px bg-[#2b2b31] flex-grow"></div>
          </div>

          <div
            className={`border-2 border-dashed ${
              isDraggingVideo
                ? "border-[#4e52f5] bg-[#4e52f5]/5"
                : "border-[#2b2b31]"
            } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
            onClick={() => videoInputRef.current?.click()}
            onDragOver={handleVideoDragOver}
            onDragLeave={handleVideoDragLeave}
            onDrop={handleVideoDrop}
          >
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleVideoFileChange}
            />
            <div className="bg-[#2b2b31] p-2 rounded-full mb-2">
              <Upload className="h-5 w-5 text-[#4e52f5]" />
            </div>
            <div className="text-[#89898c] text-sm">
              Drag and drop file here or{" "}
              <span className="text-[#4e52f5]">click to upload</span>
            </div>
          </div>
        </div>

        <div className="w-full flex sm:justify-end justify-center mt-4">
          <Button
            type="submit"
            className="w-fit font-roboto text-sm gap-2"
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};

export default EditProjectVideoModal;
