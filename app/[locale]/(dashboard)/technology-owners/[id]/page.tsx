"use client";

import {
  LinkedinIcon2,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/EditPencil";
import { CheckCircle } from "@/components/icons/Location";
import { TechOwnerTab } from "@/components/layout/tabs/tecnology-owner/techOwnerTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TechOwners } from "@/mocked_data/data-helpers/technowners/techowners";
import { useTechOwner } from "@/state/hackathon";
import { TechOwnersType } from "@/types/techowners";
import { getInitials } from "@/utils/url-validator";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TechOwner({
  params,
}: Readonly<{
  params: { locale: string; id: string };
}>) {
  const [techOwner, setTechOwner] = useState<TechOwnersType | null>(null);
  const {following, setFollowing} = useTechOwner()

  const id = params.id;

  useEffect(() => {
    const foundTechOwner = TechOwners.find(
      (owner) => owner.id.toString() === id
    );
    if (foundTechOwner) {
      setTechOwner(foundTechOwner);
    }
  }, []);

  return (
    <div>
      <div
        className={`relative overlay  w-full text-white gap-4 sm:gap-8 bg-secondary-bg rounded-[20px] flex items-center justify-between h-[240px] overflow-hidden `}
      >
        <div className="flex w-full justify-between lg:flex-row flex-col gap-3 px-6 md:px-8 lg:items-center pb-8 z-10">
          <div className="flex gap-7 items-end">
            {techOwner?.logo && (
              <Avatar className="w-[156px] h-[156px] border-2 border-tertiary-bg rounded-[12px]">
                <AvatarImage
                  src={techOwner?.logo}
                  alt={techOwner?.name}
                  className="z-0 object-contain"
                />
                <AvatarFallback className="!rounded-none !bg-transparent">
                  {getInitials(techOwner?.name)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col justify-between gap-3">
              <p className="text-secondary-text font-normal text-base max-w-[550px] font-roboto">
                {techOwner?.description}
              </p>
              <h1 className="md:text-[32px] text-[24px] lg:text-[32px] font-semibold text-[#FFFFFF] md:leading-[46px] flex gap-1 items-start">
                {techOwner?.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-col justify-between h-[128px] gap-8">
            <div>
              <Button variant="special" onClick={() => setFollowing(true)}>
                {following ? (
                  <>
                    <CheckCircle width="18px" height="18px" className="mr-2"/> Following
                  </>
                ) : (
                  <>
                    {" "}
                    <Plus /> Follow
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3 justify-end">
              {techOwner?.linkedin_url && (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={techOwner.linkedin_url}
                >
                  <LinkedinIcon2 />
                </Link>
              )}
              {techOwner?.x_url && (
                <Link target="_blank" rel="noreferrer" href={techOwner.x_url}>
                  <TwitterIcon />
                </Link>
              )}
              {techOwner?.youtube_url && (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={techOwner.youtube_url}
                >
                  <YoutubeIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="z-10">
        <TechOwnerTab />
      </div>
    </div>
  );
}
