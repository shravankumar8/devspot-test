import { useState, useEffect } from "react";
import Label from "@/components/common/form/label";
import { TextArea } from "@/components/common/form/textarea";
import { FormikProps } from "formik";
import { ChallengeFormPayload } from "../types";

interface Props {
  formik: FormikProps<ChallengeFormPayload>;
}

export const ChallengeExampleProjectsSection = ({ formik }: Props) => {
  const [raw, setRaw] = useState(
    formik.values.challenge?.example_projects?.join(", ") || ""
  );

  useEffect(() => {
    setRaw(formik.values.challenge?.example_projects?.join(", ") || "");
  }, [formik.values.challenge?.example_projects]);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">
        Provide a list of example project ideas each separated by a comma
      </Label>

      <TextArea
        name="challenge.example_projects"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => {
          const arr = raw
            .split(/,\s*/) 
            .filter(Boolean); 
          formik.setFieldValue("challenge.example_projects", arr);
        }}
        rows={4}
        className="bg-gray-800 border-gray-600 text-white resize-none"
        placeholder="Enter project ideas separated by commas"
        showMaxLength={false}
      />

      {formik.touched.challenge?.example_projects &&
        formik.errors.challenge?.example_projects && (
          <div className="text-red-400 text-sm">
            {formik.errors.challenge?.example_projects}
          </div>
        )}
    </div>
  );
};
