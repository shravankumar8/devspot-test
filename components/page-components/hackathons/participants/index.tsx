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
import { Switch } from "@/components/ui/switch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAuthStore } from "@/state";
import { Option } from "@/types/common";
import {
  HackathonParticipants as HackathonParticipantsType,
  ParticipantRoles,
} from "@/types/entities";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import PeopleCard from "../../dashboard/sections/people/PeopleCard";
import PeopleCardSkeleton from "../../dashboard/sections/people/PeopleSkeletonCard";
import EmptyState from "../../profile/ProfileTabs/EmptyState";
import ParticipantsSkeleton from "./skeletonLoader";

export const HackathonParticipants = ({
  hackathonId,
}: {
  hackathonId: string;
}) => {
  const { user } = useAuthStore();
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    language: "",
    location: "",
    roles: [] as string[],
    languages: [] as string[],
    locations: [] as string[],
    skills: [] as string[],
  });
  const [sortBy, setSortBy] = useState("Default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function getParticipantSubRoleOptions(url: string): Promise<Option[]> {
    try {
      const response = await axios.get<ParticipantRoles[]>(url);
      const options: Option[] = response?.data.map((role) => ({
        value: role.id,
        label: role.name,
      }));
      return options;
    } catch (error) {
      console.error("Error fetching Roles:", error);
      return [];
    }
  }

  const {
    data: hackathonParticipants,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteScroll<HackathonParticipantsType>(
    `/api/hackathons/${hackathonId}/participants`,
    50
  );
  const { data: participantRoles, isLoading: isParticipantRolesFetching } =
    useSWR<Option[]>(`/api/profile/roles`, getParticipantSubRoleOptions);

  // Extract unique languages from participants
  const languageOptions = useMemo(() => {
    if (!hackathonParticipants) return [];
    const languages = new Set<string>();
    hackathonParticipants.forEach((participant) => {
      participant.users?.profile?.skills?.technology?.forEach((lang) => {
        languages.add(lang);
      });
    });
    return Array.from(languages).map((lang) => ({
      value: lang,
      label: lang,
    }));
  }, [hackathonParticipants]);

  // Extract unique locations from participants
  const locationOptions = useMemo(() => {
    if (!hackathonParticipants) return [];
    const locations = new Set<string>();
    hackathonParticipants.forEach((participant) => {
      if (participant.users?.profile?.location) {
        locations.add(participant.users?.profile?.location);
      }
    });
    return Array.from(locations).map((loc) => ({
      value: loc,
      label: loc,
    }));
  }, [hackathonParticipants]);

  // Extract unique skills from participants
  const skillOptions = useMemo(() => {
    if (!hackathonParticipants) return [];
    const skills = new Set<string>();
    hackathonParticipants.forEach((participant) => {
      participant.users?.profile?.skills?.experience?.forEach((exp) => {
        skills.add(exp);
      });
      participant.users?.profile?.skills?.technology?.forEach((tech) => {
        skills.add(tech);
      });
    });
    return Array.from(skills).map((skill) => ({
      value: skill,
      label: skill,
    }));
  }, [hackathonParticipants]);

  const visibleParticipants = useMemo(() => {
    if (!hackathonParticipants) return [];

    return (
      hackathonParticipants
        // Search by name or role
        .filter((p) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return p?.users?.full_name?.toLowerCase().includes(q) || false;
        })
        // Filter by roles
        .filter((p) => {
          if (!filters.roles || filters.roles.length === 0) return true;
          return p.users?.roles?.some(
            (role) =>
              filters.roles.includes(String(role.participant_roles.id)) &&
              role.is_primary
          );
        })
        // Filter by languages
        .filter((p) => {
          if (!filters.languages || filters.languages.length === 0) return true;
          return p.users?.profile?.skills?.technology?.some((lang) =>
            filters.languages.includes(lang)
          );
        })
        // Filter by locations
        .filter((p) => {
          if (!filters.locations || filters.locations.length === 0) return true;
          return (
            p.users?.profile?.location &&
            filters.locations.includes(p.users.profile?.location)
          );
        })
        // Filter by skills
        .filter((p) => {
          if (!filters.skills || filters.skills.length === 0) return true;
          const hasExperienceSkill = p.users?.profile?.skills?.experience?.some(
            (exp) => filters.skills.includes(exp)
          );
          const hasTechnicalSkill = p.users?.profile?.skills?.technology?.some(
            (tech) => filters.skills.includes(tech)
          );
          return hasExperienceSkill || hasTechnicalSkill;
        })
        // Sorting
        .sort((a, b) => {
          switch (sortBy) {
            case "Newest":
              return -1;
            case "Alphabetical (A-Z)":
              return (a?.users?.full_name || "").localeCompare(
                b?.users?.full_name || ""
              );
            case "Number of projects":
              return (
                (a?.users?.project_count || 0) - (b?.users?.project_count || 0)
              );
            case "Looking for teammates":
              return (
                (b?.looking_for_teammates ? 1 : 0) -
                (a?.looking_for_teammates ? 1 : 0)
              );
            default:
              return 0;
          }
        })
    );
  }, [hackathonParticipants, searchQuery, filters, sortBy]);

  return (
    <div>
      {isLoading ? (
        <ParticipantsSkeleton />
      ) : (
        <>
          {hackathonParticipants?.length > 0 && (
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
              <div className="bg-tertiary-bg border border-tertiary-text rounded-[12px] flex items-center gap-3 py-2 px-4">
                <Switch
                  checked={sortBy === "Looking for teammates"}
                  onClick={() => {
                    if (sortBy !== "Looking for teammates") {
                      setSortBy("Looking for teammates");
                    } else {
                      setSortBy("Default");
                    }
                  }}
                />
                <p className="text-sm text-secondary-text font-roboto font-medium">
                  Team up
                </p>
              </div>

              {/* Roles Filter */}
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
                    Roles <ChevronDown color="#4E52F5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
                >
                  {participantRoles?.map((role) => (
                    <DropdownMenuItem
                      key={role.value}
                      className="border-b p-3 border-b-tertiary-text"
                      onClick={() => {
                        setFilters((f) => ({
                          ...f,
                          roles: filters.roles.includes(String(role.value))
                            ? filters.roles.filter(
                                (r) => r !== String(role.value)
                              )
                            : [...filters.roles, String(role.value)],
                        }));
                      }}
                    >
                      <label className="text-secondary-text text-sm flex items-center gap-3">
                        <Checkbox
                          checked={filters.roles.includes(String(role.value))}
                        />
                        {role.label}
                      </label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Languages Filter */}
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
                    Languages <ChevronDown color="#4E52F5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
                >
                  {languageOptions?.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      className="border-b p-3 border-b-tertiary-text"
                      onClick={() => {
                        setFilters((f) => ({
                          ...f,
                          languages: filters.languages.includes(lang.value)
                            ? filters.languages.filter((l) => l !== lang.value)
                            : [...filters.languages, lang.value],
                        }));
                      }}
                    >
                      <label className="text-secondary-text text-sm flex items-center gap-3">
                        <Checkbox
                          checked={filters.languages.includes(lang.value)}
                        />
                        {lang.label}
                      </label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Locations Filter */}
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
                    Locations <ChevronDown color="#4E52F5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
                >
                  {locationOptions?.map((loc) => (
                    <DropdownMenuItem
                      key={loc.value}
                      className="border-b p-3 border-b-tertiary-text"
                      onClick={() => {
                        setFilters((f) => ({
                          ...f,
                          locations: filters.locations.includes(loc.value)
                            ? filters.locations.filter((l) => l !== loc.value)
                            : [...filters.locations, loc.value],
                        }));
                      }}
                    >
                      <label className="text-secondary-text text-sm flex items-center gap-3">
                        <Checkbox
                          checked={filters.locations.includes(loc.value)}
                        />
                        {loc.label}
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
                          skills: filters.skills.includes(skill.value)
                            ? filters.skills.filter((s) => s !== skill.value)
                            : [...filters.skills, skill.value],
                        }));
                      }}
                    >
                      <label className="text-secondary-text text-sm flex items-center gap-3">
                        <Checkbox
                          checked={filters.skills.includes(skill.value)}
                        />
                        {skill.label}
                      </label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
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
          {visibleParticipants.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
              {visibleParticipants?.map((participant) => (
                <Link
                  key={participant.participant_id}
                  href={`/people/${participant.participant_id}`}
                >
                  <PeopleCard
                    participant={participant.users}
                    showTeamUp={participant.looking_for_teammates}
                    hackathonId={parseInt(hackathonId as string)!}
                  />
                </Link>
              ))}

              {(isLoading || isLoadingMore) &&
                Array.from({ length: 10 }).map((_, index) => (
                  <PeopleCardSkeleton key={index} />
                ))}

              <div ref={loadMoreRef} className="h-1" />
            </div>
          ) : (
            <EmptyState
              title="No participants yet"
              description="When hackathon participants join, they'll appear here"
              buttonLabel="Participants"
              href="/people"
            />
          )}
        </>
      )}
    </div>
  );
};
