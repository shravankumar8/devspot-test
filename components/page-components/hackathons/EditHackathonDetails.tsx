


import { DatePicker } from "@/components/common/DatePicker";
import { DateTimePicker } from "@/components/common/TimePicker";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Switch } from "@/components/ui/switch";
import UseModal from "@/hooks/useModal";
import { Hackathons } from "@/types/entities";
import { Info } from "lucide-react";
import { useState } from "react";
import EditProfileIcon from "../profile/EditProfileIcon";

export const EditHackathonDetails = ({
  hackathonData,
}: {
  hackathonData: Hackathons;
}) => {
 
    const [eventType, setEventType] = useState<"virtual" | "physical">(
    hackathonData.type
    );
    const [registrationStartDate, setRegistrationStartDate] = useState<
      Date | undefined
    >();
    const [registrationStartTime, setRegistrationStartTime] =
      useState("08:00");
    const [registrationEndDate, setRegistrationEndDate] = useState<
      Date | undefined
    >();
    const [registrationEndTime, setRegistrationEndTime] = useState("08:00");
    const [projectSubmissionDate, setProjectSubmissionDate] = useState<
      Date | undefined
    >();
    const [projectSubmissionTime, setProjectSubmissionTime] = useState("08:00");
    const [projectDeadlineDate, setProjectDeadlineDate] = useState<
      Date | undefined
    >();
    const [projectDeadlineTime, setProjectDeadlineTime] = useState("08:00");
    const [showSubmissionCountdown, setShowSubmissionCountdown] =
      useState(false);
    const [showDeadlineCountdown, setShowDeadlineCountdown] = useState(false);
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <button className="absolute top-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit hackathon details
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 p-1 font-roboto">
        {/* Virtual or in-person */}
        <div className="space-y-3">
          <label className="text-secondary-text text-sm font-medium">
            Virtual or in-person?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setEventType("virtual")}
              className={`px-4 h-7 flex justify-center items-center rounded-lg text-sm font-medium transition-colors ${
                eventType === "virtual"
                  ? "bg-main-primary text-white"
                  : "bg-[#424248] text-secondary-text hover:bg-gray-600"
              }`}
            >
              Virtual
            </button>
            <button
              onClick={() => setEventType("physical")}
              className={`px-4 h-7 flex justify-center items-center rounded-lg text-sm font-medium transition-colors ${
                eventType === "physical"
                  ? "bg-main-primary text-white"
                  : "bg-[#424248] text-secondary-text hover:bg-gray-600"
              }`}
            >
              In-person
            </button>
          </div>
        </div>

        {/* Registration start date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-secondary-text text-sm font-medium">
              Registration start date
            </label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-secondary-text text-sm">
            If your hackathon is accepting applications, this is the date
            applications open.
          </p>
          <div className="flex gap-3">
            <DatePicker
              value={registrationStartDate}
              onChange={setRegistrationStartDate}
              placeholder="May 15, 2025"
              className="basis-[50%] text-sm"
            />
            <DateTimePicker
              time={registrationStartTime}
              setTime={setRegistrationStartTime}
              className="basis-[50%] text-sm"
            />
          </div>
        </div>

        {/* Registration end date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-secondary-text text-sm font-medium">
              Registration end date
            </label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm">
            If your hackathon is accepting applications, this is the application
            deadline.
          </p>
          <div className="flex gap-3">
            <DatePicker
              value={registrationEndDate}
              onChange={setRegistrationEndDate}
              placeholder="May 15, 2025"
              className="basis-[50%] text-sm"
            />
            <DateTimePicker
              time={registrationEndTime}
              setTime={setRegistrationEndTime}
              className="basis-[50%] text-sm"
            />
          </div>
        </div>

        {/* Project submission opens */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-secondary-text text-sm font-medium">
              Project submission opens
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Display countdown</span>
              <Switch
                checked={showSubmissionCountdown}
                onCheckedChange={setShowSubmissionCountdown}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <DatePicker
              value={projectSubmissionDate}
              onChange={setProjectSubmissionDate}
              placeholder="May 15, 2025"
              className="basis-[50%] text-sm"
            />
            <DateTimePicker
              time={projectSubmissionTime}
              setTime={setProjectSubmissionTime}
              className="basis-[50%] text-sm"
            />
          </div>
        </div>

        {/* Project submission deadline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-secondary-text text-sm font-medium">
              Project submission deadline
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Display countdown</span>
              <Switch
                checked={showDeadlineCountdown}
                onCheckedChange={setShowDeadlineCountdown}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <DatePicker
              value={projectDeadlineDate}
              onChange={setProjectDeadlineDate}
              placeholder="May 15, 2025"
              className="basis-[50%] text-sm"
            />
            <DateTimePicker
              time={projectDeadlineTime}
              setTime={setProjectDeadlineTime}
              className="basis-[50%] text-sm"
            />
          </div>
        </div>
      </div>
    </GenericModal>
  );
};


