"use client";

import { Button } from "@/components/ui/button";

import UseModal from "@/hooks/useModal";
import { useAuthStore } from "@/state";
import { JudgingEntries, Judgings } from "@/types/entities";
import { ChallengPrizeType } from "@/types/techowners";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import ProjectCardSkeleton from "../dashboard/sections/projects/ProjectSkeletonCard";
import { ChallengeGroupWithData } from "./challengeGroup";
import SearchTools from "./JudgingHackathonProjectPage/search-tool/SearchTools";
import SubmitModal from "./SubmitModal";

interface ChallengeGroup {
  challenge_name: string;
  projects: JudgingEntries[];
}

interface JudgingProjectsData {
  [key: string]: ChallengeGroup;
}

const JudgingPage = ({ judgingId }: { judgingId: string }) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const { openModal } = UseModal("submit-judging");

  useEffect(() => {
    if (!user) router.back();
  }, [user]);

  const fetchProjectsToBeJudged = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as JudgingProjectsData;
  };

  const { data: judgingProjects = {}, isLoading } = useSWR<JudgingProjectsData>(
    `/api/people/${user?.id}/judgings/${judgingId}/projects`,
    fetchProjectsToBeJudged
  );

  const firstChallengeGroup = Object.values(judgingProjects)[0];
  const hackathonId = firstChallengeGroup?.projects[0]?.projects?.hackathon_id;

  const fetchHackathonChallenges = async (url: string) => {
    const res = await axios.get(url);
    return res.data; // expected to return array of challenges
  };

  // Fetch challenges for the hackathon filter
  const { data: challenges = [] } = useSWR(
    hackathonId ? `/api/hackathons/${hackathonId}/challenges/search` : null,
    fetchHackathonChallenges
  );

  // Fetch the judgings to get the is submitted status
  const fetchJudgings = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as Judgings[];
  };

  const fetchPrizes = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };
  const { data: judgings = [] } = useSWR<Judgings[]>(
    `/api/people/${user?.id}/judgings`,
    fetchJudgings
  );

  const { data: judgesData = [] } = useSWR<ChallengPrizeType[]>(
    `/api/people/${user?.id}/judgings/${judgingId}/prizes`,
    fetchPrizes
  );

  const currentJudging = judgings?.find((j) => j.id === parseInt(judgingId));
  const isSubmitted = currentJudging?.is_submitted;

  const fetchHandler = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Filters, sort and search
  const [filters, setFilters] = useState({
    sortBy: "",
    technology: "",
    challenge: "",
    judgingStatus: "",
    searchQuery: "",
    hideDrafts: true,
  });

  const filterProjects = (projects: JudgingEntries[]) => {
    return projects
      .filter((card) => {
        const matchStatus =
          filters.judgingStatus === "All" ||
          !filters.judgingStatus ||
          card.judging_status === filters.judgingStatus;

        const matchChallenge =
          filters.challenge === "All" ||
          !filters.challenge ||
          card.projects?.project_challenge?.hackathon_challenges
            ?.challenge_name === filters.challenge;

        const matchTechnology =
          filters.technology === "All" ||
          !filters.technology ||
          card.projects?.technologies?.includes(filters.technology);

        const matchSearch =
          !filters.searchQuery ||
          card.projects?.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase());

        const matchHideDrafts = !filters.hideDrafts || card.projects.submitted;

        return (
          matchStatus &&
          matchSearch &&
          matchTechnology &&
          matchChallenge &&
          matchHideDrafts
        );
      })
      .sort((a, b) => {
        // If user has selected a sort option, use that
        if (filters.sortBy.length > 0) {
          const getScore = (entry: any) =>
            (entry.judging_bot_scores && entry.judging_bot_scores?.score) ?? 0;
          const getName = (entry: JudgingEntries) => entry.projects?.name ?? "";

          switch (filters.sortBy) {
            case "Judgebot score (High → Low)":
              return getScore(b) - getScore(a);
            case "Judgebot score (Low → High)":
              return getScore(a) - getScore(b);
            case "Alphabetical":
              return getName(a).localeCompare(getName(b));
            default:
              return 0;
          }
        }

        // Default sorting when no filter.sortBy is selected
        const aSubmitted = a.projects?.submitted;
        const bSubmitted = b.projects?.submitted;
        const aStatus = a.judging_status;
        const bStatus = b.judging_status;

        // Both submitted and needs_review comes first
        if (
          aSubmitted &&
          aStatus === "needs_review" &&
          !(bSubmitted && bStatus === "needs_review")
        ) {
          return -1;
        }
        if (
          bSubmitted &&
          bStatus === "needs_review" &&
          !(aSubmitted && aStatus === "needs_review")
        ) {
          return 1;
        }

        // Then submitted and judged
        if (
          aSubmitted &&
          aStatus === "judged" &&
          !(bSubmitted && bStatus === "judged")
        ) {
          return -1;
        }
        if (
          bSubmitted &&
          bStatus === "judged" &&
          !(aSubmitted && aStatus === "judged")
        ) {
          return 1;
        }

        // Then drafts (submitted: false)
        if (!aSubmitted && bSubmitted) {
          return 1;
        }
        if (aSubmitted && !bSubmitted) {
          return -1;
        }

        // If same category, maintain original order or sort by name
        return (a.projects?.name ?? "").localeCompare(b.projects?.name ?? "");
      });
  };

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

  const isSomeReviewed = Object.values(judgingProjects)
    .flatMap((group) => group.projects)
    .filter((project) => project?.projects.submitted)
    .some(
      (entry) =>
        entry.judging_status === "judged" || entry.judging_status === "flagged"
    );

  const hasNeedsReview = Object.values(judgingProjects)
    .flatMap((group) => group.projects)
    .some((entry) => entry.judging_status === "needs_review");

  const getFirstProjectToReview = () => {
    // Flatten all projects from all challenges
    const allProjects = Object.values(judgingProjects).flatMap(
      (group) => group.projects
    );

    // First try to find a submitted project with "needs_review" status
    const needsReviewProject = allProjects.find(
      (project) =>
        project.projects?.submitted && project.judging_status === "needs_review"
    );

    if (needsReviewProject) {
      return needsReviewProject;
    }

    // If none found, try to find a submitted project that's been judged
    const judgedProject = allProjects.find(
      (project) =>
        project.projects?.submitted && project.judging_status === "judged"
    );

    return judgedProject || null;
  };

  const {
    data: assignButtonStatus,
    error: assignButtonStatusError,
    isLoading: assignButtonLoading,
  } = useSWR<{ status: boolean | "view-winners" | "disabled" }>(
    `/api/judgings/${judgingId}/assign-winner/get-challenges/get-button-status`,
    fetchHandler
  );

  const checkAssignButton = async () => {
    try {
      const res = await axios.get(
        `/api/judgings/${judgingId}/assign-winner/get-challenges/get-button-status`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAssignButton();
  }, []);

  let totalProjectsCount = 0;
  let totalJudgedCount = 0;

  Object.values(judgingProjects).forEach((group) => {
    group.projects.forEach((project) => {
      if (project.projects?.submitted) {
        totalProjectsCount++;
        if (project.judging_status === "judged") {
          totalJudgedCount++;
        }
      }
    });
  });

  if (!user) return;

  return (
    <>
      <SubmitModal judgingId={judgingId} />
      <div className="relative mt-5 min-h-screen">
        {!isSubmitted && (
          <div
            ref={buttonRef}
            className={`${
              isStuckAboveFooter
                ? "absolute bottom-0 right-0"
                : "fixed bottom-4 right-4 lg:right-8"
            }  z-50`}
          >
            <Button
              variant={isSomeReviewed ? "special" : "secondary"}
              onClick={() => openModal()}
              disabled={!isSomeReviewed}
              title={
                hasNeedsReview
                  ? "You must review or flag all projects before submitting."
                  : undefined
              }
            >
              Submit scores <CheckCircle className="ml-2" size={24} />
            </Button>
          </div>
        )}

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          <div className="col-span-1 lg:col-span-9">
            <SearchTools
              challenges={challenges}
              filters={filters}
              setFilters={setFilters}
            />

            <div className="">
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <ProjectCardSkeleton key={index} />
                ))}

              {Object.entries(judgingProjects)?.map(
                ([challengeId, challengeGroup]) => {
                  const filteredProjects = filterProjects(
                    challengeGroup.projects
                  );

                  if (filteredProjects.length === 0) return null;

                  return (
                    <ChallengeGroupWithData
                      key={challengeId}
                      challengeGroup={challengeGroup}
                      challengeId={challengeId}
                      filteredProjects={filteredProjects}
                      judgesData={judgesData}
                      judgingId={judgingId}
                    />
                  );
                }
              )}
            </div>
          </div>

          <div className="pb-[60px] lg:pb-0 col-span-1 lg:col-span-3">
            <div className="bg-secondary-bg px-5 py-4 border-none rounded-xl">
              <ul className="flex flex-col gap-5">
                <li className="flex flex-col gap-1">
                  
                  <h4 className="font-semibold text-white">HACKATHON</h4>
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
                  <p className="font-semibold text-secondary-text">
                    July 9,2025
                  </p>
                </li>
              </ul>
              {isSubmitted ? (
                <Button
                  variant="special"
                  className="mt-5 rounded-[40px] w-full font-normal"
                >
                  Scores submitted <CheckCircle className="ml-2" size={24} />
                </Button>
              ) : totalJudgedCount === totalProjectsCount ? (
                <Button
                  variant="special"
                  onClick={() => {
                    if (!isSubmitted) {
                      const firstProject = getFirstProjectToReview();
                      if (firstProject) {
                        router.push(
                          `/judging/${firstProject.judging_id}/${firstProject.project_id}/${firstProject.projects?.project_challenge?.challenge_id}`
                        );
                      }
                    }
                  }}
                  className="mt-5 w-full font-normal"
                >
                  {totalJudgedCount}/{totalProjectsCount} Judged
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (!isSubmitted) {
                      const firstProject = getFirstProjectToReview();
                      if (firstProject) {
                        router.push(
                          `/judging/${firstProject.judging_id}/${firstProject.project_id}/${firstProject.projects?.project_challenge?.challenge_id}`
                        );
                      }
                    }
                  }}
                  className="mt-5 w-full font-normal"
                >
                  {totalJudgedCount}/{totalProjectsCount} Judged
                </Button>
              )}
              {/* TODO: Only show when its available */}
              {assignButtonStatus?.status && (
                <Button
                  disabled={assignButtonStatus?.status == "disabled"}
                  className="mt-6 w-full"
                >
                  <Link
                    href={`/judging/${judgingId}/assign-winners`}
                    className="flex w-full items-center justify-center"
                  >
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 15.7172C11.1741 15.7172 12.3988 16.6868 13.0869 18.5082C13.1841 18.7655 13.1589 19.0314 13.0771 19.2143C13.0408 19.2956 13.0078 19.3336 12.9893 19.351H7.01074C6.99216 19.3336 6.95924 19.2956 6.92285 19.2143C6.84112 19.0314 6.81594 18.7655 6.91309 18.5082C7.60122 16.6868 8.8259 15.7172 10 15.7172Z"
                        fill="#E9A403"
                        stroke="#E9A403"
                        stroke-width="1.70007"
                        stroke-linecap="round"
                      />
                      <path
                        d="M17.4453 5.05008C18.1331 5.05008 18.5776 5.05173 18.8965 5.08719C19.0171 5.10061 19.0947 5.11865 19.1436 5.13211C19.1228 5.32958 19.0437 5.61748 18.8916 6.14676L18.458 7.6575C18.0247 9.16447 16.5958 10.4638 14.626 11.0638L16.7148 5.05008H17.4453Z"
                        fill="#E9A403"
                        stroke="#E9A403"
                        stroke-width="1.70007"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.55078 5.05008C1.863 5.05008 1.41854 5.05173 1.09961 5.08719C0.979006 5.10061 0.901361 5.11865 0.852539 5.13211C0.873341 5.32958 0.952351 5.61748 1.10449 6.14676L1.53809 7.6575C1.97136 9.16447 3.40033 10.4638 5.37012 11.0638L3.28125 5.05008H2.55078Z"
                        fill="#E9A403"
                        stroke="#E9A403"
                        stroke-width="1.70007"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.99868 15.5334C13.7636 15.5334 15.7064 11.4344 16.4907 4.94632C16.7076 3.15202 16.8161 2.25486 16.2416 1.56081C15.667 0.86676 14.7394 0.86676 12.8842 0.86676H7.11313C5.25792 0.86676 4.33032 0.86676 3.75579 1.56081C3.18127 2.25486 3.28973 3.15202 3.50665 4.94632C4.29101 11.4344 6.2338 15.5334 9.99868 15.5334Z"
                        fill="url(#paint0_linear_2787_2413)"
                      />
                      <path
                        d="M9.33203 9.12382H10.05M10.05 9.12382H10.7679M10.05 9.12382V5.53409L9.33203 5.89306"
                        stroke="white"
                        stroke-width="1.07696"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2787_2413"
                          x1="9.99868"
                          y1="15.5334"
                          x2="9.99868"
                          y2="0.86676"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#E9A403" />
                          <stop offset="1" stop-color="#FCFAF3" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="ml-2">
                      {assignButtonStatus?.status == "view-winners"
                        ? "View winners"
                        : "Assign winners"}
                    </span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JudgingPage;
