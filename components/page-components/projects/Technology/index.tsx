import { Projects } from "@/types/entities";
import EditProfileIcon from "../../profile/EditProfileIcon";
import EditProjectTechnologyModal from "./EditTechnologyModal";

interface TechnologiesSectionProps {
  technologies: string[];
  isOwner: boolean;
  project: Projects;

}

export const TechnologiesSection = ({
  technologies,
  isOwner,
  project
}: TechnologiesSectionProps) => {
  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Technologies</h1>
        {isOwner && <EditProjectTechnologyModal project={project} />}
      </div>

      <div className="flex flex-wrap gap-2">
        {!technologies.length && (
          <p className=" text-gray-300 text-xs"
          >The technologies and APIs you’re using go here</p>
        )}
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full capitalize"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};
