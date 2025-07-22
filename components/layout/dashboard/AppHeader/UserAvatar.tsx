import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SignOutButton from "@/components/ui/sign-out-button";
import { UserProfile } from "@/types/profile";
import { cn } from "@/utils/tailwind-merge";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import useSWR from "swr";
import SettingsModal from "../SettingsModal";
import UserAvatarSkeleton from "./UserAvatarSkeleton";

interface UserAvatarProps {
  user: User | null;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data: userProfile, isLoading: isFetchingUserProfile } =
    useSWR<UserProfile>("/api/profile", fetchUserProfile, {});

  async function fetchUserProfile(url: string) {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  if (isFetchingUserProfile) {
    return <UserAvatarSkeleton />;
  }

  const getUserPrimaryRole = () => {
    if (!userProfile?.roles) return null;

    const primaryRole = userProfile?.roles?.find((role) => role.is_primary);

    return primaryRole?.participant_roles.name;
  };

  const userPrimaryRole = getUserPrimaryRole();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex gap-3  items-center font-roboto hover:bg-tertiary-bg py-1 md:px-3 rounded-xl transition-all duration-200 ease-in-out",
            "md:w-60"
          )}
        >
          <Avatar className="w-8 md:w-9 h-8 md:h-9 bg-black">
            <AvatarImage
              src={userProfile?.avatar_url || "/default-profile.png"}
              alt={userProfile?.full_name ?? ""}
              className="object-contain"
            />
            <AvatarFallback delayMs={600}>
              {user?.user_metadata?.name}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex items-center justify-between w-full">
            {
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium">{userProfile?.full_name}</p>
                {userPrimaryRole && (
                  <p className="text-xs text-secondary-text">
                    {userPrimaryRole}
                  </p>
                )}
              </div>
            }

            <FaChevronDown
              color="#89898C"
              className={`transition-all duration-200 ease-in-out ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              size={18}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        className="w-full border-none p-0"
        align="start"
      >
        <div
          className={cn(
            "cursor-pointer bg-secondary-bg border border-[#2b2b31] rounded-[12px] !z-50 !font-roboto flex text-sm flex-col gap-4 shadow-[0_0_6px_rgba(19,19,26,0.25)]",
            "w-60 p-5 "
          )}
        >
          <button
            onClick={() => {
              router.push("/profile");
              setIsOpen(false);
            }}
            className="flex hover:text-white items-center gap-2 profile text-secondary-text transition-all ease-in-out duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="person-profile"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5268 6.07016C16.5268 3.73091 14.537 1.83457 12.0824 1.83457C9.62776 1.83457 7.63792 3.73091 7.63792 6.07016C7.63792 8.40941 9.62776 10.3057 12.0824 10.3057C13.2611 10.3057 14.3916 9.8595 15.2251 9.06517C16.0586 8.27084 16.5268 7.1935 16.5268 6.07016ZM17.4162 22.1654H8.52733C8.03641 22.1654 7.63844 21.7861 7.63844 21.3183C7.63844 20.8504 8.03641 20.4712 8.52733 20.4712H17.4162C17.9071 20.4712 18.3051 20.0919 18.3051 19.6241V16.1085C18.2604 15.6332 17.9612 15.2136 17.514 14.9988C14.0299 13.6582 10.1359 13.6582 6.65177 14.9988C6.20456 15.2136 5.90541 15.6332 5.86066 16.1085V21.3183C5.86066 21.7861 5.46269 22.1654 4.97177 22.1654C4.48085 22.1654 4.08289 21.7861 4.08289 21.3183V16.1085C4.12219 14.9392 4.86183 13.8951 5.98511 13.4232C9.89665 11.9168 14.2691 11.9168 18.1807 13.4232C19.3039 13.8951 20.0436 14.9392 20.0829 16.1085V19.6241C20.0829 21.0276 18.889 22.1654 17.4162 22.1654ZM12.0827 8.61151C13.5554 8.61151 14.7493 7.47371 14.7493 6.07016C14.7493 4.66661 13.5554 3.52881 12.0827 3.52881C10.6099 3.52881 9.41599 4.66661 9.41599 6.07016C9.41599 7.47371 10.6099 8.61151 12.0827 8.61151Z"
                fill="#89898C"
              />
            </svg>
            <p className=""> Profile</p>
          </button>

          {userProfile?.technology_organizations &&
            userProfile?.technology_organizations.length > 0 && (
              <Link
                href={`/TO/chat-with-spot`}
                className="flex items-center gap-2 hover:text-white profile text-secondary-text transition-all ease-in-out duration-200"
              >
                <LayoutDashboard width="20px" height="20px" />
                <p>TO Dashboard</p>
              </Link>
            )}
          <SettingsModal />

          <SignOutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
