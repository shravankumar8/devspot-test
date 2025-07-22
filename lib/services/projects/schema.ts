import * as yup from "yup";

export const project_validation_schema = yup.object({
  name: yup
    .string()
    .default("Untitled project")
    .required("Project name is required"),
  projectUrl: yup.string().url("Must be a valid URL").nullable(),
  hackathonId: yup.number().required("Hackathon ID is required"),
  projectCodeType: yup
    .string()
    .oneOf(
      ["fresh_code", "existing_code"],
      "Project code type must be either 'fresh_code' or 'existing_code'"
    )
    .required("Project code type is required"),
  challengeIds: yup
    .array()
    .of(yup.number().required())
    .min(1, "At least one challenge ID is required")
    .required(),
  logo_url: yup.string().required("Default logo required"),
});

export const ai_project_validation_schema = yup.object({
  name: yup.string().nullable(),
  projectUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Project url is required"),
  hackathonId: yup.number().required("Hackathon ID is required"),
});

export const project_request_validation = yup.object({
  participant_id: yup.string().required("A Participant ID is required"),
});

export const update_project_allocation_validation_schema = yup
  .array()
  .of(
    yup.object({
      user_id: yup.string().required("User ID is required"),
      prize_allocation: yup
        .number()
        .required("Prize allocation is required")
        .min(0, "Prize allocation must be at least 0"),
    })
  )
  .required("Items are required")
  .min(1, "At least one item is required");

export const teamMemberFormSchema = yup.array().of(
  yup.object({
    user_id: yup.string().required("User ID is required"),
    is_project_manager: yup.boolean().required(),
    is_new: yup.boolean().required(),
    is_deleted: yup.boolean().required(),
  })
);
