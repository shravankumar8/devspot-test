import { Checkbox } from "@/components/common/Checkbox";
import Search from "@/components/icons/Search";
import { initialTechnology } from "@/components/page-components/profile/SkillsAndTechnologies/list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";

const judgingStatus = [
  { label: "All", value: "All" },
  { label: "Needs Review", value: "needs_review" },
  { label: "Judged", value: "judged" },
  { label: "Flagged", value: "flagged" },
];

const challenge = [
  { label: "All", value: "All" },
  { label: "Hard", value: "Hard" },
  { label: "Medium", value: "Medium" },
  { label: "Easy", value: "Easy" },
];

const technologies = initialTechnology.map((tech) => ({
  value: tech,
  label: tech,
}));

const sortBy = [
  {
    label: "Judgebot score (High → Low)",
    value: "Judgebot score (High → Low)",
  },
  {
    label: "Judgebot score (Low → High)",
    value: "Judgebot score (Low → High)",
  },
  { label: "Alphabetical", value: "Alphabetical" },
];

type SearchToolsProps = {
  challenges: any;
  filters: {
    sortBy: string;
    technology: string;
    challenge: string;
    judgingStatus: string;
    searchQuery: string;
    hideDrafts: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      sortBy: string;
      technology: string;
      challenge: string;
      judgingStatus: string;
      searchQuery: string;
      hideDrafts: boolean;
    }>
  >;
};

const SearchTools = ({ setFilters, filters, challenges }: SearchToolsProps) => {
  return (
    <div className="grid grid-cols-12 mb-5 gap-3">
      {/* Search */}
      <div className="col-span-12 xl:col-span-2 flex items-center gap-3">
        <div className="flex items-center border focus-within:dark:border-secondary-text transition-all duration-200 ease-in-out  h-[40px] px-4 gap-4 w-full dark:border-slate-100 rounded-xl dark:bg-tertiary-bg">
          <Search />

          <input
            placeholder="Search Projects"
            className="bg-transparent outline-0 placeholder:text-[14px] placeholder:text-secondary-text text-white font-roboto font-normal py-3 w-full rounded-md text-[14px]"
            type="text"
            onChange={(e) => {
              setFilters((f) => ({
                ...f,
                searchQuery: e.target.value,
              }));
            }}
          />
        </div>
      </div>

      {/* Dropdown 1 */}
      <div className="col-span-6 xl:col-span-2 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="relative w-full px-4 py-2 rounded-xl flex justify-between items-center bg-tertiary-bg border-secondary-text"
          >
            <Button
              variant="ghost"
              size="lg"
              className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium truncate w-full text-left"
            >
              <span className="truncate">
                {!filters.judgingStatus || filters.judgingStatus === "All"
                  ? "Judging Status"
                  : judgingStatus.find((s) => s.value === filters.judgingStatus)
                      ?.label}
              </span>
              <ChevronDown className="ml-2 flex-shrink-0" color="#4E52F5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
          >
            {judgingStatus?.map((judgingStatusItem) => (
              <DropdownMenuItem
                key={judgingStatusItem.value}
                className="border-b p-3 border-b-tertiary-text"
                onClick={() => {
                  setFilters((f) => ({
                    ...f,
                    judgingStatus: judgingStatusItem.value,
                  }));
                }}
              >
                <label className="text-secondary-text text-sm flex items-center gap-3">
                  <Checkbox
                    checked={filters.judgingStatus === judgingStatusItem.value}
                  />

                  {judgingStatusItem.label}
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dropdown 2 — Dynamic Challenges */}
      <div className="col-span-6 xl:col-span-2 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="relative w-full px-4 py-2 rounded-xl flex justify-between items-center bg-tertiary-bg border-secondary-text"
          >
            <Button
              variant="ghost"
              size="lg"
              className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium truncate w-full text-left"
            >
              <span className="truncate">
                {!filters.challenge || filters.challenge === "All"
                  ? "Challenge"
                  : filters.challenge}
              </span>
              <ChevronDown className="ml-2 flex-shrink-0" color="#4E52F5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
          >
            <DropdownMenuItem
              key="All"
              className="border-b p-3 border-b-tertiary-text"
              onClick={() => {
                setFilters((f) => ({ ...f, challenge: "All" }));
              }}
            >
              <label className="text-secondary-text text-sm flex items-center gap-3">
                <Checkbox checked={filters.challenge === "All"} />
                All
              </label>
            </DropdownMenuItem>

            {challenges.map((c: any) => (
              <DropdownMenuItem
                key={c.challenge_name}
                className="border-b p-3 border-b-tertiary-text"
                onClick={() => {
                  setFilters((f) => ({
                    ...f,
                    challenge:
                      f.challenge === c.challenge_name
                        ? "All"
                        : c.challenge_name,
                  }));
                }}
              >
                <label className="text-secondary-text text-sm flex items-center gap-3">
                  <Checkbox checked={filters.challenge === c.challenge_name} />
                  {c.challenge_name}
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dropdown 3 — Technology (single-select with 'All') */}
      <div className="col-span-6 xl:col-span-2 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="relative w-full px-4 py-2 rounded-xl flex justify-between items-center bg-tertiary-bg border-secondary-text"
          >
            <Button
              variant="ghost"
              size="lg"
              className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium truncate w-full text-left"
            >
              <span className="truncate">
                {!filters.technology || filters.technology === "All"
                  ? "Technology"
                  : technologies.find((t) => t.value === filters.technology)
                      ?.label}
              </span>
              <ChevronDown className="ml-2 flex-shrink-0" color="#4E52F5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
          >
            {/* All option */}
            <DropdownMenuItem
              key="All"
              className="border-b p-3 border-b-tertiary-text"
              onClick={() => {
                setFilters((f) => ({
                  ...f,
                  technology: "All",
                }));
              }}
            >
              <label className="text-secondary-text text-sm flex items-center gap-3">
                <Checkbox checked={filters.technology === "All"} />
                All
              </label>
            </DropdownMenuItem>

            {/* Technology options */}
            {technologies.map((techItem) => (
              <DropdownMenuItem
                key={techItem.value}
                className="border-b p-3 border-b-tertiary-text"
                onClick={() => {
                  setFilters((f) => ({
                    ...f,
                    technology:
                      f.technology === techItem.value ? "All" : techItem.value,
                  }));
                }}
              >
                <label className="text-secondary-text text-sm flex items-center gap-3">
                  <Checkbox checked={filters.technology === techItem.value} />
                  {techItem.label}
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dropdown 4 */}
      <div className="col-span-6 xl:col-span-2 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="relative w-full px-4 py-2 rounded-xl flex justify-between items-center bg-tertiary-bg border-secondary-text"
          >
            <Button
              variant="ghost"
              size="lg"
              className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium truncate w-full flex items-center justify-between"
            >
              <span className="truncate">{filters.sortBy || "Sort by"}</span>
              <ChevronDown className="ml-2 flex-shrink-0" color="#4E52F5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-scroll font-roboto text-sm min-w-[272px]"
          >
            {sortBy?.map((sortItem) => (
              <DropdownMenuItem
                key={sortItem.value}
                className="border-b p-3 border-b-tertiary-text"
                onClick={() => {
                  setFilters((f) => ({
                    ...f,
                    sortBy: sortItem.value,
                  }));
                }}
              >
                <label className="text-secondary-text text-sm flex items-center gap-3">
                  <Checkbox checked={filters.sortBy === sortItem.value} />

                  {sortItem.label}
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-6 xl:col-span-2">
        <div className="bg-tertiary-bg border border-tertiary-text rounded-[12px] flex items-center gap-3 py-2 px-4 h-full">
          <Switch
            checked={filters.hideDrafts}
            onCheckedChange={(checked) => {
              setFilters((f) => ({ ...f, hideDrafts: checked }));
            }}
          />
          <p className="text-sm text-secondary-text font-roboto font-medium whitespace-nowrap">
            Hide draft
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchTools;
