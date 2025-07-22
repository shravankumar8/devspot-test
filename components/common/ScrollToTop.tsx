"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // on each route change…
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return <>{children}</>;
}
