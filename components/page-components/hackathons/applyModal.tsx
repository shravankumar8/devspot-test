import { RightArrow } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";

interface ApplyToHackathonModalProps {
  hackathonBanner: string;
  onContinueClick: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ApplyToHackathonModal = (props: ApplyToHackathonModalProps) => {
  const { hackathonBanner, onContinueClick, isOpen, onClose, onOpen } = props;

  const { data: profileData, isLoading: isProfileDataLoading } =
    useSWR<UserProfile>(`/api/profile`, fetchData);

  const { data: profileCompletion, isLoading } = useSWR<{
    completionPercentage: number;
  }>("/api/profile/profile-completion", fetchData);

  async function fetchData(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <GenericModal
      hasMinHeight={false}
      hasSidebar={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
    >
      <div className="-p-5">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold">
            Apply to attend
          </DialogTitle>
        </DialogHeader>

        <div className="w-full relative p-5">
          <div className="bg-[#1B1B22]">
            <p className="font-inter text-[16px] mt-6">
              We will complete your application based on your profile and send
              it to the organizers.
            </p>
          </div>
          <div className="flex items-center gap-16 w-full justify-center mt-8">
            {profileData?.avatar_url && (
              <img
                src={profileData?.avatar_url}
                alt={profileData?.full_name ?? "User Avatar"}
                className="w-24 h-24 sm:w-40 sm:h-40 rounded-full object-cover mb-4"
              />
            )}

            <RightArrow />

            <img
              src={hackathonBanner ?? "/profile/logo.png"}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover mb-4"
              alt="organizer logo"
            />
          </div>
          <div>
            <p className="font-inter text-[16px] mt-6">
              Your profile is {profileCompletion?.completionPercentage}%
              complete. For a better chance of getting accepted, complete your
              profile before <br /> applying.
            </p>
          </div>
          <div className="w-full flex justify-end gap-3 mt-10">
            <Link href={`/profile`}>
              <Button variant="secondary">Edit my profile</Button>
            </Link>
            <Button onClick={onContinueClick}>Continue</Button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default ApplyToHackathonModal;
