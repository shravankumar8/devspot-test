import { Projects } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { ExternalLink } from "lucide-react";
import EditProjectVideoModal from "./EditProjectVideoModal";
import VideoPlayer from "./VideoPlayer";

interface VideoSectionProps {
  project: Projects;
  isOwner: boolean;
}

const VideoSection = ({ project, isOwner }: VideoSectionProps) => {
  return (
    <div
      className={cn(
        "bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto flex flex-col gap-5",
        project.video_url && "row-span-2 h-full"
      )}
    >
      <div className="flex gap-3 justify-between w-full">
        <div className={cn("relative", isOwner ? "w-[80%]" : "w-full")}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#9667FA] to-[#4075FF] rounded-lg" />

          <a
            href={project.video_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-bg text-[#5A5A5F] text-base font-medium h-[50px] ",

              project.video_url
                ? "cursor-pointer text-white m-[1px]"
                : "cursor-auto border border-[#5A5A5F]"
            )}
          >
            <span>Video</span>
            <ExternalLink
              size={16}
              className={cn(
                project?.video_url ? "text-[#a076ff]" : "text-[#5A5A5F]"
              )}
            />
          </a>
        </div>

        {isOwner && <EditProjectVideoModal project={project} />}
      </div>
      {project.video_url && (
        <div className="flex items-center justify-center h-full">
          <VideoPlayer url={project.video_url} />
        </div>
      )}
    </div>
  );
};

export default VideoSection;
