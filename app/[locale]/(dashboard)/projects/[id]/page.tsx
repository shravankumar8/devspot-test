"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import useSWR from "swr";

import { ParticipantProject } from "@/components/page-components/projects";
import ProjectPageSkeletonLoader from "@/components/page-components/projects/ProjectPageSkeletonLoader";
import { Projects } from "@/types/entities";
import { toast } from "sonner";

const fetcher = (url: string) =>
  axios.get<Projects>(url).then((res) => res.data);

export default function ProjectPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: project,
    error,
    isLoading,
  } = useSWR<Projects>(`/api/projects/${id}`, fetcher);

  const view = searchParams.get("view");

  // compute ownership flag in one go
  const isOwner: boolean = useMemo(() => {
    if (!project) return false;

    if (view === "preview") {
      return false;
    }
    if (view === "edit") {
      return project.is_owner ?? false;
    }
    return project.is_owner ?? false;
  }, [project, view]);

  useEffect(() => {
    if (!project) return;

    if (project && !Boolean(project?.project_challenges?.length)) {
      toast.error("Please Add Challenges to Project.", {
        position: "top-right",
      });
    }

    if (view === "edit" && !project.is_owner) {
      router.replace(`/${locale}/projects/${id}`);
      return;
    }

    if (!project.submitted && !project.is_owner && !isLoading) {
      router.back();
    }
  }, [project, view, router, locale, id, isLoading]);

  if (error) {
    return router.back();
  }

  if (isLoading || !project) {
    return <ProjectPageSkeletonLoader />;
  }

  return (
    <ParticipantProject
      isProjectDataLoading={isLoading}
      isOwner={isOwner}
      projectData={project}
    />
  );
}
