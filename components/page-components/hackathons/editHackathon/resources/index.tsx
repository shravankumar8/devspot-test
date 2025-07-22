import { MultiSelect } from "@/components/common/form/select/multi";
import { DragIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";

import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { HackathonChallenges, Technologies } from "@/types/entities";
import axios from "axios";
import { Plus, Trash2Icon, UploadIcon } from "lucide-react";
import { FormEventHandler, useRef } from "react";
import useSWR from "swr";
import { useHackathonResources } from "./useEditResources";

const TypeOptions = [
  { label: "Documentation", value: "documentation" },
  { label: " Meduim Blog", value: "meduim-blog" },
  { label: "Subgraph", value: "subgraph" },
  { label: " Smart Contract", value: "smart-contract" },
  { label: " GitHub Repo", value: "github-repo" },
  { label: " App", value: "app" },
  { label: " Dashboard", value: "dashboard" },
  { label: " Notion Page", value: "notion-page" },
  { label: " Walkthrough", value: "walkthrough" },
  { label: " API Reference", value: "api-reference" },
  { label: " Dev Tool", value: "dev-tool" },
  { label: " Starter Kit", value: "starter-kit" },
  { label: " Spec", value: "spec" },
  { label: " Design Doc", value: "design-doc" },
  { label: " Community Resource", value: "community-resource" },
  { label: " Governance", value: "governance" },
  { label: " File", value: "file" },
  { label: " Video", value: "video" },
];

export const EditHackathonResources = ({
  hackathonId,
}: {
  hackathonId: number;
}) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    resources,
    addNewResource,
    updateResourceField,
    deleteResource,
    handleSubmit,
    submitting,
  } = useHackathonResources(hackathonId);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data?.items || response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchHackathonChallenges = async (url: string) => {
    try {
      const response = await axios.get<{
        data: {
          items: HackathonChallenges[];
        };
      }>(url);

      const options: { label: string; value: string | number }[] =
        response?.data?.data?.items.map((role) => ({
          value: role.id,
          // @ts-ignore
          label: role.sponsors[0]?.name + ": " + role.challenge_name,
        }));

      return options;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: challenges = [], isLoading: isFetchingChallenges } = useSWR<
    { label: string; value: string | number }[]
  >(
    `/api/hackathons/${hackathonId}/challenges?as=options`,
    fetchHackathonChallenges,
    {}
  );

  const { data: technologies = [] } = useSWR<Technologies[]>(
    `/api/technology-tags`,
    fetchData
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    resourceId: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateResourceField(resourceId, "tempFile", file);
      updateResourceField(resourceId, "is_downloadable", true);
      updateResourceField(resourceId, "has_external_link", false);
      updateResourceField(resourceId, "url", null);
    }
  };

  const handleLinkClick = (resourceId: number) => {
    updateResourceField(resourceId, "has_external_link", true);
    updateResourceField(resourceId, "is_downloadable", false);
    updateResourceField(resourceId, "tempFile", undefined);
  };

  const handleFileClick = (resourceId: number) => {
    updateResourceField(resourceId, "is_downloadable", true);
    updateResourceField(resourceId, "has_external_link", false);
    fileInputRef.current?.click();
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await handleSubmit();
    onClose()
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
          Edit resources
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={onFormSubmit} className="flex flex-col overflow-y-scroll">
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Include resource links or files for your participants.
        </p>

        <div className="h-[520px] overflow-y-scroll space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-[#2B2B31] p-4 rounded-lg">
              <div className="flex gap-4 items-center mb-3">
                <DragIcon />
                <Input
                  value={resource.title}
                  onChange={(e) =>
                    updateResourceField(resource.id, "title", e.target.value)
                  }
                  placeholder="Resource title"
                  className="flex-grow"
                />
                <button
                  type="button"
                  onClick={() => deleteResource(resource.id)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <Trash2Icon className="size-5" />
                </button>
              </div>

              <div className="flex gap-4 mb-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleLinkClick(resource.id)}
                    className={`px-4 h-7 rounded-lg text-sm font-medium ${
                      resource.has_external_link
                        ? "bg-main-primary text-white"
                        : "bg-[#424248] text-secondary-text hover:bg-gray-600"
                    }`}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileClick(resource.id)}
                    className={`px-4 h-7 rounded-lg text-sm font-medium ${
                      resource.is_downloadable
                        ? "bg-main-primary text-white"
                        : "bg-[#424248] text-secondary-text hover:bg-gray-600"
                    }`}
                  >
                    File
                  </button>
                </div>

                {resource.has_external_link ? (
                  <Input
                    value={resource.url || ""}
                    onChange={(e) =>
                      updateResourceField(resource.id, "url", e.target.value)
                    }
                    placeholder="Enter resource URL"
                    className="flex-grow"
                  />
                ) : (
                  <label className="border border-dashed border-secondary-text rounded-xl w-full h-20 bg-primary-bg flex flex-col items-center justify-center py-3 px-5 cursor-pointer hover:border-main-primary">
                    <UploadIcon className="stroke-main-primary size-6" />
                    <p className="font-medium text-sm text-secondary-text mt-2 text-center">
                      {resource.tempFile ? (
                        <span className="text-main-primary">
                          {resource.tempFile.name}
                        </span>
                      ) : (
                        <>
                          Drag and drop file here or{" "}
                          <span className="text-main-primary underline">
                            click to upload
                          </span>
                        </>
                      )}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, resource.id)}
                      className="hidden"
                      accept="image/*,video/*"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <MultiSelect
                    options={TypeOptions}
                    value={resource.type ? [resource.type] : []}
                    onChange={(values) =>
                      updateResourceField(
                        resource.id,
                        "type",
                        // @ts-ignore
                        values[0] || null
                      )
                    }
                    placeholder="Select resource type"
                  />
                </div>

                <div>
                  <MultiSelect
                    options={challenges}
                    isLoading={isFetchingChallenges}
                    value={resource.challengeIds}
                    onChange={(values) =>
                      updateResourceField(
                        resource.id,
                        "challengeIds",
                        values as number[]
                      )
                    }
                    placeholder="Select challenges"
                  />
                </div>

                <div className="md:col-span-2">
                  <MultiSelect
                    options={technologies.map((t) => ({
                      value: t.slug,
                      label: t.name,
                    }))}
                    value={resource.technologies}
                    onChange={(values) =>
                      updateResourceField(
                        resource.id,
                        "technologies",
                        values as string[]
                      )
                    }
                    placeholder="Select technologies"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between w-full pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={addNewResource}
            className="text-gray-300 hover:text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Resource
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {submitting && <Spinner size="small" />}
            Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};
