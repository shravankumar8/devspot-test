import { Projects } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import EmptyState from "../EmptyState";
import ProfileProjectCard from "./ProjectCard";
import ProfileProjectCardSkeleton from "./ProjectCardSkeletonLoader";
import { UserProfile } from "@/types/profile";

const ProfileProjects = ({
  userProfile,
  isOwner,
}: {
  userProfile: UserProfile;
  isOwner: boolean;
}) => {
  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: projects, isLoading } = useSWR<Projects[]>(
    `/api/people/${userProfile?.id}/projects`,
    fetchHackathonInformation
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProfileProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!projects || projects?.length <= 0) {
    return isOwner ? (
      <EmptyState
        title="No projects"
        description="Participate in a hackathon to create a project"
        buttonLabel="hackathons"
        href="/hackathons"
      />
    ) : (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <p className="text-lg text-secondary-text font-medium font-roboto">{`${userProfile?.full_name} doesn't have any projects yet`}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {projects?.map((project, index) => (
        <Link key={project?.id} href={`/en/projects/${project?.id}`}>
          <ProfileProjectCard props={project} key={index} />
        </Link>
      ))}
    </div>
  );
};

export default ProfileProjects;
