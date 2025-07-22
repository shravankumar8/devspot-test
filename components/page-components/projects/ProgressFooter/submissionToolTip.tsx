"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Projects } from "@/types/entities";
import { Info } from "lucide-react";

export function SubmissionTooltip({
  projectData,
}: Readonly<{ projectData: Projects }>) {
  const requiredFields = [
    "name",
    "project_url",
    "video_url",
    "description",
    "tagline",
    "logo_url",
    "technologies",
  ];

  function isFieldMissing(project: Projects, field: string): boolean {
    return (
      project[field as keyof Projects] === null ||
      project[field as keyof Projects] === undefined ||
      project[field as keyof Projects] === ""
    );
  }
  // Find which required fields are null or empty
  const missingFields = requiredFields.filter((field) =>
    isFieldMissing(projectData, field)
  );

  if (missingFields.length === 0) {
    return null; // Don't show tooltip if all fields are filled
  }

  return (
    <div className="group relative inline-block">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-white" />
          </TooltipTrigger>
          <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-2xl shadow-md font-roboto max-w-[300px]">
            <h3 className="font-semibold  mb-1 text-white">
              The following fields are required to submit your project:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {missingFields.map((field) => (
                <li key={field} className="text-white capitalize">
                  {field.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
