import { Projects } from "@/types/entities";
import useIsProjectManager from "../useIsProjectManager";
import AllocationCard from "./AllocationCard";
import EditProjectPrizeAllocationModal from "./EditPrizeAllocationModal";

interface PrizeAllocationSectionProps {
  project: Projects;
  isOwner: boolean;
}

export const PrizeAllocationSection = ({
  project,
  isOwner,
}: PrizeAllocationSectionProps) => {
  const teamMembers = project?.project_team_members?.filter(
    (member) => member.status == "confirmed"
  );

  const is_project_manager = useIsProjectManager(project);

  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-white">Prize allocation</h1>
        {is_project_manager && isOwner && teamMembers?.length > 1 && (
          <EditProjectPrizeAllocationModal
            members={project?.project_team_members}
            id={project?.id}
          />
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,300px),1fr))] gap-8">
        {teamMembers.map((member) => (
          <AllocationCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};
