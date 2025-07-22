import * as yup from "yup";

// Define the roles
export type VIPRole = "mentor" | "judge";

export const vipSchema = yup.object({
  id: yup.string().when("email", {
    is: (val: any) => !val,
    then: (schema) =>
      schema.required("ID is required when email is not provided"),
    otherwise: (schema) => schema,
  }),

  email: yup
    .string()
    .email("Must be a valid email")
    .when("id", {
      is: (val: any) => !val,
      then: (schema) =>
        schema.required("Email is required when ID is not provided"),
      otherwise: (schema) => schema,
    }),

  roles: yup
    .array()
    .of(
      yup
        .mixed<VIPRole>()
        .oneOf(["mentor", "judge"], "Each role must be either mentor or judge")
    )
    .min(1, "At least one role is required")
    .required("Roles are required"),

  is_featured: yup.boolean().optional().default(false),

  office_hours: yup.string().when("role", {
    is: "mentor",
    then: (schema) => schema.required("Office hours are required for mentors"),
    otherwise: (schema) => schema.strip(),
  }),

  challengeIds: yup
    .array()
    .of(yup.string().required("Each challenge ID must be a non-empty string"))
    .when("role", {
      is: "judge",
      then: (schema) =>
        schema
          .min(1, "At least one challenge ID is required for judges")
          .required(),
      otherwise: (schema) => schema.strip(),
    }),
});

export const vipArraySchema = yup
  .array()
  .of(vipSchema)
  .min(1, "At least one entry is required")
  .required();

export type VipPerson = yup.InferType<typeof vipSchema>;
export type VipList = yup.InferType<typeof vipSchema>;
