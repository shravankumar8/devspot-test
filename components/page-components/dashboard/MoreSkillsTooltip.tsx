import { Badge } from "@/components/ui/badge";
import { MoreSkillsTooltipProps } from "@/types/common";
import React from "react";

const MoreSkillsTooltip: React.FC<MoreSkillsTooltipProps> = ({
  additionalSkills,
  count,
}) => {
  return (
    <Badge className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl relative group">
      <span className="font-normal whitespace-nowrap text-xs text-neutral-100">
        +{count} more
      </span>

      {/* {additionalSkills.length > 0 && (
        <div className="absolute z-10 bg-[#2B2B31] text-white rounded-lg p-2 mt-2 shadow-lg left-0 top-4 w-auto max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ul className="list-inside list-none p-0 m-0">
            {additionalSkills.map((skill, index) => (
              <li key={index} className="text-xs whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </Badge>
  );
};

export default MoreSkillsTooltip;
