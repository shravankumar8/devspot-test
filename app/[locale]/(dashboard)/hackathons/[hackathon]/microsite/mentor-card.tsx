import React from "react";

interface MentorCardProps {
  name: string;
  position: string;
  company: string;
  imageSrc: string;
}

const MentorCard = ({ name, position, company, imageSrc }: MentorCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 w-[160px] h-[160px] rounded-full overflow-hidden">
        <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="text-center">
        <h4 className="text-white text-lg sm:text-xl font-medium font-roboto">{name}</h4>
        <p className="text-white font-roboto text-xs mt-1">
          {position} @ {company}
        </p>
      </div>
    </div>
  );
};

export default MentorCard;
