import Label from "@/components/common/form/label";
import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";
import { ChallengeFormPayload } from "../types";

interface ChallengeNameSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
}

export const ChallengeNameSection = ({ formik }: ChallengeNameSectionProps) => (
  <>
    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">
        Challenge "label" name (what you want users to see in the tab menu
        above)
      </Label>

      <Input
        name="challenge.label"
        value={formik.values.challenge.label ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {formik.errors.challenge &&
        formik.touched?.challenge?.label &&
        formik.errors.challenge.label && (
          <div className="text-red-400 text-sm">
            {String(formik.errors.challenge.label)}
          </div>
        )}
    </div>

    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">Challenge name</Label>
      <Input
        name="challenge.challenge_name"
        value={formik.values.challenge?.challenge_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.challenge?.challenge_name &&
        formik.errors.challenge?.challenge_name && (
          <div className="text-red-400 text-sm">
            {String(formik.errors.challenge?.challenge_name)}
          </div>
        )}
    </div>
  </>
);
