"use client";

import { Button } from "@/components/ui/button";
import { useTechOwner } from "@/state/hackathon";
import { Hackathons } from "@/types/entities";
import axios from "axios";
import { Plus } from "lucide-react";
import useSWR from "swr";
import HackathonCard from "../../profile/ProfileTabs/Hackathons/HackathonCard";
import ProfileHackathonCardSkeleton from "../../profile/ProfileTabs/Hackathons/HackathonSkeletonCard";

type DiscoverResponse = {
  data: Hackathons[];
  count: number;
};
export const OwnersHackathons = () => {
  const { following, setFollowing } = useTechOwner();

  const fetchDiscoverData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.data as DiscoverResponse;
  };
  const { data: discoverResponse, isLoading } = useSWR<DiscoverResponse>(
    "/api/discover/hackathons",
    fetchDiscoverData
  );

  return (
    <section className="flex flex-col gap-5 w-full">
      {discoverResponse?.data?.length === 0 ? (
        <div>
          <h4 className="font-semibold text-[32px]">Hackathons</h4>
          <div className="w-full min-h-[500px] flex items-center justify-center">
            <div className="flex flex-col gap-2.5 items-center justify-center font-roboto">
              <h3 className="text-white leading-[24px] text-xl font-semibold">
                Protocol Labs hasn’t hosted any hackathons yet.
              </h3>
              <p className="text-secondary-text text-sm font-normal">
                {following
                  ? "You’ll get notified with any new updates!"
                  : "Follow them to stay updated!"}
              </p>
              {!following && (
                <Button onClick={() => setFollowing(true)}>
                  {" "}
                  <Plus /> Follow
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <ProfileHackathonCardSkeleton key={index} />
            ))}
          {!isLoading && discoverResponse && (
            <HackathonCard
              key={discoverResponse?.data[0].id}
              userHackathon={discoverResponse.data[0]}
            />
          )}
        </div>
      )}
    </section>
  );
};
