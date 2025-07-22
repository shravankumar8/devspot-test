"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useNavHighlight() {
  const pathname = usePathname();
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentHost = window.location.hostname;
      const baseHost = getBaseHostname(
        process.env.NEXT_PUBLIC_PROTOCOL! +
          process.env.NEXT_PUBLIC_BASE_SITE_URL || ""
      );

      setHostname(currentHost);

      const isSub =
        currentHost !== baseHost && currentHost.endsWith(`.${baseHost}`);
      setIsSubdomain(isSub);
    }
  }, []);

  const normalizedPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  return {
    isSubdomain,
    hostname,
    pathname,
    normalizedPath,
  };
}

function getBaseHostname(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}
