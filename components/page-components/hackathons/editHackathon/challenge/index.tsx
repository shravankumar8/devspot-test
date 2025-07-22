// components/modals/EditHackathonChallengeModal/EditHackathonChallengeModal.tsx
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import UseModal from "@/hooks/useModal";
import { ChallengeResponseType } from "@/types/hackathons";
import { Plus } from "lucide-react";

import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { useEffect } from "react";
import { ChallengeForm } from "./form";
import { ChallengeTabNavigation } from "./tabNavigation";
import { useChallengeManagement } from "./useChallengeManagement";

interface EditChallengeModalProps {
  challengesData: ChallengeResponseType;
  hackathonId: string;
}

export const EditHackathonChallengeModal = ({
  challengesData,
  hackathonId,
}: EditChallengeModalProps) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const {
    challenges,
    activeTab,
    setActiveTab,
    addNewChallenge,
    currentChallenge,
    handleSubmit,
    setChallenges,
  } = useChallengeManagement(
    challengesData.items ?? [],
    parseInt(hackathonId ?? "1")
  );

  useEffect(() => {
    if (
      (!challengesData || challengesData?.items?.length <= 0) &&
      challenges.length <= 0
    ) {
      const newChallenge = {
        challenge_name: "challenge-1",
        description: "",
        example_projects: [],
        required_tech: [],
        technologies: [],
        submission_requirements: [],
        is_round_2_only: false,
        hackathon_id: parseInt(hackathonId ?? "1"),
        sponsors: [],
        prizes: [],
        label: "",
        id: 1,
      };
      setChallenges([newChallenge]);
      setActiveTab(1);
    }
  }, [challengesData?.items]);

  if (!currentChallenge) {
    return null;
  }

  return (
    <GenericModal
      controls={{ isOpen, onClose, onOpen }}
      trigger={
        <button className="absolute top-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit challenges
        </DialogTitle>
      </DialogHeader>

      <ChallengeTabNavigation
        challenges={challenges}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ChallengeForm
        key={activeTab}
        hackathonId={parseInt(hackathonId)}
        challenge={currentChallenge}
        onSubmit={handleSubmit}
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="ghost"
              onClick={addNewChallenge}
              className="text-white px-4 py-2 text-base font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              New challenge
            </Button>
          </div>
        }
      />
    </GenericModal>
  );
};
