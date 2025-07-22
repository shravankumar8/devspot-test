// components/modals/EditHackathonChallengeModal/components/form-sections/RoundToggleSection.tsx
import { Switch } from "@/components/ui/switch";
import { FormikProps } from "formik";
import { Info } from "lucide-react";
import { ChallengeFormPayload } from "../types";

interface RoundToggleSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
}

export const RoundToggleSection = ({ formik }: RoundToggleSectionProps) => (
  <>
    <div className="flex items-center space-x-3">
      <Switch
        checked={formik.values.challenge.is_round_2_only}
        onCheckedChange={(checked) =>
          formik.setFieldValue("challenge.is_round_2_only", checked)
        }
        className="data-[state=checked]:bg-blue-600"
      />
      <span className="text-sm text-secondary-text font-roboto">
        This challenge is for Round Two
      </span>
    </div>

    <div className="text-sm text-secondary-text font-roboto">
      <Info className="inline h-4 w-4 mr-2 text-main-primary" />
      By toggling this on, projects can only be assigned manually to this
      challenge by technology owners after Round One.
    </div>
  </>
);
