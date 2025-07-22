import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  // console.log(
  //   `Supabase middleware updateSession():\n` +
  //     `\tRequest Domain/Host: ${request.headers.get("host")}\n` +
  //     `\tBase Site URL env variable: ${process.env.NEXT_PUBLIC_BASE_SITE_URL}\n\t`
  // );

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain:
          process.env.APP_ENV === "local"
            ? ".localhost"
            : `.${process.env.NEXT_PUBLIC_BASE_SITE_URL}`, // Allow e.g. devspot.com and all subdomains (*.devspot.com)
        secure: process.env.APP_ENV === "local" ? false : true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        // If you want to use createBrowserClient, refer to this discussion
        // regarding httpOnly as this affects session cookie functionality across subdomains:
        // https://web.archive.org/web/20250504004211/https://github.com/orgs/supabase/discussions/5742#discussioncomment-12206593
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("c");
    if (
      !user &&
      !request.nextUrl.pathname.match(
        /^\/(?:[A-Za-z]{2}(?:-[A-Za-z]{2})?\/)?login$/
      ) &&
      !request.nextUrl.pathname.match(
        /^\/(?:[A-Za-z]{2}(?:-[A-Za-z]{2})?\/)?sign-up$/
      ) &&
      !request.nextUrl.pathname.match(
        /^\/(?:[A-Za-z]{2}(?:-[A-Za-z]{2})?\/)?login$/
      ) &&
      !request.nextUrl.pathname.match(
        /^\/(?:[A-Za-z]{2}(?:-[A-Za-z]{2})?\/)?auth\/callback.*/
      ) &&
      request.nextUrl.pathname !== "/" &&
      request.nextUrl.pathname.split("/").length < 3 &&
      !isValidLocale(request.nextUrl.pathname.split("/")[1])
    ) {
      // no user, potentially respond by redirecting the user to the login page

      console.log(
        "Supabase user not found, redirecting to login page. Pathname: ",
        request.nextUrl.pathname
      );
      return NextResponse.redirect(
        new URL(
          `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/login`
        ) // Hardcoded for demo
      );
    }
  } catch (error) {
    console.log(error);
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

function isValidLocale(tag: string) {
  try {
    new Intl.Locale(tag);
    return true;
  } catch {
    return false;
  }
}
