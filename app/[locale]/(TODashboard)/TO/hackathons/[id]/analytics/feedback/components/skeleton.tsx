import React from "react";

// Skeleton for individual feedback cards
const FeedbackCardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-dark-card border-2 border-blue-border gradient-border !rounded-2xl px-5 py-4 animate-pulse ${className}`}
    >
      <div className="h-4 bg-gray-600 rounded mb-2 w-3/4"></div>
      <div className="h-6 bg-gray-600 rounded w-1/2"></div>
    </div>
  );
};

// Skeleton for the EventSection component
const EventSectionSkeleton: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-6 bg-gray-600 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-600 rounded w-64 animate-pulse"></div>
      </div>

      <div className="flex items-center gap-6">
        <div className="basis-[50%]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
          </div>
        </div>

        <div className="basis-[50%]">
          <div className="bg-secondary-bg border border-tertiary-bg rounded-lg h-[212px] overflow-y-scroll">
            <div className="h-full overflow-y-scroll">
              <div className="">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 border-b border-b-tertiary-bg animate-pulse"
                  >
                    <div className="h-4 bg-gray-600 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
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

// Main skeleton loader that matches your usage structure
const FeedbackSkeleton: React.FC = () => {
  return (
    <>
      {/* Hackathon Experience Section Skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-gray-600 rounded w-48 mb-4 animate-pulse"></div>

        <div className="flex items-center gap-6">
          <div className="basis-[50%]">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FeedbackCardSkeleton />
              <FeedbackCardSkeleton />
              <FeedbackCardSkeleton />
              <FeedbackCardSkeleton />
            </div>
          </div>

          <div className="basis-[50%]">
            <div className="bg-secondary-bg border border-tertiary-bg rounded-lg h-[212px] overflow-y-scroll">
              <div className="h-full overflow-y-scroll">
                <div className="">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 border-b border-b-tertiary-bg animate-pulse"
                    >
                      <div className="h-4 bg-gray-600 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventSectionSkeleton />
      <EventSectionSkeleton />
      <EventSectionSkeleton />
    </>
  );
};

export default FeedbackSkeleton;
export { EventSectionSkeleton, FeedbackCardSkeleton };
