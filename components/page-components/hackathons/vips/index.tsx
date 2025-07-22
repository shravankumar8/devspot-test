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
import { HackathonVips } from "@/types/entities";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../profile/ProfileTabs/EmptyState";
import VipGridSkeleton from "./skeletonLoader";
import VipCard from "./vipCard";

export const HackathonVIPs = ({ hackathonId }: { hackathonId: string }) => {
  const [Vips, setVips] = useState<HackathonVips[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    hasOfficeHours: false,
    role: "" as "" | "mentor" | "judge",
  });
  const [sortBy, setSortBy] = useState("Default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchVips = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/hackathons/${hackathonId}/vips`);
      const acceptedVips = response.data?.data?.filter(
        (vip: HackathonVips) => vip.status == "accepted"
      );
      setVips(acceptedVips);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVips();
  }, []);

  const visibleVips = useMemo(() => {
    if (!Vips) return [];

    return (
      Vips
        // Search by name
        .filter((vip) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return vip?.users?.full_name?.toLowerCase().includes(q) || false;
        })
        // Filter by office hours
        .filter((vip) => {
          if (!filters.hasOfficeHours) return true;
          return vip.office_hours !== null;
        })
        // Filter by role (mentor = 2, judge = 3)
        .filter((vip) => {
          if (!filters.role) return true;
          if (filters.role === "mentor") return vip.users?.role_id === 2;
          if (filters.role === "judge") return vip.users?.role_id === 3;
          return true;
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
              return (a?.users?.full_name || "").localeCompare(
                b?.users?.full_name || ""
              );
            default:
              return 0;
          }
        })
    );
  }, [Vips, searchQuery, filters, sortBy]);

  return (
    <div>
      {loading ? (
        <VipGridSkeleton />
      ) : (
        <>
          {Vips?.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-grow font-roboto">
                <Input
                  prefixIcon={<Search />}
                  name="vips"
                  type="text"
                  placeholder="Search VIPs"
                  value={searchQuery}
                  className="!px-3 !py-2 !text-sm !font-medium !h-[40px] !placeholder:text-secondary-text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="bg-tertiary-bg border border-tertiary-text rounded-[12px] flex items-center gap-3 py-2 px-4">
                <Switch
                  checked={filters.hasOfficeHours}
                  onClick={() => {
                    setFilters((f) => ({
                      ...f,
                      hasOfficeHours: !f.hasOfficeHours,
                    }));
                  }}
                />
                <p className="text-sm text-secondary-text font-roboto font-medium">
                  Has Office Hours
                </p>
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
                    Role <ChevronDown color="#4E52F5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
                >
                  <DropdownMenuItem
                    className="border-b p-3 border-b-tertiary-text"
                    onClick={() => {
                      setFilters((f) => ({
                        ...f,
                        role: "",
                      }));
                    }}
                  >
                    <label className="text-secondary-text text-sm flex items-center gap-3">
                      <Checkbox checked={filters.role === ""} />
                      All Roles
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-b p-3 border-b-tertiary-text"
                    onClick={() => {
                      setFilters((f) => ({
                        ...f,
                        role: "mentor",
                      }));
                    }}
                  >
                    <label className="text-secondary-text text-sm flex items-center gap-3">
                      <Checkbox checked={filters.role === "mentor"} />
                      Mentors
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="p-3"
                    onClick={() => {
                      setFilters((f) => ({
                        ...f,
                        role: "judge",
                      }));
                    }}
                  >
                    <label className="text-secondary-text text-sm flex items-center gap-3">
                      <Checkbox checked={filters.role === "judge"} />
                      Judges
                    </label>
                  </DropdownMenuItem>
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
                      className="text-secondary-text text-sm p-3"
                    >
                      Alphabetical (A-Z)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {visibleVips.length > 0 ? (
            <div className="py-3">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,450px),1fr))] gap-8">
                {visibleVips?.map((vip, id) => (
                  <Link
                    key={id}
                    href={`${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/people/${vip?.users?.id}`}
                  >
                    <VipCard vip={vip} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No VIPs found"
              description="Try adjusting your search or filters"
              buttonLabel="Clear filters"
              href={`/hackathons/${hackathonId}/vips`}
            />
          )}
        </>
      )}
    </div>
  );
};
