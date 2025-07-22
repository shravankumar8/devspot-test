import * as yup from "yup";

// Define the prize data interface
export interface PrizeData {
  id?: number;
  challenge_id: number;
  title: string;
  company_partner_logo: File; // Can be File for new uploads or string for existing
  rank: number;
  prize_usd?: number;
  prize_tokens?: number;
  prize_custom?: string;
}

function validatePrizeTypes(data: any): string | null {
  const { prize_usd, prize_tokens, prize_custom } = data;

  const prizeTypes = [
    prize_usd !== null && prize_usd !== undefined,
    prize_tokens !== null && prize_tokens !== undefined,
    prize_custom !== null && prize_custom !== undefined,
  ].filter(Boolean);

  if (prizeTypes.length === 0) {
    return "At least one prize type (prize_usd, prize_tokens, or prize_custom) must be provided";
  }

  // Allow multiple prize types - removed the restriction
  return null;
}

// Base schema for common fields
const baseSchema = yup.object().shape({
  id: yup.number().optional(),
  challenge_id: yup.number().required("Challenge ID is required"),
  title: yup.string().required("Title is required"),
  company_partner_logo: yup
    .mixed()
    .required("Company partner logo is required")
    .test(
      "file-or-string",
      "Company partner logo must be a valid file or string",
      (value) => {
        return (
          (typeof value === "string" && value.length > 0) ||
          value instanceof File
        );
      }
    ),
  rank: yup.number().optional(),
  prize_usd: yup.number().nullable().optional(),
  prize_tokens: yup.number().nullable().optional(),
  prize_custom: yup.string().nullable().optional(),
});

// Add custom validation for prize types
const createPrizeSchema = baseSchema.test(
  "prize-validation",
  "Prize type validation failed",
  function (value) {
    const error = validatePrizeTypes(value);
    if (error) {
      return this.createError({ message: error });
    }
    return true;
  }
);

// Simplified update schema
const updatePrizeSchema = yup
  .object()
  .shape({
    id: yup.number().required("ID is required for updates"),
    challenge_id: yup.number().optional(),
    title: yup.string().optional(),
    company_partner_logo: yup
      .mixed()
      .optional()
      .test(
        "file-or-string",
        "Company partner logo must be a valid file or string",
        (value) => {
          if (value === undefined) return true; // Optional for updates
          return (
            (typeof value === "string" && value.length > 0) ||
            value instanceof File
          );
        }
      ),
    rank: yup.number().optional(),
    prize_usd: yup.number().nullable().optional(),
    prize_tokens: yup.number().nullable().optional(),
    prize_custom: yup.string().nullable().optional(),
  })
  .test(
    "at-least-one-field",
    "At least one field other than id must be provided for updates",
    function (value) {
      const { id, ...otherFields } = value;
      const hasAtLeastOneField = Object.values(otherFields).some(
        (field) => field !== undefined
      );
      return hasAtLeastOneField;
    }
  )
  .test("prize-validation", "Prize type validation failed", function (value) {
    const { prize_usd, prize_tokens, prize_custom } = value;

    // Check if any prize field is being updated
    const hasPrizeFields = [
      prize_usd !== undefined,
      prize_tokens !== undefined,
      prize_custom !== undefined,
    ].some(Boolean);

    // If no prize fields are being updated, skip validation
    if (!hasPrizeFields) {
      return true;
    }

    // If prize fields are being updated, validate them
    const error = validatePrizeTypes(value);
    if (error) {
      return this.createError({ message: error });
    }
    return true;
  });

// Helper function to extract data from FormData
function extractFormData(formData: FormData): any {
  const data: any = {};

  // Extract file
  const file = formData.get("company_partner_logo");
  if (file && file instanceof File) {
    data.company_partner_logo = file;
  } else if (typeof file === "string" && file.length > 0) {
    data.company_partner_logo = file;
  }

  // Extract other fields
  const fields = [
    "id",
    "challenge_id",
    "title",
    "rank",
    "prize_usd",
    "prize_tokens",
    "prize_custom",
  ];

  fields.forEach((field) => {
    const value = formData.get(field);
    if (value !== null && value !== "") {
      // Convert numbers
      if (
        ["id", "challenge_id", "rank", "prize_usd", "prize_tokens"].includes(
          field
        )
      ) {
        data[field] = Number(value);
      } else {
        data[field] = value;
      }
    }
  });

  return data;
}

export async function validatePrizeData(input: FormData | any): Promise<{
  isValid: boolean;
  data?: PrizeData;
  errors?: string[];
}> {
  try {
    // Convert FormData to object if needed
    const body = input instanceof FormData ? extractFormData(input) : input;

    // Validate file if it's FormData
    if (input instanceof FormData) {
      const file = input.get("company_partner_logo");
      if (file && !(file instanceof File) && typeof file !== "string") {
        return {
          isValid: false,
          errors: ["Company partner logo must be a valid file"],
        };
      }
    }

    // Determine if this is an update (has id) or create (no id)
    const isUpdate = body.id !== undefined && body.id !== null;

    // Choose the appropriate schema
    const schema = isUpdate ? updatePrizeSchema : createPrizeSchema;

    // Validate the data
    const validatedData = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    return {
      isValid: true,
      data: validatedData as PrizeData,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        isValid: false,
        errors: error.errors,
      };
    }

    return {
      isValid: false,
      errors: ["Validation failed with unknown error"],
    };
  }
}
