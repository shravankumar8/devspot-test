"use client";

export default function SidebarSkeleton() {
  return (
    <aside className="basis-[25%] flex flex-col gap-4">
      {/* Team members section skeleton */}
      <div>
        <div className="bg-gradient-to-l to-[#4103CE]/50 from-[#010375]/50 rounded-t-[12px] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
          {/* Switch placeholder */}
          <div className="h-4 w-48 bg-gray-700 rounded-md animate-pulse" />{" "}
          {/* Text placeholder */}
        </div>
        <div className="bg-secondary-bg p-4 rounded-b-[12px]">
          <div className="h-4 w-full bg-gray-700 rounded-md animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-gray-700 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Up Next section skeleton */}
      <div className="w-full bg-[#1B1B22] px-4 rounded-[12px] py-5">
        <div className="w-20 h-5 bg-gray-700 rounded-[16px] animate-pulse mb-2" />{" "}
        {/* UP NEXT badge */}
        <div className="h-4 w-48 bg-gray-700 rounded-md animate-pulse mb-2" />{" "}
        {/* Date placeholder */}
        <div className="h-5 w-40 bg-gray-700 rounded-md animate-pulse mb-2" />{" "}
        {/* Title placeholder */}
        <div className="w-full h-7 bg-gray-700 rounded-[16px] animate-pulse" />{" "}
        {/* Button placeholder */}
        <div className="flex gap-2 items-center mt-4">
          <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />{" "}
          {/* View text */}
          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
          {/* Icon */}
        </div>
      </div>

      {/* Hackathon details section skeleton */}
      <div className="w-full bg-[#1B1B22] px-4 rounded-[12px] py-5">
        <div className="h-5 w-36 bg-gray-700 rounded-md animate-pulse mb-2" />{" "}
        {/* Section title */}
        {/* Detail items */}
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 mb-3 pb-3 ${
              index < 3 ? "border-b border-b-[#424248]" : ""
            }`}
          >
            <div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse" />{" "}
            {/* Icon placeholder */}
            <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />{" "}
            {/* Text placeholder */}
          </div>
        ))}
      </div>

      {/* Judges section skeleton */}
      <div className="w-full bg-[#1B1B22] px-4 rounded-[12px] py-5">
        <div className="h-5 w-16 bg-gray-700 rounded-md animate-pulse mb-2" />{" "}
        {/* Section title */}
        <div className="pl-3">
          {/* Judge items */}
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex gap-2 items-center mb-4">
              <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />{" "}
              {/* Avatar placeholder */}
              <div>
                <div className="h-4 w-24 bg-gray-700 rounded-md animate-pulse mb-1" />{" "}
                {/* Name placeholder */}
                <div className="h-3 w-16 bg-gray-700 rounded-md animate-pulse" />{" "}
                {/* Role placeholder */}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-4 w-16 bg-gray-700 rounded-md animate-pulse ml-3" />{" "}
          {/* View All text */}
          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
          {/* Icon */}
        </div>
      </div>

      {/* Resources section skeleton */}
      <div className="w-full bg-[#1B1B22] px-4 rounded-[12px] py-5">
        <div className="h-5 w-24 bg-gray-700 rounded-md animate-pulse mb-2" />{" "}
        {/* Section title */}
        <div className="mb-2">
          {/* Resource items */}
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex gap-4 items-center p-3">
              <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />{" "}
              {/* Link text */}
              <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
              {/* Icon */}
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-4 w-16 bg-gray-700 rounded-md animate-pulse ml-3" />{" "}
          {/* View All text */}
          <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />{" "}
          {/* Icon */}
        </div>
      </div>
    </aside>
  );
}
