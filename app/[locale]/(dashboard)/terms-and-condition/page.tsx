"use client";

import React, { useEffect, useState, useRef } from "react";


interface NavItem {
  id: string;
  title: string;
}

const navItems: NavItem[] = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility" },
  { id: "account", title: "Account Registration & Security" },
  { id: "services", title: "Services Overview" },
  { id: "fees", title: "Fees & Payments" },
  { id: "content", title: "User Content & License" },
  { id: "intellectual", title: "Intellectual Property Rights" },
  { id: "prohibited", title: "Prohibited Activities" },
  { id: "privacy", title: "Privacy" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "limitation", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "termination", title: "Termination" },
  { id: "modifications", title: "Modifications to the Services & Terms" },
  { id: "governing", title: "Governing Law & Dispute Resolution" },
  { id: "miscellaneous", title: "Miscellaneous" },
  { id: "contact", title: "Contact" },
];

const TermsAndConditions: React.FC = () => {
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
                Terms and Conditions
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
                <h2 className=" font-meduim mb-1 uppercase">
                  1. ACCEPTANCE OF TERMS
                </h2>
                <p>
                  Welcome to DevSpot, a platform operated by DevSpot, Inc.
                  ("DevSpot," "we," "our," or "us"). These Terms and Conditions
                  (the "Terms") govern your access to and use of DevSpot’s
                  websites, mobile applications, APIs, communication channels,
                  and related services (collectively, the "Services"). By
                  creating an account, participating in an event, or otherwise
                  using the Services, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms, our [Privacy
                  Policy], [User Code of Conduct], and any event‑specific rules
                  or guidelines (collectively, the "Agreement"). If you do not
                  agree, you must not use the Services.
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
                <h2 className=" font-meduim mb-1 uppercase">2. ELIGIBILITY</h2>
                <p>
                  You may use the Services only if you (i) are at least 13 years
                  old (or the minimum age required by law in your jurisdiction)
                  and, if under the age of majority, have obtained verifiable
                  written consent from your parent or legal guardian; (ii) have
                  the legal capacity to enter into a binding contract; and (iii)
                  are not barred from using the Services under applicable laws,
                  export-control regulations, sanctions regimes, or located in
                  countries subject to embargoes by the United States or the
                  United Nations. By using the Services, you represent and
                  warrant that you meet these requirements.
                </p>
              </div>

              {/* Section 3: Account Registration & Security */}
              <div
                id="account"
                ref={(el) => {
                  sectionRefs.current.account = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  3. ACCOUNT REGISTRATION & SECURITY
                </h2>

                <div className="mb-2">
                  <p>
                    3.1 Registration To access certain features, you must create
                    an account and provide accurate, complete, and current
                    information. You agree to update information as necessary to
                    keep it accurate.
                  </p>
                </div>

                <div className="mb-2">
                  <p>
                    3.2 Credentials You are responsible for safeguarding your
                    account credentials. You must notify DevSpot immediately at
                    support@devspot.app of any unauthorized use. DevSpot is not
                    liable for losses caused by unauthorized account activity.
                  </p>
                </div>

                <div className="mb-2">
                  <p>
                    3.3 Verification We may require identity or domain
                    verification (e.g., for Technology Owners) and may suspend
                    or terminate accounts that fail verification.
                  </p>
                </div>
              </div>

              {/* Section 4: Services Overview */}
              <div
                id="services"
                ref={(el) => {
                  sectionRefs.current.services = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  4. SERVICES OVERVIEW
                </h2>
                <p>
                  DevSpot hosts virtual and in‑person hackathons, bounties,
                  competitions, and related programs that enable developers
                  ("Participants") to collaborate with technology owners,
                  sponsors, judges, and mentors. Certain features may enable
                  payments, token transfers, or integrations with third‑party
                  services (collectively, "Integrations").
                </p>
              </div>

              {/* Section 5: Fees & Payments */}
              <div
                id="fees"
                ref={(el) => {
                  sectionRefs.current.fees = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  5. FEES & PAYMENTS
                </h2>

                <div className="mb-2">
                  <p>
                    5.1 Participation Fees Some events or premium features may
                    require payment. Fees, if any, will be disclosed before
                    purchase and are payable in U.S. dollars or supported
                    digital assets via approved payment methods.
                  </p>
                </div>

                <div className=" mb-2">
                  <p>
                    5.2 Refunds Fees are non‑refundable unless otherwise stated
                    in writing or required by law.
                  </p>
                </div>

                <div className="mb-2">
                  <p>
                    5.3 Taxes You are responsible for any taxes, duties, or
                    other governmental assessments associated with your use of
                    the Services.
                  </p>
                </div>

                <div className=" mb-2">
                  <p>
                    5.4 Prizes & Payouts Prizes may be distributed in fiat
                    currency, stablecoins (e.g., USDC), or other digital assets.
                    You acknowledge (i) the volatility and regulatory
                    uncertainty surrounding digital assets; (ii) DevSpot is not
                    a licensed money services business or financial advisor; and
                    (iii) you assume full responsibility for custody, tax
                    reporting, and legal compliance related to prizes.
                  </p>
                </div>

                <div className=" mb-2">
                  <p>
                    5.5 Taxes on Prizes Winners are solely responsible for
                    reporting and paying all federal, state, local, and
                    international taxes associated with prize awards; DevSpot
                    will not withhold taxes on your behalf.
                  </p>
                </div>
              </div>

              {/* Section 6: User Content & License */}
              <div
                id="content"
                ref={(el) => {
                  sectionRefs.current.content = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  6. USER CONTENT & LICENSE
                </h2>

                <div className=" mb-2">
                  <p>
                    6.1 Definitions "Content" includes code, text, images,
                    video, audio, data, feedback, and other materials you submit
                    or make available through the Services.
                  </p>
                </div>

                <div className=" mb-2">
                  <p>
                    6.2 Ownership Except for licenses granted herein, you retain
                    all rights in your Content.
                  </p>
                </div>

                <div className=" mb-2">
                  <p>
                    6.3 License to DevSpot You grant DevSpot a worldwide,
                    royalty‑free, sublicensable, transferable license to use,
                    reproduce, adapt, distribute, publicly perform, and display
                    your Content solely for (i) operating and improving the
                    Services; (ii) marketing or promoting events in which you
                    participated (with credit attribution where feasible); and
                    (iii) complying with legal obligations.
                  </p>
                </div>

                <div className="mb-2">
                  <p>
                    6.4 Representations You represent and warrant that (i) you
                    own or have sufficient rights to your Content; (ii) your
                    Content does not violate any third‑party rights or laws; and
                    (iii) you have obtained all necessary consents.
                  </p>
                </div>

                <div className=" mb-2">
                  <p>
                    6.5 Open-Source Requirements Certain events may require
                    project submissions to include a project.json file or to be
                    licensed under an OSI‑approved license. Event rules prevail
                    in case of conflict.
                  </p>
                </div>
              </div>

              {/* More sections following the same pattern */}
              <div
                id="intellectual"
                ref={(el) => {
                  sectionRefs.current.intellectual = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  7. INTELLECTUAL PROPERTY RIGHTS
                </h2>
                <div className=" mb-2">
                  <p>
                    7.1 DevSpot IP DevSpot and its licensors retain all right,
                    title, and interest in the Services, including software,
                    trademarks, logos, and content, except your Content.
                  </p>
                </div>
                <div className="mb-2">
                  <p>
                    7.2 Feedback If you provide feedback or suggestions, you
                    grant DevSpot a perpetual, irrevocable, worldwide,
                    royalty‑free license to use, modify, and incorporate such
                    feedback without obligation to you.
                  </p>
                </div>
              </div>

              <div
                id="prohibited"
                ref={(el) => {
                  sectionRefs.current.prohibited = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  8. PROHIBITED ACTIVITIES
                </h2>
                <p>
                  You agree not to (i) violate our User Code of Conduct; (ii)
                  engage in fraudulent, deceptive, or illegal activities; (iii)
                  infringe intellectual‑property rights; (iv) interfere with or
                  disrupt the Services; (v) reverse‑engineer or attempt to
                  obtain source code; or (vi) use automated means to scrape or
                  access the Services without prior written consent.
                </p>
              </div>

              <div
                id="privacy"
                ref={(el) => {
                  sectionRefs.current.privacy = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">9. PRIVACY</h2>
                <p>
                  The Services may link to or integrate with third‑party
                  services (e.g., Supabase, wallet providers, payment
                  processors). DevSpot does not control and is not responsible
                  for third‑party services. Your use of third‑party services is
                  governed solely by their terms.
                </p>
              </div>

              <div
                id="disclaimers"
                ref={(el) => {
                  sectionRefs.current.disclaimers = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">10. DISCLAIMERS</h2>
                <p>
                  Your privacy is important to us. Please review our [Privacy
                  Policy] to understand how we collect, use, and disclose
                  personal information.
                </p>
              </div>

              <div
                id="limitation"
                ref={(el) => {
                  sectionRefs.current.limitation = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  11. LIMITATION OF LIABILITY
                </h2>
                <p>
                  To the fullest extent permitted by law, DevSpot, its
                  affiliates, directors, employees, agents, suppliers, or
                  licensors shall not be liable for (i) indirect, incidental,
                  special, consequential, or punitive damages; (ii) loss of
                  profits, data, or goodwill; or (iii) aggregate liability
                  exceeding the greater of USD 100 or the amounts you paid
                  DevSpot in the 12 months preceding the claim. These
                  limitations apply even if DevSpot has been advised of the
                  possibility of damages.
                </p>
              </div>

              <div
                id="indemnification"
                ref={(el) => {
                  sectionRefs.current.indemnification = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  12. INDEMNIFICATION
                </h2>
                <p>
                  You agree to indemnify, defend, and hold harmless DevSpot and
                  its affiliates from any claims, liabilities, damages, losses,
                  and expenses (including reasonable attorney fees) arising from
                  or related to (i) your Content; (ii) your use or misuse of the
                  Services; (iii) your violation of the Agreement; or (iv) your
                  violation of any law or third‑party right.
                </p>
              </div>

              <div
                id="termination"
                ref={(el) => {
                  sectionRefs.current.termination = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">13. TERMINATION</h2>
                <div className="mb-2">
                  <p>
                    14.1 By You You may terminate your account at any time by
                    following in‑platform instructions.
                  </p>
                </div>
                <div className="mb-2">
                  <p>
                    4.2 By DevSpot We may suspend or terminate your access (i)
                    for violation of the Agreement; (ii) to protect the Services
                    or users; (iii) if required by law; or (iv) for prolonged
                    inactivity.
                  </p>
                </div>
                <div className="mb-2">
                  <p>
                    14.3 Effect Upon termination, (i) licenses granted to you by
                    DevSpot cease; (ii) certain provisions (e.g., Section 6
                    (Content License), 11 (Disclaimers), 12 (Limitation of
                    Liability), 13 (Indemnification)) survive; and (iii) DevSpot
                    may retain archival copies of data as required by law.
                  </p>
                </div>
              </div>

              <div
                id="modifications"
                ref={(el) => {
                  sectionRefs.current.modifications = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  14. MODIFICATIONS TO THE SERVICES & TERMS
                </h2>
                <p>
                  We may modify the Services or these Terms at any time. We will
                  provide reasonable notice (e.g., via email or posting). Your
                  continued use after changes become effective constitutes
                  acceptance of the revised Terms.
                </p>
              </div>

              <div
                id="governing"
                ref={(el) => {
                  sectionRefs.current.governing = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  15. GOVERNING LAW & DISPUTE RESOLUTION
                </h2>
                <div className=" mb-2">
                  <h3 className=" font-meduim mb-1 uppercase">
                    16.1 Governing Law
                  </h3>
                  <p>
                    These Terms are governed by the laws of the State of
                    California, USA, without regard to conflict‑of‑law
                    principles.
                  </p>
                </div>
                <div className="mb-2">
                  <p>
                    16.2 Arbitration Except for claims that qualify for
                    small‑claims court, any dispute arising out of or relating
                    to the Agreement shall be resolved by confidential, binding
                    arbitration in San Francisco County, California, before a
                    single arbitrator under the JAMS Rules. The arbitrator’s
                    decision is final and may be entered in any court of
                    competent jurisdiction. You waive the right to jury trial
                    and to participate in class actions.
                  </p>
                </div>
                <div className=" mb-2">
                  <p>
                    16.3 Injunctive Relief Nothing in this Section prevents
                    either party from seeking injunctive or equitable relief to
                    protect its intellectual‑property rights.
                  </p>
                </div>
              </div>

              <div
                id="miscellaneous"
                ref={(el) => {
                  sectionRefs.current.miscellaneous = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  16. MISCELLANEOUS
                </h2>
                <p>
                  These Terms constitute the entire agreement between you and
                  DevSpot regarding the use of the Services. If any provision of
                  these Terms is found to be invalid or unenforceable, the
                  remaining provisions shall remain in full force and effect.
                </p>
              </div>

              <div
                id="contact"
                ref={(el) => {
                  sectionRefs.current.contact = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">17. CONTACT</h2>
                <p>
                  For questions about these Terms, please email
                  support@devspot.app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
