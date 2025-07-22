import Label from "@/components/common/form/label";
import { TextArea } from "@/components/common/form/textarea";
import { FormikProps } from "formik";
import { ChallengeFormPayload } from "../types";
import { useState, useEffect } from "react";

interface Props {
  formik: FormikProps<ChallengeFormPayload>;
}

export const ChallengeRequiredTechnologiesSection = ({
  formik,
}: Props) => {
  const [raw, setRaw] = useState(
    formik.values.challenge?.required_tech?.join(", ") || ""
  );

  useEffect(() => {
    setRaw(formik.values.challenge?.required_tech?.join(", ") || "");
  }, [formik.values.challenge?.required_tech]);



  return (
    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">
        Provide a list of all required technologies each separated by a comma
      </Label>
      <TextArea
        name="challenge.required_tech"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => {
          const arr = raw
            .split(/,\s*/) 
            .filter(Boolean); 
          formik.setFieldValue("challenge.example_projects", arr);
        }}
        rows={2}
        className="bg-gray-800 border-gray-600 text-white resize-none"
        placeholder="Enter required technologies separated by commas"
        showMaxLength={false}
      />
      {formik.touched.challenge?.required_tech &&
        formik.errors.challenge?.required_tech && (
          <div className="text-red-400 text-sm">
            {formik.errors.challenge?.required_tech}
          </div>
        )}
    </div>
  );
}
