"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { TOReminderIcon } from "@/components/icons/technoogyowner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import axios from "axios";
import { ChevronDown, Search, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { JudgeDataType } from "../page";
import { AddJudgeModal } from "./addJudge";
import TOEditJudges from "./editJudge";
import { Project } from "./project-manager";

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
    <DropdownMenuTrigger asChild className="basis-[16.7%]">
      <button className="flex items-center justify-between text-secondary-text  hover:text-white text-sm font-normal">
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

const JudgesManager = ({
  judgesData,
  projectsData,
  hackathonId,
  showTitle,
}: {
  judgesData: JudgeDataType[];
  projectsData: Project[];
  hackathonId: string;
  showTitle?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterChallenges, setFilterChallenges] = useState<string[]>([]);
  const [loadingChallengeId, setLoadingChallengeId] = useState<number | null>(
    null
  );
  const [filterAssignWinners, setFilterAssignWinners] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { selectedOrg } = useTechOwnerStore();

  const { mutate } = useSWRConfig();

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

  const handleToggleChange = async (
    judgeId: number,
    challengeId: number,
    checked: boolean
  ) => {
    try {
      setLoadingChallengeId(challengeId);
      const res = await axios.post(
        `/api/challenges/${challengeId}/assign-winner-assigner`,
        { judgeId: judgeId, isWinnerAssigner: checked }
      );
      console.log(res.data);

      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingChallengeId(null);
    }
  };

  const isToggleDisabled = (
    judge: JudgeDataType,
    challengId: number
  ): boolean => {
    // Disabled if judge has no challenges
    if (judge.challenges.length === 0) return true;

    // Check if this judge is assigned to the specific challenge
    const hasChallenge = judge.challenges.some((c) => c.id === challengId);
    if (!hasChallenge) return true;

    // Get all judges assigned to this challenge
    const judgesAssignedToChallenge = judgesData.filter((j) =>
      j.challenges.some((c) => c.id === challengId)
    );

    // Disabled if there's only one judge for this challenge
    if (judgesAssignedToChallenge.length === 1) return true;

    return false;
  };

  const shouldToggleBeChecked = (
    judge: JudgeDataType,
    challengeId: number
  ): boolean => {
    // Get all judges assigned to this challenge
    const judgesAssignedToChallenge = judgesData.filter((j) =>
      j.challenges.some((c) => c.id === challengeId)
    );

    // If only one judge is assigned to this challenge, their toggle should be checked
    if (judgesAssignedToChallenge.length === 1) {
      return true;
    }

    // Otherwise return the current state
    const challenge = judge.challenges.find((c) => c.id === challengeId);
    return challenge?.is_winner_assigner || false;
  };

  const allChallenges = useMemo(() => {
    const challengeNames = judgesData.flatMap((judge) =>
      judge.challenges.map((challenge) => challenge.name)
    );
    return Array.from(new Set(challengeNames));
  }, [judgesData]);

  const filteredJudges = useMemo(() => {
    return judgesData?.filter((judge) => {
      // Search filter
      if (
        searchQuery &&
        !judge.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Challenge filter
      if (
        filterChallenges.length > 0 &&
        !judge.challenges.some((challenge) =>
          filterChallenges.includes(challenge.name)
        )
      ) {
        return false;
      }

      // Assign winners filter
      if (filterAssignWinners.length > 0) {
        const hasAssignWinners = judge.challenges.some(
          (challenge) => challenge.is_winner_assigner
        );
        const assignStatus = hasAssignWinners ? "Assigned" : "Not Assigned";

        if (!filterAssignWinners.includes(assignStatus)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterChallenges, filterAssignWinners, judgesData]);

  const getChallengeButton = (challenge: string) => {
    return (
      <Badge
        className={cn(
          "text-xs font-medium rounded-full h-6 px-3 !bg-transparent !border-white !text-white truncate whitespace-nowrap"
        )}
      >
        {challenge}
      </Badge>
    );
  };

  const getAssignWinnersToggle = (
    challenge: { id: number; name: string; is_winner_assigner: boolean },
    judgeId: number
  ) => {
    const judge = judgesData.find((j) => j.judging_id === judgeId);
    if (!judge) return null;
    const isLoading = loadingChallengeId === challenge.id;

    const judgesAssignedToChallenge = judgesData.filter((j) =>
      j.challenges.some((c) => c.id === challenge.id)
    );
    const isOnlyJudge = judgesAssignedToChallenge.length === 1;

    if (isOnlyJudge && !challenge.is_winner_assigner) {
      handleToggleChange(judgeId, challenge.id, true);
    }

    const disabled = isToggleDisabled(judge, challenge.id);
    const checked = disabled
      ? shouldToggleBeChecked(judge, challenge.id)
      : challenge.is_winner_assigner;

    return (
      <div className="flex items-center">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4075FF] rounded-full animate-spin"></div>
        ) : (
          <Switch
            checked={checked}
            onCheckedChange={(checked) =>
              handleToggleChange(judgeId, challenge.id, checked)
            }
            disabled={disabled}
          />
        )}
      </div>
    );
  };

  const getScoreButton = (value: number | null, label: string) => {
    return (
      <button className="bg-transparent border border-white text-white text-xs font-medium rounded-full h-6 px-3 hover:border-gray-400">
        {label}: {value?.toFixed(1) ?? "—"}
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full gap-5 ">
      {/* Header */}
      {showTitle && (
        <div className="flex items-center justify-between font-roboto">
          <h1 className="text-white text-sm uppercase font-medium">Judges</h1>
        </div>
      )}

      {/* Search and Sort */}

      {/* Table */}
      <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
        {/* Table Header */}
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary-bg min-w-[1000px]">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-sm font-medium">Judges</h2>
            <AddJudgeModal hackathonId={hackathonId} />
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
                  <ChevronDown className="h-4 w-4" />
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
          </div>
        </div>
        <div className="min-w-[1000px]">
          <div className="bg-secondary-bg border-t-tertiary-bg border-t flex items-center px-3 py-2 gap-5 min-w-full w-full overflow-x-scroll text-secondary-text">
            <div className="text-secondary-text basis-[16.7%]">Judge</div>
            <FilterDropdown
              label="Challenges"
              items={allChallenges}
              selected={filterChallenges}
              setSelected={setFilterChallenges}
            />
            <FilterDropdown
              label="Assign Winners"
              items={["Assigned", "Not Assigned"]}
              selected={filterAssignWinners}
              setSelected={setFilterAssignWinners}
            />
            <div className="text-secondary-text basis-[16.7%]">Projects</div>
            <div className="text-secondary-text basis-[16.7%]">Progress</div>
            <div className="text-secondary-text basis-[16.7%]">Score Stats</div>
          </div>
          <div className="divide-y divide-tertiary-bg h-[450px] overflow-y-scroll">
            {filteredJudges.map((judge, index) => (
              <div
                key={judge.id}
                className={cn(
                  "px-6 py-4 grid grid-cols-6 gap-4 items-center",
                  index % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
                )}
              >
                {/* Judge Info */}
                <div className="flex items-center gap-3 basis-[16.7%]">
                  {judge?.avatar_url ? (
                    <img
                      src={judge.avatar_url}
                      alt={judge.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                      {getInitials(judge.name)}
                    </div>
                  )}

                  <span
                    className="text-white font-medium
                  text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden"
                  >
                    {judge.name}
                  </span>
                </div>

                {/* Challenges */}
                <div className="flex flex-wrap gap-2 basis-[16.7%] overflow-x-auto">
                  {judge?.challenges.length > 0 ? (
                    judge.challenges.map((challenge) => (
                      <div key={challenge.name}>
                        {getChallengeButton(challenge.name)}
                      </div>
                    ))
                  ) : (
                    <TOEditJudges
                      hackathonId={hackathonId}
                      judge={judge}
                      challenge={judge.challenges}
                      allProjects={projectsData}
                      isAssigning={true}
                    />
                  )}
                </div>

                {/* Assign Winners */}
                <div className="basis-[16.7%] flex-col flex gap-4">
                  {judge?.challenges.length > 0 ? (
                    judge.challenges.map((challenge, index) =>
                      getAssignWinnersToggle(challenge, judge.judging_id)
                    )
                  ) : (
                    <Switch checked={false} disabled />
                  )}
                  {}
                </div>

                {/* Projects */}
                <div className="text-secondary-text basis-[16.7%] text-sm">
                  {judge.total_projects} Projects
                </div>

                {/* Progress */}
                <div className="text-secondary-text basis-[16.7%] text-sm">
                  {judge.progress.toFixed(1)}%
                </div>

                {/* Score Stats */}
                <div className="flex gap-3 items-center basis-[16.7%] relative">
                  <div className="flex gap-2 flex-wrap">
                    {getScoreButton(judge.score_stats.mean, "Mean")}
                    {getScoreButton(judge.score_stats.median, "Median")}
                    {getScoreButton(judge.score_stats.mode, "Mode")}
                  </div>
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === judge.id ? null : judge.id
                      )
                    }
                    className="text-[#9CA3AF] text-lg hover:text-white"
                  >
                    ⋮
                  </button>
                  {openDropdownId === judge.id && (
                    <div
                      ref={(el) => {
                        if (el) dropdownRefs.current[judge.id] = el;
                      }}
                      className="flex py-2 flex-col absolute top-10 -right-2  z-10 justify-start items-start bg-secondary-bg border border-tertiary-bg rounded-[12px]"
                    >
                      <TOEditJudges
                        hackathonId={hackathonId}
                        judge={judge}
                        challenge={judge.challenges}
                        allProjects={projectsData}
                      />
                      <button
                        onClick={() => {
                          setOpenDropdownId(null);
                        }}
                        className="px-4 py-2 text-left w-full text-sm text-heading hover:bg-tertiary-bg flex items-center whitespace-nowrap gap-2 text-secondary-text"
                      >
                        <TOReminderIcon />
                        <span>Remind</span>
                      </button>
                      <button
                        onClick={() => {
                          setOpenDropdownId(null);
                        }}
                        className="py-2 px-4 w-full text-left text-sm text-error hover:bg-tertiary-bg flex items-center whitespace-nowrap gap-2"
                      >
                        <Trash2Icon color="#C81E17" size={18} />
                        <span className="text-[#C81E17]">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-white text-sm py-4 px-3 border-t border-t-tertiary-bg">
            {filteredJudges.length} Judges
          </div>
        </div>

        {/* Table Body */}
      </div>
    </div>
  );
};

export default JudgesManager;
