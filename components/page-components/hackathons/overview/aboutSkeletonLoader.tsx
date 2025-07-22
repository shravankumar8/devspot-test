"use client";

export default function AboutAndChallengesSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* About Section Skeleton */}
      {/* <section
        aria-label="about-skeleton"
        className="w-full bg-[#1B1B22] p-4 rounded-[12px] font-roboto mb-4"
      >
        <div className="h-5 w-16 bg-gray-700 rounded-md animate-pulse mb-4" />
        <div className="space-y-2 py-4">
          <div className="h-4 w-full bg-gray-700 rounded-md animate-pulse" />
          <div className="h-4 w-full bg-gray-700 rounded-md animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-700 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-4 w-24 bg-gray-700 rounded-md animate-pulse ml-3" />
          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />
        </div>
      </section> */}

      {/* Challenges Tabs Skeleton */}
      <div className="w-full">
        {/* Tabs List Skeleton */}
        <div className="flex justify-start border-t border-t-[#1B1B22] w-fit dark:bg-[#1B1B22] mb-1">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="relative px-4 py-2">
              <div className="h-5 w-28 bg-gray-700 rounded-md animate-pulse" />{" "}
              {/* Tab text */}
              {index === 0 && (
                <div className="absolute left-3 bottom-0 h-[1px] w-[75%] bg-[#4E52F5]" />
              )}
            </div>
          ))}
        </div>

        {/** Tab Content Skeleton */}
        <div className="bg-[#1B1B22] p-5 space-y-4">
          {/* Challenge Header */}
          <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />{" "}
          {/* Challenge number */}
          <div className="h-6 w-3/4 bg-gray-700 rounded-md animate-pulse" />{" "}
          {/* Challenge title */}
          {/* Challenge Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded-md animate-pulse" />{" "}
            {/* Text line */}
            <div className="h-4 w-full bg-gray-700 rounded-md animate-pulse" />{" "}
            {/* Text line */}
            <div className="h-4 w-2/3 bg-gray-700 rounded-md animate-pulse" />{" "}
            {/* Text line */}
          </div>
          {/* View More Button */}
          <div className="flex gap-2 items-center">
            <div className="h-4 w-24 bg-gray-700 rounded-md animate-pulse ml-3" />{" "}
            {/* Button text */}
            <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
            {/* Icon */}
          </div>
          {/* Prizes Section */}
          <div className="border-t border-t-[#2B2B31] mt-4 pt-4">
            <div className="flex w-full justify-between">
              <div className="h-5 w-16 bg-gray-700 rounded-md animate-pulse" />{" "}
              {/* Prizes title */}
              <div className="flex gap-2 items-center">
                <div className="h-4 w-28 bg-gray-700 rounded-md animate-pulse" />{" "}
                {/* View all text */}
                <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
                {/* Icon */}
              </div>
            </div>

            {/* Prize Cards */}
            <div className="flex md:gap-3 mt-6 pb-4 gap-12 w-full md:flex-row flex-col">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex-1 bg-[#232329] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />{" "}
                    {/* Prize icon */}
                    <div className="h-5 w-16 bg-gray-700 rounded-md animate-pulse" />{" "}
                    {/* Position */}
                  </div>
                  <div className="h-6 w-24 bg-gray-700 rounded-md animate-pulse mb-2" />{" "}
                  {/* Amount */}
                  <div className="h-4 w-16 bg-gray-700 rounded-md animate-pulse" />{" "}
                  {/* Tokens */}
                </div>
              ))}
            </div>
          </div>
          {/* Technologies Section */}
          <div className="pb-4 pt-6 border-t border-t-[#2B2B31]">
            <div className="h-5 w-28 bg-gray-700 rounded-md animate-pulse mb-4" />{" "}
            {/* Technologies title */}
            <div className="flex gap-2 items-center mt-4 flex-wrap">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <div
                  key={idx}
                  className="h-8 w-24 bg-gray-700 rounded-full animate-pulse\"
                />
              ))}
            </div>
          </div>
          {/* Sponsors Section */}
          <div className="pt-4 border-t border-t-[#2B2B31]">
            <div className="flex w-full justify-between">
              <div className="h-5 w-20 bg-gray-700 rounded-md animate-pulse" />{" "}
              {/* Sponsors title */}
              <div className="flex gap-2 items-center">
                <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />{" "}
                {/* View all text */}
                <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
                {/* Icon */}
              </div>
            </div>
            <div className="flex flex-wrap justify-between w-full gap-3 mt-5">
              {[1, 2, 3, 4].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[120px] h-[40px] bg-gray-700 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
