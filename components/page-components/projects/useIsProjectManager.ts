import { useAuthStore } from "@/state";
import { Projects } from "@/types/entities";

const useIsProjectManager = (project: Projects) => {
  const { user } = useAuthStore();

  const project_manager = project?.project_team_members.find(
    (user) => user.is_project_manager
  );

  const is_project_manager = project_manager?.user_id === user?.id;

  return is_project_manager;
};

export default useIsProjectManager;
