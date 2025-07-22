import * as Yup from "yup";

export const createNewHackathonValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.mixed<"virtual" | "physical">()
    .oneOf(["virtual", "physical"], "Invalid type")
    .required("Type is required"),
  applicationMethod: Yup.mixed<
    | "join"
    | "stake"
    | "apply"
    | "apply_additional"
    | "apply_stake"
    | "apply_additional_stake"
  >()
    .oneOf(
      [
        "join",
        "stake",
        "apply",
        "apply_additional",
        "apply_stake",
        "apply_additional_stake",
      ],
      "Invalid application method"
    )
    .required("Application method is required"),
});
