"use client";

import React, { useEffect, useRef, useState } from "react";

interface NavItem {
  id: string;
  title: string;
}

const navItems: NavItem[] = [
  { id: "pricingModel", title: "Our Pricing Model" },
  { id: "extraCost", title: "What costs extra?" },
  { id: "cost", title: "What is costs us" },
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

  const features = [
    {
      name: "Prize Distributions",
      cost: "$500 flat (covers compliance, payout routing, wallet or fiat delivery)",
    },
    {
      name: "Social Media Blast",
      cost: "$250 (to DevSpot X + LinkedIn audience)",
    },
    {
      name: "DevSpot Newsletter Feature",
      cost: "$250 per inclusion",
    },
    {
      name: "Custom Domain Setup",
      cost: "$100",
    },
    {
      name: "JudgeBot Access",
      cost: "$0 (free during beta!)",
    },
    {
      name: "Custom Microsite",
      cost: "$2,500",
    },
  ];

  const category = [
    {
      name: "Infra & Hosting (Supabase, Vercel, integrations)",
      cost: "$500 flat (covers compliance, payout routing, wallet or fiat delivery)",
    },
    {
      name: "Moderation, Support & Bot Monitoring",
      cost: "$250 (to DevSpot X + LinkedIn audience)",
    },
    {
      name: "Platform Maintenance & Dev Time",
      cost: "$250 per inclusion",
    },
    {
      name: "Community + Marketing Ops (emails, content, Discord mgmt)",
      cost: "$100",
    },
    {
      name: "Bug Fixes & Feature Improvements per Hackathon",
      cost: "$0 (free during beta!)",
    },
    {
      name: "Total Estimated Cost (per hackathon)",
      cost: "$2,500",
    },
  ];
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
              <h1 className="text-[32px] font-semibold mb-3">Pricing Model</h1>
              <p className="text-base text-secondary-text mb-10 font-roboto">
                Last updated May 14, 2025
              </p>

              <div
                id="pricingModel"
                ref={(el) => {
                  sectionRefs.current.pricingModel = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  Our Pricing Model
                </h2>
                <p>
                  DevSpot runs on a Pay What You Want model — because we believe
                  everyone should have access to world-class hackathon
                  infrastructure. Whether you’re a Fortune 500 or a scrappy
                  upstart with more passion than money, you decide what you pay.
                  We just ask you to keep one thing in mind: builders are giving
                  you their time — make it worth it. And if you’re one of the
                  big guys, we’re counting on you to pick up the tab for the
                  rest of the internet. (Don’t embarrass yourself.)
                </p>
              </div>

              <div
                id="extraCost"
                ref={(el) => {
                  sectionRefs.current.extraCost = el;
                }}
                className="pb-5 font-roboto text-sm"
              >
                <h2 className=" font-meduim mb-1 uppercase">
                  What Costs Extra?
                </h2>
                <p>
                  The core platform is open to all — but if you want more
                  visibility or convenience, we offer additional services at
                  fixed rates:
                </p>
                <div>
                  <div className="w-full max-w-4xl mx-auto text-white p-6 rounded-lg">
                    <div className="relative grid grid-cols-2 gap-0">
                      {/* Vertical divider line */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#2B2B31] -translate-x-1/2"></div>

                      {/* Header Row */}
                      <div className="border-b border-[#2B2B31] py-4 px-6 ">
                        FEATURE
                      </div>
                      <div className="border-b border-[#2B2B31] py-4 px-6 ">
                        COST
                      </div>

                      {/* Feature Rows */}
                      {features.map((feature, index) => (
                        <>
                          <div
                            key={`name-${index}`}
                            className="border-b border-[#2B2B31] py-6 px-6"
                          >
                            {feature.name}
                          </div>
                          <div
                            key={`cost-${index}`}
                            className="border-b border-[#2B2B31] py-6 px-6"
                          >
                            {feature.cost}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  id="cost"
                  ref={(el) => {
                    sectionRefs.current.cost = el;
                  }}
                >
                  <p className=" font-meduim mb-1 uppercase">
                    What it Costs us
                  </p>
                  <p>
                    What It Actually Costs to Power a Hackathon on DevSpot We
                    want to be transparent. Here’s what it costs us (on average)
                    to run a single hackathon:
                  </p>
                  <div className="w-full max-w-4xl mx-auto text-white p-6 rounded-lg">
                    <div className="relative grid grid-cols-2 gap-0">
                      {/* Vertical divider line */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#2B2B31] -translate-x-1/2"></div>

                      {/* Header Row */}
                      <div className="border-b border-[#2B2B31] py-4 px-6 uppercase">
                        Category
                      </div>
                      <div className="border-b border-[#2B2B31] py-4 px-6 uppercase">
                        estimated cost
                      </div>

                      {/* Feature Rows */}
                      {category.map((feature, index) => (
                        <>
                          <div
                            key={`name-${index}`}
                            className="border-b border-[#2B2B31] py-6 px-6"
                          >
                            {feature.name}
                          </div>
                          <div
                            key={`cost-${index}`}
                            className="border-b border-[#2B2B31] py-6 px-6"
                          >
                            {feature.cost}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4">
                    So when we say “pay what you want,” we mean it — but this is
                    what it actually takes to deliver a great experience. If you
                    can cover that (or more), you’re helping everyone win.
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
