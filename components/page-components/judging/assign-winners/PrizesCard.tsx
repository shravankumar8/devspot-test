"use client";

import {
  Cash,
  CustomPrizeIcon,
  DevTokenIcon,
} from "@/components/icons/Location";
import {
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "@/components/page-components/projects/constants/bacakground";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Prize } from "@/types/techowners";
import { formatNumber } from "@/utils/stringManipulation";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import { ChevronDown, TrophyIcon } from "lucide-react";

interface JudgeScore {
  judge_id: number;
  judge_user_information: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  score: number;
}

interface ProjectDataInterface {
  id: number;
  name: string;
  tagline: string;
  demo_url: string;
  logo_url: string;
  submitted: boolean;
  video_url: string;
  created_at: string;
  header_url: string | null;
  updated_at: string;
  description: string;
  project_url: string;
  hackathon_id: number;
  technologies: string[];
  project_code_type: string;
  accepting_participants: boolean;
  judges_scores: JudgeScore[];
  average_score: number;
}

interface ProjectDropdownProps {
  projects: ProjectDataInterface[];
  prize: Prize;
  selectedProjectId: number | null;
  submitted: boolean;
  onSelectProject: (projectId: number) => void;
}

const ProjectDropdown = ({
  projects,
  prize,
  submitted,
  selectedProjectId,
  onSelectProject,
}: ProjectDropdownProps) => {
  const getLogoSource = (logo_url: string | null) => {
    if (!logo_url) return null;

    let selectedLogoIndex = LOGO_TEMPLATES.indexOf(logo_url);

    if (selectedLogoIndex >= 0) {
      return (
        <div
          className={`${cn(
            selectedLogoIndex % 2 == 0 ? "bg-[#13131a] " : "bg-[#E7E7E8]",
            "w-6 h-6 rounded flex justify-center items-center"
          )}`}
        >
          <LogoPlaceholder index={selectedLogoIndex} />
        </div>
      );
    }

    return logo_url;
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="relative flex justify-between items-center bg-tertiary-bg px-4 py-2 border-secondary-text rounded-xl w-full"
      >
        <Button
          variant="ghost"
          size="lg"
          className="!border !border-tertiary-text !font-roboto !font-medium text-white !text-sm"
          disabled={projects.length === 0 || submitted}
        >
          {selectedProjectId ? (
            <div className="flex items-center gap-2">
              <span className="truncate text-white">
                {projects.find((p) => p.id === selectedProjectId)?.name}
              </span>
              {projects.find((p) => p.id === selectedProjectId)
                ?.average_score !== null && (
                <span
                  className={`bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white text-xs font-normal px-2 h-6 flex justify-center items-center rounded-full`}
                >
                  {projects
                    .find((p) => p.id === selectedProjectId)
                    ?.average_score?.toFixed(1)}
                </span>
              )}
            </div>
          ) : prize?.winner_project_id ? (
            <div className="flex items-center gap-2 w-full justify-start">
              <span className="truncate text-white w-[60%] text-left">
                {projects.find((p) => p.id === prize?.winner_project_id)?.name}
              </span>

              <span
                className={`bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white text-xs font-normal px-2 h-6 flex justify-center items-center rounded-full`}
              >
                {projects
                  .find((p) => p.id === prize?.winner_project_id)
                  ?.average_score?.toFixed(1)}
              </span>
            </div>
          ) : (
            "Assign Project"
          )}
          <ChevronDown color="#4E52F5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="left-0 !bg-tertiary-bg p-0 min-w-[272px] max-h-[300px] overflow-y-auto font-roboto text-gray-300 text-sm w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        {projects?.map((project) => {
          const logoSource = getLogoSource(project?.logo_url);
          return (
            <DropdownMenuItem
              key={project.id}
              className={cn(
                `p-3 border-b border-b-tertiary-text hover:bg-secondary-bg cursor-pointer ${
                  selectedProjectId == project.id ? "bg-secondary-bg" : ""
                }`
              )}
              onClick={() => onSelectProject(project.id)}
            >
              <label className="flex items-center gap-3 text-secondary-text text-sm w-full">
                {typeof logoSource === "string" ? (
                  project?.logo_url ? (
                    <img
                      src={project?.logo_url}
                      alt={project.name}
                      className="w-6 h-6 rounded object-contain"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                      {getInitials(project.name)}
                    </div>
                  )
                ) : (
                  logoSource
                )}

                <span className="truncate text-white">{project.name}</span>
                {project.average_score !== null && (
                  <span
                    className={`bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white text-xs font-normal px-2 h-6 flex justify-center items-center rounded-full`}
                  >
                    {project.average_score.toFixed(1)}
                  </span>
                )}
              </label>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const trophyColors: Record<number, string> = {
  1: "stroke-yellow-400",
  2: "stroke-gray-300",
  3: "stroke-gray-300",
};

const placeLabels: Record<number, string> = {
  1: "1ST PLACE",
  2: "2ND PLACE",
  3: "3RD PLACE",
};

type PrizeCardProps = {
  prize: Prize;
  onProjectSelect: (prizeId: number, projectId: number | null) => void;
  assignedProjects: number[];
  currentAssignment: number | null;
  challengeId: number;
  projects: ProjectDataInterface[];
  submittedWinners: boolean;
};

const PrizeCard = ({
  prize,
  onProjectSelect,
  challengeId,
  assignedProjects,
  currentAssignment,
  submittedWinners,
  projects,
}: PrizeCardProps) => {
  const trophyColor = prize?.rank
    ? trophyColors[prize?.rank]
    : "stroke-yellow-400";
  const placeLabel = prize?.rank ? placeLabels[prize?.rank] : `${prize?.title}`;

  const handleProjectSelect = (projectId: number) => {
    if (projectId === currentAssignment) {
      // Deselect if same project is clicked again
      onProjectSelect(prize.id, null);
    } else {
      onProjectSelect(prize.id, projectId);
    }
  };

  // Filter out already assigned projects (except the currently selected one)
  const availableProjects =
    projects?.filter(
      (project) =>
        !assignedProjects.includes(project.id) ||
        project.id === currentAssignment
    ) || [];

  const formattedAmount = formatNumber(prize?.prize_usd ?? 0);

  return (
    <div className="relative col-span-12 lg:col-span-4 bg-gradient-to-b from-[#16161D] to-[#28282E] p-5 rounded-xl min-h-[204px]">
      <header>
        <div className="flex items-center gap-2">
          {prize.prize_usd && (
            <div className="flex items-center gap-3">
              <Cash className="flex-shrink-0" />
              <p className="text-[28px] font-semibold">${formattedAmount}</p>
            </div>
          )}
          {prize.prize_tokens && (
            <div
              className={cn(
                `text-base font-roboto 
                flex items-center gap-3`
              )}
            >
              <DevTokenIcon width="32px" height="32px" /> {prize.prize_tokens}
            </div>
          )}
          {prize.prize_custom && (
            <div
              className={cn("text-base font-roboto flex items-center gap-3")}
            >
              <CustomPrizeIcon className="flex-shrink-0" /> {prize.prize_custom}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          {prize?.rank && prize?.rank < 4 ? (
            <TrophyIcon size={32} className={cn(trophyColor)} />
          ) : (
            <div className="w-0 h-8" />
          )}
          <h3 className="font-semibold text-sm">{placeLabel}</h3>
        </div>
      </header>
      <div className="bg-[#2B2B31] my-4 w-full h-[1px]" />

      <ProjectDropdown
        projects={availableProjects}
        selectedProjectId={currentAssignment}
        onSelectProject={handleProjectSelect}
        prize={prize}
        submitted={submittedWinners}
      />
    </div>
  );
};

export default PrizeCard;
