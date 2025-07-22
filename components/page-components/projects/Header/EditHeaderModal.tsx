import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";

import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import { useFormik } from "formik";
import { Upload } from "lucide-react";
import Image from "next/image";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";
import {
  BACKGROUND_COLORS,
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "../constants/bacakground";

interface EditHeaderModalProps {
  project: Projects;
}

const EditHeaderModal = (props: EditHeaderModalProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const { project } = props;
  const { mutate } = useSWRConfig();

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingBackground, setIsDraggingBackground] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Initialize Formik
  const initialValues = useMemo(() => {
    // Determine if logo is a template or custom
    let selectedLogoIndex = null;
    if (project?.logo_url) {
      selectedLogoIndex = LOGO_TEMPLATES.indexOf(project.logo_url);
    }

    // Determine if header is a color or custom image
    let selectedBackgroundIndex = null;
    if (project?.header_url) {
      selectedBackgroundIndex = BACKGROUND_COLORS.indexOf(project.header_url);
    } else {
      selectedBackgroundIndex = 0;
    }
    return {
      name: project?.name || "Untitled project",
      tagline: project?.tagline || "Your project's tagline",
      header_url: project?.header_url,
      header_file: null as File | null,
      logo_url: project?.logo_url,
      logo_file: null as File | null,
      selectedLogoIndex: selectedLogoIndex == -1 ? null : selectedLogoIndex,
      selectedBackgroundIndex:
        selectedBackgroundIndex == -1 ? null : selectedBackgroundIndex,
    };
  }, [project]);

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        const {
          header_file,
          logo_file,
          selectedBackgroundIndex,
          selectedLogoIndex,
          header_url,
          logo_url,
          ...rest
        } = values;

        if (logo_file) {
          const logoFormData = new FormData();
          logoFormData.append("image", logo_file);

          await axios.post(`/api/projects/${project?.id}/logo`, logoFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (header_file) {
          const headerFormData = new FormData();
          headerFormData.append("image", header_file);

          await axios.post(
            `/api/projects/${project?.id}/header-image`,
            headerFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        const payload = {
          ...rest,
          header_url: selectedBackgroundIndex
            ? BACKGROUND_COLORS[selectedBackgroundIndex]
            : undefined,
          logo_url: selectedLogoIndex
            ? LOGO_TEMPLATES[selectedLogoIndex]
            : undefined,
        };
        await axios.patch(`/api/projects/${project?.id}`, payload);

        mutate(`/api/projects/${project?.id}`);
        toast.success("Updated Header Information Successfully", {
          position: "top-right",
        });

        onClose();
        resetForm();
      } catch (error: any) {
        console.log("Eror updating header information:", error);
        toast.error(`Could not Update Header Information ${error?.message}`, {
          position: "top-right",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Preview URLs for uploaded files
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(null);

  // Handle logo file upload
  const handleLogoUpload = (file: File) => {
    formik.setFieldValue("logo_file", file);
    formik.setFieldValue("selectedLogoIndex", null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle background file upload
  const handleBackgroundUpload = (file: File) => {
    formik.setFieldValue("header_file", file);
    formik.setFieldValue("selectedBackgroundIndex", null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setBackgroundPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events for logo
  const handleLogoDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleLogoUpload(file);
      }
    }
  };

  // Handle drag events for background
  const handleBackgroundDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingBackground(true);
  };

  const handleBackgroundDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingBackground(false);
  };

  const handleBackgroundDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingBackground(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleBackgroundUpload(file);
      }
    }
  };

  // Handle file input change for logo
  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  // Handle file input change for background
  const handleBackgroundFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleBackgroundUpload(e.target.files[0]);
    }
  };

  // Handle logo template selection
  const handleLogoTemplateSelect = (index: number) => {
    formik.setFieldValue("selectedLogoIndex", index);
    console.log(index);
    // formik.setFieldValue("logo_url", LOGO_TEMPLATES[index]);
    formik.setFieldValue("logo_file", null);
    setLogoPreviewUrl(null);
  };

  // Handle background color selection
  const handleBackgroundColorSelect = (index: number) => {
    formik.setFieldValue("selectedBackgroundIndex", index);
    // formik.setFieldValue("header_url", BACKGROUND_COLORS[index]);
    formik.setFieldValue("header_file", null);
    setBackgroundPreviewUrl(null);
  };

  // Get background style based on selection or uploaded file
  const getBackgroundStyle = () => {
    if (backgroundPreviewUrl) {
      return {
        backgroundImage: `url(${backgroundPreviewUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    if (formik.values.header_url && !formik.values.selectedBackgroundIndex) {
      // Custom image URL from project data
      return {
        backgroundImage: `url(${formik.values.header_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    // Color from template
    return {
      backgroundColor:
        formik.values.selectedBackgroundIndex !== null
          ? BACKGROUND_COLORS[formik.values.selectedBackgroundIndex]
          : undefined,
    };
  };

  // Get logo source
  const getLogoSource = () => {
    if (logoPreviewUrl) {
      return logoPreviewUrl;
    }

    if (formik.values.logo_url && formik.values.selectedLogoIndex === null) {
      // Custom logo URL from project data
      return formik.values.logo_url;
    }

    return null; // Will use the template
  };
  // Determine if the background is light or dark
  const isLightBackground = () => {
    return (formik.values.selectedBackgroundIndex ?? 0) < 2;
  };

  const getLogoContainerClass = (selectedLogoIndex: number | null) => {
    const baseClass = "w-24 h-24 flex justify-center items-center";

    if (selectedLogoIndex === null) return baseClass;

    const bgClass =
      selectedLogoIndex === 0 || selectedLogoIndex % 2 === 0
        ? "bg-[#13131a]"
        : "bg-[#E7E7E8]";

    return cn(bgClass, baseClass);
  };

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div className="absolute top-4 right-4 ">
          <EditProfileIcon size="lg" />
        </div>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit header
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col overflow-y-scroll"
      >
        <div className="overflow-y-scroll !font-roboto mt-2">
          <div className="text-[#89898c] uppercase text-xs font-medium mb-2">
            Header preview
          </div>
          <div
            className="rounded-lg p-6 mb-6 transition-all duration-200"
            style={getBackgroundStyle()}
          >
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-md flex items-center justify-center overflow-hidden">
                {getLogoSource() ? (
                  <Image
                    width={100}
                    height={100}
                    src={getLogoSource() || ""}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={getLogoContainerClass(
                      formik.values.selectedLogoIndex
                    )}
                  >
                    <LogoPlaceholder
                      index={formik.values.selectedLogoIndex ?? 0}
                    />
                  </div>
                )}
              </div>
              <div>
                <div
                  className={`text-sm mb-1 capitalize ${
                    isLightBackground() ? "text-[#424248]" : "text-[#89898c]"
                  }`}
                >
                  {formik.values.tagline}
                </div>
                <h3
                  className={`text-2xl capitalize font-semibold ${
                    isLightBackground() ? "text-[#13131a]" : "text-white"
                  }`}
                >
                  {formik.values.name}
                </h3>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[#89898c] text-sm mb-2">
              What is your project called?
            </div>
            <Input
              id="name"
              name="name"
              className="bg-[#2b2b31] border-none capitalize text-white placeholder:text-[#424248]"
              placeholder="Your project name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-6">
            <div className="text-[#89898c] text-sm mb-2">
              What is your project's tagline?
            </div>
            <Input
              id="tagline"
              name="tagline"
              className="bg-[#2b2b31] border-none text-white placeholder:text-[#424248]"
              placeholder="Your project's tagline"
              value={formik.values.tagline}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-6">
            <div className="text-[#89898c] text-sm mb-4">Project logo</div>
            <div className="flex gap-4 flex-wrap mb-2">
              {[...Array(8)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`aspect-square ${
                    index % 2 == 0 ? "bg-[#13131a] " : "bg-[#E7E7E8]"
                  } w-24 h-24 rounded-md flex items-center justify-center p-3 ${
                    formik.values.selectedLogoIndex === index
                      ? "ring-2 ring-[#91c152]"
                      : ""
                  }`}
                  onClick={() => handleLogoTemplateSelect(index)}
                >
                  <LogoPlaceholder index={index} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 my-4">
              <div className="h-px bg-[#2b2b31] flex-grow"></div>
              <div className="text-[#89898c]">or</div>
              <div className="h-px bg-[#2b2b31] flex-grow"></div>
            </div>

            <div
              className={`border-2 border-dashed ${
                isDraggingLogo
                  ? "border-[#4e52f5] bg-[#4e52f5]/5"
                  : "border-[#2b2b31]"
              } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
              onClick={() => logoInputRef.current?.click()}
              onDragOver={handleLogoDragOver}
              onDragLeave={handleLogoDragLeave}
              onDrop={handleLogoDrop}
            >
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoFileChange}
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

          <div className="mb-6">
            <div className="text-[#89898c] text-sm mb-4">Header background</div>
            <div className="grid grid-cols-8 gap-4 mb-2">
              {BACKGROUND_COLORS.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  className={`aspect-square rounded-md ${
                    formik.values.selectedBackgroundIndex === index
                      ? "ring-2 ring-[#91c152]"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleBackgroundColorSelect(index)}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 my-4">
              <div className="h-px bg-[#2b2b31] flex-grow"></div>
              <div className="text-[#89898c]">or</div>
              <div className="h-px bg-[#2b2b31] flex-grow"></div>
            </div>

            <div
              className={`border-2 border-dashed ${
                isDraggingBackground
                  ? "border-[#4e52f5] bg-[#4e52f5]/5"
                  : "border-[#2b2b31]"
              } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
              onClick={() => backgroundInputRef.current?.click()}
              onDragOver={handleBackgroundDragOver}
              onDragLeave={handleBackgroundDragLeave}
              onDrop={handleBackgroundDrop}
            >
              <input
                type="file"
                ref={backgroundInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundFileChange}
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
        </div>

        <div className="w-full flex sm:justify-end justify-center my-4">
          <Button
            type="submit"
            className="w-fit font-roboto text-sm gap-2"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};

export default EditHeaderModal;
