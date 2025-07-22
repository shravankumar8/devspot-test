export default function VipGridSkeleton() {
  return (
    <div>
      <div className="max-w-7xl mx-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <VipCardSkeleton key={index} />
            ))}
        </div>
      </div>
    </div>
  );
}

interface VipCardSkeletonProps {
  count?: number;
}

export function VipCardSkeleton({ count = 1 }: VipCardSkeletonProps) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full max-w-sm overflow-hidden font-roboto bg-gradient-to-b from-[#13131A] to-[#2B2B31] text-white relative rounded-lg"
          >
            {/* Keep the gradient header as is since it's static */}
            <div className="h-3 bg-gradient-to-r from-[#4075FF] to-[#9667FA] rounded-t-xl" />

            <div className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {/* Profile image placeholder */}
                  <div className="relative w-36 h-48 rounded-lg overflow-hidden bg-gray-700 animate-pulse" />

                  {/* Name and title placeholders */}
                  <div className="flex flex-col w-full">
                    {/* Title placeholder */}
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />

                    {/* Name placeholder */}
                    <div className="h-8 w-40 bg-gray-700 rounded mt-2 animate-pulse" />

                    {/* Roles placeholder */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                        <div className="h-6 w-20 bg-gray-800 rounded-full animate-pulse" />
                        <div className="h-6 w-14 bg-gray-800 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
