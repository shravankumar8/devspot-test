"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { Provider, SupabaseClient } from "@supabase/supabase-js";
import { isRedirectError } from "next/dist/client/components/redirect";
import { headers } from "next/headers";

type Supabase = SupabaseClient<Database>;

export async function signInWithProvider(formData: FormData) {
  const origin = headers().get("origin");

  const provider = formData.get("provider") as Provider;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?provider=${provider}`,
        ...JSON.parse(formData.get("options") as string),
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    return { data };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { errorMessage: "Error logging in", data: null };
  }
}

export async function signOutAction() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: "Error signing out" };
  }
}

export async function signUpWithEmail(formData: FormData) {
  const origin = headers().get("origin");
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const defaultAvatarUrl =
    "https://lppzrubgmjigmwcidgzh.supabase.co/storage/v1/object/public/profile-assets/profile-images/de65316a-788f-4100-9ddd-2a88fb40c712/6de789fc-27a5-40d2-acde-dc1e51d4991a.profile-image";

  try {
    // Check if email already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      return { error: "Error checking user existence", data: null };
    }

    if (existingUser) {
      return { error: "A user with this email already exists", data: null };
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          avatar_url: defaultAvatarUrl,
        },
        emailRedirectTo: `${origin}/auth/callback?next=/sign-up/participants/select-location`,
      },
    });

    console.log("Auth data after signup:", authData);

    if (signUpError) {
      return { error: signUpError.message, data: null };
    }

    return {
      data: { message: "Verification email sent" },
      error: null,
    };
  } catch (error) {
    return {
      error: "An unexpected error occurred",
      data: null,
    };
  }
}

export async function TOSignUpWithEmail(formData: FormData) {
  const origin = headers().get("origin");
  const supabase: Supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const defaultAvatarUrl =
    "https://lppzrubgmjigmwcidgzh.supabase.co/storage/v1/object/public/profile-assets/profile-images/de65316a-788f-4100-9ddd-2a88fb40c712/6de789fc-27a5-40d2-acde-dc1e51d4991a.profile-image";

  try {
    const account_name = formData.get("account_name") as string;

    // Check if technology owner with this name already exists
    const { data: existingTO, error: toFetchError } = await supabase
      .from("technology_owners")
      .select("id")
      .ilike("name", account_name)
      .maybeSingle();

    if (toFetchError) {
      return { error: "Error checking technology owner existence", data: null };
    }

    if (existingTO) {
      return {
        error: "A technology owner with this name already exists",
        data: null,
      };
    }

    // Create new technology owner
    const { error: createTOError, data } = await supabase
      .from("technology_owners")
      .insert({ name: account_name })
      .select("*")
      .maybeSingle();

    if (createTOError || !data) {
      return { error: "Error creating technology owner", data: null };
    }
    // Check if email already exists and verify credentials
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError && signInError.message !== "Email not confirmed") {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) {
        return { error: "Error checking user existence", data: null };
      }

      if (existingUser) {
        return { error: "A user with this email already exists", data: null };
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            avatar_url: defaultAvatarUrl,
            role_id: 5,
            technology_owner_id: data.id,
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (signUpError) {
        return { error: signUpError.message, data: null };
      }

      return {
        data: { message: "Verification email sent" },
        error: null,
      };
    } else {
      // User exists but email not confirmed, resend verification email
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (resendError) {
        return { error: "Error resending verification email", data: null };
      }

      return {
        data: { message: "Verification email resent" },
        error: null,
      };
    }
  } catch (error) {
    return {
      error: "An unexpected error occurred",
      data: null,
    };
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message === "Email not confirmed") {
      return {
        success: false,
        message:
          "Please verify your email before logging in. Check your inbox for the verification link.",
      };
    }
    return { success: false, message: error.message };
  }

  return { success: true, data };
}

export async function resendVerificationEmail(email: string) {
  const origin = headers().get("origin");
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/sign-up/participants/select-location`,
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Verification email resent successfully!",
    };
  } catch (error) {
    return { success: false, message: "Failed to resend verification email" };
  }
}

export async function resetPassword(email: string) {
  const origin = headers().get("origin");
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Password reset instructions sent to your email",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send reset instructions",
    };
  }
}

export async function updateUserPassword(newPassword: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update password" };
  }
}

export async function getSupabaseAuthUser() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      data: data.user,
      success: true,
      message: "User retrieved successfully",
    };
  } catch (error) {
    return { success: false, message: "Failed to get user" };
  }
}
