"use client";

import { MultiSelect } from "@/components/common/form/select/multi";
import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Hackathons } from "@/types/entities";
import { useMemo, useState } from "react";
import BackgroundSelector from "./headerBackgroundSelector";
import HackathonPreview from "./headerPreview";
import LogoSelector from "./logoSelector";
import { useHackathonForm } from "./useHackathonHeaderForm";
import { useTechnologyTags } from "./useTechnologyTags";

// Import our new components and hooks

interface EditHeaderModalProps {
  hackathon: Hackathons;
}

const EditHackathonHeaderModal = ({ hackathon }: EditHeaderModalProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  // File preview states
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(null);

  // Technology tags hook
  const {
    technologyDropdownValues,
    technologyTags,
    isFetchingTechnologies,
    setTechnologyDropdownValues,
  } = useTechnologyTags();

  // Form hook
  const formik = useHackathonForm({
    hackathon,
    onClose,
    selectedTechnologies: technologyDropdownValues,
  });

  // File upload handlers
  const handleLogoUpload = (file: File) => {
    formik.setFieldValue("avatar_file", file);
    formik.setFieldValue("avatar_url", null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (file: File) => {
    formik.setFieldValue("banner_file", file);
    formik.setFieldValue("banner_url", null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setBackgroundPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoTemplateSelect = (url: string) => {
    formik.setFieldValue("avatar_url", url);
    formik.setFieldValue("avatar_file", null);
    setLogoPreviewUrl(null);
  };

  const onBackgroundTemplateSelect = (color: string) => {
    formik.setFieldValue("banner_url", color);
    formik.setFieldValue("banner_file", null);
    setBackgroundPreviewUrl(null);
  };

  const logoSource = useMemo(() => {
    if (logoPreviewUrl) return logoPreviewUrl;
    if (formik.values.avatar_url) return formik.values.avatar_url;
    return null;
  }, [logoPreviewUrl, formik.values.avatar_url]);

  const backgroundSource = useMemo(() => {
    if (backgroundPreviewUrl) return backgroundPreviewUrl;
    if (formik.values.banner_url) return formik.values.banner_url;
    return null;
  }, [backgroundPreviewUrl, formik.values.banner_url]);

  return (
    <GenericModal
      controls={{ isOpen, onClose, onOpen }}
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
          <HackathonPreview
            hackathon={hackathon}
            backgroundSource={backgroundSource}
            logoSource={logoSource}
          />

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
              options={technologyTags ?? []}
              isLoading={isFetchingTechnologies}
              value={technologyDropdownValues}
              placeholder="Select any applicable technology"
              onChange={(value) =>
                setTechnologyDropdownValues(value.map((v) => String(v)))
              }
            />
          </div>

          <LogoSelector
            logoPreviewUrl={formik.values.avatar_url}
            onLogoTemplateSelect={handleLogoTemplateSelect}
            onLogoUpload={handleLogoUpload}
          />

          <BackgroundSelector
            backgroundPreviewUrl={formik.values.banner_url}
            onBackgroundTemplateSelect={onBackgroundTemplateSelect}
            onBackgroundUpload={handleBackgroundUpload}
          />
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
