"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HackathonChallenges } from "@/types/entities";
import axios from "axios";
import { Download, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import EventSection from "./components/eventSection";
import FeedbackCard from "./components/feedbackCard";
import FeedbackSkeleton from "./components/skeleton";
import { useTechOwnerStore } from "@/state/techOwnerStore";

interface GlobalFeedback {
  overall_hackathon_rating: number;
  recommend_hackathon_rating: number;
  overall_devspot_rating: number;
  recommend_devspot_rating: number;
  total_responses: number;
  comments: string[];
}

export interface ChallengeFeedback {
  challenge_id: number;
  challenge: Partial<HackathonChallenges>;
  overall_rating: number;
  docs_rating: number;
  support_rating: number;
  challenge_recommendation_rating: number;
  comments: string[];
  total_responses: number;
}

interface TOFeedbackResponse {
  hackathon_id: number;
  global_feedback: GlobalFeedback;
  challenge_feedback: ChallengeFeedback[];
  summary: {
    total_global_responses: number;
    total_challenge_responses: number;
    challenges_with_feedback: number;
  };
}

const TODevFeedback = ({
  params,
}: Readonly<{
  params: { id: string };
}>) => {
  const { selectedOrg } = useTechOwnerStore();
  const HACKATHON_ID = params.id;

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data, isLoading } = useSWR<{
    data: TOFeedbackResponse;
  }>(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/feedback`,
    fetchData
  );

  const filteredFeedback = useMemo(() => {
    const response = data?.data;
    if (!response || !searchTerm) return response;

    return {
      ...response,
      challenge_feedback: response?.challenge_feedback.filter((feedback) => {
        const challengeName =
          feedback.challenge.challenge_name?.toLowerCase() || "";
        const sponsors =
          (feedback.challenge.sponsors as Array<{ name: string }>) || [];
        const sponsorNames = sponsors.map((s) => s.name.toLowerCase());

        const searchTermLower = searchTerm.toLowerCase();

        return (
          challengeName.includes(searchTermLower) ||
          sponsorNames.some((name) => name.includes(searchTermLower))
        );
      }),
    };
  }, [data, searchTerm]);

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search for a challenge or sponsor"
              prefixIcon={<SearchIcon />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
              disabled={isLoading}
            />
          </div>
          <Link
            href={`/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/feedback/csv`}
            target="_blank"
          >
            <Button
              size="md"
              variant="secondary"
              disabled={isLoading}
              className="ml-4 bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </Link>
        </div>

        {isLoading && <FeedbackSkeleton />}

        {filteredFeedback?.challenge_feedback.length === 0 ? (
          <div className="text-white text-center py-8">
            No events found matching your search criteria.
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-white text-xl font-semibold">
                Hackathon Experience
              </h2>

              <div className="flex items-center gap-6">
                <div className="basis-[50%]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FeedbackCard
                      title="Overall Hackathon experience"
                      rating={
                        filteredFeedback?.global_feedback
                          .overall_hackathon_rating ?? 0
                      }
                    />
                    <FeedbackCard
                      title="Likeliness to recommend Hackathon"
                      rating={
                        filteredFeedback?.global_feedback
                          .recommend_hackathon_rating ?? 0
                      }
                    />
                    <FeedbackCard
                      title="Overall Devspot experience"
                      rating={
                        filteredFeedback?.global_feedback
                          .overall_devspot_rating ?? 0
                      }
                    />
                    <FeedbackCard
                      title="Likeliness to recommend Devspot"
                      rating={
                        filteredFeedback?.global_feedback
                          .recommend_devspot_rating ?? 0
                      }
                    />
                  </div>
                </div>

                <div className="basis-[50%]">
                  <div className="bg-secondary-bg border border-tertiary-bg rounded-lg h-[212px] overflow-y-scroll">
                    <div className="h-full overflow-y-scroll">
                      <div className="">
                        {filteredFeedback?.global_feedback?.comments.map(
                          (testimonial, index) => (
                            <div
                              key={index}
                              className="text-white text-sm leading-relaxed px-3 py-2 border-b border-b-tertiary-bg font-roboto"
                            >
                              "{testimonial}"
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {filteredFeedback?.challenge_feedback.map((challenge, index) => (
              <EventSection key={index} {...challenge} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TODevFeedback;
