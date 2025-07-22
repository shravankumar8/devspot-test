import { Checkbox } from "@/components/common/Checkbox";
import Label from "@/components/common/form/label";
import { Switch } from "@/components/ui/switch";
import { FormikProps } from "formik";
import { Info } from "lucide-react";
import { useMemo } from "react";
import { JUDGING_CRITERIA } from "../constants";
import { ChallengeFormPayload } from "../types";

interface ChallengeJudgingCriteriaProps {
  formik: FormikProps<ChallengeFormPayload>;
}

export const ChallengeJudgingCriteria = ({
  formik,
}: ChallengeJudgingCriteriaProps) => {
  const selectedCriteria = useMemo(() => {
    return formik.values.judges.judgingCriteria;
  }, [formik.values.judges.judgingCriteria]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-secondary-text">
          Judging criteria. You can select a maximum of four. All criteria is
          graded on a scale of 1 to 10.
        </Label>
      </div>

      <div className="flex items-center space-x-3">
        <Switch />
        <span className="text-sm text-secondary-text font-roboto">
          Apply this judging criteria to all challenges
        </span>
      </div>

      <div className="grid grid-cols-3 gap-10 gap-y-7">
        {JUDGING_CRITERIA.map((criteria) => (
          <div
            key={criteria.key}
            className="flex items-center justify-between space-x-2"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCriteria.includes(criteria.key)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    if (selectedCriteria.length < 4) {
                      formik.setFieldValue("judges.judgingCriteria", [
                        ...selectedCriteria,
                        criteria.key,
                      ]);
                    }
                  } else {
                    formik.setFieldValue(
                      "judges.judgingCriteria",
                      selectedCriteria.filter((c) => c !== criteria.key)
                    );
                  }
                }}
                disabled={
                  !selectedCriteria.includes(criteria.key) &&
                  selectedCriteria.length >= 4
                }
                className=" border-gray-600"
              />

              <Label className="text-sm text-white">{criteria.label}</Label>
            </div>

            <Info className="text-main-primary w-5 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
};
