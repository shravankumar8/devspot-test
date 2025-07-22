"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UseModal from "@/hooks/useModal";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import ChallengePrizes from "./ChallengePrizes";

interface AssignWinnersProps {
  id: string;
}

const AssignWinners = ({ id }: AssignWinnersProps) => {
  // Modal for submitting winners
  const { openModal } = UseModal("submit-winner-modal");

  // Intersection observer for submit button
  const [isStuckAboveFooter, setIsStuckAboveFooter] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById("footer-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuckAboveFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  // Filters, sort and search
  const [filters, setFilters] = useState({
    sortBy: "",
    technology: "",
    challenge: "",
    judgingStatus: "",
    searchQuery: "",
  });

  // Data fetching
  const fetchHandler = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Get challenges and prizes data
  const {
    data: assignWinnersChallengesData,
    error: assignWinnersError,
    isLoading: assignWinnersLoading,
  } = useSWR(`/api/judgings/${id}/assign-winner/get-challenges`, fetchHandler);

  if (assignWinnersLoading) {
    return <div className="mt-4 text-white">Loading...</div>;
  }

  console.log("Assign Winners Challenges Data:", assignWinnersChallengesData);

  if (assignWinnersError) {
    return (
      <div className="text-red-500">
        Error loading challenges: {assignWinnersError.message}
      </div>
    );
  }

  const totalPrizes = assignWinnersChallengesData?.reduce(
    (acc: number, challenge: any) => acc + (challenge.prizes?.length || 0),
    0
  );


  const filteredChallenges = assignWinnersChallengesData?.filter(
    (challenge: any) =>
      challenge.challenge_name
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase())
  );

  return (
    // Main Grid
    <section className=" relative gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-screen mt-5">
      <main className="col-span-12 lg:col-span-9">
        {/* Search */}
        <div className="flex items-center border focus-within:dark:border-secondary-text transition-all duration-200 ease-in-out  h-[40px] px-4 gap-4 w-full dark:border-slate-100 rounded-xl dark:bg-tertiary-bg">
          <Search />

          <input
            placeholder="Search Prizes"
            className="bg-transparent outline-0 placeholder:text-[14px] placeholder:text-secondary-text text-white font-roboto font-normal py-3 w-full rounded-md text-[14px]"
            type="text"
            onChange={(e) => {
              setFilters((f) => ({
                ...f,
                searchQuery: e.target.value,
              }));
            }}
          />
        </div>

        {/* Challenge and its prizes/scores */}
        {filteredChallenges?.length === 0 ? (
          <div className="mt-10 text-center text-secondary-text">
            No challenges match your search.
          </div>
        ) : (
          filteredChallenges?.map((challenge: any) => (
            <div
              key={challenge.id}
              className="mt-5 bg-secondary-bg rounded-lg p-4 border border-tertiary-bg"
            >
              <ChallengePrizes
                id={id}
                assignWinnersChallengesData={challenge}
              />
            </div>
          ))
        )}
      </main>
      <aside className="col-span-12 lg:col-span-3">
        <div className="pb-[60px] lg:pb-0 col-span-1 lg:col-span-3">
          <div className="bg-secondary-bg px-5 py-4 border-none rounded-xl">
            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <div className="flex items-center">
                  {/* Todo: Replace with actual data */}
                  <h4 className="font-semibold text-white">HACKATHON</h4>
                  <Badge variant={"secondary"} className="ml-2">
                    Completed
                  </Badge>
                </div>
                <p className="font-semibold text-secondary-text underline">
                  PL_Genesis
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <h4 className="font-semibold text-white">ORGANIZER</h4>
                <p className="font-semibold text-secondary-text underline">
                  Protocol Labs
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <h4 className="font-semibold text-white">JUDGING DEADLINE</h4>
                <p className="font-semibold text-secondary-text">July 9,2025</p>
              </li>
            </ul>
            <Button
              variant="special"
              className="mt-5 rounded-[40px] w-full font-normal"
            >
              {
                assignWinnersChallengesData?.filter(
                  (c: any) => c.submitted_winners
                ).length
              }
              /{assignWinnersChallengesData?.length} Challenges Submitted
            </Button>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default AssignWinners;
