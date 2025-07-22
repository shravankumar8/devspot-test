import ProjectInviteConfirmation, {
  ProjectInviteConfirmationNotificationType,
} from "./ProjectInviteConfirmation";
import VIPInviteConfirmation, {
  VIPInviteConfirmationNotificationType,
} from "./VipInviteConfirmation";

export type NotificationType =
  | ProjectInviteConfirmationNotificationType
  | VIPInviteConfirmationNotificationType;

const DynamicActions = (props: NotificationType) => {
  return (
    <>
      {props.type === "project_invite_confirmation" && (
        <ProjectInviteConfirmation {...props} />
      )}

      {props.type === "vip_invite_confirmation" && (
        <VIPInviteConfirmation {...props} />
      )}
    </>
  );
};

export default DynamicActions;
