"use client";


import { ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Checkbox } from "@/components/common/Checkbox";
import {
  DocumentationIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  PlayIcon,
} from "@/components/icons/Discover";
import { MeduimIcon } from "@/components/icons/EditPencil";
import Search from "@/components/icons/Search";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { HackathonResources as HackathonResource } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import EmptyState from "../../profile/ProfileTabs/EmptyState";
import { HackathonResourcesSkeleton } from "./skeleton-loader";
import { EditHackathonResources } from "../editHackathon/resources";

type FilterDropdownProps = {
  label: string;
  items: string[];
  selected: any;
  setSelected: any;
};

const FilterDropdown = ({
  label,
  items,
  selected,
  setSelected,
}: FilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="basis-[25%]">
      <button className="flex items-center justify-between text-secondary-text hover:text-white text-base font-roboto font-normal">
        {label}
        <ChevronDown className="h-5 w-5 " />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px] max-w-[300px] sm:max-w-[400px]"
    >
      {items.map((item) => (
        <DropdownMenuItem
          key={item}
          className="border-b p-3 border-b-tertiary-text"
        >
          <label className="text-secondary-text text-sm flex items-center gap-3">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelected([...selected, item]);
                } else {
                  setSelected(selected.filter((i: string) => i !== item));
                }
              }}
              className="flex-shrink-0"
            />
            {item}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
export interface HackathonResourcesProps
  extends Omit<HackathonResource, "challenges"> {
  challenges: string[];
}
export const HackathonResources = ({ hackathonId, isOwner }: { hackathonId: string, isOwner: boolean }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterTech, setFilterTech] = useState<string[]>([]);
  const [filterChallenge, setFilterChallenge] = useState<string[]>([]);
  const [filterSponsor, setFilterSponsor] = useState<string[]>([]);


  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: resources, isLoading } = useSWR<HackathonResourcesProps[]>(
    `/api/hackathons/${hackathonId}/resources`,
    fetchHackathonInformation
  );

  const handleClickResource = async (resourceId: number) => {
    await axios.patch(`/api/hackathons/${hackathonId}/resources/${resourceId}`);
  };

  const getTypeIcon = (type: "Video" | "File" | "Documentation" | "Blog") => {
    const commonClasses =
      "flex items-center gap-1 px-2 h-[24px] bg-[#E7E7E8] rounded-2xl text-tertiary-text font-roboto text-xs font-medium";
    const iconMap = {
      Video: <PlayIcon />,
      Blog: <MeduimIcon />,
      File: <FileIcon />,
      Documentation: <DocumentationIcon />,
    };
    return (
      <p className={commonClasses}>
        {iconMap[type]} {type}
      </p>
    );
  };

  const allTypes = useMemo(() => {
    const unique = new Set(
      resources?.map((r) => r?.type as string).filter(Boolean)
    );
    return Array.from(unique);
  }, [resources]);

  const allTechnologies = useMemo(() => {
    const techs = resources?.flatMap((r) => r.technologies || []);
    const unique = new Set(techs);
    return Array.from(unique);
  }, [resources]);

  const allSponsors = useMemo(() => {
    const all = resources?.flatMap((r) => r.sponsors || []);
    const names = all?.map((s: any) => s.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [resources]);

  const allChallenges = useMemo(() => {
    const all = resources?.flatMap(
      (r) =>
        // @ts-ignore
        r?.challenges || []
    );
    const unique = new Set(all);
    return Array.from(unique);
  }, [resources]);

  if (isLoading) {
    return <HackathonResourcesSkeleton />;
  }

  if (!resources) {
    <EmptyState
      title="No resources yet"
      description="When hackathon organizers add resources, they'd appear here"
      buttonLabel="Resources"
      href="/"
    />;
  }
  const filteredResources = resources?.filter((resource) => {
    // Search query filter
    if (
      searchQuery &&
      !resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (filterType.length > 0 && !filterType.includes(resource?.type!)) {
      return false;
    }

    // Technology filter
    if (
      filterTech.length > 0 &&
      !resource?.technologies?.some((tech) => filterTech.includes(tech))
    ) {
      return false;
    }

    // Challenge filter
    if (
      filterChallenge.length > 0 &&
      // @ts-ignore
      !resource.challenges.some((challenge) =>
        filterChallenge.includes(challenge)
      )
    ) {
      return false;
    }

    // Sponsor filter
    if (
      filterSponsor.length > 0 &&
      Array.isArray(resource?.sponsors) &&
      !resource?.sponsors?.some((sponsor: any) =>
        filterSponsor.includes(sponsor?.name)
      )
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 relative">
      {/* Search Bar */}
      <div className="relative w-full">
        <Input
          prefixIcon={<Search />}
          name="participants"
          type="text"
          placeholder="Search resources"
          value={searchQuery}
          className="!px-0 !py-0 !text-sm !font-medium !h-[40px] !placeholder:text-secondary-text"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className=" border border-tertiary-bg rounded-xl overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Filters */}

          <div className="bg-secondary-bg rounded-t-xl flex items-center px-3 py-2 gap-5 min-w-full w-full overflow-x-scroll">
            <div className="basis-[25%]">
              <p className="text-base text-secondary-text font-roboto">
                Resource
              </p>
            </div>
            <FilterDropdown
              label="Type"
              items={allTypes}
              selected={filterType}
              setSelected={setFilterType}
            />

            <FilterDropdown
              label="Technology"
              items={allTechnologies}
              selected={filterTech}
              setSelected={setFilterTech}
            />

            <FilterDropdown
              label="Challenge"
              items={allChallenges}
              selected={filterChallenge}
              setSelected={setFilterChallenge}
            />

            <FilterDropdown
              label="Sponsor"
              items={allSponsors}
              selected={filterSponsor}
              setSelected={setFilterSponsor}
            />
          </div>
          <div className="relative mt-2">
            <div className="flex flex-col ">
              {filteredResources && filteredResources?.length > 0 ? (
                filteredResources?.map((resource, index) => (
                  <div
                    key={resource.id}
                    className={`min-w-full w-full overflow-x-auto flex items-start gap-5 px-3 py-2 ${cn(
                      index % 2 === 0 ? "bg-transparent" : "bg-[#1B1B22]"
                    )}`}
                  >
                    <div className="basis-[25%]">
                      <Link
                        href={resource?.url ?? ""}
                        onClick={() => handleClickResource(resource.id)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-2 items-center flex-wrap w-full"
                      >
                        <p className="font-roboto text-xs uppercase font-medium max-w-[90%] truncate">
                          {resource.title}
                        </p>
                        {resource.is_downloadable && <DownloadIcon />}
                        {resource.has_external_link && (
                          <ExternalLinkIcon />
                        )}{" "}
                      </Link>
                    </div>
                    <div className="flex gap-2 items-center basis-[25%]">
                      {getTypeIcon(
                        resource?.type! as
                          | "Video"
                          | "File"
                          | "Documentation"
                          | "Blog"
                      )}
                    </div>
                    <div className="flex gap-2 items-center basis-[25%] flex-wrap">
                      {resource?.technologies?.map((tech) => (
                        <Badge
                          key={tech}
                          className="!h-6 !px-2 !bg-[#2B2B31] !text-[#E7E7E8] !text-xs !font-roboto !font-medium !rounded-2xl"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="basis-[25%] flex gap-2 items-center flex-wrap overflow-x-auto">
                      {/* @ts-ignore */}
                      {resource?.challenges?.map((challange) => (
                        <Badge
                          key={challange}
                          className="!h-6 !px-2 !bg-[#3400A8] !text-[#C3A8FF] !text-xs !font-roboto !font-medium !rounded-2xl truncate whitespace-nowrap "
                        >
                          {challange}
                        </Badge>
                      ))}
                    </div>
                    <div className="basis-[25%] flex items-center flex-wrap gap-2">
                      {Array.isArray(resource?.sponsors) &&
                        resource?.sponsors?.map((sponsor: any) => (
                          <Badge
                            key={sponsor.name}
                            className="!h-6 !px-2 border !border-white !bg-transparent rounded-2xl flex gap-2 whitespace-nowrap items-center w-fit"
                          >
                            <img src={sponsor.logo} className="w-4 h-4" />
                            <p className="text-xs text-white font-roboto">
                              {sponsor.name}
                            </p>
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full py-8 text-center text-secondary-text text-base font-roboto">
                  No resources found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOwner && (
        <EditHackathonResources hackathonId={parseInt(hackathonId)} />
      )}
    </div>
  );
};
