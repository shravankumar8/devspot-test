import { Projects } from "@/types/entities";
import useIsProjectManager from "../useIsProjectManager";
import DeleteProjectModal from "./DeleteProjectModal";
import LeaveProjectModal from "./LeaveProjectModal";

interface LeaveAndDeleteProps {
  isOwner: boolean;
  project: Projects;
}

const LeaveAndDelete = (props: LeaveAndDeleteProps) => {
  const { isOwner, project } = props;

  const is_project_manager = useIsProjectManager(project);
  const isExceededDeadline = project.hackathons?.deadline_to_submit ? new Date() > new Date(project.hackathons.deadline_to_submit) : false;
  const confirmed_team_members = project?.project_team_members?.filter(
    (member) => member.status == "confirmed"
  );

  return (
    <>
      {isOwner && (
        <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-2">
          {confirmed_team_members.length > 1 && (
            <LeaveProjectModal project={project} />
          )}

          {is_project_manager && !isExceededDeadline && (
            <DeleteProjectModal project={project} />
          )}
        </div>
      )}
    </>
  );
};

export default LeaveAndDelete;
