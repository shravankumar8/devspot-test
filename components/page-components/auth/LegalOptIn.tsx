"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { consentItems } from "@/mocked_data/data-helpers/hackathons/legal-data";
import { Checkbox } from "../../common/Checkbox";
import { ActionTypes } from "@/app/[locale]/(dashboard)/hackathons/[hackathon]/page";
import { useUserStore } from "@/state";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

export default function ConsentPage({
  actionType,
  closeLegalOptInModal,
  closeApplicationProfileModal,
  hackathonId,
}: Readonly<{
  actionType: ActionTypes;
  closeLegalOptInModal?: () => void;
  closeApplicationProfileModal?: () => void;
  hackathonId?: string;
}>) {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const { setCurrentStage, updateUserHackathon } = useUserStore();

  const handleConsentChange = (id: string) => {
    console.log(id);
    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const joinHackathon = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/hackathons/${hackathonId}/join`, {
        joinType: "join",
      });
      setCurrentStage("joined");
      hackathonId &&
        updateUserHackathon(hackathonId, {
          applicationProgress: 2,
          status: "completed",
        });
      setLoading(false);

      closeLegalOptInModal && closeLegalOptInModal();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const applyHackathon = async (actionType: ActionTypes) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/hackathons/${hackathonId}/join`, {
        joinType: actionType,
      });
      console.log(res);
      setCurrentStage("pending");
      hackathonId &&
        updateUserHackathon(hackathonId, {
          applicationProgress: 2,
          status: "pending",
        });
      setLoading(false);
      closeApplicationProfileModal && closeApplicationProfileModal();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleProgression = () => {
    if (allRequiredConsentsChecked) {
      switch (actionType) {
        case "join":
          console.log("User is joining with consent.");
          joinHackathon();

          break;
        case "stake":
          console.log("User is staking with consent.");
          break;
        case "apply":
          applyHackathon("apply");

          break;
        case "apply_additional":
          console.log("User is applying additionally with consent.");
          break;
        case "apply_stake":
          applyHackathon("apply_stake");
          console.log("User is applying to stake with consent.");
          break;
        case "apply_additional_stake":
          console.log("User is applying for additional staking with consent.");
          break;
        default:
          console.log("Unknown action.");
      }
    } else {
      console.log("All required consents not checked.");
    }
  };

  const allRequiredConsentsChecked = consentItems
    .filter((item) => item.required)
    .every((item) => consents[item.id]);

  return (
    <div className="text-white px-4 pt-4 h-[550px] overflow-y-scroll w-full font-roboto">
      <div className="max-w-3xl mx-auto ">
        <div className="space-y-3">
          {consentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-tertiary-bg text-gray-300"
            >
              <div className="space-y-2">
                <h3 className="text-[16px] font-roboto font-medium text-white">
                  {item?.title}
                </h3>
                {item?.linkUrl ? (
                  <p className="text-sm text-secondary-text">
                    {item?.description}{" "}
                    <Link
                      href={item?.linkUrl}
                      className="text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.linkText}
                    </Link>{" "}
                    {item?.afterLinkText}
                  </p>
                ) : (
                  <p className="text-sm text-secondary-text">
                    {item?.description}
                  </p>
                )}
              </div>
              <div>
                <Checkbox
                  checked={!!consents[item.id]}
                  onCheckedChange={() => handleConsentChange(item.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-6 w-full justify-end flex bg-[#1B1B22] sticky bottom-0 right-6 pb-6">
        <Button
          disabled={!allRequiredConsentsChecked || loading}
          onClick={handleProgression}
          className="flex items-center gap-1"
        >
          {loading && <Spinner size="small" />}
          Continue
        </Button>
      </div>
    </div>
  );
}
