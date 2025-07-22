"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import UseModal from "@/hooks/useModal";
import { HackathonParticipants } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import axios from "axios";
import {
  ChevronDown,
  DownloadIcon,
  EllipsisVerticalIcon,
  MessageCircleIcon,
  Search,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import RemoveUserModal from "./ConfirmDeleteModal";
import FadeTransitionLoader from "./FadeTransitionLoader";
import ParticipantsTableSkeleton from "./ParticipantsTableSkeleton";
import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";

// #region types
type Participant = HackathonParticipants & {
  projects: { id: string; name: string }[];
};

export interface JudgeDataType {
  id: string;
  name: string;
  avatar_url: string;
  role: string;
  projects: string[];
  location: string;
  tokens: number;
  is_following: boolean;
  created_at: string; // ISO timestamp
  last_active: string; // ISO timestamp
}

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
          <label className="text-secondary-text text-sm flex items-center gap-3 font-roboto">
            <Checkbox checked={selected.includes(item)} color="#4E52F5" />
            {item}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
// #endregion

const ParticipantsTableV2 = (props: ParticipantsAnalyticsPropsBase) => {
  const { openModal } = UseModal("remove-user-modal");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const escapeCSVValue = (
    value: string | number | boolean | null | undefined
  ) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // Escape double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  };

  const convertToCSV = (data: Participant[]) => {
    if (!data.length) return "";

    const headers = [
      "ID",
      "Name",
      "Role",
      "Location",
      "Tokens",
      "Following",
      "Number of Projects",
      "Projects",
      "Created At",
      "Last Active",
    ];

    const rows = data.map((participant) => [
      escapeCSVValue(participant.id),
      escapeCSVValue(participant.users.full_name),
      escapeCSVValue(participant.users.main_role),
      escapeCSVValue(participant.users.profile?.location || ""),
      escapeCSVValue(participant.tokenBalance),
      escapeCSVValue(participant.following ? "Yes" : "No"),
      escapeCSVValue(participant.projects.length),
      escapeCSVValue(
        participant.projects.map((project) => project.name).join(", ")
      ),
      escapeCSVValue(participant.created_at),
      escapeCSVValue(participant.updated_at),
    ]);

    const csvContent = [headers.map(escapeCSVValue), ...rows]
      .map((row) => row.join(","))
      .join("\n");

    return csvContent;
  };

  const fetchParticipants = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data.data;
  };

  const {
    data: participantsData = { items: [], total: 0 },
    isLoading: participantsIsLoading,
    mutate,
  } = useSWR(
    `/api/technology-owners/${props.technologyOwnerId}/hackathons/${props.hackathonId}/analytics/registrations?search_term=${debouncedSearch}&page=${page}&page_size=${pageSize}&sort_by=${sortBy}`,
    fetchParticipants
  );

  const handleDownloadCSV = () => {
    const csv = convertToCSV(participantsData.items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const sortByOptions = [
    {
      label: "Newest",
      value: "newest",
    },
    {
      label: "Number of Projects",
      value: "number_of_projects",
    },
    {
      label: "Last Active",
      value: "last_active",
    },
  ];

  const roles = ["Developer", "Project Manager", "Builder", "Designer"];

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy]);

  return (
    <div className="flex flex-col w-full gap-5 ">
      {/* Search and Sort */}

      {/* Table */}
      <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
        {/* Table Header */}
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary-bg min-w-[1000px]">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-base font-medium">Sign ups</h2>
            <Button className="ml-4" size={"md"} disabled>
              <MessageCircleIcon className="size-6 mr-2" /> Send a message
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search participants"
                prefixIcon={<Search />}
                value={searchQuery}
                className="h-10"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center border gap-2 text-secondary-text bg-tertiary-bg border-tertiary-text rounded-xl h-10 px-4 text-sm">
                  Sort by{" "}
                  <span className="text-white">
                    {sortByOptions.find((option) => option.value === sortBy)
                      ?.label ?? "Newest"}
                  </span>
                  <ChevronDown className="h-4 w-4 stroke-main-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll text-sm min-w-[200px] border-gray-600 font-roboto"
              >
                {sortByOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className="text-gray-300 text-sm flex items-center gap-3 border-b p-3 border-b-tertiary-text cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 py-4 font-medium underline font-roboto cursor-pointer underline-offset-4 hover:text-white/65 transition-all duration-200 ease-in-out"
            >
              <DownloadIcon className="w-5 h-5" /> Download CSV
            </div>
          </div>
        </div>
        <div className="min-w-[1000px]">
          <div className="bg-secondary-bg border-t-tertiary-bg border-t flex items-center px-3 py-2 gap-5 min-w-full w-full overflow-x-scroll text-secondary-text">
            <div className="text-secondary-text basis-[16.7%]">Participant</div>
            <FilterDropdown
              label="Roles"
              items={roles}
              selected={filterRoles}
              setSelected={setFilterRoles}
            />
            <div className="text-secondary-text basis-[16.7%]">Projects</div>
            <div className="text-secondary-text basis-[16.7%]">Location</div>
            <div className="text-secondary-text basis-[16.7%]">Tokens</div>
            <div className="text-secondary-text basis-[16.7%]">Following</div>
          </div>
          <div className="divide-y divide-tertiary-bg h-[450px] overflow-y-scroll">
            <FadeTransitionLoader
              isLoading={participantsIsLoading}
              loader={<ParticipantsTableSkeleton />}
            >
              {participantsData.items.map(
                (
                  participant: Participant & { projects: any },
                  index: number
                ) => (
                  <div
                    key={participant.id}
                    className={cn(
                      "px-6 py-4 grid grid-cols-6 gap-4 items-center text-sm",
                      index % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
                    )}
                  >
                    {/* Participant */}
                    <div className="flex items-center gap-3 basis-[16.7%]">
                      {participant?.users?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={participant?.users.avatar_url}
                          alt={
                            participant?.users.full_name || "Participant Avatar"
                          }
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                          {getInitials(participant.users.full_name || "")}
                        </div>
                      )}
                      <span className="text-white font-medium truncate">
                        {participant?.users.full_name || ""}
                      </span>
                    </div>

                    {/* Role */}
                    <div className="basis-[16.7%] text-white">
                      {participant.users.main_role}
                    </div>

                    {/* Projects */}
                    <div className="basis-[16.7%] text-white space-y-1">
                      {participant?.projects?.length > 0 ? (
                        participant?.projects?.map(
                          (proj: { id: string; name: string }) => (
                            <p key={proj.id} className="truncate max-w-[180px]">
                              {proj.name}
                            </p>
                          )
                        )
                      ) : (
                        <span className="text-secondary-text">—</span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="basis-[16.7%] text-white">
                      {participant?.users.profile?.location || (
                        <span className="text-secondary-text">—</span>
                      )}
                    </div>

                    {/* Tokens */}
                    <div className="basis-[16.7%] text-white">
                      {participant.tokenBalance}
                    </div>

                    {/* Following */}
                    <div className="basis-[16.7%] text-sm">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={"custom"}
                          className={cn(
                            "px-3 py-1 text-xs font-semibold rounded-full",
                            participant.following
                              ? "bg-[#263513] text-[#91C152]"
                              : "bg-[#6C3C14] text-[#ED9644]"
                          )}
                        >
                          {participant.following ? "Yes" : "No"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <EllipsisVerticalIcon className="h-4 w-4 text-secondary-text cursor-pointer" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="!bg-secondary-bg text-white min-w-[160px] border border-tertiary-bg p-1 rounded-xl shadow-md"
                          >
                            <DropdownMenuItem
                              onClick={openModal}
                              className="text-red-500 flex items-center gap-2 p-2 text-sm font-medium hover:!bg-red-500 hover:!text-white rounded-md cursor-pointer"
                            >
                              <Trash2Icon size={16} />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )
              )}
            </FadeTransitionLoader>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-4 border-t border-t-tertiary-bg text-white text-sm">
            <span>
              Showing page {participantsData.pageNumber} of{" "}
              {participantsData.totalPages} · {participantsData.totalItems}{" "}
              total sign ups
            </span>

            <div className="flex gap-2 items-center">
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!participantsData.hasPreviousPage}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!participantsData.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Table Body */}
      </div>
      <RemoveUserModal />
    </div>
  );
};

export default ParticipantsTableV2;
