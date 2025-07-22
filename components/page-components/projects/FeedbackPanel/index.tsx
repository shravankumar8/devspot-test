import {
  ProjectChallenges,
  Projects,
  UserHackathonChallengeFeedback,
} from "@/types/entities";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import FeedbackPanel from "./FeedbackPanel";

interface FeedbackProps {
  project: Projects;
}

const Feedback = (props: FeedbackProps) => {
  const { project } = props;

  const fetchUserHackathonFeedbacks = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as UserHackathonChallengeFeedback[];
  };

  const {
    data,
    isLoading: isProjectLoading,
    mutate,
  } = useSWR<UserHackathonChallengeFeedback[]>(
    `/api/hackathons/${project.hackathon_id}/feedback`,
    fetchUserHackathonFeedbacks
  );

  const challenges = project.project_challenges as ProjectChallenges[];

  const initialData = useMemo(() => {
    const items = (data ?? []).filter(item => 
      challenges.some(challenge => challenge.challenge_id === item.challenge_id)
    );
    

    // Find challenges that don't have feedback yet
    const missingChallenges = challenges.filter(
      (challenge) =>
        !items.some((item) => item.challenge_id === challenge.challenge_id)
    );

    return {
      hackathonFeedback: {
        hackathon_id: project.hackathon_id,
        question1_rating: null,
        question2_rating: null,
        question3_rating: null,
        question4_rating: null,
        comments: null,
      },
      challengeFeedbacks: [
        ...items.map((item) => ({
          challenge_id: item.challenge_id,
          overall_rating: item.overall_rating,
          docs_rating: item.docs_rating,
          support_rating: item.support_rating,
          challenge_recommendation_rating:item.challenge_recommendation_rating,
          comments: item.comments,
        })),
        ...missingChallenges.map((challenge) => ({
          challenge_id: challenge.challenge_id,
          overall_rating: null,
          docs_rating: null,
          support_rating: null,
          challenge_recommendation_rating:null,
          comments: null,
        })),
      ],
    };
  }, [data, challenges]);

  const isGivenFeedback = useMemo(() => {
    if (!data || !challenges) return false;

    const remainngChallenges = challenges.every((challenge) =>
      data.some((feedback) => feedback.challenge_id === challenge.challenge_id)
    );

    return Boolean(remainngChallenges);
  }, [data, challenges]);

  const [submitted, setSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (submitted) {
      setShowThankYou(true);
      const timer = setTimeout(() => {
        setShowThankYou(false);
        setSubmitted(false); // Reset submitted stat
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  if (showThankYou) {
    return (
      <div className="fixed font-roboto right-4 bottom-20 z-20 shadow-lg h-12">
        <div className="w-80 rounded-xl p-4 border border-[#C3A8FF] bg-secondary-900 backdrop-blur-md flex flex-col gap-8">
          <span className="text-[#C3A8FF] text-sm font-roboto font-normal">
            Thanks for the feedback!
          </span>
        </div>
      </div>
    );
  }
  if (isProjectLoading || isGivenFeedback || submitted) return null;

  return (
    <FeedbackPanel
      selectedChallenges={challenges ?? []}
      hackathonId={project.hackathon_id}
      initialFeedbackValues={initialData}
      onSubmit={async (data) => {
        try {
          await axios.post(
            `/api/hackathons/${project.hackathon_id}/feedback`,
            data
          );

          mutate();
          setSubmitted(true);
        } catch (error) {
          console.log(error);
        }
      }}
    />
  );
};

export default Feedback;
