"use client";

import Search from "@/components/icons/Search";
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
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { TeamMemberFormPayload } from "./EditProjectTeamMembersModal";

interface UsersDropdownProps {
  teamMembers: TeamMemberFormPayload[];
  handleAddUser: (user: Users) => void;
  hackathon_id: number;
}

export default function UsersDropdown(props: UsersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hackathon_id, handleAddUser, teamMembers } = props;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  async function fetchPeople(url: string) {
    try {
      const newUrl =
        query.trim() === ""
          ? url
          : `${url}?search_term=${encodeURIComponent(query)}`;
      const response = await axios.get(newUrl);

      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  }

  const {
    data: users = [],
    isLoading,
    isValidating,

    mutate,
  } = useSWR<Users[]>(
    `/api/hackathons/${hackathon_id}/available-teammates`,
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

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="rounded-md w-full shadow-sm font-sans">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search width={16} height={18} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setIsOpen(true)}
            className="w-full pl-10 pr-4 py-3 border border-[#424248] bg-[#2B2B31] focus:outline-none focus:ring-1 rounded-md focus:outline-none focus:ring-[#424248] text-white text-sm font-medium"
            placeholder="Search for and select team members"
          />
        </div>
        {isOpen && (
          <div className="bg-[#2B2B31] border border-[#424248] flex flex-col items-start justify-start rounded-[12px] mt-2 max-h-60 overflow-y-scroll z-[999] absolute left-0 right-0 w-full">
            {isLoading || isValidating ? (
              <div className="px-4 py-3 text-gray-400 text-center w-full">
                Loading users...
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  disabled={teamMembers.some(
                    (member) =>
                      member.user_data.id === user.id && !member.is_deleted
                  )}
                  className="cursor-pointer flex items-center justify-between px-5 py-3 text-left hover:bg-[#3B3B41] transition-all w-full disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 bg-black rounded-full">
                      <img
                        src={user.avatar_url || "/default-profile.png"}
                        alt={user.full_name ?? "John"}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium capitalize">
                        {user.full_name}
                      </span>
                      <span className="text-xs font-normal capitalize">
                        {user.main_role}
                      </span>
                    </div>
                  </div>

                  {!user?.in_hackathon && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info
                            color="#4E52F5"
                            className="w-4 h-4 text-gray-400 hover:text-white"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-md shadow-md font-roboto max-w-[300px]">
                          This user hasn't joined the hackathon. When you invite
                          them to your team, they will first receive a
                          notification to join this hackathon so they can accept
                          your request.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400 text-center w-full">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
