import Label from "@/components/common/form/label";
import { MultiSelect } from "@/components/common/form/select/multi";
import Search from "@/components/icons/Search";
import { Input } from "@/components/ui/input";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import { FormikProps } from "formik";
import { useMemo } from "react";
import useSWR from "swr";
import { ChallengeFormPayload } from "../types";

interface ChallengeJudgesSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
  hackathonId: number;
}

interface JudgeDataType {
  id: string;
  name: string;
  avatar_url: string;
  judging_id: number;
  total_projects: number;
  progress: number;
}

export const ChallengeJudgesSection = ({
  formik,
  hackathonId,
}: ChallengeJudgesSectionProps) => {
  const { selectedOrg } = useTechOwnerStore();

  const fetchJudgingsData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data: judgesData, isLoading: isJudgesDataLoading } = useSWR<
    JudgeDataType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`,
    fetchJudgingsData
  );

  const judgeOptions = useMemo(() => {
    return judgesData?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [judgesData]);

  return (
    <div className="space-y-2 flex flex-col gap-2">
      <Label className="text-sm">Who is judging this challenge?</Label>

      <MultiSelect
        showCheckboxes
        options={judgeOptions ?? []}
        isLoading={isJudgesDataLoading}
        value={formik.values.judges.judges}
        placeholder="Search for and select your judges"
        prefixIcon={<Search />}
        onChange={(value) => {
          formik.setFieldValue(
            "judges.judges",
            value.map((v) => String(v))
          );
        }}
      />

      <Label className="text-sm">Can’t find your judge?</Label>

      <Input
        name="judges.customJudgeEmail"
        type="email"
        value={formik.values.judges.customJudgeEmail ?? ""}
        className="h-10"
        placeholder="Enter their email and we’ll send them an invite"
        onChange={formik.handleChange}
      />
    </div>
  );
};
