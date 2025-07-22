"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { LocationSvg } from "@/components/icons/Location";
import {
  AnalyticsIcon,
  MessageIcon,
  TOEditIcon,
} from "@/components/icons/technoogyowner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { Hackathons } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { isAxiosError } from "axios";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CreateHackathonModal from "./createNewHackathon";
import HackathonRowSkeleton from "./skeletonLoader";

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
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="lg"
        className="flex items-center justify-between text-[#9CA3AF] hover:text-white text-sm font-normal bg-[#374151] px-4 py-2 !rounded-xl"
      >
        {label}
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll text-sm min-w-[200px] border-gray-600"
    >
      {items.map((item) => (
        <DropdownMenuItem
          key={item}
          className="border-b p-3 border-b-tertiary-text cursor-pointer capitalize"
          onClick={() => {
            if (selected.includes(item)) {
              setSelected(selected.filter((i) => i !== item));
            } else {
              setSelected([...selected, item]);
            }
          }}
        >
          <label className="text-secondary-text text-sm flex items-center gap-3 capitalize">
            <Checkbox checked={selected.includes(item)} color="#4E52F5" />
            {item}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const HackathonsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest");
  const { selectedOrg, setSelectedHackathon } = useTechOwnerStore();

  const apiUrl = selectedOrg?.technology_owner_id
    ? `/api/technology-owners/${selectedOrg.technology_owner_id}/hackathons`
    : "/api/empty-endpoint";
  const { data, isLoading, isLoadingMore, loadMoreRef, error } =
    useInfiniteScroll<Hackathons>(apiUrl, 15);

  // useEffect(() => {
  //   if (!selectedOrg) {
  //     toast.info("Please select a technology organization to view hackathons");
  //   }
  // }, [selectedOrg]);

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      toast.error(errorMessage);
    }
  }, [error]);

  const mockHackathons = useMemo(() => {
    const allHackathons = data ?? [];
    const sortedHackathons = allHackathons.sort((a, b) => {
      const dateA = new Date(a.end_date).getTime();
      const dateB = new Date(b.end_date).getTime();
      return dateB - dateA;
    });

    return sortedHackathons;
  }, [data]);

  const allLocations = useMemo(() => {
    const locations = mockHackathons.map((hackathon) => hackathon.location);
    return ["virtual", ...Array.from(new Set(locations))];
  }, []);

  const allStatuses = useMemo(() => {
    const statuses = mockHackathons.map((hackathon) => hackathon.status);
    return Array.from(new Set(statuses));
  }, []);

  const filteredHackathons = useMemo(() => {
    const normalizedFilterLocations = Array.from(
      new Set(filterLocation.map((loc) => loc.toLowerCase()))
    );

    return mockHackathons.filter((hackathon) => {
      // Search filter
      if (
        searchQuery &&
        !hackathon.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      const location = hackathon.location?.toLowerCase() || "";
      const type = hackathon.type?.toLowerCase() || "";

      if (
        normalizedFilterLocations.length > 0 &&
        !normalizedFilterLocations.some(
          (loc) => location.includes(loc) || type.includes(loc)
        )
      ) {
        return false;
      }

      // Status filter
      if (filterStatus.length > 0 && !filterStatus.includes(hackathon.status)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filterLocation, filterStatus, mockHackathons]);

  const getStatusBadge = (status: "live" | "upcoming" | "ended" | "draft") => {
    const statusStyles: Record<string, string> = {
      live: "!bg-[#263513] !text-[#91C152]",
      draft: "!bg-transparent border !border-white !text-white",
      "Judging live": "!bg-[#3400A8] !text-[#C3A8FF]",
      upcoming: "!bg-[#E7E7E8] border border-gray-600 !text-tertiary-text",
      ended: "!bg-[#2B2B31] !text-[#E7E7E8]",
    };

    const texts = {
      live: "Registrations live",
      upcoming: "Upcoming",
      draft: "Draft",
      ended: "Ended",
    };

    return (
      <Badge
        className={cn(
          "text-xs font-medium rounded-full !h-7 px-3",
          statusStyles[status] || statusStyles["Draft"]
        )}
      >
        {texts[status]}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col w-full gap-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <h1 className="text-white font-roboto text-xl font-semibold">
          Your Hackathons
        </h1>
        <CreateHackathonModal />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap font-roboto">
        <div className="relative flex-grow ">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search />}
            className="!h-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <FilterDropdown
            label="Location"
            items={allLocations.filter((loc): loc is string => loc !== null)}
            selected={filterLocation}
            setSelected={setFilterLocation}
          />

          <FilterDropdown
            label="Status"
            items={allStatuses}
            selected={filterStatus}
            setSelected={setFilterStatus}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="bg-tertiary-bg !border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium w-[165px]"
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
                onClick={() => setSortBy("Newest")}
                className="text-secondary-text border-b border-b-tertiary-text text-sm p-3"
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("Name")}
                className="text-secondary-text text-sm p-3"
              >
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
        <div className="min-w-[1000px]">
          <div className="bg-secondary-bg rounded-t-xl flex items-center px-3 py-2 gap-5 min-w-full w-full overflow-x-scroll text-secondary-text">
            <div className="basis-[25%]">Hackathon</div>
            <div className="basis-[15%]">Location</div>
            <div className="basis-[20%]">Date</div>
            <div className="basis-[10%]">Sign ups</div>
            <div className="basis-[15%]">Status</div>
            <div className="basis-[15%]"></div>
          </div>
          <div className="divide-y divide-tertiary-bg">
            {filteredHackathons.map((hackathon, index) => {
              const getHackathonLocation = () => {
                if (hackathon.location == "null" || !hackathon.location)
                  return "N/A";
                return hackathon.location;
              };

              const readableEndDate = hackathon?.end_date
                ? new Date(hackathon.end_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })
                : "";
              const readableStartDate = hackathon?.start_date
                ? new Date(hackathon.start_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })
                : "";
              return (
                <div
                  key={hackathon.id}
                  className={cn(
                    "min-w-full w-full overflow-x-auto flex items-center gap-5 px-3 py-4",
                    index % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
                  )}
                >
                  {/* Hackathon Info */}
                  <div className="flex items-center gap-3 basis-[25%]">
                    {hackathon?.avatar_url?.trim() ? (
                      <img
                        src={hackathon.avatar_url}
                        alt={hackathon.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg object-cover bg-slate-400"></div>
                    )}
                    <span className="text-white font-medium text-base text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] overflow-hidden capitalize">
                      {hackathon.name}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="text-white flex items-center gap-1 text-sm basis-[15%]">
                    {hackathon.location !== "Virtual" && (
                      <LocationSvg className="flex-shrink-0" />
                    )}
                    <span className="text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] overflow-hidden">
                      {getHackathonLocation()}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="text-white text-sm basis-[20%]">
                    {readableStartDate} - {readableEndDate}
                  </div>

                  {/* Sign ups */}
                  <div className="text-white text-sm basis-[10%]">
                    {hackathon?.number_of_participants ?? 0}
                  </div>

                  {/* Status */}
                  <div className="basis-[15%]">
                    {getStatusBadge(hackathon.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 basis-[15%]">
                    <button onClick={() => setSelectedHackathon(hackathon)}>
                      <Link
                        href={`/TO/hackathons/${hackathon.id}/analytics/participants`}
                        className="w-8 h-8 flex items-center justify-center text-white transition-all duration-200 ease-in-out hover:scale-110"
                      >
                        <AnalyticsIcon />
                      </Link>
                    </button>

                    <button
                      onClick={() => setSelectedHackathon(hackathon)}
                      disabled
                      className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] transition-all duration-200 ease-in-out "
                    >
                      <MessageIcon color="#424248" />
                    </button>
                    <button
                      onClick={() => setSelectedHackathon(hackathon)}
                      className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-white"
                    >
                      <Link
                        href={`/TO/hackathons/${hackathon.id}/analytics/hackathons`}
                        className="w-8 h-8 flex items-center justify-center text-white hover:text-white"
                      >
                        <TOEditIcon
                          color="#4E52F5"
                          className="!text-main-primary"
                        />
                      </Link>
                    </button>
                    <button
                      disabled
                      className="text-[#424248] text-lgtransition-all duration-200 ease-in-out"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              );
            })}

            <div ref={loadMoreRef} className="h-1" />

            {(isLoading || isLoadingMore) && <HackathonRowSkeleton />}
          </div>

          <div className="text-white text-sm py-4 px-3 border-t border-t-tertiary-bg">
            {filteredHackathons.length} Hackathon
            {filteredHackathons.length > 1 && "s"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonsManager;
