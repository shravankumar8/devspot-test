import { MultiSelect } from "@/components/common/form/select/multi";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Option } from "@/types/common";
import { Technologies, UserSkills } from "@/types/entities";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import EditProfileIcon from "../EditProfileIcon";
import { initialSkills } from "./list";
import SuggestTagPopover from "./SuggestTagPopover";
interface AddSkillAndTechnoloyModalProps {
  userProfile: UserProfile;
}

const AddSkillAndTechnoloyModal = (props: AddSkillAndTechnoloyModalProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const { data: skillsData, isLoading: isSkillsDataLoading } = useSWR(
    `/api/profile/skills`,
    fetchSkills
  );

  const fetchTechnologies = async (url: string) => {
    const resp = await axios.get(url);
    const data = resp?.data as Technologies[];

    const options = data.map((experience) => ({
      value: experience.slug,
      label: experience.name,
    }));

    return options as Option[];
  };

  const { data: technologyTags, isLoading: isFetchingTechnologies } = useSWR(
    `/api/technology-tags`,
    fetchTechnologies
  );

  async function fetchSkills(url: string) {
    try {
      const response = await axios.get<UserSkills & Technologies>(url);

      const experienceOptions: Option[] = Array.from(
        new Set([...response?.data?.experience, ...initialSkills])
      )
        ?.filter(Boolean)
        .map((experience) => ({
          value: experience,
          label: experience,
        }));

      return {
        experienceOptions,
      };
    } catch (error) {
      console.error("Error fetching Roles:", error);
      return null;
    }
  }

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [experienceDropdownOpen, setExperienceDropdownOpen] = useState(false);
  const [experienceDropdownValues, setExperienceDropdownValues] = useState<
    string[]
  >([]);

  const removeExperience = (val: string) => {
    setSelectedExperiences(selectedExperiences.filter((exp) => exp !== val));
  };

  useEffect(() => {
    if (!experienceDropdownOpen) {
      setSelectedExperiences(experienceDropdownValues);
      setExperienceDropdownValues([]);
    }

    if (experienceDropdownOpen) {
      setExperienceDropdownValues(selectedExperiences);
      setSelectedExperiences([]);
    }
  }, [experienceDropdownOpen]);

  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [technologyDropdownOpen, setTechnologyDropdownOpen] = useState(false);
  const [technologyDropdownValues, setTechnologyDropdownValues] = useState<
    string[]
  >([]);

  useEffect(() => {
    const experience = props.userProfile?.profile?.skills?.experience ?? [];

    const technologies = props.userProfile?.profile?.skills?.technology ?? [];

    setSelectedTechnologies([...selectedTechnologies, ...technologies]);
    setSelectedExperiences([...selectedExperiences, ...experience]);
  }, [props.userProfile]);

  const removeTechnology = (val: string) => {
    setSelectedTechnologies(
      selectedTechnologies.filter((tech) => tech !== val)
    );
  };

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

  const { mutate } = useSWRConfig();

  const [submitting, setSubmitting] = useState(false);

  const handleSkillUpdate = async () => {
    setSubmitting(true);

    const finalExperiences =
      experienceDropdownValues.length > 0
        ? experienceDropdownValues
        : selectedExperiences;

    const finalTechnologies =
      technologyDropdownValues.length > 0
        ? technologyDropdownValues
        : selectedTechnologies;

    try {
      const payload = {
        skills: {
          experience: finalExperiences,
          technology: finalTechnologies,
        },
      };

      await axios.put("/api/profile", payload);
      mutate("/api/profile");
      mutate("/api/profile/profile-completion");
      toast.success("Updated Skill Information Successfully", {
        position: "top-right",
      });
      onClose();
    } catch (error: any) {
      console.log("Eror updating skill information:", error);
      toast.error(`Could not Update skill Information ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    const experience = props.userProfile?.profile?.skills?.experience ?? [];

    const technologies = props.userProfile?.profile?.skills?.technology ?? [];

    setSelectedTechnologies(technologies);
    setSelectedExperiences(experience);

    onClose();
  };

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose: handleClose,
        onOpen,
      }}
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="sticky left-6 top-0  bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit skills
        </DialogTitle>
      </DialogHeader>

      <div className="overflow-y-scroll h-full flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <p className="font-roboto font-medium text-[#89898C] text-sm sm:text-base">
            Experience
          </p>

          <MultiSelect
            showCheckboxes
            isOpen={experienceDropdownOpen}
            onMenuOpenChange={(value) => {
              setExperienceDropdownOpen(value);
              setTechnologyDropdownOpen(false);
            }}
            options={skillsData?.experienceOptions ?? []}
            isLoading={isSkillsDataLoading}
            value={experienceDropdownValues}
            placeholder="Select any applicable experience"
            onChange={(value) => {
              setExperienceDropdownValues(value as any);
            }}
          />

          <div className="flex gap-3 items-center overflow-x-scroll rounded-[40px]">
            {selectedExperiences.map((exp, index) => (
              <div
                className="bg-[#2B2B31] px-4 h-10 gap-2 flex items-center rounded-[40px] w-fit whitespace-nowrap"
                key={index}
              >
                <h3 className="text-white capitalize font-roboto text-sm font-medium">
                  {exp}
                </h3>

                <X
                  className="h-4 w-4 text-[#4e52f5] cursor-pointer"
                  onClick={() => removeExperience(exp)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-roboto font-medium text-[#89898C] text-sm sm:text-base">
            Technologies
          </p>
          <MultiSelect
            showCheckboxes
            isOpen={technologyDropdownOpen}
            onMenuOpenChange={(value) => {
              setTechnologyDropdownOpen(value);
              setExperienceDropdownOpen(false);
            }}
            options={technologyTags ?? []}
            isLoading={isFetchingTechnologies}
            value={technologyDropdownValues}
            placeholder="Select any applicable technology"
            onChange={(value) => {
              setTechnologyDropdownValues(value as any);
            }}
          />

          <div className="flex gap-3 items-center overflow-x-scroll rounded-[40px]">
            {selectedTechnologies.map((exp, index) => (
              <div
                className="bg-[#2B2B31] px-4 h-10 gap-2 flex items-center rounded-[40px] w-fit whitespace-nowrap"
                key={index}
              >
                <h3 className="text-white capitalize font-roboto text-sm font-medium">
                  {exp}
                </h3>

                <X
                  className="h-4 w-4 text-[#4e52f5] cursor-pointer"
                  onClick={() => removeTechnology(exp)}
                />
              </div>
            ))}
          </div>

          <SuggestTagPopover />
        </div>
      </div>
      <div className="w-full absolute bottom-[30px] right-8 flex sm:justify-end justify-center gap-4 ">
        <Button
          type="submit"
          className="!min-w-fit gap-2"
          onClick={handleSkillUpdate}
          disabled={submitting}
        >
          {submitting && <Spinner size="small" />} Save
        </Button>
      </div>
    </GenericModal>
  );
};

export default AddSkillAndTechnoloyModal;
