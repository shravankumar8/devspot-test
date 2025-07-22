import * as Yup from "yup";

const isFileOrNonEmptyString = (value: any): boolean => {
  if (value instanceof File) return true;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
};

const PartnerSchema = Yup.object({
  id: Yup.number().optional().nullable(),
  partner_website: Yup.string()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .required("Website URL is required"),
  logo_url: Yup.mixed()
    .test(
      "is-file-or-string",
      "Logo must be a file or valid URL",
      isFileOrNonEmptyString
    )
    .required("Partner logo is required"),
});

export const communityPartnerValidationSchema = Yup.object({
  partners: Yup.array()
    .of(PartnerSchema)
    .min(1, "At least one partner is required"),
});
