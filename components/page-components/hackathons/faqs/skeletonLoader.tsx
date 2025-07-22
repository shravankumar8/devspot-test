export default function FAQSkeleton() {
  return (
    <div className="min-h-screen text-white font-roboto">
      <div className="w-full">
        <div className="flex justify-end mb-6">
          <div className="h-9 w-32 bg-gray-700 rounded-md animate-pulse" />
        </div>

        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="rounded-[12px] bg-secondary-bg overflow-hidden"
              >
                <div className="px-5 py-3 flex justify-between items-center">
                  <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="w-6 h-6 rounded-full bg-gray-700 animate-pulse" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
