"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import Search from "@/components/icons/Search";
import HackathonHeader from "@/components/page-components/TODashboard/hackathon-header";
import ChallengeItem from "@/components/page-components/TODashboard/prizes/challenges/Challenges";
import PrizeSkeleton from "@/components/page-components/TODashboard/prizes/challenges/PrizeCardSkeleton";
import Preview from "@/components/page-components/TODashboard/prizes/leaderboard/Preview";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { ChallengPrizeType } from "@/types/techowners";
import axios from "axios";
import { useMemo, useState } from "react";
import useSWR from "swr";

const PrizesPage = ({
  params,
}: Readonly<{
  params: { id: string };
}>) => {
  const { selectedOrg } = useTechOwnerStore();
  const HACKATHON_ID = params.id;

  const [searchQuery, setSearchQuery] = useState("");
  const fetchPrizesData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data: prizesData, isLoading: isPrizeDataLoading } = useSWR<
    ChallengPrizeType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/prizes/challenges`,
    fetchPrizesData
  );

  const filteredChallenges = useMemo(() => {
    if (!prizesData) return [];
    return prizesData.filter((challenge) =>
      challenge.challenge_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [prizesData, searchQuery]);

  return (
    <div>
      <HackathonHeader />
      {isPrizeDataLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <DevspotLoader />
        </div>
      ) : (
        <div className="px-8 py-6">
          <h2 className="font-roboto font-medium text-sm uppercase">Prizes</h2>

          {/* Search */}
          <div className="flex items-center gap-4 dark:bg-tertiary-bg mt-3 px-4 border focus-within:dark:border-secondary-text dark:border-slate-100 rounded-xl w-full h-[40px] transition-all duration-200 ease-in-out">
            <Search />

            <input
              placeholder="Search prizes"
              className="bg-transparent py-3 rounded-md outline-0 w-full font-roboto font-normal text-[14px] text-white placeholder:text-[14px] placeholder:text-secondary-text"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Challenges */}

          {isPrizeDataLoading ? (
            [1, 2, 3, 4].map((_, index) => <PrizeSkeleton key={index} />)
          ) : filteredChallenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-12">
              <p className="text-white text-base font-roboto">
                {searchQuery
                  ? "No challenges match your search"
                  : "No challenges available"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-9 mt-6">
              {filteredChallenges.map((challengePrize) => (
                <ChallengeItem
                  key={challengePrize.id}
                  challengePrize={challengePrize}
                  hackathon_id={HACKATHON_ID}
                />
              ))}
            </div>
          )}

          {/* Leaderboard Preview */}
          <div className="mt-8">
            <Preview
              hackathonId={HACKATHON_ID}
              technologyOwnerId={selectedOrg?.technology_owner_id ?? 0}
            />
          </div>
          {/* <div className="mt-6">
            <PrizePayoutManager winnersData={sampleWinnersData} />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default PrizesPage;
