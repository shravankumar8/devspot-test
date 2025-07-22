import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { TechnologyStatusEnum } from "@/types/entities";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  tag_creation_validation,
  update_tag_status_validation,
} from "./schema";
import { TagValidationService } from "./validationService";

type Supabase = SupabaseClient<Database>;

export const create_tag = async (body: any) => {
  try {
    const supabase: Supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const seenSlugs = new Set<string>();
    const tagValidation = new TagValidationService();
    const validatedTags: {
      name: string;
      slug: string;
    }[] = [];

    const validated_body = await tag_creation_validation.validate(body);

    for (const tag of validated_body.tags) {
      if (!tag) continue;

      const isTagValid = tagValidation.isTagValid(tag);
      if (!isTagValid) {
        console.error("Tag is not valid");
        continue;
      }

      const validationResult = await tagValidation.validateAndNormalizeTag(tag);

      if (!validationResult.isValid || !validationResult.normalizedTag) {
        console.error(
          `Tag validation failed: ${validationResult.errors.join(", ")}`
        );
        continue;
      }

      const normalizedTag = {
        name: validationResult.normalizedTag.name,
        slug: validationResult.normalizedTag.slug,
      };

      // prevent duplicates in the same batch
      if (!seenSlugs.has(normalizedTag.slug)) {
        validatedTags.push(normalizedTag);
        seenSlugs.add(normalizedTag.slug);
      }
    }

    if (validatedTags.length === 0) {
      console.error("No valid tags to process");
      return successResponse([]);
    }

    const { data: existingTags = [] } = await supabase
      .from("technologies")
      .select("slug")
      .in(
        "slug",
        validatedTags.map((t) => t.slug)
      );

    const existingSlugs = new Set(existingTags?.map((tag) => tag.slug));

    const tagsToInsert = validatedTags.filter(
      (tag) => !existingSlugs.has(tag.slug)
    );

    if (tagsToInsert.length === 0) {
      return successResponse(existingTags?.[0]);
    }

    const { data: insertedTags, error: insertError } = await supabase
      .from("technologies")
      .insert(
        tagsToInsert.map((tag) => ({
          name: tag.name,
          slug: tag.slug,
          status: "pending" as TechnologyStatusEnum,
          status_changed_by: user?.id,
        }))
      )
      .select();

    if (insertError) {
      throw new Error("Failed to create tags");
    }

    const finalTags = [...insertedTags, ...existingTags!];

    return successResponse(finalTags);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Create Tag");
  }
};

export const update_tag_status = async (tagId: number, status: string) => {
  try {
    const supabase: Supabase = await createClient();

    const { user, error } = await getAuthenticatedUser();

    if (error) return error;

    const validated_body = await update_tag_status_validation.validate({
      status,
    });

    const { data: updated_tag, error: operation_error } = await supabase
      .from("technologies")
      .update({
        status: validated_body.status,
        status_changed_by: user.id,
      })
      .eq("id", tagId)
      .select()
      .single();

    if (operation_error) {
      throw new Error("Failed to update tag status");
    }

    return successResponse(updated_tag);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to Create Tag");
  }
};

export const get_technology_tag_options = async () => {
  try {
    const supabase: Supabase = await createClient();

    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .eq("status", "approved");

    if (error) {
      throw new Error("Failed to get all tags");
    }

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error?.message ?? "Failed to get Tags");
  }
};
