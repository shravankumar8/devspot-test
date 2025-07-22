import * as Yup from "yup";

export const editAboutValidationSchema = Yup.object().shape({
  full_name: Yup.string()
    .max(100, "Full name must be at most 100 characters")
    .required("This field is required"),

  description: Yup.string()
    .max(500, "Description must be at most 500 characters")
    .required("This field is required"),

  location: Yup.string().max(100, "Location must be at most 100 characters"),

  portfolio_website: Yup.string()
    .matches(
      /^(https:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/,
      "Enter a valid URL"
    )
    .nullable(),
  linkedin_url: Yup.string()
    .matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[A-z0-9_-]+\/?$/,
      "Enter a valid LinkedIn URL"
    )
    .nullable(),
  x_url: Yup.string()
    .matches(
      /^(https?:\/\/)?(www\.)?x\.com\/[A-Za-z0-9_-]{1,15}(\/[^\s]*)?$/,
      "Enter a valid X (formerly Twitter) URL"
    )
    .nullable(),
  lensfrens_url: Yup.string().matches(
    /^(https:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/,
    "Enter a valid URL"
  ),
  warpcast_url: Yup.string()
    .matches(
      /^(https:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/,
      "Enter a valid URL"
    )
    .nullable(),

  main_role: Yup.number().required(
    "A main role is required, Double click the role you’d like displayed first on your profile."
  ),

  roles: Yup.array()
    .of(Yup.number())
    .min(1, "This field is required")
    .required("This field is required"),
});
