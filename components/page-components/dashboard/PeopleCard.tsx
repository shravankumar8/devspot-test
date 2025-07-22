"use client";

import numericalScoreIcon from "@/public/numerical_score_icon.png";
import Image from "next/image";
import MoreSkillsTooltip from "./MoreSkillsTooltip";
import { Person } from "@/types/profile";
import SkillBadge from "@/components/common/SkillBadge";

export const PeopleCard: React.FC<{ person: Person }> = ({ person }) => {
  const { name, role, profile_picture, location, score, skills } = person;

  const additionalSkillsCount = skills.length > 2 ? skills.length - 2 : 0;
  const additionalSkills = skills.slice(2);

  return (
    <div className="relative w-full max-w-sm rounded-xl bg-secondary-bg text-white p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center">
        <Image
          src={profile_picture || "/default_avatar.png"}
          alt={name}
          width={72}
          height={72}
          className="rounded-full border border-white"
        />
        <div className="ml-4 font-inter">
          <h2 className="text-[18px] sm:text-[24px] font-bold">{name}</h2>
          <span className="text-[12px] sm:text-[16px] font-semibold text-secondary-text">
            {role}
          </span>
          <p className="text-[10px] sm:text-[12px] font-medium text-secondary-text">
            {location}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center mt-4">
        <span className="flex items-center bg-[#000375] text-[#ADAFFA] rounded-full px-2 sm:px-3 py-1 text-[12px] sm:text-[14px] font-medium mr-2">
          <Image
            src={numericalScoreIcon}
            alt="Score Icon"
            width={16}
            height={16}
            className="mr-1"
          />
          {score}
        </span>

        <div className="flex flex-wrap items-center mt-2 font-roboto">
          {skills.slice(0, 2).map((skill, index) => (
            <SkillBadge key={index} skill={skill} />
          ))}

          {additionalSkillsCount > 0 && (
            <MoreSkillsTooltip
              additionalSkills={additionalSkills}
              count={additionalSkillsCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};
