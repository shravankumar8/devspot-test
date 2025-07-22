"use client";

import { MultiSelect } from "@/components/common/form/select/multi";
import Search from "@/components/icons/Search";
import { TOEditIcon } from "@/components/icons/technoogyowner";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonChallenges } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { JudgeDataType } from "../page";
import { Project } from "./project-manager";
import { ProjectsTable, SelectedChallenge } from "./projectTable";

interface EditJudgeProps {
  judge: JudgeDataType;
  allProjects: Project[];
  challenge: { id: number; name: string; is_winner_assigner: boolean }[];
  isAssigning?: boolean;
  hackathonId: string;
}
const TOEditJudges = ({
  judge,
  challenge,
  allProjects,
  hackathonId,
  isAssigning,
}: EditJudgeProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const [selectedChallenge, setSelectedChallenge] = useState<
    SelectedChallenge[]
  >([]);
  const [judgeChallenges, setJudgeChallenges] = useState<number[]>(
    challenge.map((c) => c.id)
  );

  const [searchInput, setSearchInput] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedNewProject, setSelectedNewProject] = useState<Project | null>(
    null
  );
  const [selectedChallengeForNewProject, setSelectedChallengeForNewProject] =
    useState<number[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [judgeActionLoading, setJudgeActionLoading] = useState<{
    add: boolean;
    remove: boolean;
    newProject: boolean;
  }>({ add: false, remove: false, newProject: false });
  const fetchChallengesData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };
  const { mutate } = useSWRConfig();
  const { selectedOrg } = useTechOwnerStore();

  const { data: challengesData, isLoading: isChallengeDataLoading } = useSWR<
    HackathonChallenges[]
  >(`/api/hackathons/${hackathonId}/challenges/search`, fetchChallengesData);

  const { data: judgeprojects, isLoading: isJudgeProjectsLoading } = useSWR<
    Project[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`,
    fetchChallengesData
  );

  const handleProjectSelect = async (project: Project) => {
    setSelectedNewProject(project);
    setShowSearchResults(false);
    setSelectedChallengeForNewProject([]);
    setSearchInput(project.name);
  };

  const handleAddProject = async () => {
    if (selectedNewProject && selectedChallengeForNewProject) {
      try {
        const projectChallengePairs = selectedChallengeForNewProject.map(
          (challenge_id) => ({
            project_id: selectedNewProject.project_id,
            challenge_id: challenge_id,
          })
        );
        setJudgeActionLoading({ ...judgeActionLoading, newProject: true });
        const res = await axios.put(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/challenges`,
          {
            project_challenge_pairs: projectChallengePairs,
          }
        );
        toast.success(`Project added Successfully`, {
          position: "bottom-right",
        });
        mutate(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
        );
        mutate(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`
        );
        setSelectedNewProject(null);
        setSelectedChallengeForNewProject([]);
        setSearchInput("");
      } catch (error: any) {
        if (error instanceof AxiosError) {
          toast.error(`Could not add project ${error?.response?.data?.error}`, {
            position: "bottom-right",
          });

          return;
        }

        toast.error(`Could not add project ${error?.message}`, {
          position: "bottom-right",
        });
        console.log(error);
      } finally {
        setJudgeActionLoading({ ...judgeActionLoading, newProject: false });
      }
    }
  };

  const searchResults = useMemo(() => {
    if (!searchInput) return [];
    return allProjects.filter((project) =>
      project.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [searchInput, allProjects]);

  const handleAssignJudge = async () => {
    try {
      setJudgeActionLoading({ ...judgeActionLoading, add: true });
      const Addpayload = {
        project_challenge_pairs: selectedChallenge.flatMap((challenge) => ({
          project_id: challenge.projectId,
          challenge_id: challenge.challengeId,
        })),
      };
      const res = await axios.post(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`,
        Addpayload
      );

      onClose();
      toast.success(`Judge assignment Successful`, {
        position: "bottom-right",
      });
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
      );
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`
      );
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(`Could not assign Judges ${error?.response?.data?.error}`, {
          position: "bottom-right",
        });

        return;
      }

      toast.error(`Could not assign Judges ${error?.message}`, {
        position: "bottom-right",
      });
    } finally {
      setJudgeActionLoading({ ...judgeActionLoading, add: false });
      setSelectedChallenge([]);
    }
  };

  const handleRemoveJudge = async () => {
    try {
      setJudgeActionLoading({ ...judgeActionLoading, remove: true });
      const Removepayload = {
        project_challenge_pairs: selectedChallenge.flatMap((challenge) => ({
          project_id: challenge.projectId,
          challenge_id: challenge.challengeId,
        })),
      };
      const res = await axios.delete(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`,
        { data: Removepayload }
      );

      onClose();
      toast.success(`Judge removed successfully`, {
        position: "bottom-right",
      });
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
      );
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`
      );
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(`Could not remove judges ${error?.response?.data?.error}`, {
          position: "bottom-right",
        });

        return;
      }

      toast.error(`Could not remove judges ${error?.message}`, {
        position: "bottom-right",
      });
    } finally {
      setJudgeActionLoading({ ...judgeActionLoading, remove: false });
      setSelectedChallenge([]);
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

  const editChallenges = async (judgeId: number) => {
    try {
      setSubmitting(true);
      const res = await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judgeId}/challenges`,
        {
          challenge_ids: judgeChallenges,
        }
      );
      onClose();
      toast.success(`Judge Challenges updated successfully`, {
        position: "bottom-right",
      });
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
      );
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${judge.judging_id}/projects`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const transformChallengesForDropdown = (
    challenges: Array<{
      id?: number;
      challenge_name: string;
      [key: string]: any; // Other properties we don't need
    }>
  ): Array<{ label: string; value: number }> => {
    return challenges
      .filter((c) => !c.is_round_2_only)
      .map((challenge) => ({
        label: challenge.challenge_name,
        value: challenge?.id ?? challenge?.challenge_id,
      }));
  };

  const handleSubmit = async () => {
    try {
      // setSubmitting(true)
      editChallenges(judge.judging_id);
    } catch (error) {}
  };

  const dropdownOptions = transformChallengesForDropdown(challengesData ?? []);

  const judgeChallengesList = transformChallengesForDropdown(
    selectedNewProject?.challenges ?? []
  );

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        isAssigning ? (
          <Button variant="tertiary" className="text-white text-sm ">
            Assign challenge
          </Button>
        ) : (
          <button className="px-4 py-2 text-left hover:bg-tertiary-bg w-full text-sm text-heading flex items-center whitespace-nowrap gap-2 text-secondary-text">
            <TOEditIcon />
            <span>Edit challenges & projects</span>
          </button>
        )
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[30px] font-semibold">
          {`Edit ${judge.name} challenges and projects`}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-3">
        <p className="mb-3 text-base font-roboto font-normal">{`Edit ${judge.name} challenges.`}</p>
        <div className="">
          <MultiSelect
            options={dropdownOptions}
            isLoading={isChallengeDataLoading}
            placeholder="What challenge(s) are you submitting this project for?"
            isAsync
            value={judgeChallenges}
            onChange={(selectedValues) =>
              setJudgeChallenges(selectedValues as number[])
            }
          />
        </div>
        <div className="flex flex-col w-full gap-4">
          {/* Add Project Search */}

          <p className="text-sm font-roboto pt-3">
            The following is a list of all the projects Alex is judging. Select
            projects to remove them or use the search bar to add new ones.
          </p>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search and add a new project"
              value={searchInput}
              prefixIcon={<Search />}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="h-10"
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-tertiary-bg border border-tertiary-text rounded-xl shadow-lg max-h-60 overflow-auto">
                {searchResults.map((project) => (
                  <div
                    key={project.project_id}
                    className="p-3 bg-tertiary-bg cursor-pointer flex items-center justify-between"
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="flex items-center gap-3">
                      {/* {project. && (
                        <img
                          src={project.logo}
                          alt={project.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )} */}
                      <span className=" font-roboto text-sm text-secondary-text">
                        {project.name}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-secondary-text" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Challenge Selection for New Project */}
          {selectedNewProject && (
            <div className="flex gap-3 items-center">
              <MultiSelect
                options={judgeChallengesList}
                value={selectedChallengeForNewProject}
                className="w-[300px]"
                placeholder="Select challenges"
                isAsync
                onChange={(selectedValues) =>
                  setSelectedChallengeForNewProject(selectedValues as number[])
                }
              />

              <Button
                size="sm"
                onClick={handleAddProject}
                disabled={
                  !selectedChallengeForNewProject || isLoadingChallenges
                }
                loading={judgeActionLoading.newProject}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              >
                Add
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedNewProject(null);
                  setSelectedChallengeForNewProject([]);
                  setSearchInput("");
                }}
                size="sm"
                disabled={isLoadingChallenges}
              >
                Cancel
              </Button>
            </div>
          )}
          {/* Projects Header */}
          {isJudgeProjectsLoading && (
            <div className="h-[250px] w-full flex items-center justify-center">
              <Spinner className="h-10 w-10" />
            </div>
          )}
          {judgeprojects && (
            <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
              <ProjectsTable
                projectsData={judgeprojects}
                selectedChallenge={selectedChallenge}
                isLoading={isJudgeProjectsLoading}
                setSelectedChallenges={setSelectedChallenge}
                ProjectSelectMenu={
                  <div className="flex items-center gap-3">
                    <span className="text-white text-base">
                      {countSelectedProjects(selectedChallenge)} projects
                      selected
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
                      size="sm"
                      variant="ghost"
                      onClick={handleAssignJudge}
                      loading={judgeActionLoading.add}
                    >
                      Add {judge.name} as judge
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveJudge}
                      loading={judgeActionLoading.remove}
                    >
                      Remove {judge.name} as judge
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex sm:justify-end justify-center mt-4 gap-6">
        <Button
          type="button"
          className="w-fit font-roboto text-sm gap-2"
          disabled={submitting}
          onClick={onClose}
          variant={"secondary"}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-fit font-roboto text-sm gap-2"
          onClick={handleSubmit}
          disabled={submitting}
          loading={submitting}
        >
          Save
        </Button>
      </div>
    </GenericModal>
  );
};

export default TOEditJudges;
