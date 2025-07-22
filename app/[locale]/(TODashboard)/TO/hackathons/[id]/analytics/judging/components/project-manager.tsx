"use client";

import { Checkbox } from "@/components/common/Checkbox";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HackathonChallenges } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios, { AxiosError } from "axios";
import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { JudgeDataType } from "../page";
import { ProjectsTable, SelectedChallenge } from "./projectTable";
import { useTechOwnerStore } from "@/state/techOwnerStore";

interface TeamMember {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
}

interface Sponsor {
  logo: string;
  name: string;
}

interface Judge {
  judging_id: number;
  full_name: string;
  avatar_url: string | null;
}

interface ProjectChallenge {
  challenge_id: number;
  challenge_name: string;
  sponsors: Sponsor[];
  score: number;
  bot_score: number;
  standing: null | number;
  judges: Judge[];
}

export interface Project {
  project_id: number;
  name: string;
  submitted: boolean;
  team_members: TeamMember[];
  challenges: ProjectChallenge[];
}

interface FilterDropdownProps {
  label: string;
  items: {
    value: number;
    disabled?: boolean;
    label: string;
  }[];
  selected: number[];
  rounded?: boolean;
  setSelected: (selected: number[]) => void;
}

const FilterDropdown = ({
  label,
  items,
  selected,
  rounded,
  setSelected,
}: FilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className={cn(
          "flex flex-shrink-0 items-center justify-between text-secondary-text hover:text-white text-sm font-normal transition-colors",
          rounded
            ? "whitespace-nowrap bg-tertiary-bg border border-tertiary-text h-10 rounded-xl px-4"
            : "basis-[14.3%]"
          // Add disabled style if needed
        )}
      >
        {label}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll text-sm min-w-[200px] border-gray-600 font-roboto"
      onCloseAutoFocus={(e) => e.preventDefault()} // Prevent closing on select
    >
      {items.map((item) => (
        <DropdownMenuItem
          key={item.value}
          className={cn(
            "border-b p-3 border-b-tertiary-text",
            "cursor-pointer"
          )}
          onSelect={(e) => {
            e.preventDefault(); // Prevent default dropdown close behavior

            if (selected.includes(item.value)) {
              setSelected(selected.filter((i) => i !== item.value));
            } else {
              setSelected([...selected, item.value]);
            }
          }}
          // disabled={item.disabled}
        >
          <label className="text-secondary-text text-sm flex items-center gap-3">
            <Checkbox
              checked={selected.includes(item.value)}
              // disabled={item.disabled}
            />
            {item.label}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const ProjectManager = ({
  projectsData,
  judgesData,
  showHeader,
  hackathonId
}: {
  projectsData: Project[];
  judgesData: JudgeDataType[];
  showHeader?: boolean;
  hackathonId: string
}) => {
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [selectedJudges, setSelectedJudges] = useState<number[]>([]);
  const [removeJudges, setRemoveJudges] = useState<number[]>([]);
  const [challenges, setChallenges] = useState<HackathonChallenges[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<
    SelectedChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const {selectedOrg} = useTechOwnerStore()

  const { mutate } = useSWRConfig();

  const fetchChallenges = async () => {
    try {
      const res = await axios.get(`/api/hackathons/${hackathonId}/challenges/search`);
      console.log(res.data);
      setChallenges(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProjects = async () => {
    try {
      setRemoveLoading(true);
      const res = await axios.delete(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects`,
        {
          data: {
            pairs: selectedChallenge.map((challenge) => ({
              projectId: challenge.projectId,
              challengeId: challenge.challengeId,
            })),
          },
        }
      );
      console.log(res);
      setRemoveLoading(false);
      setSelectedChallenge([]);
      toast.success(
        `${
          selectedChallenge?.length > 1 ? "Projects" : "Project"
        } removed Successfully`,
        {
          position: "bottom-right",
        }
      );
      mutate(`/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects`);
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not remove ${
            selectedChallenge?.length > 1 ? "Projects" : "Project"
          } ${error?.response?.data?.error}`,
          {
            position: "bottom-right",
          }
        );

        return;
      }

      toast.error(
        `Could remove ${
          selectedChallenge?.length > 1 ? "Projects" : "Project"
        }  ${error?.message}`,
        {
          position: "bottom-right",
        }
      );
      setRemoveLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    if (selectedJudges.length > 0) {
      const Addpayload = {
        judging_project_challenge_pairs: selectedChallenge.flatMap(
          (challenge) =>
            selectedJudges.map((judge) => ({
              judging_id: judge,
              project_id: challenge.projectId,
              challenge_id: challenge.challengeId,
            }))
        ),
      };

      try {
        const res = await axios.post(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects/judgings`,
          Addpayload
        );
        console.log(res);
        setIsLoading(false);
        setSelectedJudges([]);
        setSelectedChallenge([]);
        toast.success(`Judges assigned Successfully`, {
          position: "bottom-right",
        });
        mutate(`/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects`);
      } catch (error: any) {
        console.log(error);
        setIsLoading(false);
        if (error instanceof AxiosError) {
          toast.error(
            `Could not assign judges ${error?.response?.data?.error}`,
            {
              position: "bottom-right",
            }
          );

          return;
        }

        toast.error(`Could not assign judges ${error?.message}`, {
          position: "bottom-right",
        });
      }
    }
    if (removeJudges?.length > 0) {
      const Removepayload = {
        judging_project_challenge_pairs: selectedChallenge.flatMap(
          (challenge) =>
            removeJudges.map((judge) => ({
              judging_id: judge,
              project_id: challenge.projectId,
              challenge_id: challenge.challengeId,
            }))
        ),
      };
      try {
        const res = await axios.delete(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects/judgings`,
          { data: Removepayload }
        );
        setRemoveJudges([]);
        setSelectedChallenge([]);
        setIsLoading(false);
        toast.success(`Judges removed Successfully`, {
          position: "bottom-right",
        });
        mutate(`/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects`);
      } catch (error: any) {
        setIsLoading(false);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not assign judges ${error?.response?.data?.error}`,
            {
              position: "bottom-right",
            }
          );

          return;
        }

        toast.error(`Could not assign judges ${error?.message}`, {
          position: "bottom-right",
        });
      }
    }
    if (selectedChallenges.length > 0) {
      const challengeAssignmentPayload = {
        project_ids: selectedChallenge.map((challenge) => challenge.projectId),
        challenge_ids: selectedChallenges,
      };

      try {
        const res = await axios.post(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects/judgings`,
          challengeAssignmentPayload
        );
        setSelectedChallenges([]);
        setSelectedChallenge([]);
        setIsLoading(false);
        toast.success(`Challenges assignment successful`, {
          position: "bottom-right",
        });
        mutate(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects`
        );
      } catch (error: any) {
        setIsLoading(false);
        if (error instanceof AxiosError) {
          toast.error(
            `Could not assign challenges ${error?.response?.data?.error}`,
            {
              position: "bottom-right",
            }
          );

          return;
        }

        toast.error(`Could not assign challenges ${error?.message}`, {
          position: "bottom-right",
        });
      }
    }
  };
  const countSelectedProjects = (
    selectedChallenges: SelectedChallenge[]
  ): number => {
    const uniqueProjectIds = new Set<number>();
    selectedChallenges.forEach(({ projectId }) =>
      uniqueProjectIds.add(projectId)
    );
    return uniqueProjectIds.size;
  };

  const isSaveDisabled = useMemo(
    () =>
      selectedChallenges.length === 0 &&
      selectedJudges.length === 0 &&
      removeJudges.length === 0,
    [selectedChallenges, selectedJudges, removeJudges]
  );

  return (
    <div className=" text-white">
      <div className="flex flex-col w-full gap-6 font-roboto">
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm uppercase font-medium tracking-wide">
              ASSIGN JUDGES TO PROJECTS
            </h1>
          </div>
        )}

        {/* Projects Section */}
        <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
          {/* Projects Header */}
          <ProjectsTable
            projectsData={projectsData}
            selectedChallenge={selectedChallenge}
            setSelectedChallenges={setSelectedChallenge}
            ProjectSelectMenu={
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-white text-base">
                  {countSelectedProjects(selectedChallenge)} projects selected
                </span>
                <Button
                  variant="tertiary"
                  size="sm"
                  className="text-error hover:bg-ghost-danger h-8 "
                  onClick={() => setSelectedChallenge([])}
                >
                  X Cancel
                </Button>
                <Button
                  loading={isLoading}
                  onClick={handleSave}
                  size="sm"
                  disabled={isSaveDisabled}
                >
                  save
                </Button>
                <FilterDropdown
                  rounded
                  label="Assign challenge"
                  items={challenges.map((c) => ({
                    value: c.id,
                    disabled: c.is_round_2_only,
                    label: c.challenge_name,
                  }))}
                  selected={selectedChallenges}
                  setSelected={setSelectedChallenges}
                />
                <FilterDropdown
                  rounded
                  label="Assign judge"
                  items={judgesData.map((j) => ({
                    value: j.judging_id,
                    disabled: false,
                    label: j.name,
                  }))}
                  selected={selectedJudges}
                  setSelected={setSelectedJudges}
                />
                <FilterDropdown
                  rounded
                  label="Remove judge"
                  items={judgesData.map((j) => ({
                    value: j.judging_id,
                    disabled: false,
                    label: j.name,
                  }))}
                  selected={removeJudges}
                  setSelected={setRemoveJudges}
                />
                <button
                  onClick={removeProjects}
                  className="bg-[#9A271D] rounded-lg h-9 w-9 flex items-center justify-center hover:bg-[#9A271D]/90"
                >
                  {removeLoading ? (
                    <Spinner />
                  ) : (
                    <Trash2 width="24px" height="24px" />
                  )}
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;
