import { GithubIcon, LinkedinIcon, StackOverflowIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import UseModal from "@/hooks/useModal";
import { ConnectedAccount } from "@/types/profile";
import EditProfileIcon from "../../EditProfileIcon";
import DevAccountCard from "./DevAccountCard";
import { DevAccountInfo } from "./type";

interface AddBuilderStatModalProps {
  accounts: ConnectedAccount[];
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean
}

const AddBuilderStatModal = ({ accounts, onClose, onOpen, isOpen }: AddBuilderStatModalProps) => {
  const connectedValues = accounts?.flatMap((account) => Object?.keys(account)) ?? [];


  const connectionData: DevAccountInfo[] = [
    {
      icon: <GithubIcon />,
      label: "Connect your GitHub",
      value: "github",
      url: "/api/connect-dev",
      method: "POST",
      connected: connectedValues.includes("github"),
      data: {
        provider: "github",
        redirect: "profile",
      },
    },
    // {
    //   icon: <LinkedinIcon />,
    //   label: "Connect your Linkedin",
    //   value: "linkedin_oidc",
    //   url: "/api/connect-dev",
    //   method: "POST",
    //   connected: connectedValues.includes("linkedin"),
    //   data: {
    //     provider: "linkedin_oidc",
    //     redirect: "profile",
    //   },
    // },
    {
      icon: <img src="/gitlab-logo.png" className="w-6 h-6" />,
      label: "Connect your GitLab",
      value: "gitlab",
      url: "/api/connect-dev",
      method: "POST",
      connected: connectedValues.includes("gitlab"),
      data: {
        provider: "gitlab",
        redirect: "profile",
      },
    },
    {
      icon: <StackOverflowIcon />,
      label: "Connect your Stack Overflow",
      value: "stack_overflow",
      url: "/api/auth/stackoverflow?state=profile",
      method: "GET",
      connected: connectedValues.includes("stack_overflow"),
    },
    // {
    //   icon: <img src="/spotify.png" className="w-5 h-5" />,
    //   label: "Connect your Spotify",
    //   value: "spotify",
    //   url: "/api/connect-dev",
    //   method: "POST",
    //   connected: connectedValues.includes("spotify"),
    //   data: {
    //     provider: "spotify",
    //     redirect: "profile",
    //   },
    // },
    {
      icon: <img src="/dribble.png" className="w-6 h-6" />,
      label: "Connect your Dribbble",
      value: "dribble",
      url: "/api/auth/dribble?state=profile",
      method: "GET",
      connected: connectedValues.includes("dribble"),
    },
  ];

  const sortedConnectionData = connectionData.sort((a, b) =>
    a.connected === b.connected ? 0 : a.connected ? -1 : 1
  );

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="bg-[#1B1B22] pt-2 pb-5">
        <DialogTitle className="!text-[24px] font-semibold">
          Connect accounts
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col relative h-full">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 overflow-y-scroll pb-5">
          {sortedConnectionData.map((info, index) => (
            <DevAccountCard {...info} key={index} />
          ))}
        </div>
        <div className="w-full absolute bottom-10 right-0 flex sm:justify-end justify-center mt-4">
          <Button type="submit" className="!min-w-fit gap-2" disabled>
            Save
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default AddBuilderStatModal;
