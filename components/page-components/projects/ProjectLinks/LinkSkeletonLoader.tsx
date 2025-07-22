export const LinksSectionSkeleton = ({
  isOwner = false,
}: {
  isOwner?: boolean;
}) => {
  return (
    <>
      {/* Top section - Repo and Demo links */}
      <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto flex gap-3 justify-between h-max">
        {/* Repo button placeholder */}
        <div
          className={`flex items-center justify-center gap-2 px-5 py-3 border border-[#5A5A5F] rounded-lg bg-primary-bg h-[50px] animate-pulse ${
            isOwner ? "w-[45%]" : "w-[50%]"
          }`}
        >
          <div className="h-5 bg-gray-700/50 rounded-md w-12" />
          <div className="h-4 w-4 bg-gray-700/50 rounded-md" />
        </div>

        {/* Demo button placeholder */}
        <div
          className={`flex items-center justify-center gap-2 px-5 py-3 border border-[#5A5A5F] rounded-lg bg-primary-bg h-[50px] animate-pulse ${
            isOwner ? "w-[45%]" : "w-[50%]"
          }`}
        >
          <div className="h-5 bg-gray-700/50 rounded-md w-12" />
          <div className="h-4 w-4 bg-gray-700/50 rounded-md" />
        </div>

        {/* Edit button placeholder (if isOwner) */}
        {isOwner && (
          <div className="h-[50px] w-[50px] bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
            <div className="h-5 w-5 bg-gray-800/50 rounded-md" />
          </div>
        )}
      </div>

      {/* Bottom section - Video link and player */}
      <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto flex flex-col gap-5 row-span-2 h-full">
        <div className="flex gap-3 justify-between w-full">
          {/* Video button placeholder */}
          <div
            className={`flex items-center justify-center gap-2 px-5 py-3 border border-[#5A5A5F] rounded-lg bg-primary-bg h-[50px] animate-pulse ${
              isOwner ? "w-[80%]" : "w-full"
            }`}
          >
            <div className="h-5 bg-gray-700/50 rounded-md w-12" />
            <div className="h-4 w-4 bg-gray-700/50 rounded-md" />
          </div>

          {/* Edit button placeholder (if isOwner) */}
          {isOwner && (
            <div className="h-[50px] w-[50px] bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
              <div className="h-5 w-5 bg-gray-800/50 rounded-md" />
            </div>
          )}
        </div>

        {/* Video player placeholder */}
        <div className="flex items-center justify-center h-full">
          <div className="w-full aspect-video bg-gray-700/50 rounded-lg animate-pulse" />
        </div>
      </div>
    </>
  );
};
