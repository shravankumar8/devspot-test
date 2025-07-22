"use client";

import Modal from "@/components/common/Modal";
import {
  GithubIcon,
  StackOverflowIcon,
  UnconnectedIcon,
} from "@/components/icons/Location";
import TermsAndConditions from "@/components/page-components/auth/TermsAndCondition";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useSignupStore } from "@/state";
import { UserIdentity } from "@supabase/supabase-js";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const connectionData = [
  // {
  //   icon: <LinkedinIcon />,
  //   label: "Connect your LinkedIn",
  //   value: "linkedin_oidc",
  // },
  { icon: <GithubIcon />, label: "Connect your GitHub", value: "github" },
  {
    icon: <StackOverflowIcon />,
    label: "Connect your Stack Overflow",
    value: "stack_overflow",
  },
  {
    icon: <img src="/gitlab-logo.png" className="w-6 h-6" />,
    label: "Connect your GitLab",
    value: "gitlab",
  },
  // {
  //   icon: <img src="/spotify.png" className="w-5 h-5" />,
  //   label: "Connect your Spotify",
  //   value: "spotify",
  // },
  // {
  //   icon: <img src="/dribble.png" className="w-6 h-6" />,
  //   label: "Connect your Dribbble",
  //   value: "dribble",
  // },
];

export default function ConnectAccount() {
  const { setActiveStep } = useSignupStore();

  const {
    isOpen: isTermsAndConditionsModalOpen,
    openModal: openTermsAndConditionsModal,
    closeModal: closeTermsAndConditionsModal,
  } = UseModal("terms-and-conditions");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setActiveStep(5);
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    const provider = searchParams.get("provider");
    if (success && provider) {
      console.log("Profile updated successfully");
      setTimeout(() => {
        success == "true"
          ? toast.success(`${provider} account successfully connected`)
          : toast.error(`${provider} account failed to connect`);
        router.replace(`/sign-up/participants/connect-account`);
      }, 2000);
    }
  }, []);

  const fetchIdentities = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.identities as UserIdentity[];
  };

  const { data: identities = [], isLoading } = useSWR<UserIdentity[]>(
    "/api/auth/identities",
    fetchIdentities
  );

  const handleDevconnect = async (provider: string) => {
    if (
      provider == "github" ||
      provider == "gitlab" ||
      provider == "linkedin_oidc" ||
      provider == "spotify"
    ) {
      try {
        const response = await axios.post("/api/connect-dev", {
          provider,
          redirect: "signup",
        });
        window.location.href = response.data?.url;
      } catch (error) {
        console.error(error);
      }
    }
    if (provider == "stack_overflow") {
      window.location.href = `/api/auth/stackoverflow?state=signup`;
    }
  };

  return (
    <div className="sm:w-[500px] w-full mt-[100px] md:mt-[155px] gap-7 flex flex-col">
      <h4 className="sm:text-[32px] text-[28px] font-bold sm:leading-[32px] leading-[100%]">
        Connect your developer accounts
      </h4>

      <p className="text-secondary-text text-base font-medium font-roboto">
        We will populate your profile with the information on your accounts.You
        will be able to connect more accounts later.
      </p>

      <div className="flex flex-col gap-4 text-[15px] text-[#A1A1A3] font-roboto">
        {connectionData.map((connect, indx) => {
          const connected = identities.some(
            (iden) => iden.provider === connect.value
          );

          if (connected) return null;

          return (
            <Button
              key={indx}
              variant="ghost"
              onClick={() => handleDevconnect(connect.value)}
              className="w-full justify-between "
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                {connect.icon}
                {connect.label}
              </div>

              <div>
                {isLoading ? (
                  <Spinner size="small" />
                ) : (
                  <UnconnectedIcon width="30px" height="30px" />
                )}
              </div>
            </Button>
          );
        })}
      </div>

      <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="!text-base font-roboto"
          onClick={openTermsAndConditionsModal}
        >
          Continue
        </Button>
      </div>

      <Modal
        isOpen={isTermsAndConditionsModalOpen}
        onClose={closeTermsAndConditionsModal}
        sidebar={false}
      >
        <TermsAndConditions
          closeTermsAndConditionsModal={closeTermsAndConditionsModal}
        />
      </Modal>
    </div>
  );
}
