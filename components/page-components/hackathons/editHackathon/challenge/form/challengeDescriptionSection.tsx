import Label from "@/components/common/form/label";
import { TextArea } from "@/components/common/form/textarea";
import { FormikProps } from "formik";
import { ChallengeFormPayload } from "../types";

interface DescriptionSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
}

export const DescriptionSection = ({ formik }: DescriptionSectionProps) => (
  <div className="space-y-2">
    <Label className="text-sm text-secondary-text">
      Briefly describe your challenge
    </Label>

    <TextArea
      name="challenge.description"
      value={formik.values.challenge.description || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      rows={3}
      showMaxLength={false}
    />

    {formik.touched.challenge?.description &&
      formik.errors.challenge?.description && (
        <div className="text-red-400 text-sm">
          {String(formik.errors.challenge?.description)}
        </div>
      )}
  </div>
);
