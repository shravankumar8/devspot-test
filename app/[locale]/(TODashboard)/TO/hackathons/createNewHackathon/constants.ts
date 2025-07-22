import { SelectOption } from "@/components/page-components/hackathons/editHackathon/challenge/types";

export const HACKATHON_TYPE_OPTIONS: SelectOption[] = [
  { label: "Virtual", value: "virtual" },
  { label: "Physical", value: "physical" },
];

export const APPLICATION_METHOD_OPTIONS: SelectOption[] = [
  { label: "Join", value: "join" },
  { label: "Stake", value: "stake" },
  { label: "Apply", value: "apply" },
  { label: "Apply + Additional", value: "apply_additional" },
  { label: "Apply + Stake", value: "apply_stake" },
  { label: "Apply + Additional + Stake", value: "apply_additional_stake" },
];
