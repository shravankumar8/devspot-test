"use client";

import { DiscordIcon } from "@/components/icons/Account";
import { ExternalLinkIcon } from "@/components/icons/Discover";
import ChallengeTab from "@/components/layout/tabs/hackathons/ChallengeTab";

import Laptop from "@/components/icons/Laptop";
import { Hackathons, HackathonVips } from "@/types/entities";
import { formatDate } from "@/utils/date";
import axios from "axios";
import Link from "next/link";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import useSWR from "swr";
import { CalendarSvg } from "../../../icons/Calendar";
import { LocationSvg, UserSvg } from "../../../icons/Location";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { EditHackathonDetails } from "../editHackathon/details";
import { EditHackathonResources } from "../editHackathon/resources";
import { EditVIPs } from "../editHackathon/vips";
import { EditHackathonAbout } from "../EditHackathonAbout";
import { EditHackathonSchedule } from "../editHackathon/schedule/index";
import AboutAndChallengesSkeleton from "./aboutSkeletonLoader";
import SidebarSkeleton from "./skeletonLoader";

export const HackathonOverview = ({
  hackathonId,
  setSelectedTab,
  isOwner,
}: {
  hackathonId: string;
  isOwner: boolean;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}) => {
  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: hackathon, isLoading } = useSWR<Hackathons>(
    `/api/hackathons/${hackathonId}/overview`,
    fetchHackathonInformation
  );

  const { data: vips, isLoading: isVipLoading } = useSWR<HackathonVips[]>(
    `/api/hackathons/${hackathonId}/vips`,
    fetchHackathonInformation
  );

  const readableEndDate = hackathon?.end_date
    ? new Date(hackathon.end_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";
  const readableStartDate = hackathon?.start_date
    ? new Date(hackathon.start_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";
  const [showFull, setShowFull] = useState(false);

  const toggleShow = () => {
    setShowFull((prev) => !prev);
  };

  const [switchLoader, setSwitchLoader] = useState(false);
  const { mutate } = useSWR(`/api/hackathons/${hackathonId}/overview`);

  const handleSwitch = async () => {
    setSwitchLoader(true);
    try {
      await axios.put(`/api/hackathons/${hackathonId}/looking-for-team`, {
        status: !hackathon?.looking_for_teammates,
      });

      mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setSwitchLoader(false);
    }
  };

  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(
    null
  );

  const handleClickResource = async (id: number) => {
    await axios.patch(`/api/hackathons/${hackathonId}/resources/${id}`);
  };

  const hackathonResources = useMemo(() => {
    if (!hackathon?.resources) {
      return [];
    }

    const resourcesToShow = hackathon.resources.filter((item) => {
      // If no challenge is selected, return all resources
      if (!selectedChallengeId) {
        return true;
      }

      if (item.challenge_id === selectedChallengeId) {
        return true;
      }

      return (
        item.challenges?.some(
          (challenge) => challenge.challenge_id === selectedChallengeId
        ) ?? false
      );
    });

    // Limit to first 5 resources
    return resourcesToShow.slice(0, 5);
  }, [selectedChallengeId, hackathon?.resources]);

  return (
    <section className="flex gap-4 lg:flex-row flex-col-reverse">
      {isLoading ? (
        <SidebarSkeleton />
      ) : (
        <aside className="xl:w-[25%] lg:w-[40%] w-[100%] flex flex-col gap-4">
          {hackathon?.application_status == "accepted" && !isOwner && (
            <div>
              <div className="bg-gradient-to-l to-[#4103CE] from-[#010375] rounded-t-[12px] px-4 py-3 flex items-center gap-3">
                {switchLoader ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4075FF] rounded-full animate-spin"></div>
                ) : (
                  <Switch
                    checked={hackathon.looking_for_teammates}
                    onClick={handleSwitch}
                    disabled={switchLoader}
                  />
                )}

                <p className="text-white font-normal text-sm leading-[20px] font-roboto">
                  I'm looking for team members
                </p>
              </div>
              <div className="bg-secondary-bg p-4 rounded-b-[12px]">
                <p className="text-[14px] font-roboto text-secondary-text">
                  Let other participants know that they can send you a request
                  to team up.{" "}
                  <button
                    onClick={() => setSelectedTab("participants")}
                    className="text-white hover:underline"
                  >
                    Browse participants
                  </button>{" "}
                  to find team members.
                </p>
              </div>
            </div>
          )}

          <div className="w-full bg-[#1B1B22] p-5 rounded-[12px] relative ">
            <div className="flex items-center gap-4 mb-2 pb-3 font-roboto">
              <TbWorld size={20} color="#4E52F5" />
              <span className="text-[#89898C] text-[13px] capitalize">
                {`${hackathon?.type} hackathon`}
              </span>
            </div>
            {hackathon?.location && (
              <div className="flex items-center gap-4 mb-2 pb-3 font-roboto">
                <LocationSvg width="20px" height="20px" />
                <span className="text-[#89898C] text-[13px]">
                  {hackathon?.location}
                </span>
              </div>
            )}
            <div className="flex items-center gap-4 mb-2 pb-3 font-roboto">
              <CalendarSvg width="20px" height="20px" />
              <span className="text-[#89898C] text-[13px]">{`${readableStartDate} - ${readableEndDate}`}</span>
            </div>

            <div className="flex items-center gap-4 font-roboto mb-4">
              <UserSvg width="20px" height="20px" />
              <span className="text-[#89898C] text-[13px]">
                {hackathon?.number_of_participants} Participants
              </span>
            </div>
            <div className="flex items-center gap-4 font-roboto mb-4">
              <Laptop
                width="20px"
                height="20px"
                color="#4E52F5"
                className="w-5 h-5"
              />
              <span className="text-[#89898C] text-[13px]">
                {hackathon?.projectCounts?.submitted}/
                {hackathon?.projectCounts?.total} Projects submitted
              </span>
            </div>

            {hackathon?.application_status === "accepted" && (
              <div className="w-full mb-4">
                <Link target="__blank" href="https://discord.gg/5aSKn7BuPV">
                  <Button className="w-full flex items-center gap-2" size="sm">
                    <DiscordIcon /> Join our Discord
                  </Button>
                </Link>
              </div>
            )}
            <Link
              href="https://drive.google.com/file/d/10WhGckc0U3hxhFRLvd5rO7FnFZkresxX/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="w-full flex items-center gap-2"
                size="sm"
                variant="secondary"
              >
                Hackathon Rules{" "}
                <ExternalLinkIcon color="#FFFFFF" className="text-white" />
              </Button>
            </Link>
            {hackathon?.application_status !== "accepted" && (
              <div className="w-full">
                {hackathon?.deadline_to_join && (
                  <>
                    <div className="h-[2px] w-full bg-tertiary-bg rounded-[20px] my-4"></div>
                    <div>
                      <p className="text-secondary-text uppercase text-xs font-normal font-roboto">
                        deadline to join hackathon
                      </p>
                      <p className="font-roboto text-xs font-normal mt-1">
                        {formatDate(hackathon?.deadline_to_join)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {hackathon && isOwner && (
              <EditHackathonDetails hackathonData={hackathon} />
            )}
          </div>

          {hackathon?.upcomingSession && (
            <div className="w-full bg-[#1B1B22] p-5 rounded-[12px] relative">
              <div className="w-fit py-1 text-[12px] px-2 text-[#EFC210] bg-[#6E5B1B] font-medium rounded-[16px] mb-2">
                UP NEXT
              </div>
              <p className="text-[13px] text-secondary-text mb-2 font-roboto">
                {formatDate(hackathon?.upcomingSession?.start_time!)}
              </p>

              <p className="text-[#FFFFFF] text-[16px] font-roboto mb-2">
                {hackathon?.upcomingSession?.title}
              </p>

              {/* <Button
                className="!text-[#C3A8FF] !rounded-[16px] w-full !h-7 font-roboto !bg-[#3400A8] !text-[13px]"
                size="sm"
              >
                <WebsiteLink />
                web.zoom.us
              </Button> */}
              <Link
                href={{
                  pathname: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}`,
                  query: { activeTab: "schedule" },
                }}
                scroll={true}
                onClick={() => setSelectedTab("schedule")}
                className="flex gap-2 items-center font-roboto uppercase mt-4"
              >
                <span className="text-[#FFFFFF] text-[13px]">
                  View Full schedule
                </span>
                <FaChevronRight className="w-4 h-4 text-[#4E52F5]" />
              </Link>
              {isOwner && (
                <EditHackathonSchedule hackathonId={parseInt(hackathonId)} />
              )}
            </div>
          )}

          <div className="w-full bg-[#1B1B22] p-5 rounded-[12px] relative">
            <p className="text-base text-[#FFFFFF] mb-4 font-roboto font-normal">
              VIPs
            </p>
            <div className="pl-3">
              {isOwner && <EditVIPs hackathonId={parseInt(hackathonId)} />}

              {vips
                ?.filter((vip) => vip.is_featured && vip.status == "accepted")
                ?.map((vip, indx) => (
                  <div key={indx} className="flex gap-3 items-center mb-4">
                    {vip?.users?.avatar_url && (
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img
                          src={vip?.users?.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-roboto text-[#FFFFFF] text-lg font-normal">
                        {vip?.users?.full_name}
                      </p>
                      <p className="font-roboto text-secondary-text text-sm capitalize mt-1">
                        {vip?.hackathon_vip_roles
                          ?.map((role) => role.roles?.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              {/* {Array.isArray(hackathon?.vips) && hackathon.vips.length > 0 ? (
                hackathon.vips.slice(2).map((judge, indx) => (
                  <div key={indx} className="flex gap-2 items-center mb-4">
                    <div className="h-8 w-8 rounded-full">
                      <img src={judge?.pics} alt="" />
                    </div>
                    <div>
                      <p className="font-roboto text-[#FFFFFF] text-[15px]">
                        {judge?.name}
                      </p>
                      <p className="font-roboto text-[#89898C] text-[13px] capitalize">
                        {judge?.role}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">
                  <p className="text-sm font-roboto text-secondary-text">
                    No Judges added yet
                  </p>
                </div>
              )} */}
            </div>

            {/* {Array.isArray(hackathon?.vips) && hackathon.vips.length > 3 && ( */}
            <button
              onClick={() => setSelectedTab("vips")}
              className="flex gap-2 items-center font-roboto uppercase"
            >
              <span className="text-[#FFFFFF] text-[14px]">View ALL</span>
              <FaChevronRight className="w-4 h-4 text-[#4E52F5]" />
            </button>
            {/* )} */}
          </div>
          <div className="w-full bg-[#1B1B22] p-5 rounded-[12px] relative">
            <p className="text-base text-[#FFFFFF] mb-4 font-roboto font-normal">
              Resources
            </p>
            <div className="mb-4">
              {hackathonResources.map((item, indx) => (
                <Link
                  key={indx}
                  onClick={() => handleClickResource(item.id)}
                  target="_blank"
                  href={item?.url ?? "#"}
                  className="font-roboto uppercase text-ellipsis w-42 whitespace-nowrap overflow-hidden text-sm flex gap-2 py-2 items-center"
                >
                  {item?.title}
                  <ExternalLinkIcon />
                </Link>
              ))}
            </div>

            <button
              onClick={() => setSelectedTab("resources")}
              className="flex gap-2 items-center font-roboto uppercase mt-2"
            >
              <span className="text-[#FFFFFF] text-[13px]">View ALL</span>
              <FaChevronRight className="w-4 h-4 text-[#4E52F5]" />
            </button>
            {isOwner && (
              <EditHackathonResources hackathonId={parseInt(hackathonId)} />
            )}
          </div>
        </aside>
      )}
      {isLoading ? (
        <AboutAndChallengesSkeleton />
      ) : (
        <main className="xl:w-[75%] lg:w-[60%] w-[100%]">
          <section
            aria-label="about"
            className="w-full bg-[#1B1B22] py-5 px-6 rounded-[12px] font-roboto relative"
          >
            <p className="text-base text-[#FFFFFF] font-roboto font-normal">
              About
            </p>
            <p className="py-3 text-secondary-text leading-[20px] text-sm font-normal font-roboto whitespace-pre-wrap">
              {hackathon?.description && hackathon.description.length > 500
                ? showFull
                  ? hackathon?.description
                  : `${hackathon?.description?.slice(0, 500)}...`
                : hackathon?.description}
            </p>
            {/* <div className="py-3 text-secondary-text leading-[20px] text-sm font-normal font-roboto">
              <p className="mb-2">
                Welcome to PL_Genesis: Modular Worlds — a global hackathon from
                Protocol Labs to accelerate breakthroughs in the foundational
                layers of the internet. From secure, censorship-resistant
                infrastructure to AI grounded in verifiable truth and economic
                systems that reward open collaboration, this hackathon
                challenges you to reimagine the digital stack for a freer, more
                intelligent world.
              </p>
              <p className="mb-4">
                Join builders around the globe to prototype resilient tools,
                explore new primitives, and unlock the next era of human
                coordination. With $250,000+ in prizes, mentorship from
                ecosystem pioneers, and the chance to join our Founders Forge
                accelerator, this is your gateway to shaping what’s next.
              </p>

              {showFull && (
                <>
                  <div className="h-[2px] bg-[#2B2B31] rounded-full w-full mb-4"></div>
                  <p className="mb-3">
                    Explore the frontiers of open systems. Each track represents
                    a pillar of the new digital stack — choose your focus or
                    weave them together to build the future.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <p className="text-[#4E52F5] mb-1">
                        Secure, Sovereign Systems
                      </p>
                      <p>Reclaim the foundations of trust.</p>
                      <p>
                        Centralized servers, brittle certificates, and
                        state-controlled chokepoints leave our data and speech
                        exposed. This track invites builders to design resilient
                        alternatives — from peer-to-peer messaging that survives
                        network blackouts to zero-knowledge tools that protect
                        privacy without compromising usability. Create
                        infrastructure where users hold the keys, and truth
                        can’t be unplugged.
                      </p>
                    </div>

                    <div>
                      <p className="text-[#4E52F5] mb-1">
                        AI & Autonomous Infrastructure
                      </p>
                      <p>Ground intelligence in open, verifiable systems.</p>
                      <p>
                        AI models are powerful, but without access to
                        transparent, trusted data, they hallucinate more than
                        they help. This track challenges you to build tools that
                        give agents reliable footing — like open knowledge
                        graphs, on-chain provenance tools, and lab assistants
                        that understand scientific workflows. Build smarter
                        machines by grounding them in systems that anyone can
                        verify.
                      </p>
                    </div>

                    <div>
                      <p className="text-[#4E52F5] mb-1">
                        Decentralized Economies, Governance & Science
                      </p>
                      <p>Unlock coordination at the speed of the internet.</p>
                      <p>
                        Innovation is still bottlenecked by slow grants, siloed
                        institutions, and invisible contributions. This track
                        calls for programmable treasuries, real-time reputation
                        proofs, crypto-native public goods tools and open
                        standards for DeSci. Whether you’re tipping code
                        reviewers, running local quadratic funding rounds or
                        building a knowledge-graph stack for science, help build
                        economic engines that reward open collaboration.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div> */}

            {hackathon?.description && hackathon.description.length > 500 && (
              <button
                onClick={toggleShow}
                className="flex gap-2 items-center font-roboto uppercase"
              >
                <span className="text-[#FFFFFF] text-[13px]">
                  {showFull ? "Show Less" : "View more"}
                </span>
                {showFull ? (
                  <FaChevronUp className="w-4 h-4 text-[#4E52F5]" />
                ) : (
                  <FaChevronDown className="w-4 h-4 text-[#4E52F5]" />
                )}
              </button>
            )}
            {hackathon && isOwner && (
              <EditHackathonAbout hackathonData={hackathon} />
            )}
          </section>

          {hackathon && (
            <div className="pt-5 w-full">
              <ChallengeTab
                isOwner={isOwner}
                hackathonId={hackathonId}
                setSelectedTab={setSelectedTab}
                setSelectedChallengeId={setSelectedChallengeId}
              />
            </div>
          )}
        </main>
      )}
    </section>
  );
};
