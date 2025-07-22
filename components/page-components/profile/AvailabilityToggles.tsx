import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";

interface AvailabilityTogglesProps {
  userProfile: UserProfile;
  isOwner: boolean;
  isFetching: boolean;
}

const AvailabilityToggles = (props: AvailabilityTogglesProps) => {
  const { userProfile, isOwner, isFetching } = props;

  // const { mutate, } = useSWRConfig();

  const { mutate } = useSWR("/api/profile");

  const [switchLoader, setSwitchLoader] = useState({
    work: false,
    project: false,
  });

  const toggleWork = async () => {
    setSwitchLoader({ ...switchLoader, work: true });
    try {
      await axios.put("/api/profile", {
        is_open_to_work: !userProfile?.profile.is_open_to_work,
      });
      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setSwitchLoader({ ...switchLoader, work: false });
      }, 1500);
    }
  };

  const toggleProject = async () => {
    setSwitchLoader({ ...switchLoader, project: true });
    try {
      await axios.put("/api/profile", {
        is_open_to_project: !userProfile?.profile?.is_open_to_project,
      });
      setSwitchLoader({ ...switchLoader, project: false });

      mutate();
    } catch (error) {
      setSwitchLoader({ ...switchLoader, project: false });

      console.log(error);
    } finally {
      setSwitchLoader({ ...switchLoader, project: false });
    }
  };

  const handleProfileSwitch = async (_: any, profile: "work" | "project") => {
    if (profile === "work") {
      await toggleWork();
    }

    if (profile === "project") {
      await toggleProject();
    }
  };

  if (!isOwner) return null;

  return (
    <Card className="w-full !border-none font-roboto gap-3 flex items-center toggle-availability">
      <div className="flex gap-3 bg-secondary-bg rounded-xl items-center font-roboto text-[15px] w-full px-3 py-3">
        <div className="w-9">
          {switchLoader.work ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4075FF] rounded-full animate-spin"></div>
          ) : (
            <Switch
              checked={userProfile?.profile?.is_open_to_work}
              onClick={(e) => handleProfileSwitch(e, "work")}
              disabled={isFetching}
            />
          )}
        </div>

        <p className="text-white text-xs font-medium">Open to work</p>
      </div>

      <div className="flex gap-3 items-center bg-secondary-bg rounded-xl font-roboto w-full text-[15px] px-3 py-3">
        <div className="w-9">
          {switchLoader.project ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4075FF] rounded-full animate-spin"></div>
          ) : (
            <Switch
              checked={userProfile?.profile?.is_open_to_project}
              onClick={(e) => handleProfileSwitch(e, "project")}
              disabled={isFetching}
            />
          )}
        </div>
        <p className="text-white text-xs font-medium">Open to projects</p>
      </div>
    </Card>
  );
};

export default AvailabilityToggles;
