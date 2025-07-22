export default function PrizeSkeleton() {
  return (
    <div className="relative col-span-12 lg:col-span-4 bg-gradient-to-b from-[#16161D] to-[#28282E] p-5 rounded-xl min-h-[204px]">
      {/* Edit button skeleton */}
      <div className="absolute top-4 right-4 bg-tertiary-bg rounded-full w-10 h-10 flex items-center justify-center">
        <div className="w-4 h-4 bg-gray-600 rounded animate-pulse" />
      </div>

      <header>
        {/* Prize amount/title section */}
        <div className="flex items-center gap-2">
          {/* Dollar sign icon skeleton */}
          <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse flex-shrink-0" />

          {/* Amount/title skeleton */}
          <div className="h-7 bg-gray-600 rounded animate-pulse flex-1 max-w-[120px]" />
        </div>

        {/* Trophy and place label section */}
        <div className="flex items-center gap-2 mt-4">
          {/* Trophy icon skeleton */}
          <div className="w-8 h-8 bg-gray-600 rounded animate-pulse" />

          {/* Place label skeleton */}
          <div className="h-4 w-16 bg-gray-600 rounded animate-pulse" />
        </div>
      </header>

      {/* Divider */}
      <div className="bg-[#2B2B31] my-4 w-full h-[1px]" />

      {/* Project dropdown skeleton */}
      <div className="w-full h-10 bg-gray-600 rounded animate-pulse" />
    </div>
  );
}
