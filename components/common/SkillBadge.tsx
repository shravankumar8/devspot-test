import { SkillBadgeProps } from "@/types/common";
import React from "react";


const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <span className="flex items-center bg-[#2B2B31] text-[#E7E7E8] rounded-full px-3 py-1 text-[12px] sm:text-[14px] font-medium mr-2 mb-1 relative group font-roboto">
      {skill.length > 10 ? `${skill.slice(0, 10)}...` : skill}
      {skill.length > 10 && (
        <div className="absolute z-10 bg-[#2B2B31] text-[#E7E7E8] rounded-lg p-1 shadow-lg left-0 w-full text-center break-words opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {skill}
        </div>
      )}
    </span>
  );
};

export default SkillBadge;
