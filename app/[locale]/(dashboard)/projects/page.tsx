"use client";

import ProjectCard from "@/components/page-components/dashboard/sections/projects/ProjectCard";
import ProjectCardSkeleton from "@/components/page-components/dashboard/sections/projects/ProjectSkeletonCard";
import { Projects } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";

export default function ProjectsPage() {
  const fetchProjects = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as Projects[];
  };

  const { data: project = [], isLoading: isProjectLoading } = useSWR<
    Projects[]
  >(`/api/projects`, fetchProjects);

  const count = project.length ?? 0;
  const projectText = count === 1 ? "project" : "projects";

  return (
    <section className="flex flex-col py-1 md:px-3 gap-5 w-full">
      <div className="font-roboto flex flex-col gap-2">
        <h4 className="font-bold text-[28px]">Projects</h4>

        <span className="text-secondary-text text-sm">
          {`${count} ${projectText} found`}
        </span>

        <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {project.map((project) => (
          <Link key={project?.id} href={`/projects/${project?.id}`}>
            <ProjectCard key={project.id} props={project} />
          </Link>
        ))}

        {isProjectLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
      </div>
    </section>
  );
}
