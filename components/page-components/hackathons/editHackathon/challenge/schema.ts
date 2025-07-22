import * as yup from "yup";

// export const validationSchema = Yup.object({
//   challenge_name: Yup.string().required("Challenge name is required"),
//   description: Yup.string().required("Description is required"),
//   example_projects: Yup.array().min(1, "At least one project idea is required"),
//   required_tech: Yup.array().min(
//     1,
//     "At least one required technology is required"
//   ),
//   technologies: Yup.array().min(1, "At least one technology is required"),
//   submission_requirements: Yup.array().min(
//     1,
//     "At least one submission requirement is required"
//   ),
// });

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

export const validationSchema = yup.object({
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
        .min(1)
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

      customJudgeEmail: yup
        .string()
        .email("Must be a valid email")
        .optional(),
    })
    .required(),
});