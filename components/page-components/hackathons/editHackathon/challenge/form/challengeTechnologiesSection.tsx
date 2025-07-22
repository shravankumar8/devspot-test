import Label from "@/components/common/form/label";
import { MultiSelect } from "@/components/common/form/select/multi";
import { Technologies } from "@/types/entities";
import axios from "axios";
import { FormikProps } from "formik";
import useSWR from "swr";
import { ChallengeFormPayload } from "../types";

const fetchTechnologies = async (url: string) => {
  const resp = await axios.get(url);
  const data = resp?.data as Technologies[];
  return data.map((tech) => ({
    value: tech.slug,
    label: tech.name,
  }));
};

interface ChallengeTechnologiesSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
}

const ChallengeTechnologiesSection = ({
  formik,
}: ChallengeTechnologiesSectionProps) => {
  const { data: technologyTags, isLoading: isFetchingTechnologies } = useSWR(
    `/api/technology-tags`,
    fetchTechnologies
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">Technologies</Label>
      <MultiSelect
        showCheckboxes
        options={technologyTags ?? []}
        isLoading={isFetchingTechnologies}
        value={formik.values.challenge?.technologies}
        placeholder="Select any applicable technology"
        onChange={(value) => {
          formik.setFieldValue(
            "challenge.technologies",
            value.map((v) => String(v))
          );
        }}
      />

      {formik.touched.challenge?.technologies &&
        formik.errors.challenge?.technologies && (
          <div className="text-red-400 text-sm">
            {formik.errors.challenge?.technologies}
          </div>
        )}
    </div>
  );
};

export default ChallengeTechnologiesSection;
