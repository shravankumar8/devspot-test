"use client";

import { Tags } from "@/components/common/Tags";
import { ComingSoonSvg } from "@/components/icons/ComingSoon";
import {
  FirstPrize,
  SecondPrize,
  ThirdPrize,
} from "@/components/icons/Location";
import { EditHackathonChallengeModal } from "@/components/page-components/hackathons/editHackathon/challenge";
import AboutAndChallengesSkeleton from "@/components/page-components/hackathons/overview/aboutSkeletonLoader";
import HackathonPriceCard from "@/components/page-components/hackathons/overview/HackathonPriceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChallengeStore } from "@/state/hackathon";
import { ChallengeResponseType } from "@/types/hackathons";
import { NormalizeParam } from "@/utils/stringManipulation";
import axios from "axios";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import useSWR from "swr";

const ChallengeTab = ({
  hackathonId,
  setSelectedTab,
  setSelectedChallengeId,
  isOwner,
}: {
  hackathonId: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  isOwner: boolean;
  setSelectedChallengeId: Dispatch<SetStateAction<number | null>>;
}) => {
  const [showFull, setShowFull] = useState(false);
  const { activeTab, setActiveTab } = useChallengeStore();
  const [localTab, setLocalTab] = useState<string>("");

  const toggleShow = () => {
    setShowFull((prev) => !prev);
  };

  const fetchChallenges = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: challenges, isLoading } = useSWR<ChallengeResponseType>(
    `/api/hackathons/${hackathonId}/challenges`,
    fetchChallenges
  );

  const sponsorNames = useMemo(
    () =>
      challenges?.items?.map((challenge) =>
        NormalizeParam(
          // @ts-ignore
          challenge?.sponsors[0]?.name
            ? // @ts-ignore
              challenge?.sponsors[0]?.name.toLowerCase().replace(/\s+/g, "-")
            : ""
        )
      ) || [],
    [challenges]
  );
  const challengeLabels = useMemo(
    () =>
      challenges?.items?.map((challenge) =>
        NormalizeParam(
          challenge?.label
            ? challenge?.label.toLowerCase().replace(/\s+/g, "-")
            : ""
        )
      ) || [],
    [challenges]
  );

  useEffect(() => {
    if (!challenges?.items?.length) return;

    if (!activeTab && challengeLabels.length > 0) {
      const firstTab = challengeLabels[0];
      setActiveTab(firstTab);
      setLocalTab(firstTab);
      const challenge = challenges?.items?.find(
        (item) =>
          NormalizeParam(
            item?.label ? item?.label.toLowerCase().replace(/\s+/g, "-") : ""
          ) === firstTab
      );
      if (challenge) {
        setSelectedChallengeId(challenge?.id);
      }
    } else {
      setLocalTab(activeTab);
      const challenge = challenges?.items?.find(
        (item) =>
          NormalizeParam(
            item?.label ? item?.label.toLowerCase().replace(/\s+/g, "-") : ""
          ) === activeTab
      );
      if (challenge) {
        setSelectedChallengeId(challenge?.id);
      }
    }
  }, [
    challenges,
    challengeLabels,
    activeTab,
    setActiveTab,
    setSelectedChallengeId,
  ]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLocalTab(value);
    const challenge = challenges?.items?.find(
      (item) =>
        NormalizeParam(
          item?.label?.toLowerCase().replace(/\s+/g, "-") ?? ""
        ) === value
    );

    if (challenge) {
      setSelectedChallengeId(challenge?.id);
    }
  };
  const isTabRoundTwo = useMemo(() => {
    const roundTwoChallenges =
      challenges?.items?.filter((challenge) => challenge.is_round_2_only) ?? [];
    const isTabRoundTwo = roundTwoChallenges.find(
      (item) =>
        NormalizeParam(
          item?.label ? item?.label.toLowerCase().replace(/\s+/g, "-") : ""
        ) === localTab
    );

    if (isTabRoundTwo) {
      const firstNonRoundTwoChallenge = challenges?.items?.find(
        (challenge) => !challenge.is_round_2_only
      );

      return (
        NormalizeParam(
          firstNonRoundTwoChallenge?.label
            ?.toLowerCase()
            .replace(/\s+/g, "-") ?? ""
        ) || localTab
      );
    }

    return localTab;
  }, [localTab, challenges?.items]);

  if (isLoading) {
    return <AboutAndChallengesSkeleton />;
  }

  if (!challenges || challenges?.items?.length <= 0) {
    return (
      <div className="dark:bg-secondary-bg rounded-xl w-full flex h-full items-center justify-center py-10 flex-col font-roboto relative">
        <ComingSoonSvg />
        <h3 className="text-white text-base sm:text-xl font-semibold -mt-5">
          We’re building something amazing for you.
        </h3>
        <p className="text-secondary-text text-[13px] sm:text-sm font-normal">
          No challenges yet, check back later
        </p>
        {isOwner && (
          <EditHackathonChallengeModal
            challengesData={{ items: [] }}
            hackathonId={hackathonId}
          />
        )}
      </div>
    );
  }

  return (
    <Tabs
      value={isTabRoundTwo}
      onValueChange={handleTabChange}
      className="relative"
    >
      <TabsList className="flex flex-nowrap dark:bg-secondary-bg rounded-none rounded-tl-xl px-3 pt-3 gap-6 rounded-tr-xl w-fit max-w-full h-[40px] overflow-x-auto whitespace-nowrap !overflow-y-hidden scrollbar-hide">
        {challenges?.items?.map((challenge, index) => {
          const challengeValue = NormalizeParam(
            challenge?.label
              ? challenge?.label.toLowerCase().replace(/\s+/g, "-")
              : ""
          );

          return (
            <TabsTrigger
              disabled={challenge.is_round_2_only}
              className="!p-0 !pb-4 !bg-transparent capitalize relative text-sm font-semibold text-[#B8B8BA] transition-all duration-200 ease-in-out hover:text-white after:absolute after:w-0 after:transition-all after:duration-200 after:ease-in-out after:h-0.5 after:left-0 after:rounded-[1px] data-[state=active]:after:w-full after:bottom-2 data-[state=active]:after:bg-[#4E52F5] data-[state=active]:text-white"
              key={index}
              value={challengeValue}
            >
              {challenge.label} {challenge.is_round_2_only ? "(Round 2)" : ""}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {challenges?.items?.map((challenge) => {
        const challengeValue = NormalizeParam(
          challenge?.label?.toLowerCase().replace(/\s+/g, "-") ?? ""
        );
        return (
          <TabsContent
            key={challenge?.id}
            value={challengeValue}
            className="bg-[#1B1B22] -my-1 !rounded-tr-xl !rounded-bl-xl rounded-br-xl"
          >
            <div className="space-y-4 p-5">
              <h3 className="font-roboto font-bold text-lg md:text-xl">
                {challenge?.challenge_name}
              </h3>
              <div className="space-y-6 font-roboto text-secondary-text">
                <div>
                  <h2 className="text-base font-bold flex items-center space-x-2">
                    <span>🧩</span>
                    <span>Challenge Overview </span>
                  </h2>
                  <p className="mt-2 text-sm">{challenge.description}</p>
                  {challenge?.example_projects && (
                    <>
                      <h2 className="text-base font-bold mt-2 flex items-center space-x-2">
                        <span>Example project ideas</span>
                      </h2>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        {challenge?.example_projects?.map((project) => (
                          <li key={project}>{project}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                {showFull && (
                  <>
                    {challenge?.submission_requirements && (
                      <div className="font-roboto">
                        <h2 className="text-base font-bold flex items-center space-x-2">
                          <span>✅</span>
                          <span>Submission Requirements</span>
                        </h2>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                          {challenge?.submission_requirements?.map(
                            (requirement) => (
                              <li key={requirement}>{requirement}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {challenge?.required_tech && (
                      <div>
                        <h2 className="text-base font-bold flex items-center space-x-2">
                          <span>✅</span>
                          <span>Required Technologies</span>
                        </h2>
                        <p className="mt-2 text-sm">
                          These are strongly implied by the challenge specs
                        </p>

                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                          {challenge.required_tech?.map((tech) => (
                            <li key={tech}>{tech}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={toggleShow}
                className="flex items-center gap-2 font-roboto uppercase"
              >
                <span className="text-[#FFFFFF] text-[13px]">
                  {showFull ? "Show Less" : "View more"}
                </span>
                <FaChevronDown className="w-4 h-4 text-[#4E52F5]" />
              </button>

              <div className="mt-4 pt-4 border-t border-t-[#2B2B31]">
                <div className="flex justify-between w-full font-roboto">
                  <h4 className="font-roboto font-semibold text-lg">Prizes</h4>
                  <button
                    onClick={() => setSelectedTab("prizes")}
                    className="flex items-center gap-2 font-roboto uppercase"
                  >
                    <span className="pl-3 text-[#FFFFFF] text-[12px] sm:text-[13px]">
                      View all prizes
                    </span>
                    <FaChevronRight className="w-4 h-4 text-[#4E52F5]" />
                  </button>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:flex-row flex-col md:flex-wrap gap-6 sm:gap-12 md:gap-3 mt-6 pb-4 w-full">
                  {challenge.prizes.map((prize, index) => (
                    <HackathonPriceCard
                      key={index}
                      icon={
                        prize.rank == 1 ? (
                          <FirstPrize />
                        ) : prize.rank == 2 ? (
                          <SecondPrize />
                        ) : prize.rank == 3 ? (
                          <ThirdPrize />
                        ) : null
                      }
                      custom_category={prize.title}
                      amount={prize.prize_usd ?? 0}
                      custom_prize={prize.prize_custom}
                      tokens={prize.prize_tokens ?? 0}
                      position={prize.rank ?? undefined}
                      company_partner_url={prize.company_partner_logo}
                    />
                  ))}
                </div>
              </div>

              {challenge?.technologies?.length > 0 && (
                <div className="pt-6 pb-4 border-t border-t-[#2B2B31]">
                  <h4 className="font-roboto font-semibold text-lg">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {challenge.technologies.map((tech, idx) => (
                      <Tags key={idx} text={tech} />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-t-[#2B2B31]">
                <div className="flex justify-between w-full">
                  <h4 className="font-roboto font-semibold text-lg">
                    Sponsors
                  </h4>

                  <button
                    onClick={() => setSelectedTab("sponsors")}
                    className="flex items-center gap-2 font-roboto uppercase"
                  >
                    <span className="pl-3 text-[#FFFFFF] text-[12px] sm:text-[13px]">
                      View all Sponsors
                    </span>
                    <FaChevronRight className="w-4 h-4 text-[#4E52F5]" />
                  </button>
                </div>
                {challenge?.sponsors && (
                  <div className="flex flex-wrap justify-between gap-3 mt-5 w-full">
                    {challenge.sponsors.map((sponsor, idx) => (
                      <Image
                        key={idx}
                        // @ts-ignore
                        src={sponsor?.logo as string}
                        // @ts-ignore
                        alt={`${sponsor?.name}'s Logo`}
                        className="object-contain"
                        width={120}
                        height={5}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        );
      })}
      {isOwner && (
        <EditHackathonChallengeModal
          challengesData={challenges}
          hackathonId={hackathonId}
        />
      )}
    </Tabs>
  );
};

export default ChallengeTab;
