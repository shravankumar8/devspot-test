"use client";

import { Button } from "@/components/ui/button";
import { Projects } from "@/types/entities";
import { PencilIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AboutSection } from "./About";
import { ChallengeSection } from "./Challenges";
import Feedback from "./FeedbackPanel";
import ProjectHeader from "./Header";
import LeaveAndDelete from "./LeaveAndDelete";
import { PrizeAllocationSection } from "./PrizeAllocation";
import { ProgressFooter } from "./ProgressFooter";
import { LinksSection } from "./ProjectLinks";
import VideoSection from "./ProjectLinks/VideoSection";
import { TeamMembersSection } from "./TeamMembers";
import ProjectDetailsSection from "./TeamMembers/ProjectDetailsSection";
import { TechnologiesSection } from "./Technology";

interface ProfileProps {
  projectData: Projects;
  isProjectDataLoading: boolean;
  isOwner: boolean;
  isJudgingToolOpen?: boolean;
  suspiciousFlags?: string;
}

export const ParticipantProject = (props: ProfileProps) => {
  const {
    isOwner: ownerStatus,
    isProjectDataLoading,
    projectData,
    isJudgingToolOpen,
    suspiciousFlags,
  } = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEdit = () => {
    const current = new URLSearchParams(searchParams);
    current.set("view", "edit");

    router.push(`?${current.toString()}`);
  };

  const isPreview = useMemo(() => {
    return Boolean(searchParams.get("view"));
  }, [searchParams]);

  const isExceededDeadline = projectData.hackathons?.deadline_to_submit
    ? new Date() > new Date(projectData.hackathons.deadline_to_submit)
    : false;

  const isOwner = !isExceededDeadline && ownerStatus;

  return (
    <div
      className={`relative flex flex-col w-full items-start gap-4 ${
        isProjectDataLoading && "pointer-events-none"
      }`}
    >
      <ProjectHeader
        project={projectData}
        isOwner={isOwner}
        isLoading={isProjectDataLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 w-full items-stretch">
        <aside className="lg:col-span-3 flex flex-col gap-3">
          <ChallengeSection project={projectData} isOwner={isOwner} />
          <ProjectDetailsSection
            project={projectData}
            suspiciousFlags={suspiciousFlags}
          />
          <TeamMembersSection project={projectData} isOwner={isOwner} />
          <LeaveAndDelete project={projectData} isOwner={isOwner} />
        </aside>

        <section className="lg:col-span-7 flex flex-col gap-3">
          {isJudgingToolOpen ? (
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12">
                <LinksSection project={projectData} isOwner={isOwner} />
              </div>
              <div className="col-span-12">
                <VideoSection project={projectData} isOwner={isOwner} />
              </div>
              <div className="col-span-12">
                <AboutSection
                  project={projectData}
                  isOwner={isOwner}
                  content={projectData?.description}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-3 items-stretch">
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-3 h-full">
                <LinksSection project={projectData} isOwner={isOwner} />
                <div className="block lg:hidden">
                  <VideoSection project={projectData} isOwner={isOwner} />
                </div>
                <div className="h-full">
                  <AboutSection
                    project={projectData}
                    isOwner={isOwner}
                    content={projectData?.description}
                  />
                </div>
              </div>
              <div className="hidden lg:block col-span-12 lg:col-span-5 h-full">
                <VideoSection project={projectData} isOwner={isOwner} />
              </div>
            </div>
          )}

          <div>
            <TechnologiesSection
              project={projectData}
              isOwner={isOwner}
              technologies={projectData.technologies ?? []}
            />
          </div>
          <PrizeAllocationSection project={projectData} isOwner={isOwner} />
        </section>
      </div>

      {isOwner && <ProgressFooter project={projectData} />}

      {isPreview && (
        <Button
          onClick={handleEdit}
          size="sm"
          className="gap-2 flex items-center absolute bottom-0 right-0"
        >
          <PencilIcon size={16} />
          Edit Mode
        </Button>
      )}

      {isOwner && <Feedback project={projectData} />}
    </div>
  );
};
