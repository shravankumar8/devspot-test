import { DevTokenIcon } from "@/components/icons/Location";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/profile";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";
import { HeaderSkeleton } from "./SkeletonLoader";
import UpdateHeaderImageModal from "./UpdateHeaderImageModal";
import UpdateProfileImageModal from "./UpdateProfileImageModal";

interface HeaderProps {
  userProfile: UserProfile;
  isFetching: boolean;
  isOwner: boolean;
}

const Header = (props: HeaderProps) => {
  const { isFetching, userProfile, isOwner } = props;

  const fetchData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const userWallets = useMemo(() => {
    return userProfile?.wallets;
  }, [userProfile?.wallets]);

  const { data: token_balance } = useSWR<number>(
    "/api/profile/token",
    fetchData
  );

  if (isFetching || !userProfile || !userProfile?.profile) {
    return <HeaderSkeleton />;
  }

  const { full_name, avatar_url, profile_header_url, profile } = userProfile;

  const getUserPrimaryRole = () => {
    if (!userProfile?.roles) return null;

    const primaryRole = userProfile?.roles?.find((role) => role.is_primary);

    return primaryRole?.participant_roles.name;
  };

  const userPrimaryRole = getUserPrimaryRole();

  return (
    <div
      className={`relative w-full text-white p-4 sm:p-5 gap-1 sm:gap-8 bg-secondary-bg rounded-[20px] sm:flex-row flex-col flex items-start sm:items-end justify-between h-[160px]  ${cn(
        !profile_header_url ? "overflow-hidden" : ""
      )} `}
      style={{
        backgroundImage: `url(${profile_header_url || ""})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* {profile_header_url && (
        <div className="absolute inset-0 bg-black/50 rounded-[20px] z-0" />
      )} */}
      {/* Left side: Avatar and user details */}
      <div className="flex flex-row items-center sm:items-end gap-4 sm:gap-7 z-[1]">
        <div className="relative">
          <Avatar className="sm:w-[120px] sm:h-[120px] h-[72px] w-[72px] bg-black flex items-center justify-center">
            <AvatarImage
              src={avatar_url ?? "/default-profile.png"}
              alt={full_name ?? "User"}
              className="object-contain"
            />

            <AvatarFallback delayMs={600}>{full_name}</AvatarFallback>
          </Avatar>

          {isOwner && (
            <UpdateProfileImageModal profileSrc={userProfile?.avatar_url} />
          )}
        </div>

        <div className="flex flex-col gap-[2px] sm:gap-2">
          {userPrimaryRole && (
            <p className="text-white font-roboto text-base font-medium">
              {userPrimaryRole}
            </p>
          )}

          <h1 className="text-white leading-[30px] text-[28px] font-semibold">
            {userProfile?.display_wallet_id && userWallets?.[0]?.wallet_address 
              ? userWallets[0].wallet_address.slice(-6)
              : full_name || 'Anonymous User'}
          </h1>
          <div className="sm:flex hidden items-center gap-3">
            {profile?.is_open_to_work && (
              <Badge
                className="text-xs px-2 h-[24px] py-1 font-medium w-fit font-roboto rounded-full border-0"
                variant="custom"
              >
                Open to work
              </Badge>
            )}
            {profile?.is_open_to_project && (
              <Badge
                className="text-xs px-2 h-[24px] py-1 font-medium w-fit font-roboto rounded-full border-0"
                variant="custom"
              >
                Open to projects
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="sm:flex hidden items-center text-white text-[28px] font-semibold gap-3 z-[1]">
        <DevTokenIcon width={32} height={32} color="#A076FF" />
        {profile?.token_balance ?? 0}
      </div>

      {isOwner && (
        <UpdateHeaderImageModal headerSrc={userProfile?.profile_header_url} />
      )}
      <div className="flex sm:hidden w-full z-[1] justify-between gap-3 items-center">
        {(profile?.is_open_to_work || profile?.is_open_to_project) && (
          <div className="flex items-center gap-3">
            {profile?.is_open_to_work && (
              <Badge
                className="text-xs px-2 h-[24px] py-1 font-medium w-fit font-roboto rounded-full border-0"
                variant="custom"
              >
                Open to work
              </Badge>
            )}
            {profile?.is_open_to_project && (
              <Badge
                className="text-xs px-2 h-[24px] py-1 font-medium w-fit font-roboto rounded-full border-0"
                variant="custom"
              >
                Open to projects
              </Badge>
            )}
          </div>
        )}
        <div className="flex items-center text-white text-[28px] font-semibold gap-1 sm:gap-3 z-[1] small-text">
          <DevTokenIcon width={32} height={32} color="#A076FF" />
          {token_balance ?? 0}
        </div>
      </div>
    </div>
  );
};

export default Header;
