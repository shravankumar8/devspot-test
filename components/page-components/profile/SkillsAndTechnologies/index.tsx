"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/profile";
import { useMemo } from "react";
import AddSkillAndTechnoloyModal from "./AddSkillAndTechnoloyModal";
import SkillAndTechnologySkeletonLoader from "./SkeletonLoader";

interface SkillsAndTechnologiesProps {
  userProfile: UserProfile;
  isFetching: boolean;
  isOwner: boolean;
}

const SkillsAndTechnologies = (props: SkillsAndTechnologiesProps) => {
  const { isOwner, isFetching, userProfile } = props;

  const showEdit = useMemo(() => {
    return isOwner && !isFetching;
  }, [isFetching, isOwner]);

  const skills = userProfile?.profile?.skills;

  if (!skills?.experience.length && !skills?.technology.length && !isOwner)
    return null;

  return (
    <Card className="w-full bg-secondary-bg rounded-xl !border-none font-roboto gap-4 flex flex-col !p-6">
      <div className="flex justify-between items-center">
        <p className="font-normal !text-base text-white">Skills</p>

        {showEdit && <AddSkillAndTechnoloyModal userProfile={userProfile!} />}
      </div>

      {isFetching && <SkillAndTechnologySkeletonLoader />}

      {!isFetching && (
        <>
          {skills?.experience?.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-secondary-text">
                Experience
              </h3>
              <div className="flex flex-wrap gap-4">
                {skills?.experience?.map((skill, index) => (
                  <Badge
                    key={index}
                    className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl"
                  >
                    <span className="font-normal capitalize text-sm text-[#E7E7E8]">
                      {skill}
                    </span>
                  </Badge>
                ))}
              </div>
            </>
          )}

          {skills?.experience?.length > 0 && skills?.technology.length > 0 && (
            <Separator className="h-0.5 bg-[#424248]" />
          )}

          {skills?.technology?.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-secondary-text">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-4">
                {skills?.technology?.map((skill, index) => (
                  <Badge
                    key={index}
                    className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl"
                  >
                    <span className="font-normal capitalize text-sm text-[#E7E7E8]">
                      {skill}
                    </span>
                  </Badge>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default SkillsAndTechnologies;
