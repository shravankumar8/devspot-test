import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";

type ProfileProgressBarProps = {
  isOwner: boolean;
};

const ProfileProgressBar = (props: ProfileProgressBarProps) => {
  const { isOwner } = props;
  const { mutate } = useSWRConfig();

  const fetchProfileCompletionPercentage = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data: profileCompletion, isLoading } = useSWR<{
    completionPercentage: number;
  }>("/api/profile/profile-completion", fetchProfileCompletionPercentage);

  useEffect(() => {
    setTimeout(() => {
      mutate("/api/profile/token");
    }, 1000);
  }, [profileCompletion]);

  if (!isOwner) return null;

  return (
    <Card className="w-full bg-secondary-bg rounded-xl !border-none font-roboto gap-5 flex flex-col !px-6 !py-3">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium">{`Your profile is ${
          profileCompletion?.completionPercentage ?? 0
        }% complete.`}</p>

        {isLoading && <Skeleton className="w-full h-3 rounded-2xl" />}

        {!isLoading && (
          <div className="h-3 w-full rounded-2xl relative bg-[#5A5A5F]">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#4075FF] to-[#9667FA] rounded-2xl transition-width duration-200 ease-in-out"
              style={{
                width: `${profileCompletion?.completionPercentage ?? 0}%`,
              }}
            ></div>
          </div>
        )}
      </div>

      {profileCompletion?.completionPercentage &&
        profileCompletion?.completionPercentage == 0 && (
          <>
            <p className="text-secondary-text text-sm font-normal">
              To automatically fill out your profile, connect your developer
              accounts. Click on the edit icons to manually enter information.
            </p>

            <Link href="/profile?selectedModal=connect-account">
              <Button className="w-full h-9">Connect accounts</Button>
            </Link>
          </>
        )}
    </Card>
  );
};

export default ProfileProgressBar;
