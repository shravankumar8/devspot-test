import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { CheckCircle } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

type Status = "pending" | "accepted" | "rejected"; 
type VipInvitationAction = "approve" | "reject";

export interface VIPInviteConfirmationNotificationType {
  type: "vip_invite_confirmation";
  hackathon_id: number;
  status: Status;
  transaction_id: string;
}

const VIPInviteConfirmation = ({
  status,
  hackathon_id,
  transaction_id,
}: VIPInviteConfirmationNotificationType) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<VipInvitationAction | null>(null);

  const [inviteStatus, setInviteStatus] = useState(status);

  const handleUpdateVipInviteStatus = useCallback(
    async (action: VipInvitationAction) => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/en/hackathons/${hackathon_id}`;

        await axios.post(
          `/api/hackathons/${hackathon_id}/handle-invitation`,
          {},
          {
            params: { handler_type: action, transaction_id },
          }
        );

        if (action == "approve") {
          setInviteStatus("accepted");

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
    [hackathon_id]
  );

  const handleAction = (action: VipInvitationAction) => {
    setSelected(action);
    handleUpdateVipInviteStatus(action);
  };

  const sharedButtonProps = {
    disabled: loading || inviteStatus !== "pending",
    className:
      "w-[max-content] h-[36px] !text-base font-medium flex items-center gap-2",
  };

  return (
    <div className="flex items-center gap-2">
      <Button {...sharedButtonProps} onClick={() => handleAction("approve")}>
        {selected === "approve" && loading && <Spinner size="small" />}
        {inviteStatus === "accepted" && <CheckCircle />}
        {inviteStatus === "accepted" ? "Accepted" : "Accept"}
      </Button>

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

export default VIPInviteConfirmation;
