import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectedAccount, UserProfile } from "@/types/profile";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useSWRConfig } from "swr";
import EditAboutModal from "./EditAboutModal";
import ProfileAboutSkeletonLoader from "./SkeletonLoader";
import SpotifyPlayer from "./SpotifyPlayer";
import { LensIcon, WarpcastIcon, XIcon } from "@/components/icons/EditPencil";
type BuilderStatsProps = {
  isFetching: boolean;
  userProfile: UserProfile;
  isOwner: boolean;
};

const ProfileAbout = (props: BuilderStatsProps) => {
  const { userProfile, isFetching, isOwner } = props;

  const { mutate } = useSWRConfig();

  const showEdit = useMemo(() => {
    return isOwner && !isFetching;
  }, [isFetching, isOwner]);

  const profile = userProfile?.profile;

  const spotifyData = (profile?.connected_accounts as ConnectedAccount[])?.find(
    (a): a is { spotify: any } => "spotify" in a
  )?.spotify;

  const linkedinData = (
    profile?.connected_accounts as ConnectedAccount[]
  )?.find(
    (a): a is { linkedin_oidc: {} } => "linkedin_oidc" in a
  )?.linkedin_oidc;

  const refreshSpotifyData = async () => {
    try {
      const response = await fetch("/api/auth/spotify/refresh");
      if (!response.ok) {
        throw new Error("Failed to refresh Spotify data");
      }
      const data = await response.json();
      if (data.data_changed) {
        mutate("/api/profile");
      }
    } catch (error) {
      console.error("Error refreshing Spotify data:", error);
    }
  };

  function normalizeUrl(raw: string) {
    // If it already starts with http:// or https://, leave it; otherwise prepend https://
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }

  useEffect(() => {
    if (
      profile?.connected_accounts?.some(
        (account: ConnectedAccount) => "spotify" in account
      )
    ) {
      refreshSpotifyData();
    }
  }, [profile?.connected_accounts]);

  return (
    <Card className="w-full bg-secondary-bg rounded-xl !border-none font-roboto gap-4 flex flex-col !p-6">
      <div className="flex justify-between items-center">
        <p className="font-normal !text-base text-white">About</p>

        {showEdit && <EditAboutModal profile={userProfile} />}
      </div>

      {isFetching && <ProfileAboutSkeletonLoader />}

      {!isFetching && (
        <>
          {profile?.description && (
            <div className="text-secondary-text line-clamp-[8] text-xs font-medium whitespace-normal break-words">
              {profile?.description}
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap w-full">
            {userProfile?.roles?.map((role, index) => (
              <Badge
                key={index}
                className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl"
              >
                <span className="font-normal text-sm text-[#E7E7E8] capitalize">
                  {role.participant_roles?.name}
                </span>
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-5 mt-2">
            {/* {(profile?.location || profile?.years_of_experience) && (
              <Separator className="h-0.5 bg-tertiary-bg" />
            )} */}

            {profile?.location && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-main-primary" />
                <span className="text-secondary-text text-xs font-normal">
                  {profile?.location}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {profile?.portfolio_website && (
                <a
                  href={normalizeUrl(profile.portfolio_website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <LinkIcon className="w-6 h-6 text-main-primary" />

                  <p className="underline text-secondary-text text-xs font-medium">
                    My Portfolio
                  </p>
                </a>
              )}

              {profile?.linkedin_url && (
                <>
                  <a
                    href={normalizeUrl(profile.linkedin_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Image
                      width={24}
                      height={24}
                      src="/linkedIn-logo.png"
                      alt="LinkedIn"
                    />
                    <p className="underline text-secondary-text text-xs font-medium">
                      My LinkedIn
                    </p>
                  </a>
                </>
              )}

              {profile?.x_url && (
                <>
                  <a
                    href={normalizeUrl(profile.x_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <XIcon className="w-6 h-6 text-main-primary" />
                    <p className="underline text-secondary-text text-xs font-medium">
                      My X Account
                    </p>
                  </a>
                </>
              )}

              {profile?.lensfrens_url && (
                <>
                  <a
                    href={normalizeUrl(profile.lensfrens_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <LensIcon className="w-6 h-6 text-main-primary" />
                    <p className="underline text-secondary-text text-xs font-medium">
                      My Lens
                    </p>
                  </a>
                </>
              )}

              {profile?.warpcast_url && (
                <a
                  href={normalizeUrl(profile.warpcast_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <WarpcastIcon className="w-6 h-6 text-main-primary" />

                  <p className="underline text-secondary-text text-xs font-medium">
                    My Warpcast
                  </p>
                </a>
              )}
            </div>
          </div>

          {spotifyData && (
            <div className="overflow-hidden rounded-xl bg-secondary-bg">
              {spotifyData?.currently_playing &&
              spotifyData?.currently_playing?.id ? (
                <SpotifyPlayer trackId={spotifyData?.currently_playing?.id} />
              ) : (
                <SpotifyPlayer trackId={spotifyData?.last_played_track?.id!} />
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default ProfileAbout;
