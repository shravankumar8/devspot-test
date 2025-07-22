import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Projects } from "@/types/entities";
import { InfoIcon } from "lucide-react";

interface ProjectDetailsSectionProps {
  project: Projects;
  suspiciousFlags?: string;
}

const ProjectDetailsSection = ({
  project,
  suspiciousFlags,
}: ProjectDetailsSectionProps) => {
  console.log("ProjectDetailsSection", project);
  return (
    <div className="bg-secondary-bg relative rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-base font-semibold text-white">
            Project details
          </h1>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div>
                  {project?.project_code_type && (
                    <Badge
                      className={`${
                        project.project_code_type
                          ? "!bg-[#263513] !text-[#91C152]"
                          : "!bg-[#6E5B1B] !text-[#EFC210]"
                      } px-3 text-sm font-medium`}
                    >
                      {project.project_code_type === "fresh_code"
                        ? "Fresh Code"
                        : "Existing Code"}
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#424248] text-white text-sm px-4 py-2 font-medium rounded-md shadow-md font-roboto max-w-[300px]">
                Determined by Judging Bot based on repository commit history.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {suspiciousFlags && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                      <Badge className="!bg-[#58120A] !text-[#EB7E76] px-3 text-sm font-medium">
                        <InfoIcon className="stroke-[#EB7E76] text-sm size-[14px] mr-2" />{" "}
                        Suspicious Activity
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#424248] text-white text-sm px-4 py-2 font-medium rounded-md shadow-md font-roboto max-w-[300px]">
                    Determined by Judging Bot based on repository commit
                    history.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="font-medium text-xs font-roboto">
                {suspiciousFlags}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsSection;
