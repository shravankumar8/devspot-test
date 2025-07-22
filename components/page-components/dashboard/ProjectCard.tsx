"use client";

import Image from "next/image";
import Link from "next/link";
import MoreSkillsTooltip from "./MoreSkillsTooltip";
import SkillBadge from "../../common/SkillBadge";
import { Button } from "../../ui/button";

const Medal: React.FC<{ ranking: string }> = ({ ranking }) => {
  const medalSrc = {
    "1": "/first_place_medal.svg",
    "2": "/second_place_medal.svg",
    "3": "/third_place_medal.svg",
  }[ranking];

  return medalSrc ? (
    <div className="relative w-[1rem] h-[1.5rem] mr-[0.3rem]">
      <Image
        src={medalSrc}
        alt={`${ranking} place medal`}
        layout="fill"
        className="object-cover"
      />
    </div>
  ) : null;
};

const TeamMember: React.FC<{ member: any; index: number }> = ({
  member,
  index,
}) => (
  <div
    className={`group relative w-[2.7rem] h-[2.7rem] rounded-full overflow-visible ${
      index !== 0 ? "-ml-[0.6rem]" : ""
    }`}
  >
    <Image
      src={member.profilePicture}
      alt={`${member.firstName} ${member.lastName}`}
      layout="fill"
      className="object-cover"
    />

    <div className="absolute -top-[1rem] left-1/2 transform -translate-x-1/2 font-roboto text-white font-semibold text-[0.6rem] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-10">
      {member.firstName} {member.lastName}
    </div>
  </div>
);

export const ProjectCard = ({ project }: any) => {
  const {
    projectName,
    challengeName,
    teamMembers,
    ranking,
    description,
    skills,
    image,
  } = project;
  const additionalSkillsCount = skills.length > 2 ? skills.length - 2 : 0;
  const additionalSkills = skills.slice(2);

  return (
    <div className="bg-[rgba(27,27,34,1)] rounded-xl p-3">
      <div className="h-[7rem] flex">
        <div className="flex items-center justify-center">
          <img
            src={image}
            alt={projectName}
            className="xl:w-[5.5rem] xl:h-[5.5rem] md:w-[4rem] md:h-[4rem] object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col justify-center pl-4">
          <h3 className="font-raleway text-white font-bold xl:text-[1.5rem] md:text-[1.4rem] sm:text-[1.3rem] text-[1.1rem] leading-[32.87px] text-left">
            {projectName}
          </h3>
          <span className="font-roboto text-secondary-text font-semibold xl:text-[0.95rem] md:text-[0.8rem] sm:text-[1rem] text-[0.7rem] text-left">
            {challengeName}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="h-[4rem] flex justify-between items-center">
          <div className="flex items-center">
            {teamMembers.slice(0, 3).map((member: any, index: number) => (
              <TeamMember key={index} member={member} index={index} />
            ))}
            {teamMembers.length > 3 && (
              <div className="-ml-[0.6rem] flex items-center justify-center w-[2.3rem] h-[2.3rem] bg-[rgba(43,43,49,1)] rounded-full">
                <span className="font-roboto text-[rgba(137,137,140,1)] font-semibold text-[1.125rem]">
                  +{teamMembers.length - 3}
                </span>
              </div>
            )}
            {teamMembers.length === 0 && (
              <span className="font-roboto text-[rgba(137,137,140,1)] font-semibold text-[0.875rem]">
                Team Members: N/A
              </span>
            )}
          </div>
          <Medal ranking={ranking} />
        </div>
        <div className="w-full h-[0.145rem] bg-[rgba(43,43,49,1)]" />
      </div>

      <div className="h-[7rem] mt-4 mb-2">
        <p className="font-roboto text-secondary-text font-medium text-[0.815rem] leading-[1.5rem] text-left line-clamp-5">
          {description ?? "Description: N/A"}
        </p>
      </div>

      <div className="h-[3rem] flex flex-wrap items-center mt-4 xl:mb-0 lg:mb-3 md:mb-2 sm:mb-4 font-roboto">
        {skills.length > 0 ? (
          <>
            {skills.slice(0, 2).map((skill: any, index: number) => (
              <SkillBadge key={index} skill={skill} />
            ))}
            {additionalSkillsCount > 0 && (
              <MoreSkillsTooltip
                additionalSkills={additionalSkills}
                count={additionalSkillsCount}
              />
            )}
          </>
        ) : (
          <span className="text-gray-400">Skills: N/A</span>
        )}
      </div>

      <div className="h-[4rem] pt-[0.5rem]">
        <Link href="/project/details">
          <Button variant="secondary" className=" w-full">
            View details
          </Button>
        </Link>
      </div>
    </div>
  );
};
