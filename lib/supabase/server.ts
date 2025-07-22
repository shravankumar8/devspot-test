import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getUser = async () => {
  const auth = await createClient();
  const user = (await auth.auth.getUser()).data.user;

  return user;
};

export async function createClient() {
  const cookieStore = await cookies();

  // Generate a proper type for this
  return createServerClient<any>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain:
          process.env.APP_ENV === "local"
            ? ".localhost"
            : `.${process.env.NEXT_PUBLIC_BASE_SITE_URL}`, // Allow e.g. devspot.app and all subdomains (*.devspot.app)
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function createAdminClient() {
  const cookieStore = await cookies();

  // Generate a proper type for this
  return createServerClient<any>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookieOptions: {
        domain:
          process.env.APP_ENV === "local"
            ? ".localhost"
            : `.${process.env.NEXT_PUBLIC_BASE_SITE_URL}`, // Allow e.g. devspot.app and all subdomains (*.devspot.app)
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
