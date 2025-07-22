import {
  HackathonChallengeBounties,
  HackathonChallenges,
} from "@/types/entities";
import * as yup from "yup";

// TypeScript Interfaces
export interface Sponsor {
  logo: string | File;
  name: string;
  website: string;
  tier: string;
}

export interface EditHackathonChallengePrize
  extends Omit<Partial<HackathonChallengeBounties>, "company_partner_logo"> {
  company_partner_logo: string | File;
}

export interface Challenge
  extends Omit<Partial<HackathonChallenges>, "sponsors" | "prizes"> {
  sponsors: Sponsor[];
  prizes: EditHackathonChallengePrize[];
}

export interface Judges {
  judgingCriteria: string[];
  judges: string[];
  customJudgeEmail: string;
}

export interface ChallengeFormData {
  challenge: Challenge;
  judges: Judges;
}

// Custom validation functions
const isFileOrNonEmptyString = (value: any): boolean => {
  if (value instanceof File) return true;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
};

const isFileOrStringOrNull = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (value instanceof File) return true;
  if (typeof value === "string") return true;
  return false;
};

// Yup validation schema
export const challengeValidationSchema = yup.object({
  challenge: yup
    .object({
      challenge_name: yup
        .string()
        .transform((value) => value?.trim() || "")
        .required("Challenge name is required"),

      description: yup
        .string()
        .transform((value) => value?.trim() || "")
        .required("Description is required"),

      technologies: yup.array().of(yup.string().required()).default([]),

      sponsors: yup
        .array()
        .of(
          yup.object({
            logo: yup
              .mixed()
              .test(
                "is-file-or-string",
                "Logo must be a file or valid URL",
                isFileOrNonEmptyString
              )
              .required("Sponsor logo is required"),

            name: yup
              .string()
              .transform((value) => value?.trim() || "")
              .required("Sponsor name is required"),

            website: yup
              .string()
              .transform((value) => value?.trim() || "")
              .url("Must be a valid URL")
              .required("Sponsor website is required"),

            tier: yup
              .string()
              .transform((value) => value?.trim() || "")
              .required("Sponsor tier is required"),
          })
        )
        .default([]),

      example_projects: yup.array().of(yup.string().required()).default([]),

      required_tech: yup.array().of(yup.string().required()).default([]),

      submission_requirements: yup
        .array()
        .of(yup.string().required())
        .default([]),

      is_round_2_only: yup.boolean().default(false),

      label: yup.string().transform((value) => value?.trim() || ""),

      prizes: yup
        .array()
        .of(
          yup.object({
            id: yup.number().optional(),

            rank: yup
              .number()
              .positive("Rank must be a positive number")
              .integer("Rank must be an integer")
              .required("Prize rank is required"),

            title: yup.string().transform((value) => value?.trim() || ""),

            prize_usd: yup
              .number()
              .nullable()
              .positive("Prize USD must be positive")
              .optional(),

            challenge_id: yup.number().optional(),

            prize_custom: yup
              .string()
              .nullable()
              .transform((value) => value?.trim() || null),

            prize_tokens: yup
              .string()
              .nullable()
              .transform((value) => value?.trim() || null),

            company_partner_logo: yup
              .mixed()
              .test(
                "is-file-or-string-or-null",
                "Company partner logo must be a file or valid URL",
                isFileOrStringOrNull
              ),

            created_at: yup.string().optional(),
            updated_at: yup.string().optional(),
          })
        )
        .default([]),
    })
    .required(),

  judges: yup
    .object({
      judgingCriteria: yup.array().of(yup.string().required()).default([]),
      judges: yup.array().of(yup.string().required()).default([]),
      customJudgeEmail: yup.string().email("Must be a valid email").optional(),
    })
    .required(),
});

// Example usage function
export const validateChallengeForm = async (
  formData: ChallengeFormData
): Promise<boolean> => {
  try {
    await challengeValidationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("Validation errors:", error.errors);
      // Handle validation errors
      error.inner.forEach((err) => {
        console.error(`${err.path}: ${err.message}`);
      });
    }
    return false;
  }
};

// Helper function to prepare FormData for validation
export const prepareFormDataForValidation = (
  formData: FormData
): ChallengeFormData => {
  // This is a helper to convert FormData back to the expected structure
  // You'll need to implement this based on how you structure your FormData
  // This is just an example structure

  const challengeData = JSON.parse(
    (formData.get("challenge") as string) || "{}"
  );
  const judgesData = JSON.parse((formData.get("judges") as string) || "{}");

  // Handle file uploads for sponsors
  challengeData.sponsors = challengeData.sponsors?.map(
    (sponsor: any, index: number) => ({
      ...sponsor,
      logo: formData.get(`sponsors[${index}].logo`) || sponsor.logo,
    })
  );

  // Handle file uploads for prizes
  challengeData.prizes = challengeData.prizes?.map(
    (prize: any, index: number) => ({
      ...prize,
      company_partner_logo:
        formData.get(`prizes[${index}].company_partner_logo`) ||
        prize.company_partner_logo,
    })
  );

  return {
    challenge: challengeData,
    judges: judgesData,
  };
};
