"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/common/Checkbox";
import { cn } from "@/utils/tailwind-merge";
import { ChevronDown, Download, InfoIcon, Search } from "lucide-react";
import { useMemo, useState } from "react";
import CircularProgress from "../challenges/CircularProgress";

type WinnerData = {
  id: string;
  name: string;
  avatar_url?: string | null;
  challenge: string;
  project: string;
  standing: string;
  prizeAllocation: string;
  walletAddress: string;
  kycProgress: number;
  status:
    | "Missing wallet address"
    | "Not paid"
    | "Paid"
    | "Notified to connect"
    | "Notify to connect";
};

type FilterDropdownProps = {
  label: string;
  items: string[];
  selected: string[];
  setSelected: (items: string[]) => void;
  className?: string;
};

const FilterDropdown = ({
  label,
  items,
  selected,
  setSelected,
  className,
}: FilterDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className={className}>
      <button className="flex items-center justify-between text-secondary-text hover:text-white text-sm font-normal">
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
          <label className="text-secondary-text text-sm flex items-center gap-3">
            <Checkbox checked={selected.includes(item)} />
            {item}
          </label>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const PrizePayoutManager = ({
  winnersData,
  showTitle = true,
}: {
  winnersData: WinnerData[];
  showTitle?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterChallenges, setFilterChallenges] = useState<string[]>([]);
  const [filterProjects, setFilterProjects] = useState<string[]>([]);
  const [filterWalletAddress, setFilterWalletAddress] = useState<string[]>([]);
  const [filterKycProgress, setFilterKycProgress] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Challenge");
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const allChallenges = useMemo(() => {
    const challenges = winnersData.map((winner) => winner.challenge);
    return Array.from(new Set(challenges));
  }, [winnersData]);

  const allProjects = useMemo(() => {
    const projects = winnersData.map((winner) => winner.project);
    return Array.from(new Set(projects));
  }, [winnersData]);

  const walletAddressOptions = ["Missing wallet address", "Has wallet address"];
  const kycProgressOptions = ["0%", "50%", "100%"];
  const statusOptions = [
    "Missing wallet address",
    "Not paid",
    "Paid",
    "Notified to connect",
    "Notify to connect",
  ];

  const filteredWinners = useMemo(() => {
    return winnersData?.filter((winner) => {
      // Search filter
      if (
        searchQuery &&
        !winner.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Challenge filter
      if (
        filterChallenges.length > 0 &&
        !filterChallenges.includes(winner.challenge)
      ) {
        return false;
      }

      // Project filter
      if (
        filterProjects.length > 0 &&
        !filterProjects.includes(winner.project)
      ) {
        return false;
      }

      // Wallet address filter
      if (filterWalletAddress.length > 0) {
        const hasWallet = winner.walletAddress && winner.walletAddress !== "";
        const walletStatus = hasWallet
          ? "Has wallet address"
          : "Missing wallet address";
        if (!filterWalletAddress.includes(walletStatus)) {
          return false;
        }
      }

      // KYC Progress filter
      if (filterKycProgress.length > 0) {
        const kycStatus = `${winner.kycProgress}%`;
        if (!filterKycProgress.includes(kycStatus)) {
          return false;
        }
      }

      // Status filter
      if (filterStatus.length > 0 && !filterStatus.includes(winner.status)) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    filterChallenges,
    filterProjects,
    filterWalletAddress,
    filterKycProgress,
    filterStatus,
    winnersData,
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWinners(filteredWinners.map((winner) => winner.id));
    } else {
      setSelectedWinners([]);
    }
  };

  const handleSelectWinner = (winnerId: string, checked: boolean) => {
    if (checked) {
      setSelectedWinners([...selectedWinners, winnerId]);
    } else {
      setSelectedWinners(selectedWinners.filter((id) => id !== winnerId));
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Winner",
      "Challenge",
      "Project",
      "Standing",
      "Prize Allocation",
      "Wallet Address",
      "KYC Progress",
      "Status",
    ];

    const csvData = filteredWinners.map((winner) => [
      winner.name,
      winner.challenge,
      winner.project,
      winner.standing,
      winner.prizeAllocation,
      winner.walletAddress || "N/A",
      `${winner.kycProgress}%`,
      winner.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prize-payout.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getChallengeButton = (challenge: string) => {
    return (
      <Badge
        className={cn(
          "text-xs font-medium rounded-full h-6 px-3 !bg-transparent !border-white !text-white truncate whitespace-nowrap"
        )}
      >
        {challenge}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "Missing wallet address":
        "!bg-[#58120A] !text-[#EB7E76] !border-red-500/30",
      "Not paid": "!bg-[#2B2B31] !text-[#E7E7E8] !border-gray-500/30",
      Paid: "!bg-green-500/20 !text-green-400 !border-green-500/30",
      "Notified to connect": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Notify to connect": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };

    return (
      <Badge
        className={cn(
          "text-xs whitespace-nowrap font-medium rounded-2xl h-6 px-3 border",
          statusColors[status as keyof typeof statusColors] ||
            "bg-gray-500/20 text-gray-400 border-gray-500/30"
        )}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Header */}
      {showTitle && (
        <div className="flex items-center justify-between font-roboto">
          <h1 className="text-white text-sm uppercase font-medium">
            Prize Payout
          </h1>
        </div>
      )}

      {/* Table */}
      <div className="border border-tertiary-bg font-roboto rounded-xl overflow-x-scroll">
        {/* Table Header */}
        <div className="flex items-center justify-between gap-4 p-3 bg-secondary-bg min-w-[1200px]">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-sm font-medium">Prize Payout</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search winners"
                value={searchQuery}
                className="h-10 bg-tertiary-bg border-tertiary-text text-white placeholder:text-secondary-text pl-10"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-text" />
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
                  onClick={() => setSortBy("Challenge")}
                  className="text-gray-300 text-sm flex items-center gap-3 border-b p-3 border-b-tertiary-text cursor-pointer"
                >
                  Challenge
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("Standing")}
                  className="text-gray-300 text-sm flex items-center gap-3 p-3 cursor-pointer"
                >
                  Standing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={downloadCSV} variant="tertiary">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </div>

        <div className="min-w-[1200px]">
          {/* Filter Row */}
          <div className="bg-secondary-bg border-t-tertiary-bg border-t flex items-center px-3 py-2 gap-5 text-secondary-text">
            <div className="flex items-center gap-2 basis-[11%]">
              <Checkbox
                checked={
                  selectedWinners.length === filteredWinners.length &&
                  filteredWinners.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-secondary-text text-sm">Winner</span>
            </div>
            <FilterDropdown
              label="Challenge"
              items={allChallenges}
              selected={filterChallenges}
              setSelected={setFilterChallenges}
              className="basis-[11%]"
            />
            <FilterDropdown
              label="Project"
              items={allProjects}
              selected={filterProjects}
              setSelected={setFilterProjects}
              className="basis-[11%]"
            />
            <div className="text-secondary-text basis-[11%]">Standing</div>
            <div className="text-secondary-text basis-[11%]">
              Prize allocation
            </div>
            <FilterDropdown
              label="Wallet address"
              items={walletAddressOptions}
              selected={filterWalletAddress}
              setSelected={setFilterWalletAddress}
              className="basis-[13%]"
            />
            <FilterDropdown
              label="KYC Progress"
              items={kycProgressOptions}
              selected={filterKycProgress}
              setSelected={setFilterKycProgress}
              className="basis-[11%]"
            />
            <FilterDropdown
              label="Status"
              items={statusOptions}
              selected={filterStatus}
              setSelected={setFilterStatus}
              className="basis-[12%]"
            />
            <div className="basis-[9%]"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-tertiary-bg h-[450px] overflow-y-scroll">
            {filteredWinners.map((winner, index) => (
              <div
                key={winner.id}
                className={cn(
                  "px-3 py-4 grid grid-cols-9 gap-5 items-center",
                  index % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
                )}
              >
                {/* Winner */}
                <div className="flex items-center gap-3 ">
                  <Checkbox
                    className="flex-shrink-0"
                    checked={selectedWinners.includes(winner.id)}
                    onCheckedChange={(checked) =>
                      handleSelectWinner(winner.id, checked)
                    }
                  />
                  {winner.avatar_url ? (
                    <img
                      src={winner.avatar_url}
                      alt={winner.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                      {getInitials(winner.name)}
                    </div>
                  )}
                  {/* <span className="text-white font-medium text-sm truncate">
                    {winner.name}
                  </span> */}
                </div>

                {/* Challenge */}
                <div className="flex items-center gap-2">
                  {getChallengeButton(winner.challenge)}
                </div>

                {/* Project */}
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{winner.project}</span>
                </div>

                {/* Standing */}
                <div className="text-white text-sm">{winner.standing}</div>

                {/* Prize Allocation */}
                <div className="text-white text-sm">
                  {winner.prizeAllocation}
                </div>

                {/* Wallet Address */}
                <div className="text-white text-sm truncate">
                  {winner.walletAddress || (
                    <span className="flex items-center gap-2 overflow-x-auto">
                      <InfoIcon color="#D64D41" size={18} className="flex-shrink-0"/>
                      <Button variant="tertiary" size="sm" className="!text-sm">
                        Notify to connect
                      </Button>
                    </span>
                  )}
                </div>

                {/* KYC Progress */}
                <div className="text-white text-sm">
                  <CircularProgress percentage={winner?.kycProgress} />
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 overflow-x-auto basis-[12%]">
                  {getStatusBadge(winner.status)}
                </div>
                <div className=" self-center">
                  <Button size="sm" disabled>
                    Pay
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-white text-sm py-4 px-3 border-t border-t-tertiary-bg">
            {filteredWinners.length} Projects
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizePayoutManager;
