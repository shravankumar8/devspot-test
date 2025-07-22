"use client";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import UseModal from "@/hooks/useModal";
import { useState } from "react";
import SettingsConfirmationModal from "./SettingsConfirmationModal";

// Define tab types for type safety
type SettingsTab = "account" | "display" | "notifications";

const SettingsTrigger = () => {
  return (
    <button className="flex items-center transition-all ease-in-out duration-200 gap-2 text-secondary-text hover:text-white">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-colors duration-200"
      >
        <path
          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12.8801V11.1201C2 10.0801 2.85 9.22006 3.9 9.22006C5.71 9.22006 6.45 7.94006 5.54 6.37006C5.02 5.47006 5.33 4.30006 6.24 3.78006L7.97 2.79006C8.76 2.32006 9.78 2.60006 10.25 3.39006L10.36 3.58006C11.26 5.15006 12.74 5.15006 13.65 3.58006L13.76 3.39006C14.23 2.60006 15.25 2.32006 16.04 2.79006L17.77 3.78006C18.68 4.30006 18.99 5.47006 18.47 6.37006C17.56 7.94006 18.3 9.22006 20.11 9.22006C21.15 9.22006 22.01 10.0701 22.01 11.1201V12.8801C22.01 13.9201 21.16 14.7801 20.11 14.7801C18.3 14.7801 17.56 16.0601 18.47 17.6301C18.99 18.5401 18.68 19.7001 17.77 20.2201L16.04 21.2101C15.25 21.6801 14.23 21.4001 13.76 20.6101L13.65 20.4201C12.75 18.8501 11.27 18.8501 10.36 20.4201L10.25 20.6101C9.78 21.4001 8.76 21.6801 7.97 21.2101L6.24 20.2201C5.33 19.7001 5.02 18.5301 5.54 17.6301C6.45 16.0601 5.71 14.7801 3.9 14.7801C2.85 14.7801 2 13.9201 2 12.8801Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="transition-colors duration-200">Settings</p>
    </button>
  );
};

// Account Management Content Component
const AccountManagementContent = () => {
  return (
    <div className="w-full flex flex-col gap-2 font-roboto">
      <h2 className="text-white text-base font-medium">Delete your account</h2>

      <p className="text-secondary-text text-sm font-normal">
        This will permanently remove you from DevSpot. You will no longer be
        able to access your projects or hackathons.
      </p>

      <SettingsConfirmationModal />
    </div>
  );
};

// Display Settings Content Component
const DisplayContent = () => {
  return (
    <div className="w-full flex flex-col gap-4 font-roboto">
      <h2 className="text-white text-base font-medium">
        Display settings coming soon!
      </h2>
    </div>
  );
};

// Notifications Content Component
const NotificationsContent = () => {
  return (
    <div className="w-full flex flex-col gap-4 font-roboto">
      <h2 className="text-white text-base font-medium">
        Notification settings coming soon!
      </h2>
    </div>
  );
};

const SettingsModal = () => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  // Function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountManagementContent />;
      case "display":
        return <DisplayContent />;
      case "notifications":
        return <NotificationsContent />;
      default:
        return <AccountManagementContent />;
    }
  };

  return (
    <GenericModal
      hasMinHeight={false}
      hasSidebar={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <SettingsTrigger />
        </div>
      }
    >
      <div className="-p-5">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold font-roboto">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <div className="w-full flex flex-col md:flex-row gap-5">
            {/* Sidebar */}
            <div className="w-full md:w-[200px] flex flex-col gap-2 border-b-2 md:border-b-0 md:border-r-2 border-tertiary-bg pb-5 md:pb-0 md:pr-5">
              <button
                className={`w-full text-left px-2 py-2 md:py-1 rounded text-sm font-semibold transition-colors ${
                  activeTab === "account"
                    ? "bg-blackest-500 text-[#ffffff]"
                    : "text-secondary-text hover:bg-[#2b2b31]"
                }`}
                onClick={() => setActiveTab("account")}
              >
                Account management
              </button>
              <button
                className={`w-full text-left px-2 py-2 md:py-1 rounded text-sm font-semibold transition-colors ${
                  activeTab === "display"
                    ? "bg-blackest-500 text-[#ffffff]"
                    : "text-secondary-text hover:bg-[#2b2b31]"
                }`}
                onClick={() => setActiveTab("display")}
              >
                Display
              </button>
              <button
                className={`w-full text-left px-2 py-2 md:py-1 rounded text-sm font-semibold transition-colors ${
                  activeTab === "notifications"
                    ? "bg-blackest-500 text-[#ffffff]"
                    : "text-secondary-text hover:bg-[#2b2b31]"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                Notifications
              </button>
            </div>

            {/* Main content - dynamically rendered based on active tab */}
            <div className="w-full md:w-[calc(100%-200px)]">
              {renderContent()}
            </div>
          </div>
        </div>

        <div className="w-full flex sm:justify-end justify-center">
          <Button
            type="button"
            className="w-fit font-roboto text-sm gap-2"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default SettingsModal;
