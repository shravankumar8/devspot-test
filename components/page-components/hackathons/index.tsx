"use client";

import Modal from "@/components/common/Modal";
import { CheckCircle, PendingIcon } from "@/components/icons/Location";
import HackathonTab from "@/components/layout/tabs/hackathons/HackathonTab";
import ConsentPage from "@/components/page-components/auth/LegalOptIn";
import ApplyToHackathonModal from "@/components/page-components/hackathons/applyModal";
import { CountdownTimer } from "@/components/page-components/hackathons/countdown";
import HackathonSkeleton from "@/components/page-components/hackathons/header-skeleton";
import CreateProjectModal from "@/components/page-components/projects/CreateProjectModal";
import SpotCreationModal from "@/components/page-components/projects/SpotCreationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import UseModal from "@/hooks/useModal";
import { useAuthStore, useUserStore } from "@/state";
import { Hackathons } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { sendGAEvent } from "@next/third-parties/google";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditHackathonHeaderModal from "./editHackathon/header";
import StakeToJoinModal from "./staking/StakeToJoinModal";

export type ActionTypes =
  | "join"
  | "stake"
  | "apply"
  | "apply_additional"
  | "apply_stake"
  | "apply_additional_stake";

interface HackathonPageProps {
  hackathonData: Hackathons;
  isHackathonDataLoading: boolean;
  isOwner: boolean;
}
export default function HackathonPage(props: HackathonPageProps) {
  const { isOwner, isHackathonDataLoading, hackathonData } = props;
  const router = useRouter();

  const { addUserHackathon } = useUserStore();

  const {
    closeModal: onCloseSpotModal,
    isOpen: isSpotModalOpen,
    openModal: onOpenSpotModal,
  } = UseModal();
  const [submittedProjectUrl, setSubmittedProjectUrl] = useState<string | null>(
    null
  );

  const [selectedAction, setSelectedAction] = useState<null | ActionTypes>(
    null
  );

  const { user, session } = useAuthStore();
  const isMobile = useIsMobile();

  const {
    isOpen: isLegalOptInOpen,
    openModal: openLegalOptInModal,
    closeModal: closeLegalOptInModal,
  } = UseModal("legal-opt-in");

  const {
    isOpen: isApplicationProfileOpen,
    openModal: openApplicationProfileModal,
    closeModal: closeApplicationProfileModal,
  } = UseModal("application-profile");

  const handleJoinHackathon = (action: ActionTypes) => {
    if (process.env.NODE_ENV === "production") {
      sendGAEvent("event", "join_hackathon_click", {
        value: "yes",
      });
      if (window.twq) {
        window.twq("track", "SignUp");
      }
    }

    if (!user || !session) {
      const url = ` ${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/login`;
      return router.push(url);
    }
    if (hackathonData?.application_status === "accepted") return;

    if (hackathonData) {
      addUserHackathon({
        hackathonId: hackathonData?.id.toString(),
        status: "in_progress",
        applicationProgress: 1,
      });
    }
    switch (action) {
      case "join":
        setSelectedAction("join");
        openLegalOptInModal();
        break;

      case "apply":
        setSelectedAction("apply");
        openApplicationProfileModal();

        break;
      case "apply_additional":
        setSelectedAction("apply_additional");
        router.push(`/hackathons/${hackathonData?.id}/application`);
        break;

      default:
        console.log("Unknown action.");
    }
  };

  const getButtonText = () => {
    switch (hackathonData?.application_method) {
      case "join":
        return (
          <div className="flex items-center gap-2">
            <Plus />
            <span>Join Hackathon</span>
          </div>
        );

      case "apply":
      case "apply_additional":
      case "apply_stake":
      case "apply_additional_stake":
        return (
          <div className="flex items-center gap-2">
            <Plus />
            <span>Apply to hackathon</span>
          </div>
        );
      default:
        return "Apply";
    }
  };

  const targetDate =
    hackathonData?.deadline_to_submit &&
    !isNaN(new Date(hackathonData.deadline_to_submit).getTime())
      ? new Date(hackathonData.deadline_to_submit)
      : null;

  if (targetDate) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  type HackathonState = {
    status: "upcoming" | "live" | "ended" | "draft";
    hasDeadline: string | null;
    join_status: "pending" | "accepted" | null;
  };

  const getHackathonState = ({
    status,
    hasDeadline,
    join_status,
  }: HackathonState) => {
    const deadlineStatus = hasDeadline
      ? hackathonData.deadline_to_join &&
        new Date(hackathonData.deadline_to_join) < new Date()
        ? "deadlinePassed"
        : "deadlineUpcoming"
      : "noDeadline";

    const key = `${status}_${deadlineStatus}_${
      join_status === "accepted" ? "joined" : "notJoined"
    }`;

    switch (key) {
      case "upcoming_deadlineUpcoming_notJoined":
        return (
          <div>
            {join_status === "pending" ? (
              <div className="flex justify-center items-center gap-2 dark:bg-gradient-to-l dark:from-[#9667FA] dark:to-[#4075FF] px-4 rounded-[8px] h-[28px] sm:h-[44px] font-roboto dark:text-white">
                <PendingIcon />
                <span>Application pending</span>
              </div>
            ) : (
              <>
                {hackathonData.application_method == "stake" ? (
                  <StakeToJoinModal hackathon={hackathonData} />
                ) : (
                  <Button
                    onClick={() =>
                      handleJoinHackathon(
                        hackathonData?.application_method as ActionTypes
                      )
                    }
                    size={isMobile ? "sm" : "default"}
                    variant="special"
                  >
                    {getButtonText()}
                  </Button>
                )}
              </>
            )}
          </div>
        );

      case "upcoming_noDeadline_notJoined":
        return (
          <div>
            {join_status === "pending" ? (
              <Button size={isMobile ? "sm" : "default"} variant="special">
                <div className="flex items-center gap-2">
                  <PendingIcon />
                  <span>Application Pending</span>
                </div>
              </Button>
            ) : (
              <>
                {hackathonData.application_method == "stake" ? (
                  <StakeToJoinModal hackathon={hackathonData} />
                ) : (
                  <Button
                    onClick={() =>
                      handleJoinHackathon(
                        hackathonData?.application_method as ActionTypes
                      )
                    }
                    size={isMobile ? "sm" : "default"}
                    variant="special"
                  >
                    {getButtonText()}
                  </Button>
                )}
              </>
            )}
          </div>
        );

      case "upcoming_noDeadline_joined":
      case "upcoming_deadlineUpcoming_joined":
        return (
          <>
            <Button size={isMobile ? "sm" : "default"} variant="special">
              <div className="flex items-center gap-2">
                <CheckCircle />
                <span>Joined Hackathon</span>
              </div>
            </Button>
          </>
        );

      case "live_deadlineUpcoming_joined":
      case "live_noDeadline_joined":
        return (
          <>
            {targetDate && <CountdownTimer targetDate={targetDate} />}
            <CreateProjectModal
              hackathonId={hackathonData?.id.toString()}
              onOpenSpotModal={onOpenSpotModal}
              setSubmittedProjectUrl={setSubmittedProjectUrl}
            />

            {isSpotModalOpen && (
              <SpotCreationModal
                hackathonId={hackathonData?.id.toString()}
                isOpen={isSpotModalOpen}
                onClose={onCloseSpotModal}
                onOpen={onOpenSpotModal}
                submittedProjectUrl={submittedProjectUrl}
                setSubmittedProjectUrl={setSubmittedProjectUrl}
              />
            )}
          </>
        );

      case "live_deadlinePassed_notJoined":
        return targetDate && <CountdownTimer targetDate={targetDate} />;

      case "live_noDeadline_notJoined":
      case "live_deadlineUpcoming_notJoined":
        return (
          <>
            {targetDate && <CountdownTimer targetDate={targetDate} />}
            {join_status === "pending" ? (
              <Button size={isMobile ? "sm" : "default"} variant="special">
                <div className="flex items-center gap-2">
                  <PendingIcon />
                  <span>Application Pending</span>
                </div>
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleJoinHackathon(
                    hackathonData?.application_method as ActionTypes
                  )
                }
                variant="special"
                size={isMobile ? "md" : "default"}
              >
                {getButtonText()}
              </Button>
            )}
          </>
        );

      default:
        return "";
    }
  };

  if (isHackathonDataLoading) {
    return <HackathonSkeleton />;
  }

  return (
    <div className="w-full h-full">
      <Modal
        isOpen={isLegalOptInOpen}
        onClose={closeLegalOptInModal}
        sidebar={false}
        maxWidth="800px"
      >
        <div className="relative w-full">
          <div className="bg-[#1B1B22] px-5 pt-5 pb-2">
            <h2 className="top-0 left-6 sticky font-inter font-semibold text-[20px] sm:text-[24px]">
              Legal Opt-ins
            </h2>
            <p className="mt-6 font-inter text-[15px]">
              Please agree to the following legal terms.
            </p>
          </div>
          <ConsentPage
            actionType={selectedAction!}
            closeLegalOptInModal={closeLegalOptInModal}
            closeApplicationProfileModal={closeApplicationProfileModal}
            hackathonId={hackathonData?.id.toString()}
          />
        </div>
      </Modal>

      <div
        className={`relative overlay  w-full text-white gap-4 sm:gap-8 bg-[#1F2034] rounded-[20px] flex-col flex items-center justify-between h-auto sm:h-[240px]  ${cn(
          !hackathonData?.banner_url ? "overflow-hidden" : ""
        )} `}
        style={{
          backgroundImage: `url(${hackathonData?.banner_url})`,
          backgroundPosition: "cover",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="z-10 lg:items-end px-5 pt-5 lg:pb-8 w-full overflow-auto">
          <div className="flex gap-3 sm:gap-5 w-full">
            {hackathonData?.avatar_url && (
              <div className="block flex-shrink-0 rounded-[12px] w-[56px] sm:w-[146px] h-[56px] sm:h-[146px] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={hackathonData?.avatar_url}
                  alt="Fixed Logo for hackathon"
                />
              </div>
            )}
            <div className="flex flex-col justify-between items-start gap-3 w-full">
              <div className="flex items-center gap-1 sm:gap-3 mt-3">
                <h1 className="overflow-hidden font-semibold text-[#FFFFFF] sm:text-[28px] text-xl text-ellipsis leading-[30px] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] capitalize">
                  {hackathonData?.name}
                </h1>
                {/* {hackathonInformation?.status === "live" ? (
                  <div>
                    <span className="flex items-center bg-[#263513] px-3 py-1 rounded-full h-[26px] font-[500] font-roboto text-[#91C152] text-[12px] whitespace-nowrap">
                      
                      Register now
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="flex items-center bg-[#2B2B31] px-3 py-1 rounded-full h-[26px] font-[500] font-roboto text-[#E7E7E8] text-[12px]">
                      Upcoming
                    </span>
                  </div>
                )} */}
              </div>

              <div className="hidden sm:flex items-center gap-3">
                {hackathonData?.organizer?.logo && (
                  <div className="rounded-[12px] w-7 h-7 overflow-hidden">
                    <img
                      src={hackathonData?.organizer?.logo}
                      className="w-full h-full object-cover"
                      alt={`organizer logo`}
                    />
                  </div>
                )}
                <div className="font-roboto">
                  <p className="font-meduim text-[#FFFFFF] text-base capitalize">
                    {hackathonData?.organizer?.name}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex justify-between gap-3 w-full">
                <div className="flex gap-2 w-[70%] max-w-[70%] overflow-x-auto">
                  {hackathonData?.tags?.slice(0, 8).map((tech, index) => (
                    <Badge
                      key={index}
                      className="!bg-transparent border !border-white !h-7 !text-white whitespace-nowrap"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="">
                  {getHackathonState({
                    status: hackathonData?.status,
                    hasDeadline: hackathonData?.deadline_to_join,
                    join_status: hackathonData?.application_status!,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden z-10 flex justify-start gap-2 max-w-[90%] overflow-x-auto">
          {hackathonData?.tags?.slice(0, 8).map((tech, index) => (
            <Badge
              key={index}
              className="!bg-transparent border !border-white !h-7 !text-white whitespace-nowrap"
            >
              {tech}
            </Badge>
          ))}
        </div>
        <div className="w-full flex justify-between gap-3 px-5 z-10 sm:hidden pb-[50px]">
          <div className="flex gap-3 items-center">
            {hackathonData?.organizer?.logo && (
              <div className="flex-shrink-0 rounded-[12px] w-7 h-7 overflow-hidden">
                <img
                  src={hackathonData?.organizer?.logo}
                  className="w-full h-full object-cover"
                  alt={`organizer logo`}
                />
              </div>
            )}
            <div className="font-roboto">
              <p className="font-medium text-[#FFFFFF] text-base">
                {hackathonData?.organizer?.name}
              </p>
            </div>
          </div>
          <div className="">
            {getHackathonState({
              status: hackathonData?.status,
              hasDeadline: hackathonData?.deadline_to_join,
              join_status: hackathonData?.application_status!,
            })}
          </div>
        </div>
        {isOwner && <EditHackathonHeaderModal hackathon={hackathonData} />}
      </div>
      {hackathonData && (
        <div className="z-10">
          <HackathonTab
            hackathonId={hackathonData?.id.toString()}
            isOwner={isOwner}
          />
        </div>
      )}

      <ApplyToHackathonModal
        hackathonBanner={hackathonData?.banner_url}
        isOpen={isApplicationProfileOpen}
        onClose={closeApplicationProfileModal}
        onOpen={openApplicationProfileModal}
        onContinueClick={() => {
          closeApplicationProfileModal();
          openLegalOptInModal();
        }}
      />
    </div>
  );
}
