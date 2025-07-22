"use client";

import React, { useEffect, useState, useRef } from "react";
import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";
import { cn } from "@/utils/tailwind-merge";

interface NavItem {
  id: string;
  title: string;
}

const navItems: NavItem[] = [
  { id: "privacy", title: "Privacy Policy" },
  { id: "notice", title: "DMCA Notice & Policy" },
];

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("privacy");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle navigation click
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    window.history.pushState(null, "", `#${id}`);
  };

  // Initialize from URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && navItems.some((item) => item.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  // Set up intersection observer to update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
            window.history.replaceState(null, "", `#${id}`);
          }
        });
      },
      { rootMargin: "-90px 0px -80% 0px", threshold: 0 }
    );

    // Observe all section elements
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className=" relative">
      <div className="">
        <div className="dark min-h-screen bg-background text-foreground">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-1/4 lg:w-1/5 md:pr-8 md:block hidden">
              <div className="sticky top-20 space-y-1">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`py-2 px-4 text-sm font-medium transition-colors duration-200 border-l-2  text-secondary-text ${cn(
                        activeSection === item.id
                          ? "border-l-main-primary  text-primary text-white"
                          : "border-l-transparent"
                      )}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                        document.getElementById(item.id)?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 lg:w-4/5 mt-5 md:mt-0">
              <h1 className="text-[32px] font-semibold mb-3">Privacy Policy</h1>
              <p className="text-base text-secondary-text mb-10 font-roboto">
                Last updated May 14, 2025
              </p>

              {/* Section 1: Acceptance of Terms */}
              <div
                id="privacy"
                ref={(el) => {
                  sectionRefs.current.privacy = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  1. PRIVACY POLICY
                </h2>
                <p>
                  We care about data privacy and security. Please review our
                  Privacy Policy. By using the Site, you agree to be bound by
                  our Privacy Policy, which is incorporated into these Terms and
                  Conditions. Please be advised the Site is hosted in the United
                  States. If you access the Site from the European Union, Asia,
                  or any other region of the world with laws or other
                  requirements governing personal data collection, use, or
                  disclosure that differ from applicable laws in the United
                  States, then through your continued use of the Site, you are
                  transferring your data to the United States, and you expressly
                  consent to have your data transferred to and processed in the
                  United States. Further, we do not knowingly accept, request,
                  or solicit information from children or knowingly market to
                  children. Therefore, in accordance with the U.S. Children’s
                  Online Privacy Protection Act, if we receive actual knowledge
                  that anyone under the age of 13 has provided personal
                  information to us without the requisite and verifiable
                  parental consent, we will delete that information from the
                  Site as quickly as is reasonably practical.
                </p>
              </div>

              {/* Section 2: Eligibility */}
              <div
                id="notice"
                ref={(el) => {
                  sectionRefs.current.notice = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  2. DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY
                </h2>
                <p className=" whitespace-pre-line">
                  Notifications <br /> <br /> We respect the intellectual
                  property rights of others. If you believe that any material
                  available on or through the Site infringes upon any copyright
                  you own or control, please immediately notify our Designated
                  Copyright Agent using the contact information provided below
                  (a “Notification”). <br /> <br /> A copy of your Notification
                  will be sent to the person who posted or stored the material
                  addressed in the Notification. Please be advised that pursuant
                  to federal law you may be held liable for damages if you make
                  material misrepresentations in a Notification. Thus, if you
                  are not sure that material located on or linked to by the Site
                  infringes your copyright, you should consider first contacting
                  an attorney. <br /> <br /> All Notifications should meet the
                  requirements of DMCA 17 U.S.C. § 512(c)(3) and include the
                  following information: <br /> <br />
                  (1) A physical or electronic signature of a person authorized
                  to act on behalf of the owner of an exclusive right that is
                  allegedly infringed; <br /> <br />
                  (2) identification of the copyrighted work claimed to have
                  been infringed, or, if multiple copyrighted works on the Site
                  are covered by the Notification, a representative list of such
                  works on the Site; <br /> <br />
                  (3) identification of the material that is claimed to be
                  infringing or to be the subject of infringing activity and
                  that is to be removed or access to which is to be disabled,
                  and information reasonably sufficient to permit us to locate
                  the material; <br /> <br />
                  (4) information reasonably sufficient to permit us to contact
                  the complaining party, such as an address, telephone number,
                  and, if available, an email address at which the complaining
                  party may be contacted; <br /> <br />
                  (5) a statement that the complaining party has a good faith
                  belief that use of the material in the manner complained of is
                  not authorized by the copyright owner, its agent, or the law;
                  <br /> <br />
                  (6) a statement that the information in the notification is
                  accurate, and under penalty of perjury, that the complaining
                  party is authorized to act on behalf of the owner of an
                  exclusive right that is allegedly infringed upon. Counter
                  Notification If you believe your own copyrighted material has
                  been removed from the Site as a result of a mistake or
                  misidentification, you may submit a written counter
                  notification to [us/our Designated Copyright Agent] using the
                  contact information provided below (a “Counter Notification”).
                  <br /> <br />
                  To be an effective Counter Notification under the DMCA, your
                  Counter Notification must include substantially the following:
                  (1) identification of the material that has been removed or
                  disabled and the location at which the material appeared
                  before it was removed or disabled; <br /> <br />
                  (2) a statement that you consent to the jurisdiction of the
                  Federal District Court in which your address is located, or if
                  your address is outside the United States, for any judicial
                  district in which we are located; <br /> <br />
                  (3) a statement that you will accept service of process from
                  the party that filed the Notification or the party’s agent;
                  <br /> <br />
                  (4) your name, address, and telephone number; <br /> <br />
                  (5) a statement under penalty of perjury that you have a good
                  faith belief that the material in question was removed or
                  disabled as a result of a mistake or misidentification of the
                  material to be removed or disabled; <br /> <br />
                  (6) your physical or electronic signature. If you send us a
                  valid, written Counter Notification meeting the requirements
                  described above, we will restore your removed or disabled
                  material, unless we first receive notice from the party filing
                  the Notification informing us that such party has filed a
                  court action to restrain you from engaging in infringing
                  activity related to the material in question. Please note that
                  if you materially misrepresent that the disabled or removed
                  content was removed by mistake or misidentification, you may
                  be liable for damages, including costs and attorney’s fees.
                  Filing a false Counter Notification constitutes perjury.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
