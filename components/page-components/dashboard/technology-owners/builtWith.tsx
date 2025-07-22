import { Input } from "@/components/common/form/input";
import Search from "@/components/icons/Search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Projects } from "@/types/entities";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import EmptyState from "../../profile/ProfileTabs/EmptyState";

import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import useSWR from "swr";
import ParticipantsSkeleton from "../../hackathons/participants/skeletonLoader";
import ProjectCard from "../sections/projects/ProjectCard";

export const BuiltWithTab = () => {
  const params = useParams();

  const fetchProjects = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as Projects[];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    language: "",
    location: "",
    roles: [] as string[],
  });
  const [sortBy, setSortBy] = useState("Default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { selectedOrg } = useTechOwnerStore();

  const { data: projectsData, isLoading } = useSWR<Projects[]>(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/projects`,
    fetchProjects
  );
  const technologies = ["Filecoin", "IPFS", "libp2p"];

  const visibleProjects = useMemo(() => {
    if (!projectsData) return [];

    return projectsData;
  }, [projectsData, searchQuery, filters, sortBy]);

  return (
    <div>
      {isLoading ? (
        <ParticipantsSkeleton />
      ) : (
        <>
          {projectsData?.length !== undefined && (
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-grow font-roboto">
                <Input
                  prefixIcon={<Search />}
                  name="participants"
                  type="text"
                  placeholder="Search participants"
                  value={searchQuery}
                  className="!px-3 !py-2 !text-sm !font-medium !h-[40px] !placeholder:text-secondary-text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                    Standing <ChevronDown color="#4E52F5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
                ></DropdownMenuContent>
              </DropdownMenu>
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
                ></DropdownMenuContent>
              </DropdownMenu>
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
                ></DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="bg-tertiary-bg !border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium"
                    >
                      Sort by{" "}
                      {sortBy === "Looking for teammates" ? (
                        <span className="text-white ml-1">Default</span>
                      ) : (
                        <span className="text-white ml-1">{sortBy}</span>
                      )}
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
                    <DropdownMenuItem
                      onClick={() => setSortBy("Number of projects")}
                      className="text-secondary-text text-sm p-3"
                    >
                      Number of projects
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
          {visibleProjects.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
              {visibleProjects?.map((project) => (
                <ProjectCard key={project.id} props={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No participants yet"
              description="When hackathon participants join, they’ll appear here"
              buttonLabel="Participants"
              href="/people"
            />
          )}
        </>
      )}
    </div>
  );
};
