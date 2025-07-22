import { Projects } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { ExternalLink } from "lucide-react";
import EditProjectLinksModal from "./EditProjectLinksModal";

interface LinksSectionProps {
  project: Projects;
  isOwner: boolean;
}

export const LinksSection = ({ project, isOwner }: LinksSectionProps) => {
  return (
    <>
      <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto flex gap-3 justify-between h-max">
        <div className={cn("relative", isOwner ? "w-[45%]" : "w-[50%]")}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#9667FA] to-[#4075FF] rounded-lg" />

          <a
            href={project.project_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-bg text-[#5A5A5F] text-base font-medium h-[50px] ",

              project.project_url
                ? "cursor-pointer text-white m-[1px]"
                : "cursor-auto border border-[#5A5A5F]"
            )}
          >
            <span>Repo</span>
            <ExternalLink
              size={16}
              className={cn(
                project?.project_url ? "text-[#a076ff]" : "text-[#5A5A5F]"
              )}
            />
          </a>
        </div>

        <div className={cn("relative", isOwner ? "w-[45%]" : "w-[50%]")}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#9667FA] to-[#4075FF] rounded-lg" />

          <a
            href={project.demo_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-bg text-[#5A5A5F] text-base font-medium h-[50px] ",

              project.demo_url
                ? "cursor-pointer text-white m-[1px]"
                : "cursor-auto border border-[#5A5A5F]"
            )}
          >
            <span>Demo</span>
            <ExternalLink
              size={16}
              className={cn(
                project?.demo_url ? "text-[#a076ff]" : "text-[#5A5A5F]"
              )}
            />
          </a>
        </div>

        {isOwner && <EditProjectLinksModal project={project} />}
      </div>
    </>
  );
};
