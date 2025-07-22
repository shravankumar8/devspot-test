import { MultiSelect } from "@/components/common/form/select/multi";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Option } from "@/types/common";
import { UserSkills } from "@/types/entities";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import EditProfileIcon from "../EditProfileIcon";

const AddSkillAndTechnoloyModal = () => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const { data: skillsData, isLoading: isSkillsDataLoading } = useSWR(
    `/api/profile/skills`,
    fetchSkills
  );

  async function fetchSkills(url: string) {
    try {
      const response = await axios.get<UserSkills>(url);

      const experienceOptions: Option[] = response?.data?.experience
        ?.filter(Boolean)
        .map((experience) => ({
          value: experience,
          label: experience,
        }));

      const technologyOptions: Option[] = response?.data?.technology
        ?.filter(Boolean)
        .map((tech) => ({
          value: tech,
          label: tech,
        }));

      return {
        experienceOptions,
        technologyOptions,
      };
    } catch (error) {
      console.error("Error fetching Roles:", error);
      return null;
    }
  }

  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [experienceDropdownOpen, setExperienceDropdownOpen] = useState(false);
  const [experienceDropdownValues, setExperienceDropdownValues] = useState([]);

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

  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [technologyDropdownOpen, setTechnologyDropdownOpen] = useState(false);
  const [technologyDropdownValues, setTechnologyDropdownValues] = useState([]);

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

  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleUpdateSkills = async () => {
    setSubmitting(true);

    try {
      const payload = {
        skills: {
          experience: selectedExperiences,
          technology: selectedTechnologies,
        },
      };

      await axios.put("/api/profile", payload);
      mutate("/api/profile");
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
      <DialogHeader className="sticky left-6 top-0  bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit Skills
        </DialogTitle>
      </DialogHeader>

      <div className="h-full flex flex-col justify-between">
        <div className="font-roboto ">
          <div className="flex flex-col gap-3">
            <h2 className="text-secondary-text font-normal text-sm capitalize">
              Experience
            </h2>

            <MultiSelect
              showCheckboxes
              isOpen={experienceDropdownOpen}
              onMenuOpenChange={(value) => {
                setExperienceDropdownOpen(value);
              }}
              options={skillsData?.experienceOptions ?? []}
              isLoading={isSkillsDataLoading}
              value={experienceDropdownValues}
              placeholder="Select any applicable experience"
              onChange={(value) => {
                setExperienceDropdownValues(value as any);
              }}
            />

            <div className="flex gap-3 items-center">
              {selectedExperiences.map((exp) => (
                <div
                  className="bg-[#2B2B31] px-4 h-10 gap-2 flex items-center rounded-[40px]"
                  key={exp}
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
            <h2 className="text-secondary-text font-normal text-sm capitalize">
              Technologies
            </h2>

            <MultiSelect
              showCheckboxes
              isOpen={technologyDropdownOpen}
              onMenuOpenChange={(value) => {
                setTechnologyDropdownOpen(value);
              }}
              options={skillsData?.technologyOptions ?? []}
              isLoading={isSkillsDataLoading}
              value={technologyDropdownValues}
              placeholder="Select any applicable technology"
              onChange={(value) => {
                setTechnologyDropdownValues(value as any);
              }}
            />

            <div className="flex gap-3 items-center">
              {selectedTechnologies.map((exp) => (
                <div
                  className="bg-[#2B2B31] px-4 h-10 gap-2 flex items-center rounded-[40px]"
                  key={exp}
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
          </div>
        </div>

        <div className="w-full flex sm:justify-end justify-center mt-4">
          <Button
            type="submit"
            className="w-fit font-roboto text-sm gap-2"
            onClick={handleUpdateSkills}
            disabled={submitting}
          >
            {submitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default AddSkillAndTechnoloyModal;
