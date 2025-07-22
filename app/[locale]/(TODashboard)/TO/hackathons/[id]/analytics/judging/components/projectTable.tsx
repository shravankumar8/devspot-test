import { Checkbox } from "@/components/common/Checkbox";
import Spinner from "@/components/common/Spinner";
import Search from "@/components/icons/Search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import { ChevronDown, Download } from "lucide-react";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";

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
export interface SelectedChallenge {
  projectId: number;
  challengeId: number;
}

interface ProjectsTableProps {
  projectsData: Project[];
  ProjectSelectMenu: ReactNode;
  setSelectedChallenges: Dispatch<SetStateAction<SelectedChallenge[]>>;
  selectedChallenge: SelectedChallenge[];
  isLoading?: boolean;
}

type FilterDropdownProps = {
  label: string;
  items: string[];
  selected: string[];
  rounded?: boolean;
  setSelected: (items: string[]) => void;
};

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
          "flex flex-shrink-0  items-center justify-between text-secondary-text hover:text-white text-sm font-normal transition-colors ",
          rounded
            ? "whitespace-nowrap bg-tertiary-bg border border-tertiary-text h-10 rounded-xl px-4"
            : "basis-[12.5%]"
        )}
      >
        {label}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll text-sm min-w-[200px] border-gray-600 font-roboto"
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
            <Checkbox checked={selected.includes(item)} />
            {item}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projectsData = [],
  ProjectSelectMenu,
  selectedChallenge,
  isLoading = false,
  setSelectedChallenges,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterChallenges, setFilterChallenges] = useState<string[]>([]);

  const allChallenges = useMemo(() => {
    const challenges = projectsData?.flatMap((project) =>
      project.challenges.map((challenge) => challenge.challenge_name)
    );
    return Array.from(new Set(challenges));
  }, []);

  const allStatuses = useMemo(() => {
    const statuses = projectsData?.map((project) =>
      project.submitted ? "Submitted" : "Draft"
    );
    return Array.from(new Set(statuses));
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData?.filter((project) => {
      // Search filter
      if (
        searchQuery &&
        !project.name.toLowerCase().includes(searchQuery.toLowerCase())
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

      if (filterStatus.length > 0) {
        const projectStatus = project.submitted ? "Submitted" : "Draft";
        if (!filterStatus.includes(projectStatus)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterChallenges, filterStatus]);

  const toggleChallengeSelection = (projectId: number, challengeId: number) => {
    setSelectedChallenges((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.projectId === projectId && item.challengeId === challengeId
      );

      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { projectId, challengeId }];
      }
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const allChallenges = filteredProjects.flatMap((project) =>
        project.challenges.map((challenge) => ({
          projectId: project.project_id,
          challengeId: challenge.challenge_id,
        }))
      );
      setSelectedChallenges(allChallenges);
    } else {
      setSelectedChallenges([]);
    }
  };

const convertToCSV = (
  projects: Project[],
  selectedChallenges: SelectedChallenge[]
) => {
  const headers = [
    "Project ID",
    "Project Name",
    "Status",
    "Tagline",
    "Description",
    "Project URL",
    "Video URL",
    "Demo URL",
    "Logo URL",
    "Header URL",
    "Technologies",
    "Accepting Participants",
    "Team Members",
    "Team Member Roles",
    "Team Member Prize Allocations",
    "Challenge Name",
    "Sponsors",
    "Judges",
    "Judge Scores",
    "Judgebot Score",
    "Score",
    "Standing",
    "Project Code Type",
    "Created At",
    "Updated At",
  ];

  // Filter projects to only include those with selected challenges if any are selected
  const projectsToExport =
    selectedChallenges.length > 0
      ? projects.filter((project) =>
          selectedChallenges.some((sc) => sc.projectId === project.project_id)
        )
      : projects;

  const rows = projectsToExport.flatMap((project: any) => {
    return project.challenges
      .filter(
        (challenge: any) =>
          selectedChallenges.length === 0 ||
          selectedChallenges.some(
            (sc) =>
              sc.projectId === project.project_id &&
              sc.challengeId === challenge.challenge_id
          )
      )
      .map((challenge: any) => {
        const teamMembers = project.team_members
          .map((member: any) => member.full_name)
          .join(", ");

        const teamMemberRoles = project.team_members
          .map((member: any) =>
            member.is_project_manager ? "Project Manager" : "Member"
          )
          .join(", ");

        const teamMemberAllocations = project.team_members
          .map((member: any) => member.prize_allocation)
          .join(", ");

        const judges = challenge.judges
          .map((judge: any) => judge.full_name)
          .join(", ");

        const judgeScores =
          project.judging_entries
            ?.filter(
              (entry: any) => entry.challenge_id === challenge.challenge_id
            )
            ?.map((entry: any) => entry.score)
            ?.join(", ") || "-";

        const sponsors = challenge.sponsors
          .map((sponsor: any) => sponsor.name)
          .join(", ");

        const technologies = project.technologies?.join(", ") || "";

        return [
          project.project_id,
          project.name,
          project.submitted ? "Submitted" : "Draft",
          project.tagline || "-",
          project.description || "-",
          project.project_url || "-",
          project.video_url || "-",
          project.demo_url || "-",
          project.logo_url || "-",
          project.header_url || "-",
          technologies,
          project.accepting_participants ? "Yes" : "No",
          teamMembers,
          teamMemberRoles,
          teamMemberAllocations,
          challenge.challenge_name,
          sponsors,
          judges,
          judgeScores,
          challenge.bot_score?.toFixed(1) ?? "-",
          challenge.score?.toFixed(1) ?? "-",
          challenge.standing?.toString() ?? "-",
          project.project_code_type || "-",
          project.created_at,
          project.updated_at,
        ];
      });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((field: any) => `"${field?.toString().replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
};

const downloadCSV = (
  projects: Project[],
  selectedChallenges: SelectedChallenge[]
) => {
  const csvContent = convertToCSV(projects, selectedChallenges);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "projects_export.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const renderTeamAvatars = (team: TeamMember[]) => {
    const maxVisible = 3;
    const visibleTeam = team.slice(0, maxVisible);
    const extraCount = team.length - maxVisible;

    return (
      <div className="flex items-center -space-x-2">
        {visibleTeam.map((member, index) =>
          member?.avatar_url ? (
            <img
              key={member.user_id}
              src={member.avatar_url ?? ""}
              alt={member.full_name}
              className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover"
              style={{ zIndex: maxVisible - index }}
            />
          ) : (
            <div
              key={member.user_id}
              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700"
              style={{ zIndex: maxVisible - index }}
            >
              {getInitials(member.full_name)}
            </div>
          )
        )}
        {extraCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs text-white font-medium">
            +{extraCount}
          </div>
        )}
      </div>
    );
  };

  const renderJudgeAvatars = (judges: Judge[] | null | undefined) => {
    // Guard against null/undefined judges
    if (!judges || judges.length === 0) {
      return;
    }

    const maxVisible = 2;
    const visibleJudges = judges.slice(0, maxVisible);
    const extraCount = judges.length - maxVisible;

    // Helper function to get initials (e.g., "Taiwo Ademuyi" → "TA")
    const getInitials = (name: string) => {
      if (!name) return "?";
      const parts = name.split(" ");
      return parts
        .map((part) => part[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 2);
    };

    return (
      <div className="flex items-center -space-x-2">
        {visibleJudges.map((judge, index) =>
          judge.avatar_url ? (
            <img
              key={judge.judging_id}
              src={judge.avatar_url}
              alt={judge.full_name}
              className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
              style={{ zIndex: maxVisible - index }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                // The sibling fallback div will take over
              }}
            />
          ) : (
            <div
              key={judge.judging_id}
              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700"
              style={{ zIndex: maxVisible - index }}
            >
              {getInitials(judge.full_name)}
            </div>
          )
        )}
        {extraCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-200 flex items-center justify-center text-xs text-gray-700 font-medium">
            +{extraCount}
          </div>
        )}
      </div>
    );
  };

  const getChallengeButton = (challenge: ProjectChallenge) => {
    return (
      <Badge
        key={challenge.challenge_id}
        className={cn(
          "text-xs font-medium rounded-full h-6 px-3 border",
          "!bg-transparent !border-white !text-white truncate whitespace-nowrap"
        )}
      >
        ✕ {challenge.challenge_name}
      </Badge>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border-b border-b-tertiary-bg bg-secondary-bg min-w-[1200px]">
        <h2 className="text-white text-sm uppercase font-medium">Projects</h2>
        {selectedChallenge.length > 0 ? (
          ProjectSelectMenu
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                className="h-10"
                placeholder="Search projects"
                prefixIcon={<Search />}
                value={searchQuery}
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
            <Button
              variant="tertiary"
              className="flex items-center gap-2 text-sm"
              onClick={() => downloadCSV(filteredProjects, selectedChallenge)}
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        )}
      </div>

      <div className="min-w-[1200px]">
        {/* Table Header */}
        <div className="bg-secondary-bg border-t-tertiary-bg border-t flex items-center px-3 py-2 gap-4 min-w-full w-full overflow-x-scroll text-secondary-text">
          <div className="flex items-center gap-2 basis-[12.5%]">
            <Checkbox
              onCheckedChange={(checked) => toggleSelectAll(checked)}
              checked={
                selectedChallenge.length > 0 &&
                selectedChallenge.length ===
                  filteredProjects.flatMap((p) => p.challenges).length
              }
            />
            <span className="text-gray-400">Project</span>
          </div>
          <div className="text-gray-400 basis-[12.5%]">Team</div>
          <FilterDropdown
            label="Status"
            items={allStatuses}
            selected={filterStatus}
            setSelected={setFilterStatus}
          />
          <FilterDropdown
            label="Challenge"
            items={allChallenges}
            selected={filterChallenges}
            setSelected={setFilterChallenges}
          />
          <div className="text-gray-400 basis-[12.5%]">Judge</div>
          <div className="text-gray-400 flex gap-6 basis-[12.5%]">
            <span>Judgebot Score</span>
          </div>
          <div className="text-gray-400 flex gap-6 basis-[12.5%]">
            <span>Score</span>
          </div>
          <div className="basis-[12.5%]">
            <span>Standing</span>
          </div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="h-[450px] w-full flex items-center justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        ) : (
          <div className="divide-y divide-tertiary-bg max-h-[450px] overflow-y-scroll">
            {filteredProjects?.map((project, index) => (
              <div
                key={project.project_id}
                className={cn(
                  "px-3 py-4 grid grid-cols-8 gap-4 items-center",
                  index % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
                )}
              >
                {/* Project Info */}
                <div className="flex items-start gap-3 basis-[12.5%]">
                  <div className="flex flex-col gap-3">
                    {project.challenges.map((challenge) => (
                      <Checkbox
                        key={challenge.challenge_id}
                        checked={selectedChallenge.some(
                          (item) =>
                            item.projectId === project.project_id &&
                            item.challengeId === challenge.challenge_id
                        )}
                        onCheckedChange={() =>
                          toggleChallengeSelection(
                            project.project_id,
                            challenge.challenge_id
                          )
                        }
                        className="flex-shrink-0"
                      />
                    ))}
                  </div>

                  {/* {project?. && (
                      <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white flex-shrink-0 text-sm">
                        {project.logo}
                      </div>
                    )} */}
                  <span
                    className="text-white font-medium
                    text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden"
                  >
                    {project.name}
                  </span>
                </div>

                {/* Team */}
                <div className="flex items-center basis-[12.5%]">
                  {renderTeamAvatars(project.team_members)}
                </div>

                {/* Status */}
                <div className="basis-[12.5%]">
                  {project.submitted ? (
                    <Badge className="!bg-[#263513] !text-[#91C152]">
                      Submitted
                    </Badge>
                  ) : (
                    <Badge className="!bg-[#2B2B31] !text-[#E7E7E8] text-xs font-medium rounded-full px-3 py-1">
                      Draft
                    </Badge>
                  )}
                </div>

                {/* Challenges */}
                <div className="flex flex-wrap gap-2 basis-[12.5%]">
                  {project.challenges.map((challenge) =>
                    getChallengeButton(challenge)
                  )}
                </div>

                {/* Judge */}
                <div className="flex items-center basis-[12.5%]">
                  <div className="flex flex-col gap-1">
                    {project.challenges.map((challenge) => (
                      <div key={challenge.challenge_id} className="">
                        {renderJudgeAvatars(challenge.judges)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score & Standing */}
                <div className="flex gap-2 text-gray-400 flex-col basis-[12.5%]">
                  {project.challenges.map((challenge) => (
                    <p className="" key={challenge.challenge_id}>
                      {challenge.bot_score?.toFixed(1) ?? "-"}
                    </p>
                  ))}
                </div>

                {/* Score & Standing */}
                <div className="flex gap-2 text-gray-400 flex-col basis-[12.5%]">
                  {project.challenges.map((challenge) => (
                    <p className="" key={challenge.challenge_id}>
                      {challenge.score?.toFixed(1) ?? "-"}
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-3 basis-[12.5%] w-full justify-between">
                  <div>
                    {project.challenges.map((challenge) => (
                      <p className="block mb-2" key={challenge.challenge_id}>
                        {challenge.standing?.toFixed(1) ?? "-"}
                      </p>
                    ))}
                  </div>

                  <button className="text-white  text-lg">⋮</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-white text-sm py-4 px-3 border-t border-tertiary-bg">
          {filteredProjects?.length} Projects
        </div>
      </div>
    </>
  );
};
