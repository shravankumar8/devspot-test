// components/modals/EditHackathonChallengeModal/components/ChallengeForm.tsx
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FormikHelpers, useFormik } from "formik";
import { ReactNode } from "react";
import { validationSchema } from "../schema";
import { ChallengeFormPayload, EditChallengePayload } from "../types";
import { DescriptionSection } from "./challengeDescriptionSection";
import { ChallengeExampleProjectsSection } from "./challengeExampleProjectsSection";
import { ChallengeJudgesSection } from "./challengeJudgesSection";
import { ChallengeJudgingCriteria } from "./challengeJudgingCriteria";
import { ChallengeNameSection } from "./challengeNameSection";
import { ChallengePrizeSection } from "./challengePrizeSection";
import { ChallengeRequiredTechnologiesSection } from "./challengeRequiredTechnologiesSection";
import { RoundToggleSection } from "./challengeRoundSectionToggle";
import ChallengeSponsorSection from "./challengeSponsorSection";
import ChallengeSubmissionRequirements from "./challengeSubmissionRequirements";
import ChallengeTechnologiesSection from "./challengeTechnologiesSection";

interface ChallengeFormProps {
  challenge: EditChallengePayload;
  onSubmit: (
    values: ChallengeFormPayload,
    formikHelpers: FormikHelpers<ChallengeFormPayload>
  ) => Promise<void>;
  footer?: ReactNode;
  hackathonId: number;
}

export const ChallengeForm = ({
  challenge,
  onSubmit,
  footer,
  hackathonId,
}: ChallengeFormProps) => {
  const formik = useFormik<ChallengeFormPayload>({
    initialValues: {
      challenge,
      judges: {
        judgingCriteria: [],
        judges: [],
        customJudgeEmail: "",
      },
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-7 mt-7">
      <RoundToggleSection formik={formik} />
      <ChallengeNameSection formik={formik} />
      <DescriptionSection formik={formik} />
      <ChallengeExampleProjectsSection formik={formik} />
      <ChallengeRequiredTechnologiesSection formik={formik} />
      <ChallengeTechnologiesSection formik={formik} />
      <ChallengeSubmissionRequirements formik={formik} />
      <ChallengeJudgingCriteria formik={formik} />
      <ChallengeSponsorSection formik={formik} />
      <ChallengeJudgesSection formik={formik} hackathonId={hackathonId} />
      <ChallengePrizeSection formik={formik} hackathonId={hackathonId} />

      {footer}

      <div className="flex justify-end">
        <Button
          type="submit"
          className=" gap-2"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting && <Spinner size="small" />} Save
        </Button>
      </div>
    </form>
  );
};

ChallengeForm.displayName = "ChallengeForm";
