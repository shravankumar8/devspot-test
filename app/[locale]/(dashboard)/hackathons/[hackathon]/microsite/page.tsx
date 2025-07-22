"use client";

import { PlGenesisIcon, PlGenesisIcon2 } from "@/components/icons/Account";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuthStore } from "@/state";
import { sendGAEvent } from "@next/third-parties/google";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import CategoryBadge from "./category-badge";
import AccordionFAQ from "./faq";
import MentorCard from "./mentor-card";
import ScheduleItem from "./schedule-item";
import SponsorCard from "./sponsor-card";

const Index = () => {
  const isMobile = useIsMobile();

  const { user } = useAuthStore();

  const sponsors = [
    { name: "Protocol Labs", logo: "/protocol.svg" },
    { name: "Filecoin Foundation", logo: "/filecon.svg" },
    { name: "Near Protocol", logo: "/near-protocol.svg" },
    { name: "Moss AI", logo: "/moss.svg" },
    { name: "Space Meridian", logo: "/space.svg" },
    { name: "NounsDAO", logo: "/nouns.svg" },
    { name: "Glitter Protocol", logo: "/gilter.svg" },
    { name: "Swan Chain", logo: "/swan.svg" },
    { name: "Butter", logo: "/butter.svg" },
    { name: "GPCHarvard University", logo: "/gpc.svg" },
  ];

  const scheduleData = {
    thursday: [{ time: "8:00 AM - 9:30 AM", event: "Kick-off Presentation" }],
    friday: [
      { time: "9:30 AM", event: "Hackathon begins" },
      { time: "11:00 AM - 12:00 PM", event: "Azure AI Workshop" },
      { time: "2:00 PM - 2:30 PM", event: "The Future of Web3" },
    ],
    saturday: [
      { time: "10:00 AM - 11:30 AM", event: "Blockchain Workshop" },
      { time: "1:00 PM - 2:00 PM", event: "Team Networking" },
      { time: "6:00 PM", event: "Project Submissions Due" },
    ],
  };

  const taglines = [
    {
      title: "Secure, Sovereign Systems",
      tags: [
        "Privacy & Data Sovereignty",
        "ZK-Proofs",
        "Censorship Resistance",
        "Advanced Cryptography",
      ],
    },
    {
      title: "AI & Autonomous Infrastructure",
      tags: [
        "On-Chain Governance",
        "Incentive Mechanisms",
        "Open-Source Funding",
        "Decentralized Science",
      ],
    },
    {
      title: "Decentralized Economies, Governance & Science",
      tags: ["AI Agents", "Machine Learning", "Data Infrastructure"],
    },
  ];
  const faqs = [
    {
      question: "Is there an application process to sign up?",
      answer:
        "No, anyone can participate in the hackathon. Simply click the join hackathon button to get started.",
    },
    {
      question: "Will technical support be provided during the competition?",
      answer:
        "Yes, our mentors will be available throughout the hackathon to provide technical support and guidance.",
    },
    {
      question:
        "Can I submit a world that’s already been released / published?",
      answer:
        "No, all projects must be original and created during the hackathon period.",
    },
    {
      question: "Should I submit my entry for compatibility testing? ",
      answer:
        "Yes, all entries should be compatible with major browsers and devices for the best judging experience.",
    },
  ];

  const mentors = [
    {
      name: "Kathryn Brown",
      position: "HEAD ARCHITECT",
      company: "PROTOCOL LABS",
      imageSrc: "/person1.png",
    },
    {
      name: "Juan Scott",
      position: "FRONTEND WEB3 DEVELOPER",
      company: "ETHEREUM.ORG",
      imageSrc: "/person2.png",
    },
    {
      name: "Molly Macauley",
      position: "BLOCKCHAIN DATA SCIENTIST",
      company: "IPFS TECHNOLOGIES",
      imageSrc: "/person3.png",
    },
    {
      name: "Adeniji Omon",
      position: "SMART CONTRACT EXPERT",
      company: "FILECOIN",
      imageSrc: "/person4.png",
    },
    {
      name: "Michael O'Gallagher",
      position: "SYSTEM ARCHITECT",
      company: "LIBP2P",
      imageSrc: "/person5.png",
    },
    {
      name: "Clark Gutierrez",
      position: "SENIOR SOFTWARE ENGINEER",
      company: "WEB3.STORAGE",
      imageSrc: "/person6.png",
    },
    {
      name: "Ana Benson",
      position: "HEAD OF PRODUCT",
      company: "IPFS VENTURES",
      imageSrc: "/person7.png",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-blackest-600">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-8 pl-bg h-[calc(100vh-65px)]">
          <div className="grid place-content-center h-full w-full">
            <div className="flex md:justify-start justify-center items-end mb-4">
              <PlGenesisIcon
                width={isMobile ? "150px" : "204px"}
                height={isMobile ? "150px" : "243px"}
              />
              <PlGenesisIcon2
                width={isMobile ? "150px" : "500px"}
                height={isMobile ? "50px" : "80px"}
              />
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-2 md:items-center  mb-12 justify-center">
              <p className="text-white text-center text-lg sm:text-[28px] font-bold">
                <span className="text-[#9DC842] mr-1">Modular World's</span>
                is the flagship hackathon of the Protocol <br /> Labs Genesis
                Hackathon Series.
              </p>
            </div>

            <div className="mt-6 flex flex-col  gap-4 items-center">
              <div className="flex gap-2 items-center">
                <div className="rounded-md overflow-hidden w-44">
                  <img
                    src="/protocol.png"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              <div className="text-white font-semibold text-lg font-roboto">
                May 24 — June 25, 2023
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Link
              onClick={() => {
                if (process.env.NODE_ENV === "production") {
                  sendGAEvent("event", "join_hackathon_click", {
                    value: "yes",
                  });
                  if (window.twq) {
                    window.twq("track", "Purchase", {
                      value: 0,
                      currency: "USD",
                    });
                  }
                }
              }}
              href={`${
                user
                  ? "/hackathons/1"
                  : `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/en/sign-up`
              }`}
              className="bg-[#77A53B] hover:bg-[#90c44e] transition-all ease-in duration-200 text-white font-medium py-2 px-6 rounded-md flex items-center cursor-pointer gap-2 font-roboto text-lg "
            >
              <span className="flex items-center gap-2 text-white">
                <PlusIcon /> Join Hackathon
              </span>
            </Link>
          </div>
        </section>

        {/* Prize Section */}
        <section className="pt-16 px-4 sm:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-[28px] sm:text-[32px] lg:text-[56px] font-semibold text-center">
              $200,000 available in prizes
            </h2>

            <p className="text-white font-roboto text-center text-xl mt-2">
              Our sponsors
            </p>

            <div className="flex justify-center w-full items-center">
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sponsors.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.name}
                    name={sponsor.name}
                    imageSrc={sponsor.logo}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-[200px] px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {taglines.map((item) => (
              <div key={item.title}>
                <h3 className="text-white text-lg lg:text-[28px] lg:leading-[28px] mb-[36px] font-bold">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {item.tags.map((tag) => (
                    <CategoryBadge key={tag}>{tag}</CategoryBadge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-[20px] sm:text-[28px] font-bold mb-8">
              Schedule
            </h2>

            <Tabs defaultValue="thursday">
              <TabsList className="w-full flex bg-transparent mb-6 pb-1 space-x-8">
                <TabsTrigger
                  value="thursday"
                  className="text-white font-semibold data-[state=active]:border-b-2  data-[state=active]:border-b-[#91C152] data-[state=active]:dark:bg-transparent pb-2 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Thursday, May 8
                </TabsTrigger>
                <TabsTrigger
                  value="friday"
                  className="text-white font-semibold  data-[state=active]:border-b-2  data-[state=active]:border-b-[#91C152] data-[state=active]:dark:bg-transparent pb-2 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Friday, May 9
                </TabsTrigger>
                <TabsTrigger
                  value="saturday"
                  className="text-white font-semibold  data-[state=active]:border-b-2  data-[state=active]:border-b-[#91C152] data-[state=active]:dark:bg-transparent pb-2 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Saturday, May 10
                </TabsTrigger>
              </TabsList>

              <TabsContent value="thursday" className="mt-4">
                {scheduleData.thursday.map((item, index) => (
                  <ScheduleItem
                    key={`thursday-${index}`}
                    time={item.time}
                    event={item.event}
                  />
                ))}
              </TabsContent>

              <TabsContent value="friday" className="mt-4">
                {scheduleData.friday.map((item, index) => (
                  <ScheduleItem
                    key={`friday-${index}`}
                    time={item.time}
                    event={item.event}
                  />
                ))}
              </TabsContent>

              <TabsContent value="saturday" className="mt-4">
                {scheduleData.saturday.map((item, index) => (
                  <ScheduleItem
                    key={`saturday-${index}`}
                    time={item.time}
                    event={item.event}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Judges & Mentors Section */}
        <section className="py-[200px] px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-[20px] sm:text-[28px] font-bold mb-[60px]">
              Judges, Speakers, and Mentors
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-9">
              {mentors.map((mentor, index) => (
                <MentorCard
                  key={index}
                  name={mentor.name}
                  position={mentor.position}
                  company={mentor.company}
                  imageSrc={mentor.imageSrc}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="sm:px-8 px-4 pb-[140px]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-[20px] sm:text-[28px] font-bold mb-8">
              FAQ
            </h2>

            <div className="w-full mt-[40px]">
              <AccordionFAQ faqs={faqs} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
