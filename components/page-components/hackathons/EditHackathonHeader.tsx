"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";

import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Hackathons, Technologies } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import { useFormik } from "formik";
import { Upload } from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { MultiSelect } from "@/components/common/form/select/multi";
import { tabs } from "@/components/layout/tabs/hackathons/HackathonTab";
import { Badge } from "@/components/ui/badge";
import EditProfileIcon from "../profile/EditProfileIcon";
import {
  BACKGROUND_COLORS,
  HackathonLogoPlaceholder,
  LOGO_TEMPLATES,
} from "../projects/constants/bacakground";

interface EditHeaderModalProps {
  hackathon: Hackathons;
}

const EditHackathonHeaderModal = (props: EditHeaderModalProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const { hackathon } = props;
  const { mutate } = useSWRConfig();

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingBackground, setIsDraggingBackground] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [technologyDropdownOpen, setTechnologyDropdownOpen] = useState(false);
  const [technologyDropdownValues, setTechnologyDropdownValues] = useState<
    string[]
  >([]);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const fetchTechnologies = async (url: string) => {
    const resp = await axios.get(url);
    const data = resp?.data as Technologies[];

    const options = data.map((experience) => ({
      value: experience.slug,
      label: experience.name,
    }));

    return options;
  };

  const { data: technologyTags, isLoading: isFetchingTechnologies } = useSWR(
    `/api/technology-tags`,
    fetchTechnologies
  );

  useEffect(() => {
    if (!technologyDropdownOpen) {
      setSelectedTechnologies(technologyDropdownValues);
      setTechnologyDropdownValues([]);
    }

    if (technologyDropdownOpen) {
      setTechnologyDropdownValues(selectedTechnologies);
      setSelectedTechnologies([]);
    }
  }, [technologyDropdownOpen]);

  // Initialize Formik
  const initialValues = useMemo(() => {
    // Determine if logo is a template or custom
    let selectedLogoIndex = null;
    if (hackathon?.avatar_url) {
      selectedLogoIndex = LOGO_TEMPLATES.indexOf(hackathon.avatar_url);
    }

    // Determine if header is a color or custom image
    let selectedBackgroundIndex = null;
    if (hackathon?.banner_url) {
      selectedBackgroundIndex = BACKGROUND_COLORS.indexOf(hackathon.banner_url);
    } else {
      selectedBackgroundIndex = 0;
    }
    return {
      name: hackathon?.name || "Untitled project",

      banner_url: hackathon?.banner_url,
      header_file: null as File | null,
      avatar_url: hackathon?.avatar_url,
      logo_file: null as File | null,
      selectedLogoIndex: selectedLogoIndex == -1 ? null : selectedLogoIndex,
      selectedBackgroundIndex:
        selectedBackgroundIndex == -1 ? null : selectedBackgroundIndex,
    };
  }, [hackathon]);

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
          banner_url,
          avatar_url,
          ...rest
        } = values;

        if (logo_file) {
          const logoFormData = new FormData();
          logoFormData.append("image", logo_file);

          await axios.post(
            `/api/hackathons/${hackathon?.id}/logo`,
            logoFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        if (header_file) {
          const headerFormData = new FormData();
          headerFormData.append("image", header_file);

          await axios.post(
            `/api/hackathons/${hackathon?.id}/header-image`,
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
        await axios.patch(`/api/hackathons/${hackathon?.id}`, payload);

        mutate(`/api/hackathons/${hackathon?.id}`);
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

    if (formik.values.banner_url && !formik.values.selectedBackgroundIndex) {
      // Custom image URL from project data
      return {
        backgroundImage: `url(${formik.values.banner_url})`,
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

    if (formik.values.avatar_url && formik.values.selectedLogoIndex === null) {
      // Custom logo URL from project data
      return formik.values.avatar_url;
    }

    return null; // Will use the template
  };
  // Determine if the background is light or dark
  const isLightBackground = () => {
    return (formik.values.selectedBackgroundIndex ?? 0) < 2;
  };

  const getLogoContainerClass = (selectedLogoIndex: number | null) => {
    const baseClass = "w-32 h-32 flex justify-center items-center rounded-xl";

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
        <button className="absolute top-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
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
          <div className=" mb-6 ">
            <div
              className={`relative overlay  w-full text-white gap-4 sm:gap-8 bg-[#1F2034] rounded-[20px] flex-col flex items-center justify-between h-auto sm:h-[240px]  ${cn(
                !hackathon?.banner_url ? "overflow-hidden" : ""
              )} `}
              style={getBackgroundStyle()}
            >
              <div className="z-10 lg:items-end px-5 pt-5 lg:pb-8 w-full overflow-auto">
                <div className="flex gap-3 sm:gap-5">
                  <div className="w-32 h-32">
                    {getLogoSource() ? (
                      <Image
                        width={100}
                        height={100}
                        src={getLogoSource() || ""}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div
                        className={getLogoContainerClass(
                          formik.values.selectedLogoIndex
                        )}
                      >
                        <HackathonLogoPlaceholder
                          index={formik.values.selectedLogoIndex ?? 0}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-start gap-3 w-full">
                    <div className="flex items-center gap-1 sm:gap-3 mt-3">
                      <h1 className="overflow-hidden font-semibold text-[#FFFFFF] sm:text-[28px] text-xl text-ellipsis leading-[30px] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                        {hackathon?.name}
                      </h1>
                      {/* {hackathonInformation?.status === "live" ? (
                  <div>
                    <span className="flex items-center bg-[#263513] px-3 py-1 rounded-full h-[26px] font-[500] font-roboto text-[#91C152] text-[12px] whitespace-nowrap">
                      
                      Register now
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="flex items-center bg-[#2B2B31] px-3 py-1 rounded-full h-[26px] font-[500] font-roboto text-[#E7E7E8] text-[12px]">
                      Upcoming
                    </span>
                  </div>
                )} */}
                    </div>

                    <div className="hidden sm:flex items-center gap-3">
                      {hackathon?.organizer?.logo && (
                        <div className="rounded-[12px] w-7 h-7 overflow-hidden">
                          <img
                            src={hackathon?.organizer?.logo ?? ""}
                            className="w-full h-full object-cover"
                            alt={`organizer logo`}
                          />
                        </div>
                      )}
                      <div className="font-roboto">
                        <p className="font-meduim text-[#FFFFFF] text-base">
                          {hackathon?.organizer?.name}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex justify-between gap-3 w-full">
                      <div className="flex gap-2 w-[80%] max-w-[80%] overflow-x-auto">
                        {hackathon?.tags?.slice(0, 8).map((tech, index) => (
                          <Badge
                            key={index}
                            className="!bg-transparent border !border-white !h-7 !text-white whitespace-nowrap"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:hidden z-10 flex justify-start gap-2 max-w-[90%] overflow-x-auto">
                {hackathon?.tags?.slice(0, 8).map((tech, index) => (
                  <Badge
                    key={index}
                    className="!bg-transparent border !border-white !h-7 !text-white whitespace-nowrap"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="w-full flex justify-between gap-3 px-5 z-10 sm:hidden pb-[50px]">
                <div className="flex gap-3 items-center">
                  {hackathon?.organizer?.logo && (
                    <div className="flex-shrink-0 rounded-[12px] w-7 h-7 overflow-hidden">
                      <img
                        src={hackathon?.organizer?.logo!}
                        className="w-full h-full object-cover"
                        alt={`organizer logo`}
                      />
                    </div>
                  )}
                  <div className="font-roboto">
                    <p className="font-medium text-[#FFFFFF] text-base">
                      {hackathon?.organizer?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-10 flex items-center">
              <div
                className={`flex flex-nowrap
                  h-10 whitespace-nowrap overflow-x-auto scrollbar-hide justify-start items-center space-x-5 lg:space-x-12 !w-full px-5  rounded-t-[12px] dark:bg-[#13131A99] z-10 relative !overflow-y-hidden`}
              >
                {tabs.map((tab) => (
                  <div
                    key={tab.value}
                    className={`bg-transparent capitalize relative text-sm font-semibold text-[#B8B8BA] transition-all duration-200 ease-in-out hover:text-white after:absolute after:w-0 after:transition-all after:duration-200 after:ease-in-out after:h-0.5 after:left-0 after:rounded-[1px] data-[state=active]:after:w-full after:bottom-2 data-[state=active]:after:bg-[#4E52F5] data-[state=active]:text-white `}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <div
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
                <h3
                  className={`text-2xl capitalize font-semibold ${
                    isLightBackground() ? "text-[#13131a]" : "text-white"
                  }`}
                >
                  {formik.values.name}
                </h3>
              </div>
            </div>
          </div> */}

          <div className="mb-4">
            <div className="text-[#89898c] text-sm mb-2">
              What is your hackathon called?
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
            <p className="text-[#89898c] text-sm mb-2">
              Add key words associated with your hackathon (maximum of four).
            </p>
            <MultiSelect
              showCheckboxes
              isOpen={technologyDropdownOpen}
              onMenuOpenChange={(value) => {
                setTechnologyDropdownOpen(value);
              }}
              options={technologyTags ?? []}
              isLoading={isFetchingTechnologies}
              value={technologyDropdownValues}
              placeholder="Select any applicable technology"
              onChange={(value) => {
                setTechnologyDropdownValues(value as any);
              }}
            />
          </div>

          <div className="mb-6">
            <div className="text-[#89898c] text-sm mb-4">Hackathon logo</div>
            <div className="flex gap-4 flex-wrap mb-2">
              {[...Array(6)].map((_, index) => (
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
                  <HackathonLogoPlaceholder index={index} />
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

export default EditHackathonHeaderModal;
