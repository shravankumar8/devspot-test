import { Button } from "@/components/ui/button";
import { Projects } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectSkeletonCard";

type DiscoverResponse = {
  data: Projects[];
  count: number;
};

const ProjectCategory = () => {
  const fetchDiscoverData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.data as DiscoverResponse;
  };
  const { data: discoverResponse, isLoading } = useSWR<DiscoverResponse>(
    "/api/discover/projects",
    fetchDiscoverData
  );

  const count = discoverResponse?.count ?? 0;
  const projectText = count === 1 ? "project" : "projects";

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="font-roboto flex flex-col gap-2">
        <h2 className="text-xl font-bold">Projects</h2>

        <span className="text-secondary-text text-sm font-medium">
          {`${count} ${projectText} found`}
        </span>

        <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}

        {!isLoading &&
          discoverResponse?.data.map((project) => (
            <ProjectCard key={project.id} props={project} />
          ))}
      </div>
      <div className="w-full flex justify-center mt-4 mb-10">
        <Link href="/projects">
          <Button variant="ghost">Browse all projects</Button>
        </Link>
      </div>
    </section>
  );
};

export default ProjectCategory;
