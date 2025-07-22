import { ChevronDown, Search } from "lucide-react";
import PeopleCardSkeleton from "../../dashboard/sections/people/PeopleSkeletonCard";

export default function ParticipantsSkeleton() {
  return (
    <div>
      {/* Search and filters skeleton */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search input skeleton */}
        <div className="relative flex-grow max-w-md font-roboto">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="h-4 w-4" />
            </div>
            <div className="w-full h-10 bg-tertiary-bg rounded-[0.625rem] pl-10 animate-pulse" />
          </div>
        </div>

        {/* Role dropdown skeleton */}
        <div className="w-[10rem] h-10 bg-tertiary-bg rounded-[0.625rem] animate-pulse flex items-center justify-between px-4">
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          <ChevronDown color="#4E52F5" className="opacity-50" />
        </div>

        {/* Skills dropdown skeleton */}
        <div className="w-[10rem] h-10 bg-tertiary-bg rounded-[0.625rem] animate-pulse flex items-center justify-between px-4">
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          <ChevronDown color="#4E52F5" className="opacity-50" />
        </div>

        {/* Sort dropdown skeleton */}
        <div className="w-[10rem] h-10 bg-tertiary-bg rounded-[0.625rem] animate-pulse flex items-center justify-between px-4">
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
          <ChevronDown color="#4E52F5" className="opacity-50" />
        </div>
      </div>

      {/* Participant cards grid skeleton */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {Array(16)
          .fill(0)
          .map((_, index) => (
            <PeopleCardSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

function ParticipantCardSkeleton() {
  return (
    <div className="bg-secondary-bg rounded-[12px] p-4 animate-pulse">
      {/* Header with avatar and name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-700" />
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-700 rounded" />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-700 rounded" />
        <div className="h-4 w-3/4 bg-gray-700 rounded" />
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="h-4 w-20 bg-gray-700 rounded mb-2" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-700 rounded-full" />
          <div className="h-6 w-20 bg-gray-700 rounded-full" />
          <div className="h-6 w-14 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Projects */}
      <div className="mb-4">
        <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-700 rounded" />
          <div className="h-4 w-1/2 bg-gray-700 rounded" />
        </div>
      </div>

      {/* Team up button */}
      <div className="h-10 w-full bg-gray-700 rounded-[0.625rem] mt-4" />
    </div>
  );
}
