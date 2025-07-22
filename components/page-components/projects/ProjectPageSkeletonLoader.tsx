import { AboutSectionSkeleton } from "./About/AboutSkeletonLoader";
import { ChallengeSectionSkeleton } from "./Challenges/ChallengeSkeletonLoader";
import { ProjectHeaderSkeleton } from "./Header/HeaderSkeletonLoader";
import { PrizeAllocationSectionSkeleton } from "./PrizeAllocation/PrizeAllocationSkeleton";
import { LinksSectionSkeleton } from "./ProjectLinks/LinkSkeletonLoader";
import { TeamMembersSectionSkeleton } from "./TeamMembers/TeamMemberSkeleton";
import { TechnologiesSectionSkeleton } from "./Technology/TechnologySkeletonLoader";

const ProjectPageSkeletonLoader = () => {
  return (
    <div
      className={`relative flex flex-col w-full items-start gap-4 pointer-events-none `}
    >
      <ProjectHeaderSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 w-full items-start">
        <aside className="lg:col-span-3 flex flex-col gap-3">
          <ChallengeSectionSkeleton />

          <TeamMembersSectionSkeleton />
        </aside>

        <section className="lg:col-span-7 flex flex-col gap-3">
          <div className="grid grid-cols-[55%_43%] gap-3 w-full">
            <LinksSectionSkeleton />
            <AboutSectionSkeleton />
          </div>

          <TechnologiesSectionSkeleton />
          <PrizeAllocationSectionSkeleton />
        </section>
      </div>
    </div>
  );
};

export default ProjectPageSkeletonLoader;
