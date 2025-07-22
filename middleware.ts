import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  canTechOwnerAccessHackathon,
  canUserAccessTechnologyOwner,
} from "./lib/services/technology_owner/permissions";
import { updateSession } from "./lib/supabase/middleware";
import {
  addTenantHeader,
  hasLocalePrefix,
  isDomainAllowed,
  redirectToTenant,
} from "./utils/middleware/utils";

const locales = ["en", "fr"];
const defaultLocale = "en";

const I18nMiddleware = createI18nMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //
  // ─── 1. PROTECT YOUR API ROUTES ───────────────────────────────────────────────
  //
  if (pathname.startsWith("/api/technology-owners/")) {
    // extract [technology_owner_id]
    const techMatch = pathname.match(
      /^\/api\/technology-owners\/(\d+)(?:\/|$)/
    );
    if (techMatch) {
      const techId = Number(techMatch[1]);
      const techErr = await canUserAccessTechnologyOwner(techId);
      if (techErr) {
        return new Response(techErr.body, { status: techErr.status });
      }
    }

    // if it’s the nested hackathons route, also check hackathon access
    const hackMatch = pathname.match(
      /^\/api\/technology-owners\/\d+\/hackathons\/(\d+)(?:\/|$)/
    );
    if (hackMatch) {
      const hackId = Number(hackMatch[1]);
      const hackErr = await canTechOwnerAccessHackathon(
        Number(techMatch![1]),
        hackId
      );
      if (hackErr) {
        return new Response(hackErr.body, { status: hackErr.status });
      }
    }
  }

  if (!pathname.startsWith("/api")) {
    const response = I18nMiddleware(req);

    // Return early if it redirects or rewrites
    if (response.status === 307) return response;
    if (response.headers.get("x-middleware-rewrite")) return response;
  }


  const redirectResponse = isDomainAllowed(
    req,
    process.env.NEXT_PUBLIC_BASE_SITE_URL || ""
  );

  if (redirectResponse) {
    // console.log("isDomainAllowed() redirect");
    return redirectResponse;
  }

  const supabaseResponse = await updateSession(req); // Temporary. Later, combine session cookie with all responses
  if (supabaseResponse.status === 307) return supabaseResponse;
  // await updateSession(req);

  const url = new URL(req.url);

  // If no subdomain but pathname is '/hackathons/[subdomain]'
  // redirect to subdomain url (e.g. https://subdomain.devspot.com/hackathons/[subdomain])
  const redirectToTenantResponse = redirectToTenant(req, locales);

  if (redirectToTenantResponse) {
    // console.log("redirectToTenant() Redirect");
    return redirectToTenantResponse;
  }

  // If subdomain is present, add it to the request header
  const headers = addTenantHeader(req);
  const tenant = headers.get("x-tenant") || "";

  if (tenant) {
    // const tenantID = subdomains.indexOf({ subdomain: tenant }) + 1;
    // console.log("tenant", tenant);
    // console.log("tenantID", tenantID);
    const tenantID = 1; // Hardcoded

    const hasLocale = hasLocalePrefix(locales, url.pathname);
    const locale = hasLocale ? "/" + url.pathname.split("/")[1] : "";

    const pathname = hasLocale
      ? "/" + url.pathname.split("/").slice(2).join("/")
      : "/" + url.pathname;

    if (pathname !== "/" && !pathname.match(/^\/application/)) {
      // console.log("Subdomain to Apex Domain Redirect\n\tPathname: ", pathname);
      // console.log("\tBase Site URL: ", process.env.NEXT_PUBLIC_BASE_SITE_URL);
      // console.log("\tProtocol: ", process.env.NEXT_PUBLIC_PROTOCOL);
      console.log(
        "Redirecting to: ",
        `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}${pathname}`
      );
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}${pathname}`,
        { headers }
      );
    }
    // console.log({
    //   has_locale: hasLocale,
    //   pathname: url.pathname,
    //   rewrite_url_template: `${locale}/hackathons/${tenantID}${pathname}`,
    //   final_rewrite_url: new URL(
    //     `${locale}/hackathons/${tenantID}${pathname}`,
    //     req.url
    //   ).toString(),
    // });

    return NextResponse.rewrite(
      new URL(`${locale}/hackathons/${tenantID}${pathname}`, req.url),
      {
        headers,
      }
    );
  }
  console.log("-----------");

  const requestHeaders = req.headers;
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/api/technology-owners/:path*",
    {
      source:
        "/((?!api|_next/static|sitemap.xml|robots.txt|_next/image|favicon.ico|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};
