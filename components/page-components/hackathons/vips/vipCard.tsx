import { ExternalLinkIcon } from "@/components/icons/Discover";
import { HackathonVips } from "@/types/entities";
import Link from "next/link";

export default function VipCard({ vip }: Readonly<{ vip: HackathonVips }>) {
  return (
    <div className="w-full max-w-sm overflow-hidden font-roboto bg-gradient-to-b from-[#13131A] to-[#2B2B31] text-white relative rounded-lg">
      {/* Gradient header */}
      <div className="h-3 bg-gradient-to-r from-[#4075FF] to-[#9667FA] rounded-t-xl" />

      <div className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 items-start">
            {/* Profile image */}
            <div className="relative w-36 h-48 rounded-lg overflow-hidden">
              <img
                src={vip.users.avatar_url || "/placeholder.svg"}
                alt={vip.users?.full_name ?? "judge"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name and title */}
            <div className="flex flex-col ">
              <span className="text-[10px] text-white uppercase tracking-wider font-medium">
                {/* {vip?.hac} */}
              </span>
              <h2 className="text-2xl font-bold mt-1">
                {vip?.users?.full_name}
              </h2>

              {/* Roles */}
              <div className="sm:absolute bottom-4">
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-4 sm:p-3">
                  {vip?.users?.role_id == 3 ? (
                    <p className="bg-[#000375] hover:bg-blue-800 text-[#ADAFFA] rounded-full px-2 py-1 text-sm border-[#000375]">
                      Judge
                    </p>
                  ) : (
                    <p className="bg-[#000375] hover:bg-blue-800 text-[#ADAFFA] rounded-full px-2 py-1 text-sm border-[#000375]">
                      Mentor
                    </p>
                  )}
                </div>
                {vip?.office_hours && (
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    rel="noopener noreferrer"
                    target="__blank"
                    href={vip?.office_hours}
                    className="bg-transparent border text-white font-roboto flex gap-1 items-center px-2 h-7 text-sm border-white rounded-2xl"
                  >
                    <p>Office hours</p>
                    <ExternalLinkIcon
                      color="#FFFFFF"
                      width="18px"
                      height="18px"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
