import { createAdminClient } from "@/lib/supabase/server";
import { Users } from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import { File } from "@web-std/file";
import ApiBaseService from "../../utils/baseService";
import { uploadImage } from "../../utils/uploadImage";

class UserService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async update_terms_of_acceptance(user_id: string, terms_accepted: boolean) {
    const { error: update_error } = await this.supabase
      .from("users")
      .update({ terms_accepted })
      .eq("id", user_id);

    if (update_error) {
      throw new Error(
        `Failed to update terms acceptance: ${update_error.message}`
      );
    }

    return null;
  }

  async update_profile_image(user_id: string, form_data: FormData) {
    const file = form_data.get("image");

    if (!file) {
      throw new Error("No file provided in the form data");
    }
    const fileToSend = new File([file as BlobPart], "profile_photo.txt", {
      type: "image/",
    });

    if (!fileToSend || !(fileToSend instanceof File)) {
      throw new Error("image must be a valid file");
    }
    const { publicUrl: public_url, error: upload_error } = await uploadImage({
      file: fileToSend,
      userId: user_id,
      bucketName: "profile-assets",
      folderPath: "profile-images",
    });

    if (upload_error) {
      throw new Error(`Image upload failed: ${upload_error}`);
    }

    const { error: update_error } = await this.supabase
      .from("users")
      .update({ avatar_url: public_url })
      .eq("id", user_id);

    if (update_error) {
      throw new Error(`Failed to update profile: ${update_error.message}`);
    }

    return {
      imageUrl: public_url,
    };
  }

  async remove_profile_image(user_id: string) {
    // Implement method to remove image from supabase storage
    const { error: update_error } = await this.supabase
      .from("users")
      .update({ avatar_url: null })
      .eq("id", user_id);

    if (update_error) {
      throw new Error(
        `Failed to update profile image: ${update_error.message}`
      );
    }

    return null;
  }

  async update_header_image(user_id: string, form_data: FormData) {
    const file = form_data.get("image");

    if (!file || !(file instanceof File)) {
      throw new Error("image must be a valid file");
    }

    const { publicUrl: public_url, error: upload_error } = await uploadImage({
      file,
      userId: user_id,
      bucketName: "profile-assets",
      folderPath: "header-images",
    });

    if (upload_error) {
      throw new Error(`Image upload failed: ${upload_error}`);
    }

    const { error: update_error } = await this.supabase
      .from("users")
      .update({ profile_header_url: public_url })
      .eq("id", user_id);

    if (update_error) {
      throw new Error(`Failed to update header Image: ${update_error.message}`);
    }

    return {
      imageUrl: public_url,
    };
  }
  async remove_header_image(user_id: string) {
    // Implement method to remove image from supabase storage
    const { error: updateError } = await this.supabase
      .from("users")
      .update({ profile_header_url: null })
      .eq("id", user_id);

    if (updateError) {
      throw new Error(`Failed to update header image: ${updateError.message}`);
    }

    return null;
  }

  async get_terms_of_acceptance(user_id: string) {
    const { data, error: fetch_error } = await this.supabase
      .from("users")
      .select("terms_accepted")
      .eq("id", user_id)
      .single();

    if (fetch_error) {
      throw new Error(
        `Failed to fetch terms acceptance: ${fetch_error.message}`
      );
    }

    return { terms_accepted: data?.terms_accepted || false };
  }

  async delete_account(user_id: string) {
    const supabase = await createAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(user_id);

    if (error) {
      console.log(error);
      throw new Error(
        `Failed to delete user account admin: ${error.message} ${error}`
      );
    }

    const { error: delete_error } = await supabase
      .from("users")
      .delete()
      .eq("id", user_id);
    console.log("deleted account clint");

    if (delete_error) {
      throw new Error(`Failed to delete user account: ${delete_error.message}`);
    }

    return null;
  }

  async update_user_fields(user_id: string, data: Partial<Users>) {
    const { error } = await this.supabase
      .from("users")
      .update({ ...data })
      .eq("id", user_id);

    if (error) {
      throw new Error(`Failed to update user name: ${error.message}`);
    }
  }
}

export default UserService;
