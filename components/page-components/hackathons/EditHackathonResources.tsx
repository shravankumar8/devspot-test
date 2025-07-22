import { MultiSelect } from "@/components/common/form/select/multi";
import { DragIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonChallenges, Technologies } from "@/types/entities";
import axios from "axios";
import { Plus, Trash2Icon, UploadIcon } from "lucide-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import EditProfileIcon from "../profile/EditProfileIcon";
import { HackathonResourcesProps } from "./resources";

export const EditHackathonResources = ({
  hackathonId,
}: {
  hackathonId: number;
}) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const [resources, setResources] = useState<HackathonResourcesProps[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>(
    {}
  );
  const { selectedOrg } = useTechOwnerStore();

  const [challengeIds, setChallengeIds] = useState<number[]>([]);
  const [technologyDropdownValues, setTechnologyDropdownValues] = useState<
    string[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchTechnologies = async (url: string) => {
    const resp = await axios.get(url);
    const data = resp?.data as Technologies[];

    const options = data.map((experience) => ({
      value: experience.slug,
      label: experience.name,
    }));

    return options;
  };

  const { data: hackathonChallenges = [], isLoading: isFetchingChallenges } =
    useSWR<{ label: string; value: string | number }[]>(
      `/api/hackathons/${hackathonId}/challenges?as=options`,
      fetchHackathonChallenges,
      {}
    );

  const { data: technologyTags, isLoading: isFetchingTechnologies } = useSWR(
    `/api/technology-tags`,
    fetchTechnologies
  );

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

  const fetchResources = async () => {
    try {
      const res = await axios.get(`/api/hackathons/${hackathonId}/resources`);
      setResources(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addNewResources = () => {
    const newChallengeId = resources.length + 1;
    const newResource: HackathonResourcesProps = {
      challenges: [],
      clicks: 0,
      created_at: new Date().toISOString(),
      has_external_link: false,
      challenge_id: null,
      description: "",
      hackathon_id: hackathonId,
      is_downloadable: false,
      sponsors: [],
      title: "",
      technologies: [],
      type: null,
      url: null,
      id: newChallengeId,
      updated_at: new Date().toISOString(),
    };

    setResources([...resources, newResource]);
    setOpenDropdowns((prev) => ({
      ...prev,
      [newChallengeId]: false,
    }));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    }
  };
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log({ resources });
    setSubmitting(true);

    try {
      // When you get the file, send it to this endpoint and get the public url
      // the type should be of type form data and the keys in the form data is image or video, based on the content type
      // await axios.post(
      //   `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/resources/upload-file`,{}
      // );

      // The challenge is different for each resource
      const formattedResources = resources.map((resource) => {
        return {
          ...resource,
          challengeIds: challengeIds,
          technologies: resource.technologies ? resource.technologies : [],
        };
      });

      await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/resources`,
        formattedResources
      );

      mutate(`/api/hackathons/${hackathonId}`);

      toast.success(`Updated Challenge Resources Successfully`, {
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Error updating header information:", error);
      toast.error(`Could not Update Header Information ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log({ challengeIds });
  }, [challengeIds]);

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

      <form className="flex flex-col overflow-y-scroll" onSubmit={handleSubmit}>
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Include resource links or files for your participants.Include resource
          links or files for your participants.
        </p>
        <div className="h-[520px] overflow-y-scroll">
          {resources.map((resource) => (
            <div key={resource.id} className="mb-4">
              <div className="space-y-3 ">
                <div className="flex gap-4 items-center">
                  <DragIcon />
                  <Input value={resource.title} />
                  <Trash2Icon className="size-5 stroke-[#89898C] cursor-pointer hover:stroke-red-500 transition" />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-4 h-7 flex justify-center items-center rounded-lg text-sm font-medium transition-colors ${
                        resource?.has_external_link
                          ? "bg-main-primary text-white"
                          : "bg-[#424248] text-secondary-text hover:bg-gray-600"
                      }`}
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      className={`px-4 h-7 flex justify-center items-center rounded-lg text-sm font-medium transition-colors ${
                        resource.is_downloadable
                          ? "bg-main-primary text-white"
                          : "bg-[#424248] text-secondary-text hover:bg-gray-600"
                      }`}
                    >
                      File
                    </button>
                  </div>
                  {resource?.url ? (
                    <Input value={resource.url} />
                  ) : (
                    <label
                      htmlFor="logo-upload"
                      className="border border-dashed border-secondary-text rounded-xl w-full h-20 bg-primary-bg flex flex-col items-center justify-center py-3 px-5 cursor-pointer hover:border-main-primary transition"
                    >
                      <div className="size-6 flex-shrink-0">
                        <UploadIcon className="stroke-main-primary size-6" />
                      </div>
                      <p className="font-medium text-sm text-secondary-text mt-2 text-center">
                        Drag and drop partner company logo here or{" "}
                        <span className="text-main-primary underline">
                          click to upload
                        </span>
                      </p>
                      <input
                        id="logo-upload"
                        type="file"
                        ref={fileInputRef}
                        name="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <MultiSelect options={TypeOptions} onChange={() => {}} />
                </div>
                <div>
                  <MultiSelect
                    isSearchable
                    options={hackathonChallenges}
                    isLoading={isFetchingChallenges}
                    placeholder="Select challenges"
                    value={challengeIds}
                    onChange={(selectedValues) => {
                      setChallengeIds(selectedValues as number[]);
                    }}
                    height="150px"
                    styles={{
                      placeholder: (provided) => ({
                        ...provided,
                        fontSize: "14px",
                        fontWeight: "normal",
                        height: "40px",
                      }),
                    }}
                  />
                </div>
                <div>
                  <MultiSelect
                    showCheckboxes
                    isOpen={openDropdowns[resource.id] || false}
                    onMenuOpenChange={(isOpen) => {
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        [resource.id]: isOpen,
                      }));
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
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full pt-6">
          <Button
            variant="ghost"
            type="button"
            onClick={addNewResources}
            className="text-gray-300 hover:text-white px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New resources
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {submitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};
