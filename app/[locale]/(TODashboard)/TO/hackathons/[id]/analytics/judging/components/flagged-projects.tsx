"use client";

import { Checkbox } from "@/components/common/Checkbox";
import Spinner from "@/components/common/Spinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import AvatarGroup from "@/components/ui/avatar-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import { ChevronDown, DownloadIcon, FlagIcon, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

interface ProjectResponse {
  project_id: number;
  name: string;
  team_members: TeamMember[];
  challenges: Challenge[];
}

interface TeamMember {
  user_id: string;
  full_name: string;
  avatar_url: string;
}

interface Challenge {
  challenge_id: number;
  challenge_name: string;
  sponsors: Sponsor[];
  judges: Judge[];
  flags: Flag[];
  bot_score: number;
  project_hidden: boolean;
}

interface Sponsor {
  logo: string;
  name: string;
}

interface Judge {
  judging_id: number;
  full_name: string;
  avatar_url: string;
}

interface Flag {
  flagged_reason: string;
  flagged_by: {
    judging_id: number;
    judge_name: string;
    judge_avatar: string;
    judging_entry_id?: number;
  };
}
type RemoveflagsProps =
  | { judging_entry_id: number }
  | {
      project_id: number;
      challenge_id: number;
    };

type FilterDropdownProps = {
  label: string;
  items: string[];
  selected: string[];
  setSelected: (items: string[]) => void;
};

const FilterDropdown = ({
  label,
  items,
  selected,
  setSelected,
}: FilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="basis-[14.4777777%]">
      <button className="flex items-center justify-between text-secondary-text  hover:text-white text-base font-normal">
        {label}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll text-sm min-w-[200px] border-gray-600"
    >
      {items.map((item) => (
        <DropdownMenuItem
          key={item}
          className="border-b p-3 border-b-tertiary-text cursor-pointer"
          onClick={() => {
            if (selected.includes(item)) {
              setSelected(selected.filter((i) => i !== item));
            } else {
              setSelected([...selected, item]);
            }
          }}
        >
          <label className="text-secondary-text text-sm flex items-center gap-3">
            <Checkbox checked={selected.includes(item)} color="#4E52F5" />
            {item}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const FlaggedProjects = ({ hackathonId }: { hackathonId: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterChallenges, setFilterChallenges] = useState<string[]>([]);
  const [filterJudges, setFilterJudges] = useState<string[]>([]);
  const [filterFlaggedBy, setFilterFlaggedBy] = useState<string[]>([]);
  const [filterBotScore, setFilterBotScore] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    remove: Record<string, boolean>; // key: `${projectId}-${challengeId}`
    hide: Record<string, boolean>; // key: `${projectId}-${challengeId}`
  }>({
    remove: {},
    hide: {},
  });

  const [sortBy, setSortBy] = useState("Newest");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlagToRemove, setSelectedFlagToRemove] = useState<{
    props: RemoveflagsProps;
    isHidden: boolean;
  } | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { selectedOrg } = useTechOwnerStore();
  const { mutate } = useSWRConfig();

  const fetchJudgingsData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data.data;
  };

  const { data: flaggedProjects, isLoading: isFlaggedLoading } = useSWR<
    ProjectResponse[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/projects/flags`,
    fetchJudgingsData
  );

  const handleHideFlag = async (
    projectId: number,
    challengeId: number,
    projectHidden: boolean
  ) => {
    const key = `${projectId}-${challengeId}`;

    try {
      setLoadingStates((prev) => ({
        ...prev,
        hide: { ...prev.hide, [key]: true },
      }));

      await axios.patch(`/api/technology-owners/${selectedOrg?.technology_owner_id}/projects/flags/hide`, {
        project_id: projectId,
        challenge_id: challengeId,
        hidden: !projectHidden,
      });
      // Refresh the data after successful hide
      mutate(`/api/technology-owners/${selectedOrg?.technology_owner_id}/projects/flags`);
      toast.success(`Flag status updated successfully`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error hiding flag:", error);
      toast.error(`Unable to update flag status`, {
        position: "bottom-right",
      });
      // You might want to add error handling/toast notification here
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        hide: { ...prev.hide, [key]: false },
      }));
    }
  };

  const handleRemoveFlag = async (props: RemoveflagsProps) => {
    let key;
    if ("judging_entry_id" in props) {
      key = `${props?.judging_entry_id}`;
    } else {
      key = `${props.project_id}-${props.challenge_id}`;
    }

    try {
      setLoadingStates((prev) => ({
        ...prev,
        remove: { ...prev.remove, [key]: true },
      }));

      const payload =
        "judging_entry_id" in props
          ? { judging_entry_id: props.judging_entry_id }
          : { project_id: props.project_id, challenge_id: props.challenge_id };
      await axios.post(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/projects/flags/remove`,
        payload
      );
      // Refresh the data after successful removal
      mutate(`/api/technology-owners/${selectedOrg?.technology_owner_id}/projects/flags`);
      toast.success(`Flag removed successfully`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error removing flag:", error);
      toast.error(`Unable to remove flag`, {
        position: "bottom-right",
      });
      // You might want to add error handling/toast notification here
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        remove: { ...prev.remove, [key]: false },
      }));
    }
  };
  const handleRemoveFlagWithConfirmation = (
    props: RemoveflagsProps,
    isHidden: boolean
  ) => {
    if (isHidden) {
      // If project is hidden, show confirmation modal
      setSelectedFlagToRemove({ props, isHidden });
      setIsModalOpen(true);
    } else {
      // If not hidden, proceed directly with removal
      // handleRemoveFlag(props);
      console.log(isHidden);
    }
  };
  const allChallenges = useMemo(() => {
    if (!flaggedProjects) return [];
    const challengeNames = flaggedProjects.flatMap((project) =>
      project.challenges.map((challenge) => challenge.challenge_name)
    );
    return Array.from(new Set(challengeNames));
  }, [flaggedProjects]);

  const allJudges = useMemo(() => {
    if (!flaggedProjects) return [];
    const judges = flaggedProjects.flatMap((project) =>
      project.challenges.flatMap((challenge) =>
        challenge.judges.map((judge) => judge.full_name)
      )
    );
    return Array.from(new Set(judges));
  }, [flaggedProjects]);

  const allFlaggedBy = useMemo(() => {
    if (!flaggedProjects) return [];
    const flaggedBy = flaggedProjects.flatMap((project) =>
      project.challenges.flatMap((challenge) =>
        challenge.flags.map((flag) => flag.flagged_by.judge_name)
      )
    );
    return Array.from(new Set(flaggedBy));
  }, [flaggedProjects]);

  const botScoreRanges = useMemo(() => {
    return ["0-2", "2-4", "4-6", "6-8", "8-10"];
  }, []);

  const filteredProjects = useMemo(() => {
    if (!flaggedProjects) return [];

    return flaggedProjects
      .filter((project) => {
        // Search filter
        if (
          searchQuery &&
          !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.team_members.some((member) =>
            member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ) {
          return false;
        }

        // Challenge filter
        if (
          filterChallenges.length > 0 &&
          !project.challenges.some((challenge) =>
            filterChallenges.includes(challenge.challenge_name)
          )
        ) {
          return false;
        }

        // Judge filter
        if (
          filterJudges.length > 0 &&
          !project.challenges.some((challenge) =>
            challenge.judges.some((judge) =>
              filterJudges.includes(judge.full_name)
            )
          )
        ) {
          return false;
        }

        // Flagged by filter
        if (
          filterFlaggedBy.length > 0 &&
          !project.challenges.some((challenge) =>
            challenge.flags.some((flag) =>
              filterFlaggedBy.includes(flag.flagged_by.judge_name)
            )
          )
        ) {
          return false;
        }

        // Bot score filter
        if (filterBotScore.length > 0) {
          const scoreRanges = filterBotScore.map((range) => {
            const [min, max] = range.split("-").map(Number);
            return { min, max };
          });

          if (
            !project.challenges.some((challenge) => {
              const score = challenge.bot_score;
              return scoreRanges.some(
                (range) => score >= range.min && score < range.max
              );
            })
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Name") {
          return a.name.localeCompare(b.name);
        } else {
          // Default to "Newest" (using project_id as proxy)
          return b.project_id - a.project_id;
        }
      });
  }, [
    flaggedProjects,
    searchQuery,
    filterChallenges,
    filterJudges,
    filterFlaggedBy,
    filterBotScore,
    sortBy,
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;

      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(target) &&
        // Check for any modal-related element
        !target.closest('[role="dialog"]') &&
        !target.closest('[data-state="open"]') &&
        !target.closest(".fixed") &&
        !target.closest("[data-radix-portal]") &&
        !target.closest("[data-radix-popper-content-wrapper]")
      ) {
        setOpenDropdownId(null);
      }
    }

    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);
  const handleDownloadCSV = () => {
    if (!flaggedProjects || flaggedProjects.length === 0) return;

    // Define CSV headers
    const headers = [
      "Project Name",
      "Team Members",
      "Challenge",
      "Judges",
      "JudgeBot Score",
      "Flagged By",
      "Flag Reason",
    ];

    // Process data into CSV rows
    const rows = flaggedProjects.map((project) => {
      const teamMembers = project.team_members
        .map((member) => member.full_name)
        .join(", ");

      const challenges = project.challenges
        .map((challenge) => challenge.challenge_name)
        .join(", ");

      const judges = project.challenges
        .flatMap((challenge) =>
          challenge.judges.map((judge) => judge.full_name)
        )
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        .join(", ");

      const botScores = project.challenges
        .map((challenge) => challenge.bot_score.toFixed(1))
        .join(", ");

      const flaggedBy = project.challenges
        .flatMap((challenge) =>
          challenge.flags.map((flag) => flag.flagged_by.judge_name)
        )
        .join(", ");

      const flagReasons = project.challenges
        .flatMap((challenge) =>
          challenge.flags.map((flag) => flag.flagged_reason)
        )
        .join(" | "); // Using | as separator since reasons might contain commas

      return [
        `"${project.name.replace(/"/g, '""')}"`, // Escape quotes in project name
        `"${teamMembers}"`,
        `"${challenges}"`,
        `"${judges}"`,
        `"${botScores}"`,
        `"${flaggedBy}"`,
        `"${flagReasons}"`,
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `flagged_projects_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-5 ">
      {/* Header */}
      {selectedFlagToRemove && (
        <GenericModal
          hasSidebar={false}
          hasMinHeight={false}
          controls={{
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            onOpen: () => setIsModalOpen(true),
          }}
        >
          <DialogHeader className="bg-[#1B1B22] py-2">
            <DialogTitle className="!text-[24px] font-semibold">
              Do you want to unhide the project from the judges dashboard?
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 overflow-y-scroll pb-5 mt-5">
            <p className="text-white font-roboto">
              This project is currently hidden from judges. Would you like to
              unhide it when removing the flag?
            </p>
          </div>

          <div className="w-full flex sm:justify-end justify-center mt-4 gap-6">
            <Button
              type="button"
              className="w-fit font-roboto text-sm gap-2"
              onClick={() => {
                // No - just remove the flag
                handleRemoveFlag(selectedFlagToRemove.props);
                setIsModalOpen(false);
              }}
              variant={"secondary"}
            >
              No, keep hidden
            </Button>
            <Button
              type="button"
              className="w-fit font-roboto text-sm gap-2"
              onClick={async () => {
                // Yes - unhide first, then remove flag
                if ("project_id" in selectedFlagToRemove.props) {
                  await handleHideFlag(
                    selectedFlagToRemove.props.project_id,
                    selectedFlagToRemove.props.challenge_id,
                    true // current state is hidden, so we pass true to unhide
                  );
                }
                handleRemoveFlag(selectedFlagToRemove.props);
                setIsModalOpen(false);
              }}
            >
              Yes, unhide
            </Button>
          </div>
        </GenericModal>
      )}
      <div className="flex items-center justify-between font-roboto">
        <h1 className="text-white text-sm uppercase font-medium">
          Flagged Projects
        </h1>
      </div>

      {/* Search and Sort */}

      {/* Table */}
      <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
        {/* Table Header */}
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary-bg min-w-[1500px]">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-sm font-medium">Flags</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search projects"
                prefixIcon={<Search />}
                value={searchQuery}
                className="h-10"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center border gap-2 text-secondary-text bg-tertiary-bg border-tertiary-text rounded-xl h-10 px-4 text-sm">
                  Sort by <span className="text-white">{sortBy}</span>
                  <ChevronDown className="h-4 w-4 stroke-main-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll text-sm min-w-[200px] border-gray-600 font-roboto"
              >
                <DropdownMenuItem
                  onClick={() => setSortBy("Newest")}
                  className="text-gray-300 text-sm flex items-center gap-3 border-b p-3 border-b-tertiary-text cursor-pointer"
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("Name")}
                  className="text-gray-300 text-sm flex items-center gap-3 p-3 cursor-pointer"
                >
                  Name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 py-4 font-semibold underline font-roboto cursor-pointer"
            >
              <DownloadIcon /> Download CSV
            </div>
          </div>
        </div>
        <div className="min-w-[1500px]">
          <div className="bg-secondary-bg border-t-tertiary-bg border-t flex items-center px-3 py-2 gap-5 min-w-full w-full overflow-x-scroll text-secondary-text">
            <div className="text-secondary-text basis-[14.4777777%]">
              Projects
            </div>
            <div className="text-secondary-text basis-[14.4777777%]">Team</div>
            <FilterDropdown
              label="Challenge"
              items={allChallenges}
              selected={filterChallenges}
              setSelected={setFilterChallenges}
            />
            <FilterDropdown
              label="Judge"
              items={allJudges}
              selected={filterJudges}
              setSelected={setFilterJudges}
            />
            <FilterDropdown
              label="JudgeBot Score"
              items={botScoreRanges}
              selected={filterBotScore}
              setSelected={setFilterBotScore}
            />
            <FilterDropdown
              label="Flagged By"
              items={allFlaggedBy}
              selected={filterFlaggedBy}
              setSelected={setFilterFlaggedBy}
            />
            <div className="text-secondary-text basis-[14.4777777%]">
              Reason
            </div>
            <div className="text-secondary-text basis-[14.4777777%]">
              Comments
            </div>
            <div className="text-secondary-text basis-[14.4777777%]">
              Remove Flag?
            </div>
            <div className="text-secondary-text basis-[14.4777777%]">
              Hide From Judges?
            </div>
          </div>
          <div className="divide-y divide-tertiary-bg h-[450px] overflow-y-scroll">
            {isFlaggedLoading ? (
              <div className="h-[450px] w-full flex items-center justify-center">
                <Spinner className="h-10 w-10" />
              </div>
            ) : filteredProjects?.length > 0 ? (
              filteredProjects?.map((project, index) => (
                <div
                  key={project.project_id}
                  className={cn(
                    "px-6 py-4 grid grid-cols-10 gap-4 items-start",
                    index % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
                  )}
                >
                  {/* Project */}
                  <div className="flex items-center gap-3 basis-[14.4777777%]">
                    <span className="text-white text-sm font-medium">
                      {project.name}
                    </span>
                  </div>

                  {/* Team */}
                  <div className="flex items-center gap-2 basis-[14.4777777%]">
                    <div className="flex items-center">
                      <AvatarGroup limit={3}>
                        {project.team_members?.map((member) => (
                          <Avatar key={member.user_id}>
                            <AvatarImage
                              src={member.avatar_url}
                              alt={member.full_name}
                            />
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="basis-[14.4777777%]">
                    {project.challenges.map((challenge) => (
                      <Badge
                        key={challenge.challenge_id}
                        className={cn(
                          "text-xs font-medium rounded-full h-6 px-3 border",
                          "!bg-transparent !border-white !text-white truncate whitespace-nowrap overflow-x-auto w-full"
                        )}
                      >
                        {challenge.challenge_name}
                      </Badge>
                    ))}
                  </div>

                  {/* Judge */}
                  <div className="flex items-center gap-2 basis-[14.4777777%]">
                    <AvatarGroup limit={3}>
                      {project.challenges.flatMap((challenge) =>
                        challenge.judges.map((judge) => (
                          <Avatar key={judge.judging_id}>
                            <AvatarImage
                              src={judge.avatar_url}
                              alt={judge.full_name}
                            />
                          </Avatar>
                        ))
                      )}
                    </AvatarGroup>
                  </div>

                  {/* JudgeBot Score */}
                  <div className="basis-[14.4777777%]">
                    {project.challenges.map((challenge) => (
                      <span
                        key={challenge.challenge_id}
                        className="text-sm text-white font-medium bg-gradient-to-r from-[#4075FF] to-[#9667FA] px-3 py-1 rounded-full inline-block"
                      >
                        {challenge.bot_score.toFixed(1)}/10
                      </span>
                    ))}
                  </div>

                  {/* Flagged By */}
                  <div className="basis-[14.4777777%]">
                    {project.challenges.flatMap((challenge) =>
                      challenge.flags.map((flag) => (
                        <Avatar
                          key={flag.flagged_by.judging_id}
                          className="border border-white"
                        >
                          <AvatarImage
                            src={flag.flagged_by.judge_avatar}
                            alt={flag.flagged_by.judge_name}
                          />
                        </Avatar>
                      ))
                    )}
                  </div>

                  {/* Reason */}
                  <div className="basis-[14.4777777%] font-medium flex gap-2 flex-col text-sm text-white">
                    <ul className="list-disc list-inside text-xs space-y-2">
                      {project.challenges.flatMap((challenge) =>
                        challenge.flags.map((flag, idx) => (
                          <li key={idx}>{flag.flagged_reason}</li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Comments - Placeholder since not in API */}
                  <div className="basis-[14.4777777%] font-medium flex gap-2 flex-col text-sm text-secondary-text">
                    <ul className="list-inside text-xs space-y-2">
                      <li>-</li>
                    </ul>
                  </div>

                  {/* Remove Flag */}
                  <div className="basis-[14.4777777%] font-medium flex gap-2 flex-col text-sm text-white">
                    {project.challenges.map((challenge) =>
                      challenge.flags.map((flag, idx) => {
                        const key = flag?.flagged_by?.judging_entry_id
                          ? `${flag?.flagged_by?.judging_entry_id}`
                          : `${project.project_id}-${challenge.challenge_id}`;
                        return (
                          <Button
                            loading={loadingStates.remove[key]}
                            key={challenge.challenge_id}
                            size={"sm"}
                            onClick={() =>
                              !flag?.flagged_by?.judging_entry_id
                                ? handleRemoveFlagWithConfirmation(
                                    {
                                      project_id: project.project_id,
                                      challenge_id: challenge.challenge_id,
                                    },
                                    challenge.project_hidden
                                  )
                                : handleRemoveFlagWithConfirmation(
                                    {
                                      judging_entry_id:
                                        flag.flagged_by.judging_entry_id,
                                    },
                                    challenge.project_hidden
                                  )
                            }
                          >
                            Remove flag
                            <FlagIcon className="ml-2 size-4 stroke-white" />
                          </Button>
                        );
                      })
                    )}
                  </div>

                  {/* Hide from judges */}
                  <div className="basis-[14.4777777%] font-medium flex gap-2 flex-col text-sm text-white">
                    {project.challenges.map((challenge) => {
                      const key = `${project.project_id}-${challenge.challenge_id}`;
                      return (
                        <Button
                          key={challenge.challenge_id}
                          onClick={() =>
                            handleHideFlag(
                              project.project_id,
                              challenge.challenge_id,
                              challenge.project_hidden
                            )
                          }
                          loading={loadingStates.hide[key]}
                          className={cn(
                            challenge?.project_hidden
                              ? ""
                              : "!bg-[#9A271D] !text-white"
                          )}
                          size={"sm"}
                          variant="ghost"
                        >
                          {challenge?.project_hidden
                            ? "Unhide project"
                            : "Hide project"}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="flex justify-center items-center h-full w-full text-base font-roboto font-medium">
                No Flagged projects{" "}
              </p>
            )}
          </div>

          <div className="text-white text-sm py-4 px-3 border-t border-t-tertiary-bg">
            {flaggedProjects?.length} Flag
            {flaggedProjects && flaggedProjects?.length > 1 && "s"}
          </div>
        </div>

        {/* Table Body */}
      </div>
    </div>
  );
};

export default FlaggedProjects;
