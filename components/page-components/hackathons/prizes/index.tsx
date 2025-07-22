"use client";

import { useChallengeStore } from "@/state/hackathon";
import { NormalizeParam } from "@/utils/stringManipulation";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import useSWR from "swr";
import { PrizeCard } from "./prizeCard";
import { HackathonPrizesSkeleton } from "./skeleton-loader";

type Prize = {
  id: number;
  challenge_id: number;
  title: string;
  company_partner_logo: string;
  prize_usd: number | null;
  prize_tokens: string | null;
  prize_custom: string | null;
  rank: number;
  created_at: string;
  updated_at: string;
  challenge: {
    id: number;
    sponsors: any[];
    description: string;
    technologies: string[];
    challenge_name: string;
  };
};

type GroupedPrizes = {
  [challengeName: string]: Prize[];
};

export const HackathonPrizes = ({
  setSelectedTab,
  hackathonId
}: {
  setSelectedTab: Dispatch<SetStateAction<string>>;
  hackathonId: string
}) => {
  const router = useRouter();


  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: prizes, isLoading } = useSWR<Prize[]>(
    `/api/hackathons/${hackathonId}/prizes`,
    fetchHackathonInformation
  );

  const { activeTab, setActiveTab } = useChallengeStore();

  if (isLoading) {
    return <HackathonPrizesSkeleton />;
  }

  if (!prizes) {
    return null;
  }
  const groupPrizesByChallenge = (prizes: Prize[]): GroupedPrizes => {
    return prizes.reduce((acc, prize) => {
      const name = prize.challenge.challenge_name;
      if (!acc[name]) acc[name] = [];
      acc[name].push(prize);
      return acc;
    }, {} as GroupedPrizes);
  };

  const mapPrizeData = (prize: Prize) => ({
    cash: prize.prize_usd || undefined,
    tokens: prize.prize_tokens,
    custom_prize: prize.prize_custom,
    position: prize.rank,
    custom_category: prize.title,
    sponsor: {
      name: prize.challenge.challenge_name,
      logo: prize.company_partner_logo,
    },
    company_partner_url: prize.company_partner_logo,
  });

  const grouped = groupPrizesByChallenge(prizes);

  return (
    <div>
      <div className="space-y-10">
        {Object.entries(grouped).map(([challengeName, prizes]) => (
          <div key={challengeName} className="space-y-3">
            <h2 className="text-xl font-bold">{challengeName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {prizes.map((prize) => (
                <Link
                  href={`/?activeTab=overview&challenge=${NormalizeParam(
                    prize.challenge.sponsors[0].name
                  )}`}
                  onClick={() => {
                    const normalizedSponsor = NormalizeParam(
                      prize.challenge.sponsors[0].name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    );

                    // Update the active tab in state
                    setActiveTab(normalizedSponsor);
                    setSelectedTab("overview");

                    // Update URL parameters
                    const params = new URLSearchParams(window.location.search);
                    params.set("tab", "overview"); // Changed from "activeTab" to "tab" to match your URL structure
                    params.set("challenge", normalizedSponsor);

                    router.replace(`?${params.toString()}`, { scroll: false });
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer  "
                  key={prize.id}
                >
                  <PrizeCard prize={mapPrizeData(prize)} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export const HackathonPrizes = () => {
//   const challenges = ["Challenge 1"];

//   const isMobile = useIsMobile()

//   return (
//     <div className="flex justify-center items-center bg-[#1b1b22] rounded-xl p-6 w-full min-h-max xl:min-h-[450px]">
//       <div className="grid grid-cols-12 gradient-border xl:h-[450px] place-items-center rounded-xl w-full place-content-center gap-6 sm:gap-3">
//         <div className="col-span-12 xl:col-span-6 p-4 xl:p-0 flex w-full justify-center" >
//           <EmptyStateComplete width={isMobile ? "250px" : "356px"} />
//         </div>

//         <div className="col-span-12 xl:col-span-6 xl:my-6 xl:mr-8 p-5 border border-tertiary-bg rounded-xl font-roboto h-fit">
//           <h1 className="font-bold text-xl">
//             Prizes will be revealed on June 5th!
//           </h1>
//           <p className="mt-3 text-xs font-normal text-secondary-text">
//             In the mean time, browse our sponsors, technology, judges, and more.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
