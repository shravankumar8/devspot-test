"use client";

import React, { useEffect, useRef, useState } from "react";

interface NavItem {
  id: string;
  title: string;
}

const navItems: NavItem[] = [
  { id: "mission", title: "Our Mission" },
  { id: "why", title: "Why We Built DevSpot" },
  { id: "principles", title: "Our Guiding Principles" },
  { id: "bounty", title: "Our Minimum Bounty Requirement" },
  { id: "whyDevspot", title: "Why “DevSpot”?" },
  { id: "where", title: "Where We’re Going" },
];

const About: React.FC = () => {
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
              <h1 className="text-[32px] font-semibold mb-3">Manifesto</h1>
              <p className="text-base text-secondary-text mb-10 font-roboto">
                Last updated May 14, 2025
              </p>

              {/* Section 1: Acceptance of Terms */}
              <div
                id="mission"
                ref={(el) => {
                  sectionRefs.current.mission = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">Our mission</h2>
                <p>
                  DevSpot exists to make building more accessible, inclusive,
                  and human. We’re here to give every builder — no matter where
                  they come from or what stage they’re in — the tools,
                  community, and opportunities to bring ideas to life.
                </p>
              </div>

              {/* Section 3: Account Registration & Security */}
              <div
                id="why"
                ref={(el) => {
                  sectionRefs.current.why = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  Why We Built DevSpot
                </h2>

                <div className="mb-2">
                  <p>
                    We’re not a VC-backed hype machine. We’re just a bunch of
                    builders who saw the hackathon platform market falling short
                    — so we did something about it. Between us, we’ve run
                    hundreds of hackathons over the past two decades. From
                    scrappy weekend sprints to massive open-source competitions.
                    We know what works, what doesn’t, and how frustrating it can
                    be when platforms forget who they’re really for: the
                    builders. So we created DevSpot — a platform that’s open by
                    design, friendly by default, and rooted in community-first
                    values.
                  </p>
                </div>
              </div>

              {/* Section 4: Services Overview */}
              <div
                id="principles"
                ref={(el) => {
                  sectionRefs.current.principles = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  Our Guiding Principles
                </h2>
                <p>
                  Give Back: We’ve been lucky to be part of great communities.
                  It’s our turn to return the favor. Do Our Best: Whether it’s
                  shipping feature or supporting organizers, we show up with our
                  full effort. Make Room for Everyone: Innovation comes from
                  everywhere — and everyone deserves a seat at the table. Value
                  the Builder: We don’t just talk community — we protect its
                  time, talent, and energy.
                </p>
              </div>

              {/* Section 5: Fees & Payments */}
              <div
                id="bounty"
                ref={(el) => {
                  sectionRefs.current.bounty = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  Our Minimum Bounty Requirement
                </h2>

                <div className="mb-2">
                  <p>
                    Every hackathon on DevSpot must offer at least $20,000 USD
                    in total bounties. Why? Because builders invest real time
                    and energy into solving tough challenges. That work deserves
                    respect — and reward. We want every builder to know: if it’s
                    on DevSpot, it’s worth showing up for.
                  </p>
                </div>
              </div>

              {/* Section 6: User Content & License */}
              <div
                id="whyDevspot"
                ref={(el) => {
                  sectionRefs.current.whyDevspot = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">Why “DevSpot”?</h2>

                <div className=" mb-2">
                  <p>
                    Because this isn’t just another tool — it’s your space. A
                    home base for builders. A place to grow. The last profile
                    you should ever need to make. DevSpot runs on a Pay What You
                    Want model. Whether you’re a Fortune 500 giant or a
                    struggling upstart with more passion than runway, we believe
                    access to great hackathon infrastructure shouldn’t be gated
                    by a price tag. We suggest a contribution based on what you
                    can afford — and we hope the big dogs pick up the tab for
                    the little guys. (Looking at you, unicorns. Don’t be
                    stingy.) Your payments help keep DevSpot independent,
                    community-powered, and open to all. Because this is more
                    than a platform. It’s a public good.
                  </p>
                </div>
              </div>

              {/* More sections following the same pattern */}
              <div
                id="where"
                ref={(el) => {
                  sectionRefs.current.where = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  Where We’re Going
                </h2>
                <div className=" mb-2">
                  <p>
                    We’re just getting started. DevSpot is constantly evolving —
                    shaped by our community, powered by the people who use it,
                    and guided by what builders actually need. This isn’t our
                    product — it’s yours. DevSpot Welcome home, builders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
