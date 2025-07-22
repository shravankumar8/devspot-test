import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { CheckCircle } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";

type Status = "pending" | "rejected" | "confirmed";
type ProjectInvitationAction = "approve" | "reject";

export interface ProjectInviteConfirmationNotificationType {
  type: "project_invite_confirmation";
  project_id: number;
  is_hackathon_participant: string;
  status: Status;
  transaction_id: string;
}

const ProjectInviteConfirmation = ({
  status,
  project_id,
  transaction_id,
  is_hackathon_participant,
}: ProjectInviteConfirmationNotificationType) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ProjectInvitationAction | null>(
    null
  );

  const [inviteStatus, setInviteStatus] = useState(status);

  const handleUpdateProjectInviteStatus = useCallback(
    async (action: ProjectInvitationAction) => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/projects/${project_id}`;

        await axios.post(
          `/api/projects/${project_id}/handle-invitation`,
          {},
          {
            params: { handler_type: action, transaction_id },
          }
        );

        if (action == "approve") {
          setInviteStatus("confirmed");

          router.push(url);
        } else if (action === "reject") {
          setInviteStatus("rejected");
        }
      } catch (error: any) {
        const message =
          error instanceof AxiosError
            ? error?.response?.data?.error
            : error?.message;

        toast.error(`Could not update invitation: ${message}`);
      } finally {
        setLoading(false);
      }
    },
    [project_id]
  );

  const handleAction = (action: ProjectInvitationAction) => {
    setSelected(action);
    handleUpdateProjectInviteStatus(action);
  };

  const sharedButtonProps = {
    disabled: loading || inviteStatus !== "pending",
    className:
      "w-[max-content] h-[36px] !text-base font-medium flex items-center gap-2",
  };
  const is_hackathon_participant_bool = is_hackathon_participant === "true";

  return (
    <div className="flex items-center gap-2">
      {is_hackathon_participant_bool && (
        <Button {...sharedButtonProps} onClick={() => handleAction("approve")}>
          {selected === "approve" && loading && <Spinner size="small" />}
          {inviteStatus === "confirmed" && <CheckCircle />}
          {inviteStatus === "confirmed" ? "Accepted" : "Accept"}
        </Button>
      )}

      {!is_hackathon_participant_bool && (
        <Button
          {...sharedButtonProps}
          onClick={() => {
            if (process.env.NODE_ENV === "production") {
              sendGAEvent("event", "join_hackathon_click", {
                value: "yes",
              });
            }
            const url = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/hackathons/1`;

            router.push(url);
          }}
        >
          Join Hackathon
        </Button>
      )}

      <Button
        {...sharedButtonProps}
        variant="secondary"
        onClick={() => handleAction("reject")}
      >
        {selected === "reject" && loading && <Spinner size="tiny" />}
        {inviteStatus === "rejected" && <CheckCircle />}
        {inviteStatus === "rejected" ? "Declined" : "Decline"}
      </Button>
    </div>
  );
};

export default ProjectInviteConfirmation;
