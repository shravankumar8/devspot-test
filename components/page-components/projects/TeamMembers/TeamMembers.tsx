import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/state";
import { Projects, Users } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { Trash2 } from "lucide-react";
import { TeamMemberFormPayload } from "./EditProjectTeamMembersModal";

interface TeamMembersSectionProps {
  project: Projects;
  teamMembers: TeamMemberFormPayload[];
  handleDeleteExistingUser: (user: Users) => void;
  updateProjectManagerStatus: (user: Users) => void;
}

export const TeamMembers = (props: TeamMembersSectionProps) => {
  const {
    handleDeleteExistingUser,
    project,
    teamMembers,
    updateProjectManagerStatus,
  } = props;
  const { user: loggedInUser } = useAuthStore();

  return (
    <>
      {teamMembers.map((teamMember, index) => {
        if (teamMember.is_deleted) return null;

        const project_team_member = project.project_team_members.find(
          (item) => item.user_id == teamMember.user_data.id
        );
        const user = teamMember?.user_data;
        const status = project_team_member?.status ?? "pending";

        const getStatusColor = () => {
          switch (status) {
            case "pending":
              return {
                backgroundColor: "#6E5B1B",
                color: "#EFC210",
              };
            case "confirmed":
              return {
                backgroundColor: "#263513",
                color: "#91C152",
              };
          }
        };

        const styles = getStatusColor();
        const isMe = loggedInUser?.id == user?.id;
        return (
          <div
            key={index}
            className="flex items-center justify-between w-full max-w-3xl"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#000375] w-[180px] overflow-hidden">
                <Avatar className="h-6 w-6 bg-black rounded-full flex-shrink-0">
                  <img
                    src={user.avatar_url || "/default-profile.png"}
                    alt={user.full_name ?? "John"}
                    className="h-full w-full object-cover rounded-full"
                  />
                </Avatar>
                <span className="flex-1 min-w-0 font-roboto text-[#ADAFFA] text-sm font-medium capitalize truncate">
                  {user.full_name} {isMe ? "(me)" : ""}
                </span>
              </div>

              <div className="px-4 py-1 rounded-full" style={styles}>
                <span className="text-xs font-normal capitalize font-roboto">
                  {status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {status === "confirmed" && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      !teamMember.is_project_manager &&
                      updateProjectManagerStatus(user)
                    }
                    className={cn(
                      "px-4 py-2  rounded-full border border-white bg-transparent text-xs font-roboto font-normal capitalize flex-1 min-w-0 truncate",
                      !teamMember.is_project_manager
                        ? "cursor-pointer"
                        : "cursor-auto"
                    )}
                  >
                    {teamMember.is_project_manager
                      ? "Project Manager"
                      : "Switch to Project Manager"}
                  </button>
                </>
              )}

              {!isMe && (
                <button
                  className="text-[#89898c] hover:text-[#adaffa] transition-colors"
                  onClick={() => handleDeleteExistingUser(user)}
                >
                  <Trash2 size={14} />
                  <span className="sr-only">Delete</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
