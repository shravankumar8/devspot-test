"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { Input } from "@/components/common/form/input";
import Search from "@/components/icons/Search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Projects } from "@/types/entities";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import ProjectCard from "../../dashboard/sections/projects/ProjectCard";
import ProjectCardSkeleton from "../../dashboard/sections/projects/ProjectSkeletonCard";
import EmptyState from "../../profile/ProfileTabs/EmptyState";

export const HackathonProjects = ({hackathonId}: { hackathonId : string}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: [] as string[],
    challenge: [] as string[],
    skills: [] as string[],
  });
  const [sortBy, setSortBy] = useState("Default");

  const {
    data: projects,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteScroll<Projects>(
    `/api/hackathons/${hackathonId}/projects`,
    500
  );

  // Project status options
  const statusOptions = useMemo(() => {
    return [
      { value: "submitted", label: "Submitted" },
      { value: "draft", label: "Draft" },
    ];
  }, []);

  // Extract unique challenges from projects
  const challengeOptions = useMemo(() => {
    if (!projects) return [];
    const challenges = new Set<string>();
    projects.forEach((project) => {
      if (project?.project_challenges) {
        project?.project_challenges.forEach((c) => {
          if (c.hackathon_challenges)
            challenges.add(c?.hackathon_challenges?.challenge_name);
        });
      }
    });

    return Array.from(challenges).map((challenge) => ({
      value: challenge,
      label: challenge,
    }));
  }, [projects]);

  // Extract unique skills/technologies from projects
  const skillOptions = useMemo(() => {
    if (!projects) return [];
    const skills = new Set<string>();
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => {
        skills.add(tech);
      });
    });
    return Array.from(skills).map((skill) => ({
      value: skill,
      label: skill,
    }));
  }, [projects]);

  const visibleProjects = useMemo(() => {
    if (!projects) return [];

    return (
      projects
        // Search by project name or tagline
        .filter((project) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return (
            project?.name?.toLowerCase().includes(q) ||
            project?.tagline?.toLowerCase().includes(q)
          );
        })
        // Filter by status (submitted/draft)
        .filter((project) => {
          if (!filters.status || filters.status.length === 0) return true;

          return filters.status.some((status) => {
            if (status === "submitted") return project.submitted;
            if (status === "draft") return !project.submitted;
            return true;
          });
        })
        // Filter by challenge
        .filter((project) => {
          if (!filters.challenge || filters.challenge.length === 0) return true;

          // Check if any of the project's challenges match the selected filters
          return project.project_challenges?.some(
            (pc) =>
              pc.hackathon_challenges?.challenge_name &&
              filters.challenge.includes(pc.hackathon_challenges.challenge_name)
          );
        })
        // Filter by skills/technologies
        .filter((project) => {
          if (!filters.skills || filters.skills.length === 0) return true;
          return (
            project.technologies &&
            filters.skills.some((skill) =>
              project.technologies?.includes(skill)
            )
          );
        })
        // Sorting
        .sort((a, b) => {
          switch (sortBy) {
            case "Newest":
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case "Alphabetical (A-Z)":
              return (a.name || "").localeCompare(b.name || "");

            default:
              return 0;
          }
        })
    );
  }, [projects, searchQuery, filters, sortBy]);
  console.log(challengeOptions);

  if (isLoading || isLoadingMore) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(290px,350px),1fr))] gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!projects || projects?.length <= 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="When hackathon participants submit their projects, they'll appear here"
      />
    );
  }

  return (
    <div>
      {projects?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-5">
          {/* Search Input */}
          <div className="relative flex-grow font-roboto">
            <Input
              prefixIcon={<Search />}
              name="projects"
              type="text"
              placeholder="Search projects"
              value={searchQuery}
              className="!px-3 !py-2 !text-sm !font-medium !h-[40px] !placeholder:text-secondary-text"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Project Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="relative w-[10rem] px-4 py-2 rounded-[0.625rem] flex justify-between items-center bg-tertiary-bg border-secondary-text"
            >
              <Button
                variant="ghost"
                size="lg"
                className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium"
              >
                Status <ChevronDown color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
            >
              {statusOptions?.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  className="border-b p-3 border-b-tertiary-text"
                  onClick={() => {
                    setFilters((f) => ({
                      ...f,
                      status: f.status.includes(status.value)
                        ? f.status.filter((s) => s !== status.value)
                        : [...f.status, status.value],
                    }));
                  }}
                >
                  <label className="text-secondary-text text-sm flex items-center gap-3">
                    <Checkbox checked={filters.status.includes(status.value)} />
                    {status.label}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Challenge Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="relative w-[10rem] px-4 py-2 rounded-[0.625rem] flex justify-between items-center bg-tertiary-bg border-secondary-text"
            >
              <Button
                variant="ghost"
                size="lg"
                className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium"
              >
                Challenge <ChevronDown color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
            >
              {challengeOptions?.map((challenge) => (
                <DropdownMenuItem
                  key={challenge.value}
                  className="border-b p-3 border-b-tertiary-text"
                  onClick={() => {
                    setFilters((f) => ({
                      ...f,
                      challenge: f.challenge.includes(challenge.value)
                        ? f.challenge.filter((c) => c !== challenge.value)
                        : [...f.challenge, challenge.value],
                    }));
                  }}
                >
                  <label className="text-secondary-text text-sm flex items-center gap-3">
                    <Checkbox
                      checked={filters.challenge.includes(challenge.value)}
                    />
                    {challenge.label}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Skills Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="relative w-[10rem] px-4 py-2 rounded-[0.625rem] flex justify-between items-center bg-tertiary-bg border-secondary-text"
            >
              <Button
                variant="ghost"
                size="lg"
                className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium"
              >
                Skills <ChevronDown color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
            >
              {skillOptions?.map((skill) => (
                <DropdownMenuItem
                  key={skill.value}
                  className="border-b p-3 border-b-tertiary-text"
                  onClick={() => {
                    setFilters((f) => ({
                      ...f,
                      skills: f.skills.includes(skill.value)
                        ? f.skills.filter((s) => s !== skill.value)
                        : [...f.skills, skill.value],
                    }));
                  }}
                >
                  <label className="text-secondary-text text-sm flex items-center gap-3">
                    <Checkbox checked={filters.skills.includes(skill.value)} />
                    {skill.label}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="bg-tertiary-bg !border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium"
              >
                Sort by <span className="text-white ml-1">{sortBy}</span>
                <ChevronDown color="#4E52F5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="font-roboto max-h-[200px] overflow-y-scroll !border-tertiary-text min-w-[272px] !bg-tertiary-bg !self-start"
            >
              <DropdownMenuItem
                onClick={() => setSortBy("Default")}
                className="text-secondary-text border-b border-b-tertiary-text text-sm p-3"
              >
                Default
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("Newest")}
                className="text-secondary-text border-b border-b-tertiary-text text-sm p-3"
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("Alphabetical (A-Z)")}
                className="text-secondary-text border-b border-b-tertiary-text text-sm p-3"
              >
                Alphabetical (A-Z)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {visibleProjects?.map((project) => (
          <ProjectCard key={project?.id} props={project} />
        ))}

        <div ref={loadMoreRef} className="h-1" />
      </div>
    </div>
  );
};
