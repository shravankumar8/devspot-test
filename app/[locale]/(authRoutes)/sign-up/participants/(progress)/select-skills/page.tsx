"use client";

import { MultiSelect } from "@/components/common/form/select/multi";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignupStore } from "@/state";
import { Option } from "@/types/common";
import { UserSkills } from "@/types/entities";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

type Technologies = {
  technologies: string[];
};

export default function SelectSkills() {
  const { setActiveStep, setUserId } = useSignupStore();
  const router = useRouter();

  useEffect(() => {
    setActiveStep(4);
  }, []);

  const { data: skillsData, isLoading: isSkillsDataLoading } = useSWR(
    `/api/profile/skills`,
    fetchSkills
  );

  async function fetchSkills(url: string) {
    try {
      const response = await axios.get<UserSkills & Technologies>(url);

      const experienceOptions: Option[] = response?.data?.experience
        ?.filter(Boolean)
        .map((experience) => ({
          value: experience,
          label: experience,
        }));

      const technologyOptions: Option[] = response?.data?.technologies
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
      router.push("/sign-up/participants/connect-account");
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
    <div className="flex flex-col gap-7 mt-[100px] md:mt-[155px] w-[90vw] sm:w-[500px]">
      <h4 className="font-bold text-[22px] sm:text-[28px] md:text-[32px] leading-[28px] sm:leading-[32px]">
        Select at least one skill to add to your profile
      </h4>
      <p className="font-roboto font-medium text-[#89898C] text-sm sm:text-base">
        You can change this any time.
      </p>

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

      <div className="flex justify-end w-full">
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
  );
}
