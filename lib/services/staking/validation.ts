import * as yup from "yup";

export const StakeRequestSchema = yup.object({
  walletAddress: yup
    .string()
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

export const StakeAmountSchema = yup
  .number()
  .min(1, "Stake amount must be at least $1")
  .max(1000, "Stake amount cannot exceed $1000");
