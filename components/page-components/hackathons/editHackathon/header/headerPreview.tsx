import { Badge } from "@/components/ui/badge";
import { Hackathons } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import Image from "next/image";
import React, { memo } from "react";

interface HackathonPreviewProps {
  hackathon: Hackathons;
  backgroundSource: string | null;
  logoSource: string | null;
}

const HackathonPreview = memo(
  ({ hackathon, backgroundSource, logoSource }: HackathonPreviewProps) => {
    const tabs = [
      { value: "overview", label: "Overview" },
      { value: "timeline", label: "Timeline" },
      { value: "prizes", label: "Prizes" },
      { value: "resources", label: "Resources" },
    ];

    return (
      <div className="mb-6">
        <div className="text-[#89898c] uppercase text-xs font-medium mb-2">
          Header preview
        </div>

        <div
          className={cn(
            "relative overlay w-full text-white gap-4 sm:gap-8 bg-[#1F2034] rounded-[20px] flex-col flex items-center justify-between h-auto sm:h-[240px]",
            !hackathon?.banner_url && "overflow-hidden"
          )}
          style={{
            backgroundImage: `url(${backgroundSource})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="z-10 lg:items-end px-5 pt-5 lg:pb-8 w-full overflow-auto">
            <div className="flex gap-3 sm:gap-5">
              <div className="min-w-fit w-32 h-32 bg-black flex-1">
                {logoSource && (
                  <Image
                    width={100}
                    height={100}
                    src={logoSource}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>

              <div className="flex flex-col justify-between items-start gap-3 w-full">
                <div className="flex items-center gap-1 sm:gap-3 mt-3">
                  <h1 className="overflow-hidden font-semibold text-[#FFFFFF] sm:text-[28px] text-xl text-ellipsis leading-[30px] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                    {hackathon?.name}
                  </h1>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  {hackathon?.organizer?.logo && (
                    <div className="rounded-[12px] w-7 h-7 overflow-hidden">
                      <img
                        src={hackathon.organizer.logo}
                        className="w-full h-full object-cover"
                        alt="organizer logo"
                      />
                    </div>
                  )}
                  <div className="font-roboto">
                    <p className="font-medium text-[#FFFFFF] text-base">
                      {hackathon?.organizer?.name}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex justify-between gap-3 w-full">
                  <div className="flex gap-2 w-[80%] max-w-[80%] overflow-x-auto">
                    {hackathon?.tags?.slice(0, 8).map((tech, index) => (
                      <Badge
                        key={index}
                        className="!bg-transparent border !border-white !h-7 !text-white whitespace-nowrap"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:hidden z-10 flex justify-start gap-2 max-w-[90%] overflow-x-auto">
            {hackathon?.tags?.slice(0, 8).map((tech, index) => (
              <Badge
                key={index}
                className="!bg-transparent border !border-white !h-7 !text-white whitespace-nowrap"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <div className="w-full flex justify-between gap-3 px-5 z-10 sm:hidden pb-[50px]">
            <div className="flex gap-3 items-center">
              {hackathon?.organizer?.logo && (
                <div className="flex-shrink-0 rounded-[12px] w-7 h-7 overflow-hidden">
                  <img
                    src={hackathon.organizer.logo}
                    className="w-full h-full object-cover"
                    alt="organizer logo"
                  />
                </div>
              )}
              <div className="font-roboto">
                <p className="font-medium text-[#FFFFFF] text-base">
                  {hackathon?.organizer?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-10 flex items-center">
          <div className="flex flex-nowrap h-10 whitespace-nowrap overflow-x-auto scrollbar-hide justify-start items-center space-x-5 lg:space-x-12 !w-full px-5 rounded-t-[12px] dark:bg-[#13131A99] z-10 relative !overflow-y-hidden">
            {tabs.map((tab) => (
              <div
                key={tab.value}
                className="bg-transparent capitalize relative text-sm font-semibold text-[#B8B8BA] transition-all duration-200 ease-in-out hover:text-white after:absolute after:w-0 after:transition-all after:duration-200 after:ease-in-out after:h-0.5 after:left-0 after:rounded-[1px] data-[state=active]:after:w-full after:bottom-2 data-[state=active]:after:bg-[#4E52F5] data-[state=active]:text-white"
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

HackathonPreview.displayName = "HackathonPreview";

export default HackathonPreview;
