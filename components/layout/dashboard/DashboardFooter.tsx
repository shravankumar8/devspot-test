import { DevspotIcon } from "@/components/icons/Logo";
import Link from "next/link";

export function DashboardFooter() {
  const FooterLinks = [
    { label: "Terms & Conditions", route: "terms-and-condition" },
    { label: "Terms of Service", route: "terms-of-service" },
    { label: "Manifesto", route: "manifesto" },
    { label: " Press & Media", route: "press-and-media" },
    { label: "Privacy Policy", route: "privacy-policy" },
    { label: "Code of Conduct", route: "code-of-conduct" },
    { label: "Pricing model", route: "pricing-model" },
    { label: "Contact", route: "contact" },
    { label: "Project submission guide", route: "project-submission-guide" },
  ];
  return (
    <div className="bg-secondary-bg font-roboto z-10 relative">
      <div className=" w-full py-8 px-5 sm:py-5 sm:px-10 justify-between items-start gap-3 flex-row flex ">
        <div className="">
          <ul className="grid grid-cols-1 sm:grid-cols-4 gap-y-3 gap-x-[20px] lg:gap-x-[40px] xl:gap-x-[60px]">
            {FooterLinks?.map((link) => (
              <li
                key={link.label}
                className="hover:text-[#FFFFFF] text-secondary-text text-[14px]"
              >
                <Link
                  href={`${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/${link.route}`}
                  target={
                    link.route == "project-submission-guide"
                      ? "_blank"
                      : "_self"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="flex items-center gap-2">
          <DevspotIcon />
          <img src="/beta.svg" alt="beta logo" />
        </Link>
      </div>
      <p className="text-[14px] text-secondary-text sm:pl-10 pl-5 py-4 bg-primary-bg">
        Copyright © 2025 DevSpot. All rights reserved.
      </p>
    </div>
  );
}
