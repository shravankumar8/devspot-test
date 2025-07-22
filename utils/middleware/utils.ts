import subdomains from "@/subdomains.json";
import { NextRequest, NextResponse } from "next/server";

const localhost = "localhost";

export function isDomainAllowed(req: NextRequest, baseSiteURL: string) {
  const allowedDomains = ["devspot.app", "stagespot.app", localhost];

  const host = getHost(req);
  const parts = host.split(".");
  const isLocalHost = parts.at(-1) === localhost;
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL;

  if (
    (isLocalHost && parts.length < 1 && parts.length > 2) ||
    (!isLocalHost && parts.length < 2 && parts.length > 3)
  ) {
    // console.log("yo", parts);
    return NextResponse.redirect(`${protocol}//${baseSiteURL}/error`);
  }

  const rootDomain = isLocalHost ? localhost : parts.slice(-2).join(".");
  // console.log(rootDomain);
  if (allowedDomains.includes(rootDomain)) {
    // console.log("Allowed domain: ", rootDomain);
    // No subdomain
    if (
      (isLocalHost && parts.length === 1) ||
      (!isLocalHost && parts.length === 2)
    )
      return null;
    else {
      const subdomain =
        (isLocalHost && parts.length === 2) ||
        (!isLocalHost && parts.length === 3)
          ? host.split(".")[0]
          : false;
      // console.log(`subdomain: ${subdomain ? subdomain : "No Subdomain"}`);

      if (subdomains.some((d) => d.subdomain === subdomain)) {
        return null;
      } else {
        // If not on an allowed subdomain, redirect to the error page of the root domain
        return NextResponse.redirect(`${protocol}//${baseSiteURL}/error`);
      }
    }
  } else return NextResponse.redirect(`${protocol}//${baseSiteURL}/error`);
}

export function addTenantHeader(req: NextRequest): Headers {
  const host = getHost(req);
  const parts = host.split(".");
  const isLocalHost = parts.at(-1) === localhost;

  const headers = new Headers({
    ...Object.fromEntries(req.headers.entries()),
  });
  if (
    (isLocalHost && parts.length === 1) ||
    (!isLocalHost && parts.length === 2)
  )
    return headers; // No subdomain

  const subdomain =
    (isLocalHost && parts.length === 2) || (!isLocalHost && parts.length === 3)
      ? host.split(".")[0]
      : null;
  // console.log("addTenantHeader() subdomain: ", subdomain);
  // Send the subdomain as a header to the requested page

  // if (subdomain) headers.set("x-tenant", subdomain);
  headers.set("x-tenant", "plgenesis"); // Hardcoded for demo

  return headers;
}

function getHost(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  // 1. Normalize host, drop port
  const host = hostname.split(":")[0].replace(/^www\./i, "");
  return host;
}

// Redirect to url with subdomain if using server-side '/hackathons/[subdomain]' path
export function redirectToTenant(req: NextRequest, locales: readonly string[]) {
  const url = new URL(req.url);
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL;
  console.log("redirectToTenant() url pathname: ", url.pathname);
  // Only redirect if path matches /en/hackathons/{id} pattern and doesn't start with /TO/

  const regex = new RegExp(`^/${`(${locales.join("|")})`}/hackathons/\\d+`);
  if (url.pathname.match(regex)) {
    console.log("redirectToTenant TRIGGERED");
    const parts = url.pathname.split("/");
    const tenant = subdomains[parseInt(parts[3]) - 1]?.subdomain; // Hardcoded for demo purposes

    let truncatedPath = "/" + parts[1];
    if (parts.length > 4)
      truncatedPath =
        "/" +
        parts[1] +
        "/" +
        url.pathname.substring(url.pathname.indexOf(parts[4]));

    const headers = new Headers({
      ...Object.fromEntries(req.headers.entries()),
    });
    // headers.set("x-tenant", parts[3]);
    headers.set("x-tenant", "plgenesis"); // Hardcoded for demo

    return NextResponse.redirect(
      new URL(
        `${protocol}${tenant}.${process.env.NEXT_PUBLIC_BASE_SITE_URL}${truncatedPath}`
      ),
      { headers }
    );
  }

  return null;
}

export function hasLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.some((locale) => {
    return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
  });
}
