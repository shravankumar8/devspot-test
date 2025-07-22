import React from "react";
import { ChallengeFeedback } from "../page";
import FeedbackCard from "./feedbackCard";

const EventSection: React.FC<ChallengeFeedback> = ({
  challenge,
  docs_rating,
  challenge_recommendation_rating,
  overall_rating,
  support_rating,
  comments,
}) => {
  const sponsor = challenge.sponsors?.[0];

  return (
    <div className="mb-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-6">
          <img
            // @ts-ignore
            src={sponsor?.logo as string}
            // @ts-ignore
            alt={`${sponsor?.name}'s Logo`}
            className="object-contain"
          />
        </div>

        <h2 className="text-white text-xl font-semibold">
          {challenge.challenge_name}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="basis-[50%]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FeedbackCard title="Overall experience" rating={overall_rating} />
            <FeedbackCard title="Docs experience" rating={docs_rating} />
            <FeedbackCard title="Support experience" rating={support_rating} />
            <FeedbackCard
              title="Likeliness to recommend challenge"
              rating={challenge_recommendation_rating}
            />
          </div>
        </div>

        <div className="basis-[50%]">
          <div className="bg-secondary-bg border border-tertiary-bg rounded-lg h-[212px] overflow-y-scroll">
            <div className="h-full overflow-y-scroll">
              <div className="">
                {comments.map((testimonial, index) => (
                  <div
                    key={index}
                    className="text-white text-sm leading-relaxed px-3 py-2 border-b border-b-tertiary-bg font-roboto"
                  >
                    "{testimonial}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSection;
