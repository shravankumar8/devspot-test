import Label from "@/components/common/form/label";
import { MultiSelect } from "@/components/common/form/select/multi";
import { FormikProps } from "formik";
import { AVAILABLE_SUBMISSION_REQUIREMENTS } from "../constants";
import { ChallengeFormPayload } from "../types";

interface ChallengeSubmissionRequirementsProps {
  formik: FormikProps<ChallengeFormPayload>;
}

const ChallengeSubmissionRequirements = ({
  formik,
}: ChallengeSubmissionRequirementsProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">
        Submission requirements
      </Label>
      <MultiSelect
        showCheckboxes
        options={AVAILABLE_SUBMISSION_REQUIREMENTS}
        value={formik.values.challenge?.submission_requirements ?? []}
        placeholder="Select any applicable technology"
        onChange={(value) => {
          formik.setFieldValue(
            "challenge.submission_requirements",
            value.map((v) => String(v))
          );
        }}
      />

      {formik.touched.challenge?.submission_requirements &&
        formik.errors.challenge?.submission_requirements && (
          <div className="text-red-400 text-sm">
            {formik.errors.challenge?.submission_requirements}
          </div>
        )}
    </div>
  );
};

export default ChallengeSubmissionRequirements;
