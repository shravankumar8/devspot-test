export const ProjectHeaderSkeleton = () => {
  return (
    <div className="relative w-full text-white p-5 gap-4 sm:gap-8 rounded-[20px] flex items-end justify-between bg-[#2B2B31]">
      {/* Left side: Avatar and project details */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-7 z-[1] w-full">
        <div className="flex gap-7 items-end flex-col sm:flex-row w-full">
          {/* Logo placeholder */}
          <div className="w-[156px] h-[156px] rounded-[12px] bg-gray-700/50 animate-pulse" />

          <div className="flex flex-col justify-between gap-3 w-full sm:w-auto">
            {/* Tagline placeholder */}
            <div className="h-5 bg-gray-700/50 rounded-md w-full sm:w-[300px] animate-pulse" />

            {/* Project name placeholder */}
            <div className="h-8 bg-gray-700/50 rounded-md w-full sm:w-[250px] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Edit button placeholder */}
      <div className="hidden sm:block h-10 w-10 bg-gray-700/50 rounded-full animate-pulse" />
    </div>
  );
};
