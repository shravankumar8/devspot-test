"use client";
import HackathonCategory from "@/components/page-components/dashboard/sections/hackathons";
import PeopleCategory from "@/components/page-components/dashboard/sections/people";
import ProjectCategory from "@/components/page-components/dashboard/sections/projects";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 py-1 md:px-3">
      <h4 className="font-bold text-[28px]">Discover</h4>
      <HackathonCategory />
      <PeopleCategory />
      <ProjectCategory />
    </div>
  );
}
