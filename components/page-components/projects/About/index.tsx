import { Projects } from "@/types/entities";
import { useState } from "react";
import EditProjectAboutModal from "./EditProjectAboutModal";

interface AboutSectionProps {
  content: string | null;
  isOwner: boolean;
  onEdit?: () => void;
  project: Projects;
}

export const AboutSection = ({
  content,
  isOwner,
  onEdit,
  project,
}: AboutSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 150;
  const shouldTruncate = content ? content.length > maxLength : false;

  const displayText =
    shouldTruncate && !expanded && content
      ? content.substring(0, maxLength) + "..."
      : content;

  return (
    <div
      className={
        "bg-secondary-bg rounded-[12px] py-4 h-full px-5 font-roboto space-y-2 flex flex-col gap-3 "
      }
    >
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Description</h1>
        {isOwner && <EditProjectAboutModal project={project} />}
      </div>

      <p className="text-sm text-secondary-text whitespace-normal break-words">
        {displayText ?? "Your project description goes here."}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 text-sm font-medium mt-2"
        >
          {expanded ? "VIEW LESS" : "VIEW MORE"}
        </button>
      )}
    </div>
  );
};
