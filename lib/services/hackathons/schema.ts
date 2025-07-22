import * as Yup from "yup";

export const query_validators = Yup.object().shape({
  page: Yup.number()
    .optional()
    .positive("Page number must be greater than 0")
    .integer("Page number must be an integer")
    .default(1),

  page_size: Yup.number()
    .optional()
    .positive("Page size must be greater than 0")
    .integer("Page size must be an integer")
    .max(500, "Page size must not exceed 100")
    .default(30),

  sort_by: Yup.string().optional().default("created_at"),
  search_term: Yup.string().optional(),

  order: Yup.string()
    .optional()
    .oneOf(["asc", "desc"], 'Order must be either "asc" or "desc"')
    .default("desc"),

  filter: Yup.object().optional(),
});

export const createHackathonValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  subdomain: Yup.string().required("Sub Domain is required"),
  organizerId: Yup.number().required("Organizer id is required"),
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

const answerSchema = Yup.object({
  questionId: Yup.number().required("questionId is required"),
  answer: Yup.string().required("answer is required"),
});

export const bodySchema = Yup.array()
  .of(answerSchema)
  .required("Body is required");

const challengeSchema = Yup.object().shape({
  challenge_id: Yup.number().required(),
  overall_rating: Yup.number().required().min(1).max(5),
  docs_rating: Yup.number().required().min(1).max(5),
  challenge_recommendation_rating: Yup.number().required().min(1).max(5),
  support_rating: Yup.number().required().min(1).max(5),
  comments: Yup.string().nullable(),
});

const hackathonSchema = Yup.object().shape({
  question1_rating: Yup.number().required().min(1).max(5),
  question2_rating: Yup.number().required().min(1).max(5),
  question3_rating: Yup.number().required().min(1).max(5),
  question4_rating: Yup.number().required().min(1).max(5),
  comments: Yup.string().nullable(),
});

export const submitUserHackathonFeedbackSchema = Yup.object().shape({
  challengeFeedbacks: Yup.array().of(challengeSchema).required(),
  hackathonFeedback: hackathonSchema,
});
