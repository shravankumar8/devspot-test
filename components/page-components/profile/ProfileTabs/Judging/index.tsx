import { PlIcon } from "@/components/icons/Account";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/state";
import { Judgings } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import ProfileHackathonCardSkeleton from "../Hackathons/HackathonSkeletonCard";
import ProfileJudgingHackathonCard from "./HackathonCard";

const ProfileJudging = () => {
  const { user } = useAuthStore();

  const fetchJudgings = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as Judgings[];
  };

  const { data: judgings = [], isLoading } = useSWR<Judgings[]>(
    `/api/people/${user?.id}/judgings`,
    fetchJudgings
  );

  if (judgings.length === 0 && !isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col gap-5 items-center justify-center font-roboto">
          <h3 className="text-white text-base sm:text-xl font-semibold">
            No Judgings Found
          </h3>
          <p className="text-secondary-text text-[13px] sm:text-sm font-normal">
            It seems you haven't participated in any judgings yet. Explore our
            hackathons and join as a judge to start reviewing projects.
          </p>
          <Link href="/hackathons">
            <Button variant="special" className="flex gap-2 items-center">
              <PlIcon />
              Browse Devspot
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col space-y-3">
        <div className="gap-4 grid grid-cols-2">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div className="col-span-2 md:col-span-1" key={index}>
                <ProfileHackathonCardSkeleton />
              </div>
            ))}
        </div>

        <div className="gap-4 grid grid-cols-2">
          {!isLoading &&
            judgings.map((judging) => (
              <div className="col-span-2 md:col-span-1" key={judging.id}>
                <Link key={judging?.id} href={`/judging/${judging?.id}`}>
                  <ProfileJudgingHackathonCard
                    key={judging.id}
                    userHackathon={judging.hackathons}
                    judgingId={judging.id}
                  />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileJudging;
