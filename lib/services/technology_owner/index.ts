import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import * as yup from "yup";
import { query_validators } from "../hackathons/schema";
import { build_response } from "../utils/buildResponse";
import { uploadImage } from "../utils/uploadImage";
import { uploadVideo } from "../utils/uploadVideo";
import { challengeValidationSchema } from "./edit_hackathon_challenge.schema";
import { communityPartnerValidationSchema } from "./edit_hackathon_community_partner.schema";
import AnalyticsService, { Granularity } from "./services/analytics.service";
import EditHackathonService from "./services/edit_hackathon.service";
import EditHackathonScheduleService from "./services/editHackathonSchedule";
import GoogleCalendarScheduleGenerator from "./services/editHackathonSchedule/google.service";
import TechnologyOwnerService from "./services/technology_owner.service";

export const get_all_technology_owners = async () => {
  try {
    const supabase = await createClient();

    const technology_owner_service = new TechnologyOwnerService(supabase);

    const data = await technology_owner_service.get_all_technology_owners();

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Technology Owners");
  }
};

export const get_all_technology_owner_hackathons = async (
  technology_owner_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const service = new TechnologyOwnerService(supabase);

    const validated_body = await query_validators.validate(body);

    const data = await service.get_all_hackathons(
      technology_owner_id,
      validated_body
    );

    const response = build_response("Hackathons Retrieved Successfully", data);

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get All Hackathons");
  }
};

export const assign_challenges_to_projects = async (
  hackathon_id: number,
  project_ids: number[],
  challenge_ids: number[]
) => {
  try {
    const supabase = await createClient();
    const technology_owner_service = new TechnologyOwnerService(supabase);

    const data = await technology_owner_service.assignChallengesToProjects(
      hackathon_id,
      project_ids,
      challenge_ids
    );

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to assign challenges to projects"
    );
  }
};

export const get_hackathon_registrations = async (
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();
    const analytics_service = new AnalyticsService(supabase);
    const { error } = await getAuthenticatedUser();
    if (error) return error;

    const validatedOptions = await query_validators.validate(body);

    const data = await analytics_service.get_hackathon_participants_TO(
      hackathon_id,
      validatedOptions
    );

    const response = build_response(
      "Hackathon Participants Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to get hackathon participants"
    );
  }
};

export const get_hackathon_feedback_overview = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();
    const technology_owner_service = new TechnologyOwnerService(supabase);

    const data = await technology_owner_service.get_hackathon_feedback_overview(
      hackathon_id
    );

    const response = build_response(
      "Hackathon Feedback Retrieved Successfully",
      data
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get hackathon feedback");
  }
};

export const get_hackathon_feedback_csv = async (hackathon_id: number) => {
  const supabase = await createClient();

  const { data: hackathon, error } = await supabase
    .from("hackathons")
    .select("name")
    .eq("id", hackathon_id)
    .single();

  if (!hackathon || error)
    return {
      name: `Invalid Hackathon Report`,
      content: "",
    };

  try {
    const technology_owner_service = new TechnologyOwnerService(supabase);

    const data = await technology_owner_service.generate_feedback_csv(
      hackathon_id
    );

    return {
      name: `2025_${hackathon?.name}_Feedback_Report`,
      content: data,
    };
  } catch (error: any) {
    console.log(
      errorResponse(error?.message ?? "Failed to get hackathon feedback")
    );

    return {
      name: `2025_${hackathon?.name}_Feedback_Report`,
      content: "",
    };
  }
};

export const toggle_project_hidden = async (
  technology_owner_id: number,
  body: {
    project_id: number;
    challenge_id: number;
    hidden: boolean;
  }
) => {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const technology_owner_service = new TechnologyOwnerService(supabase);
    const result = await technology_owner_service.toggleProjectHidden(
      technology_owner_id,
      body
    );

    const response = build_response(
      "Project hidden status updated successfully",
      result
    );

    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to toggle project hidden status"
    );
  }
};

export const get_hackathon_analytics_overview = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const faqs = await analyticsService.get_hackathon_analytics_overview(
      hackathon_id
    );

    const response = build_response(
      "Analytics overview retrieved successfully",
      faqs
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve Analytics Overview"
    );
  }
};

export const get_hackathon_attrition_analytics = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const faqs = await analyticsService.get_hackathon_attrition_analytics(
      hackathon_id
    );

    const response = build_response(
      "Attrition analytics retrieved successfully",
      faqs
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve Attrition analytics"
    );
  }
};

export const get_hackathon_faq_analytics = async (hackathon_id: number) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const faqs = await analyticsService.get_hackathon_faq_analytics(
      hackathon_id
    );

    const response = build_response(
      "FAQ analytics retrieved successfully",
      faqs
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to retrieve FAQ analytics");
  }
};

export const get_hackathon_resources_analytics = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const resources = await analyticsService.get_hackathon_resources_analytics(
      hackathon_id
    );

    const response = build_response(
      "Resource analytics retrieved successfully",
      resources
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve resource analytics"
    );
  }
};

export const get_hackathon_sessions_analytics = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const sessions = await analyticsService.get_hackathon_sessions_analytics(
      hackathon_id
    );

    const response = build_response(
      "Session analytics retrieved successfully",
      sessions
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve session analytics"
    );
  }
};

export const get_hackathon_common_skills_analytics = async (
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const skills = await analyticsService.get_hackathon_common_skills_analytics(
      hackathon_id
    );

    const response = build_response(
      "Common skills analytics retrieved successfully",
      skills
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve common skills analytics"
    );
  }
};

export const get_hackathon_registration_analytics = async (
  hackathon_id: number,
  granularity: Granularity
) => {
  try {
    const supabase = await createClient();
    // const { error: authError } = await getAuthenticatedUser();
    // if (authError) return authError;
    const analyticsService = new AnalyticsService(supabase);

    const data = await analyticsService.get_hackathon_registration_analytics(
      hackathon_id,
      granularity
    );

    const response = build_response(
      "Registration analytics retrieved successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(
      error?.message ?? "Failed to retrieve registration analytics"
    );
  }
};

// Edit Hackathon
const updateHackathonSchema = yup.object().shape({
  name: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "Name too long")
    .default(undefined),
  hackathon_header: yup
    .mixed<File | string>()
    .nullable()
    .notRequired()
    .default(undefined),
  hackathon_logo: yup
    .mixed<File | string>()
    .nullable()
    .notRequired()
    .default(undefined),
  technologies: yup
    .array()
    .of(yup.string())
    .max(4, "Maximum 4 technologies allowed"),
});

export const edit_hackathon_header = async (
  technology_owner_id: number,
  hackathon_id: number,
  body: FormData
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }
    const validationData = {
      hackathon_header: body.get("hackathon_header") ?? undefined,
      hackathon_logo: body.get("hackathon_logo") ?? undefined,
      name: body.get("name"),
      technologies: body.get("technologies")?.toString().split(",") || [],
    };
    const res = await updateHackathonSchema.validate(validationData, {
      abortEarly: false,
    });
    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_project_header(
      hackathon_id,
      {
        name: res.name,
        technologies: res.technologies as string[],
        hackathonHeader: res.hackathon_header,
        hackathonLogo: res.hackathon_logo,
      }
    );

    const response = build_response(
      "Hackathon Header updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(error?.message ?? "Failed to update hackathon header");
  }
};

export const edit_hackathon_description = async (
  technology_owner_id: number,
  hackathon_id: number,
  description: string
) => {
  try {
    const supabase = await createClient();
    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_project_description(
      hackathon_id,
      description
    );

    const response = build_response(
      "Hackathon Description updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to update hackathon description"
    );
  }
};

const updateHackathonDetailsSchema = yup
  .object()
  .shape({
    type: yup.mixed<"virtual" | "physical">().oneOf(["virtual", "physical"]),
    hackathon_start_date_time: yup.string(),
    hackathon_end_date_time: yup.string(),
    registration_start_date_time: yup.string(),
    registration_end_date_time: yup.string(),
    project_submission_start_date_time: yup.string(),
    project_submission_end_date_time: yup.string(),
    show_registration_deadline_countdown: yup.boolean(),
    show_submission_deadline_countdown: yup.boolean(),
    rules: yup.string().url("Must be a valid URL").nullable().notRequired(),
    communication_link: yup
      .string()
      .url("Must be a valid URL")
      .nullable()
      .notRequired(),
    winners_announcement_date: yup.string().nullable().notRequired(),
  })
  .test(
    "at-least-one-field",
    "At least one field must be provided",
    (value) => value && Object.values(value).some((v) => v !== undefined)
  );

export const edit_hackathon_details = async (
  technology_owner_id: number,
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const validatedBody = await updateHackathonDetailsSchema.validate(body, {
      abortEarly: false,
    });

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_project_details(
      hackathon_id,
      validatedBody
    );
    const response = build_response(
      "Hackathon Details updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to update hackathon details"
    );
  }
};

const hackathonResourceSchema = yup.array().of(
  yup
    .object({
      id: yup.number().optional(),
      title: yup.string().optional().nullable().default(""),
      type: yup.string().optional(),
      challengeIds: yup.array().optional().nullable().default([]),
      technologies: yup.array().optional().nullable().default([]),
      url: yup.string().url().optional().nullable().default(""),
      is_downloadable: yup.boolean().optional().nullable().default(false),
    })
    .test(
      "at-least-one",
      "At least one of title, type, challengeIds, technologies, url, or is_downloadable must be provided",
      (value) => {
        if (!value) return false;
        const {
          title,
          type,
          challengeIds,
          technologies,
          url,
          is_downloadable,
        } = value;
        return (
          title !== undefined ||
          type !== undefined ||
          (challengeIds && challengeIds.length > 0) ||
          (technologies && technologies.length > 0) ||
          url !== undefined ||
          is_downloadable !== undefined
        );
      }
    )
);
export const edit_hackathon_resource = async (
  technology_owner_id: number,
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const validatedBody = await hackathonResourceSchema.validate(body, {
      abortEarly: false,
    });

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_hackathon_resources(
      hackathon_id,
      validatedBody ?? []
    );
    const response = build_response(
      "Hackathon Resource updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to update hackathon resource"
    );
  }
};

const faqSchema = yup.object().shape({
  id: yup.number().required("FAQ ID is required"),
  question: yup
    .string()
    .required("Question is required")
    .max(500, "Question cannot exceed 500 characters"),
  answer: yup
    .string()
    .required("Answer is required")
    .max(2000, "Answer cannot exceed 2000 characters"),
});

const faqArraySchema = yup
  .array()
  .of(faqSchema)
  .min(1, "At least one FAQ is required");

export const edit_hackathon_faqs = async (
  technology_owner_id: number,
  hackathon_id: number,
  body: yup.InferType<typeof faqSchema>[]
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const validatedBody = await faqArraySchema.validate(body, {
      abortEarly: false,
    });

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_hackathon_faqs(
      hackathon_id,
      validatedBody ?? []
    );
    const response = build_response(
      "Hackathon FAQs updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(error?.message ?? "Failed to update hackathon faqs");
  }
};

export const edit_hackathon_vips = async (
  technology_owner_id: number,
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_hackathon_vips(
      hackathon_id,
      body
    );
    const response = build_response(
      "Hackathon VIPs updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(error?.message ?? "Failed to update hackathon vips");
  }
};

export const edit_hackathon_challenges = async (
  technology_owner_id: number,
  hackathon_id: number,
  formData: FormData
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

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

    const payload = {
      challenge: challengeData,
      judges: judgesData,
    };

    await challengeValidationSchema.validate(payload, {
      abortEarly: false,
    });

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_hackathon_challenges(
      hackathon_id,
      payload
    );

    const response = build_response(
      "Hackathon Challenges updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to update hackathon Challenges"
    );
  }
};

export const edit_hackathon_community_partners = async (
  technology_owner_id: number,
  hackathon_id: number,
  formData: FormData
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const partnersData = [];
    const partnerKeys: number[] = [];

    for (const [key] of formData.entries()) {
      const match = key.match(/^partners\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        if (!partnerKeys.includes(index)) {
          partnerKeys.push(index);
        }
      }
    }

    for (const index of partnerKeys) {
      const partner = {
        partner_website: formData.get(
          `partners[${index}][partner_website]`
        ) as string,
        id: formData.get(`partners[${index}][id]`) as string,
        logo_url: formData.get(`partners[${index}][logo_url]`),
      };

      partnersData.push(partner);
    }
    console.log({ partnersData });

    await communityPartnerValidationSchema.validate(
      { partners: partnersData },
      { abortEarly: false }
    );

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.update_hackathon_commuity_partners(
      hackathon_id,
      partnersData
    );

    const response = build_response(
      "Hackathon Community Partners updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to update hackathon community Partners"
    );
  }
};

export const upload_resource_file = async (formData: FormData) => {
  try {
    const image = formData.get("image") as File;
    const video = formData.get("video");

    if (image && image instanceof File) {
      const { publicUrl: public_url, error: upload_error } = await uploadImage({
        file: image as File,
        userId: image.name.replace(/[^a-zA-Z0-9.-]/g, "_"),
        bucketName: "hackathon-images",
        folderPath: "resource-images",
      });
      if (upload_error) {
        throw new Error(`Image upload failed: ${upload_error}`);
      }

      const response = build_response("Image Uploaded successfully", {
        public_url,
      });

      return successResponse(response);
    }

    if (video && video instanceof File) {
      const { publicUrl: public_url, error: upload_error } = await uploadVideo({
        file: video as File,
        userId: video.name.replace(/[^a-zA-Z0-9.-]/g, "_"),
        bucketName: "hackathon-images",
        folderPath: "resource-videos",
      });

      if (upload_error) {
        throw new Error(`Video upload failed: ${upload_error}`);
      }

      const response = build_response("Video Uploaded successfully", {
        public_url,
      });

      return successResponse(response);
    }

    throw new Error("there must be a valid file");
  } catch (error: any) {
    console.log({ error });
    return errorResponse(error?.message ?? "Failed to upload resource");
  }
};

export const getAuthenticationUrlForGoogleCalendar = async (
  hackathonId: number
) => {
  const calendarGenerator = new GoogleCalendarScheduleGenerator();

  const url = calendarGenerator.getAuthUrl(hackathonId);

  return successResponse(url);
};

const updateHackathonScheduleValidation = yup.object().shape({
  calendarLink: yup
    .string()
    .required("Google Calendar link is required")
    .matches(
      /^https:\/\/calendar\.google\.com\/calendar\/embed\?src=.+$/,
      "Please enter a valid Google Calendar embed link"
    ),
  code: yup.string().required("Access Code is Required"),
});

export const edit_hackathon_schedule = async (
  technology_owner_id: number,
  hackathon_id: number,
  body: any
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("organizer_id")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const validatedBody = await updateHackathonScheduleValidation.validate(
      body,
      {
        abortEarly: false,
      }
    );

    const editHackathonScheduleService = new EditHackathonScheduleService(
      supabase
    );

    const data = await editHackathonScheduleService.update_hackathon_schedule({
      code: validatedBody.code,
      hackathonId: hackathon_id,
      url: validatedBody.calendarLink,
    });

    const response = build_response(
      "Hackathon Schedule updated successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to update hackathon schedule"
    );
  }
};

export const publish_hackathon = async (
  technology_owner_id: number,
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();

    const { error: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("*")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const currentDate = new Date();
    const startDate = hackathon.start_date
      ? new Date(hackathon.start_date)
      : null;
    const endDate = hackathon.end_date ? new Date(hackathon.end_date) : null;
    const submissionDeadline = hackathon.deadline_to_submit
      ? new Date(hackathon.deadline_to_submit)
      : null;

    let newStatus: "live" | "upcoming" | "ended" | "draft" = "draft";

    if (startDate && currentDate < startDate) {
      newStatus = "upcoming";
    } else if (
      (endDate && currentDate > endDate) ||
      (submissionDeadline && currentDate > submissionDeadline)
    ) {
      newStatus = "ended";
    } else {
      newStatus = "live";
    }

    const { data, error } = await supabase
      .from("hackathons")
      .update({
        status: newStatus,
      })
      .eq("id", hackathon_id);

    if (error) {
      throw new Error(`Could not Publish Hackathon: ${error}`);
    }

    const response = build_response("Hackathon published successfully", {
      status: newStatus,
    });
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(error?.message ?? "Failed to publish hackathon");
  }
};

export const get_hackathon_completion_percentage = async (
  technology_owner_id: number,
  hackathon_id: number
) => {
  try {
    const supabase = await createClient();

    const { data: hackathon, error: hackathonError } = await supabase
      .from("hackathons")
      .select("*")
      .eq("id", hackathon_id)
      .eq("organizer_id", technology_owner_id)
      .single();

    if (!hackathon || hackathonError) {
      return errorResponse("Unauthorized access to hackathon", 403);
    }

    const editHackathonService = new EditHackathonService(supabase);

    const data = await editHackathonService.get_hackathon_completion_percentage(
      hackathon_id
    );

    const response = build_response(
      "Hackathon Percentage Retrieved successfully",
      data
    );
    return successResponse(response);
  } catch (error: any) {
    console.log({ error });
    return errorResponse(
      error?.message ?? "Failed to retrieve hackathon completion percentage"
    );
  }
};
