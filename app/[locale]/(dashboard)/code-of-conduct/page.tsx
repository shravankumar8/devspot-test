"use client";

import React, { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";

interface NavItem {
  id: string;
  title: string;
}

const navItems: NavItem[] = [
  { id: "preamble", title: "Preamble" },
  { id: "acceptance", title: "Acceptance & Scope" },
  { id: "principles", title: "Core Principles" },
  { id: "prohibited", title: "Prohibited Content" },
  { id: "contents", title: "Content Standards" },
  { id: "security", title: "Security & Compliance" },
  { id: "violatons", title: "Reporting Violations" },
  { id: "enforcement", title: "Enforcement" },
  { id: "legal", title: "Legal Notices" },
  { id: "definitions", title: "Definitions" },
  { id: "contact", title: "Contact " },
  { id: "activities", title: "Prohibited Activities" },
];

const prohibitedItems = [
  {
    id: "3.1",
    title: "Harass, Discriminate, or Hate.",
    description:
      "Engage in harassment, intimidation, hate speech, or discriminatory remarks based on race, ethnicity, nationality, religion, gender identity, sexual orientation, disability, or any other protected characteristic.",
  },
  {
    id: "3.2",
    title: "Infringe Intellectual Property.",
    description:
      "Upload, submit, or otherwise transmit content that violates patents, trademarks, copyrights, trade secrets, or other proprietary rights.",
  },
  {
    id: "3.3",
    title: "Violate Privacy or Data Protection.",
    description:
      "Collect, store, or disclose personal data without lawful basis or explicit consent, or in violation of applicable data-protection laws.",
  },
  {
    id: "3.4",
    title: "Distribute Malicious Code or Conduct Illegal Activity.",
    description:
      "Introduce viruses, malware, or other harmful code; attempt unauthorized access; or engage in any unlawful activity on or through the Services.",
  },
  {
    id: "3.5",
    title: "Spam or Solicit.",
    description:
      "Transmit unsolicited promotional messages, chain letters, or deceptive content.",
  },
  {
    id: "3.6",
    title: "Cheat, Collude, or Commit Fraud.",
    description:
      "Submit work that was not substantially developed during an event where original work is required; artificially inflate metrics; manipulate judging or voting; or provide false information.",
  },
  {
    id: "3.7",
    title: "Impersonate or Misrepresent.",
    description:
      "Falsely represent your identity, affiliations, credentials, or sponsorships.",
  },
  {
    id: "3.8",
    description:
      "Interfere with the normal functioning of the Services, including through excessive load, denial-of-service attacks, or disruptive behavior at events.",
  },
];

const agreementItems = [
  {
    id: "3.1",

    description:
      "systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.",
  },
  {
    id: "3.2",
    description:
      "make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.",
  },
  {
    id: "3.3",
    description:
      "use a buying agent or purchasing agent to make purchases on the Site.",
  },
  {
    id: "3.4",
    description:
      "use the Site to advertise or offer to sell goods and services.",
  },
  {
    id: "3.5",
    description:
      "circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.",
  },
  {
    id: "3.6",
    description: "engage in unauthorized framing of or linking to the Site.",
  },
  {
    id: "3.7",
    description:
      "trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords;",
  },
  {
    id: "3.8",
    description:
      "make improper use of our support services or submit false reports of abuse or misconduct.",
  },
  {
    id: "3.9",
    description:
      "engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools. ",
  },
  {
    id: "4.0",
    description:
      "interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.",
  },
  {
    id: "4.1",
    description:
      "attempt to impersonate another user or person or use the username of another user.",
  },
  {
    id: "4.2",
    description: "sell or otherwise transfer your profile.",
  },
  {
    id: "4.3",
    description:
      "use any information obtained from the Site in order to harass, abuse, or harm another person.",
  },
  {
    id: "4.4",
    description:
      "use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise.",
  },
  {
    id: "4.5",
    description:
      "decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site.",
  },
  {
    id: "4.6",
    description:
      "attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.",
  },
  {
    id: "4.7",
    description:
      "harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you.",
  },
  {
    id: "4.8",
    description:
      "delete the copyright or other proprietary rights notice from any Content.",
  },
  {
    id: "4.9",
    description:
      "copy or adapt the Site’s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.",
  },
  {
    id: "5.0",
    description:
      "upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site.",
  },
  {
    id: "5.1",
    description:
      "upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware” or “passive collection mechanisms” or “pcms”).",
  },
  {
    id: "5.2",
    description:
      "except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Site, or using or launching any unauthorized script or other software.",
  },
  {
    id: "5.3",
    description:
      "disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.",
  },
  {
    id: "5.4",
    description:
      "use the Site in a manner inconsistent with any applicable laws or regulations",
  },
];

const definitionsItems = [
  {
    id: "3.1",
    title: "Content",
    description:
      " means any code, text, images, audio, video, data, or materials submitted, posted, or otherwise provided through the Services.",
  },
  {
    id: "3.2",
    title: "Event",
    description:
      " means any hackathon, bounty, workshop, competition, or other program hosted or co‑hosted by DevSpot.",
  },
];

const CodeOfConduct: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("acceptance");
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
                      className={`py-2 px-4 text-sm font-medium transition-colors duration-200 border-l-2  text-secondary-text ${
                        activeSection === item.id
                          ? "border-l-main-primary  text-primary text-white"
                          : "border-l-transparent"
                      }`}
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
              <h1 className="text-[32px] font-semibold mb-3">
                Code of Conduct
              </h1>
              <p className="text-base text-secondary-text mb-10 font-roboto">
                Last updated May 14, 2025
              </p>

              {/* Section 1: Acceptance of Terms */}
              <div
                id="acceptance"
                ref={(el) => {
                  sectionRefs.current.acceptance = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">preamble</h2>
                <p>
                  DevSpot empowers builders, technology owners, sponsors,
                  judges, and community members to collaborate in hackathons,
                  bounties, and other developer‑focused programs. To maintain a
                  safe, inclusive, and fair environment, DevSpot has adopted
                  this User Code of Conduct (the “Code”). By accessing or using
                  DevSpot, you acknowledge that you have read, understood, and
                  agree to be bound by this Code, our Terms of Service, Privacy
                  Policy, and any event‑specific rules.
                </p>
              </div>

              {/* Section 2: Eligibility */}
              <div
                id="eligibility"
                ref={(el) => {
                  sectionRefs.current.eligibility = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  1. Acceptance & Scope
                </h2>
                <p>
                  1.1 Applicability. This Code applies to all users of
                  DevSpot—participants, technology owners, sponsors, judges,
                  mentors, moderators, and observers (collectively, “Users”).{" "}
                  <br />
                  1.2 Covered Services. The Code governs conduct on all
                  DevSpot‑owned or ‑controlled properties, including our
                  website, APIs, communication channels (e.g., Discord, Slack),
                  documentation, virtual or on‑site events, and any in‑person
                  gatherings organized under the DevSpot brand (collectively,
                  the “Services”). <br /> 1.3 Legal Integration. This Code is
                  incorporated by reference into the DevSpot Terms of Service.
                  Capitalized terms not defined herein have the meanings
                  assigned in the Terms of Service.
                </p>
              </div>

              {/* Section 3: Account Registration & Security */}
              <div
                id="principles"
                ref={(el) => {
                  sectionRefs.current.principles = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  2. Core Principles
                </h2>

                <div className="mb-2">
                  <p>
                    2.1 Respect & Inclusion. Treat everyone with dignity.
                    Harassment, discrimination, or abusive behavior will not be
                    tolerated. <br /> 2.2 Integrity & Fair Play. Act honestly,
                    uphold professional standards, and compete fairly. Cheating,
                    plagiarism, or manipulation of DevSpot processes is strictly
                    prohibited. <br /> 2.3 Legal Compliance. Comply with all
                    applicable local, national, and international laws,
                    regulations, export controls, and sanctions regimes.
                  </p>
                </div>
              </div>

              {/* Section 4: Services Overview */}
              <div
                id="prohibited"
                ref={(el) => {
                  sectionRefs.current.prohibited = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  3. Prohibited Conduct
                </h2>
                <p className="mb-2">Without limitation, Users may not:</p>
                <ul className="space-y-4">
                  {prohibitedItems.map((item) => (
                    <li key={item.id} className="flex">
                      <span className="text-white mr-2">•</span>
                      <div>
                        <span className="font-medium">
                          {item.id} {item.title}
                        </span>{" "}
                        {item.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 5: Fees & Payments */}
              <div
                id="contents"
                ref={(el) => {
                  sectionRefs.current.contents = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  4. Content Standards
                </h2>

                <div className="mb-2">
                  <p>
                    4.1 Ownership & Licensing. You affirm that you have
                    sufficient rights to the content you submit and that you
                    will clearly identify any third‑party components you use.
                    When event rules require open‑source licensing (e.g.,
                    inclusion of a project.json file), you must comply. <br />{" "}
                    4.2 Offensive or Harmful Content. Do not post content that
                    is obscene, sexually explicit (other than educational or
                    medical), or that glorifies violence, self‑harm, or illegal
                    activity. <br /> 4.3 Sensitive Personal Data. Do not post or
                    request highly sensitive personal data, including
                    government‑issued IDs, financial account numbers, or
                    biometric identifiers, except where expressly permitted by
                    DevSpot and protected by appropriate safeguards
                  </p>
                </div>
              </div>

              {/* Section 6: User Content & License */}
              <div
                id="security"
                ref={(el) => {
                  sectionRefs.current.security = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  5. Security & Compliance
                </h2>

                <div className=" mb-2">
                  <p>
                    5.1 Responsible Disclosure. If you discover a security
                    vulnerability, report it promptly to support@devspot.app and
                    refrain from public disclosure until DevSpot confirms
                    remediation. <br /> 5.2 Export & Sanctions. You affirm you
                    are not subject to applicable sanctions or located in a
                    prohibited jurisdiction. You may not use DevSpot to
                    facilitate transactions or services that violate
                    export‑control or sanctions laws.
                  </p>
                </div>
              </div>

              {/* More sections following the same pattern */}
              <div
                id="violatons"
                ref={(el) => {
                  sectionRefs.current.violatons = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  6. Reporting Violations
                </h2>
                <div className=" mb-2">
                  <p>
                    6.1 How to Report. Report violations by emailing
                    support@devspot.app or using in‑platform reporting tools.{" "}
                    <br /> 6.2 Investigation Process. DevSpot will review
                    reports confidentially and impartially, and may request
                    additional information. <br /> 6.3 No Retaliation.
                    Retaliation against anyone who reports or participates in an
                    investigation is strictly prohibited.
                  </p>
                </div>
              </div>

              <div
                id="enforcement"
                ref={(el) => {
                  sectionRefs.current.enforcement = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">7. Enforcement</h2>
                <p>
                  7.1 Remedial Actions. DevSpot may, at its sole discretion,
                  issue warnings, remove content, suspend or terminate accounts,
                  revoke winnings, or take any other action deemed appropriate.{" "}
                  <br />
                  7.2 Appeal Procedure. You may appeal certain enforcement
                  actions by emailing support@devspot.app within fourteen (14)
                  days of notice, unless the violation involves safety,
                  security, or legal obligations that render the decision final.{" "}
                  <br />
                  7.3 Referral to Authorities. DevSpot reserves the right to
                  involve law‑enforcement authorities where warranted.
                </p>
              </div>

              <div
                id="legal"
                ref={(el) => {
                  sectionRefs.current.legal = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  8. Legal Notices
                </h2>
                <p>
                  8.1 Modifications. DevSpot may modify this Code at any time by
                  posting an updated version. Continued use of the Services
                  constitutes acceptance of the revised Code. <br /> 8.2
                  Governing Law & Jurisdiction. This Code is governed by the
                  laws of the State of California, USA, without regard to
                  conflict‑of‑law principles. Disputes shall be resolved as set
                  forth in the DevSpot Terms of Service. <br /> 8.3
                  Severability. If any provision of this Code is held
                  unenforceable, the remaining provisions remain in full force.{" "}
                  <br /> 8.4 Survival. Sections 4 (Content Standards), 5
                  (Security & Compliance), 6 (Reporting), 7 (Enforcement), and 8
                  (Legal Notices) survive termination of your account.
                </p>
              </div>

              <div
                id="definitions"
                ref={(el) => {
                  sectionRefs.current.definitions = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">9. Definitions</h2>
                <ul className="space-y-4">
                  {definitionsItems.map((item) => (
                    <li key={item.id} className="flex">
                      <span className="text-white mr-2">•</span>
                      <div>
                        <span className="font-medium">
                          {item.id} {item.title}
                        </span>{" "}
                        {item.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                id="contact"
                ref={(el) => {
                  sectionRefs.current.contact = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">10. Contact</h2>
                <p>
                  Questions about this Code may be directed to support@devspot.app.{" "}
                  <br />
                  By continuing to use DevSpot, you agree to abide by this Code
                  of Conduct.
                </p>
              </div>

              <div
                id="activities"
                ref={(el) => {
                  sectionRefs.current.activities = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  11. PROHIBITED ACTIVITIES
                </h2>
                <p>
                  You may not access or use the Site for any purpose other than
                  that for which we make the Site available. The Site may not be
                  used in connection with any commercial endeavors except those
                  that are specifically endorsed or approved by us.
                </p>
                <p>As a user of the Site, you agree not to:</p>
                <div>
                  <ul className="space-y-4">
                    {agreementItems.map((item) => (
                      <li key={item.id} className="flex">
                        <span className="text-white mr-2">•</span>
                        <div>{item.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeOfConduct;
