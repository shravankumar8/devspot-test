import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonChallenges } from "@/types/entities";
import axios from "axios";
import { FormikHelpers } from "formik";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { ChallengeFormPayload, EditChallengePayload } from "./types";

interface Sponsor {
  logo: string | File;
  name: string;
  website: string;
  tier: string;
}

export const useChallengeManagement = (
  initialData: HackathonChallenges[],
  hackathonId: number
) => {
  const [challenges, setChallenges] = useState<EditChallengePayload[]>(
    initialData as unknown as EditChallengePayload[]
  );
  const [activeTab, setActiveTab] = useState(initialData?.[0]?.id || 1);
  const { selectedOrg } = useTechOwnerStore();

  const currentChallenge = useMemo(
    () => challenges.find((c) => c.id === activeTab),
    [challenges, activeTab]
  );

  const addNewChallenge = useCallback(() => {
    if (challenges.length === 0) {
      const newChallenge: EditChallengePayload = {
        challenge_name: "challenge-1",
        description: "",
        example_projects: [],
        required_tech: [],
        technologies: [],
        submission_requirements: [],
        is_round_2_only: false,
        hackathon_id: hackathonId,
        sponsors: [],
        prizes: [],
        label: "",
        id: 1,
      };
      setChallenges([newChallenge]);
      setActiveTab(1);
      return;
    }

    const sortedChallenges = [...challenges].sort(
      (a, b) => (a.id || 0) - (b.id || 0)
    );
    const lastChallenge = sortedChallenges[sortedChallenges.length - 1];
    const newChallengeId = lastChallenge?.id
      ? lastChallenge.id + 1
      : sortedChallenges.length + 1;
    const newChallenge: EditChallengePayload = {
      challenge_name: `challenge-${newChallengeId}`,
      description: "",
      example_projects: [],
      required_tech: [],
      technologies: [],
      submission_requirements: [],
      is_round_2_only: false,
      hackathon_id: hackathonId,
      sponsors: [],
      prizes: [],
      label: "",
      id: newChallengeId,
    };

    setChallenges((prev) => [...prev, newChallenge]);
    setActiveTab(newChallengeId);
  }, [challenges, hackathonId]);
  const handleSubmit = async (
    values: ChallengeFormPayload,
    { setSubmitting }: FormikHelpers<ChallengeFormPayload>
  ) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("judges", JSON.stringify(values.judges));

      const challengeData = { ...values.challenge };

      // Handle sponsor logos
      challengeData.sponsors = challengeData.sponsors?.map((item, index) => {
        const sponsor = item as unknown as Sponsor;
        if (sponsor?.logo instanceof File) {
          formData.append(`sponsors[${index}].logo`, sponsor?.logo);
          return {
            ...sponsor,
            logo: null,
          };
        }
        return sponsor as any;
      });

      // Handle prize logos
      challengeData.prizes = challengeData.prizes?.map((prize, index) => {
        if (prize.company_partner_logo instanceof File) {
          formData.append(
            `prizes[${index}].company_partner_logo`,
            prize.company_partner_logo
          );
          return {
            ...prize,
            company_partner_logo: null,
          };
        }
        return prize;
      });

      formData.append("challenge", JSON.stringify(challengeData));

      await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/challenges`,
        formData
      );

      mutate(`/api/hackathons/${hackathonId}/challenges`);

      toast.success(
        `Updated Challenge - ${challengeData.challenge_name} Successfully`,
        {
          position: "top-right",
        }
      );
    } catch (error: any) {
      console.error("Error updating header information:", error);
      toast.error(`Could not Update Header Information ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateChallenge = (
    challengeId: number,
    updates: EditChallengePayload
  ) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, ...updates } : challenge
      )
    );
  };

  return {
    challenges,
    activeTab,
    setActiveTab,
    currentChallenge,
    addNewChallenge,
    handleSubmit,
    updateChallenge,
    setChallenges,
  };
};
