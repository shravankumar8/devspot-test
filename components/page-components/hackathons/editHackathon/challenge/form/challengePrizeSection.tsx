import Label from "@/components/common/form/label";
import AddPrizeModal from "@/components/page-components/TODashboard/prizes/challenges/AddPrizeModal";
import { HackathonChallengeBounties } from "@/types/entities";
import { FormikProps } from "formik";
import { PrizeCard } from "../prizeCard";
import { ChallengeFormPayload } from "../types";

interface ChallengePrizeSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
  hackathonId: number
}

export const ChallengePrizeSection = ({
  formik,
  hackathonId
}: ChallengePrizeSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm">Add prize cards for this challenge</Label>

      <div className="space-y-3">
        <div className="flex gap-4 flex-wrap items-center h-full">
          {formik.values.challenge?.prizes?.map((prize) => {
            const newPrize = prize as unknown as HackathonChallengeBounties;
            return (
              <PrizeCard
                key={prize.id}
                prize={newPrize}
                onEdit={() => console.log("Edit prize", prize.id)}
                hackathonId={hackathonId}
              />
            );
          })}

          <AddPrizeModal
            mode="Add"
            challengeId={formik.values?.challenge?.id!}
            hackathonId={hackathonId}
          />
        </div>
      </div>
    </div>
  );
};
