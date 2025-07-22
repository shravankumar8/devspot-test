"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDebounce from "@/hooks/useDebounce";
import { Users } from "@/types/entities";
import axios from "axios";
import { Info, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { VIP } from "./useEditVips";
import { Input } from "@/components/ui/input";

interface VIPsDropdownProps {
  selectedVIPs: VIP[]; // Your VIP type
  handleAddUser: (user: Users) => void;
  hackathonId: number;
}

export default function VIPsDropdown(props: VIPsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hackathonId, handleAddUser, selectedVIPs } = props;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  async function fetchPeople(url: string) {
    try {
      const newUrl =
        debouncedQuery.trim() === ""
          ? url
          : `${url}?search_term=${encodeURIComponent(debouncedQuery)}`;
      const response = await axios.get(newUrl);
      return response.data?.data.items;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const {
    data: users = [],
    isLoading,
    isValidating,
    mutate,
  } = useSWR<Users[]>(
    "/api/people", // Your API endpoint
    fetchPeople,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleUserClick = (user: Users) => {
    handleAddUser(user);
    setQuery("");
    setIsOpen(false);
  };

  useEffect(() => {
    mutate();
  }, [debouncedQuery]);

  // Check if user is already added as VIP
  const isUserVIP = (userId: string) => {
    return selectedVIPs.some((vip) => vip.user_id === userId);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="rounded-md w-full shadow-sm font-sans">
        <div className="relative">
          <Input
            type="text"
            prefixIcon={<Search className="text-secondary-text" size={20} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setIsOpen(true)}
            placeholder="Search for and select VIPs"
          />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-tertiary-bg border border-tertiary-text rounded-2xl mt-1 z-10 max-h-40 overflow-y-auto">
            {isLoading || isValidating ? (
              <div className="px-4 py-3 text-secondary-text text-center w-full">
                Loading users...
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  disabled={isUserVIP(user.id)}
                  className="w-full p-3 hover:bg-tertiary-bg/60 cursor-pointer flex items-center bg-tertiary-bg gap-3 border-b border-b-tertiary-text last:border-none disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-6 w-6 bg-black rounded-full">
                      <img
                        src={user.avatar_url || "/default-profile.png"}
                        alt={user.full_name ?? "User"}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium capitalize">
                        {user.full_name}
                      </span>
                      
                    </div>
                  </div>

                  {isUserVIP(user.id) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info
                            color="#4E52F5"
                            className="w-4 h-4 text-gray-400 hover:text-white"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-md shadow-md font-roboto max-w-[300px]">
                          This user is already added as a VIP
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-secondary-text text-center w-full">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
