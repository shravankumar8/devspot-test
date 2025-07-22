"use client";

import { Projects } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import Image from "next/image";
import { useMemo } from "react";
import { HeaderSkeleton } from "../../profile/Header/SkeletonLoader";
import {
  BACKGROUND_COLORS,
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "../constants/bacakground";
import EditHeaderModal from "./EditHeaderModal";

interface HeaderProps {
  project: Projects;
  isLoading: boolean;
  isOwner: boolean;
}

const ProjectHeader = ({ project, isLoading, isOwner }: HeaderProps) => {
  const getLogoSource = () => {
    if (project?.logo_url) {
      let selectedLogoIndex = LOGO_TEMPLATES.indexOf(project.logo_url);

      if (selectedLogoIndex >= 0) {
        return (
          <div
            className={`${cn(
              selectedLogoIndex % 2 == 0 ? "bg-[#13131a] " : "bg-[#E7E7E8]",
              "md:w-[156px] md:h-[156px] w-24 h-24 flex justify-center items-center"
            )}`}
          >
            <LogoPlaceholder index={selectedLogoIndex} />
          </div>
        );
      }
    }

    return project.logo_url;
  };

  const headerSource = useMemo(() => {
    const url = project?.header_url;

    if (!url) {
      return { type: "color", value: "#2B2B31" };
    }

    const isColor = BACKGROUND_COLORS.includes(url);

    return {
      type: isColor ? "color" : "image",
      value: isColor ? url : url,
    };
  }, [project.header_url]);

  const logoSource = useMemo(getLogoSource, [getLogoSource]);

  const style = useMemo(() => {
    if (headerSource.type === "image") {
      return {
        backgroundImage: `url(${headerSource.value})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      };
    }

    return { backgroundColor: headerSource.value };
  }, [headerSource]);

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <div
      className={cn(
        "relative w-full text-white p-5 gap-4 sm:gap-8 rounded-[20px] flex items-end justify-between ",
        headerSource.type === "image" && "overflow-hidden"
      )}
      style={style}
    >
      {headerSource.type === "image" && (
        <div className="absolute inset-0 bg-black/50 rounded-[20px] z-0" />
      )}

      {/* Left side: Avatar and user details */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-7 z-[1]">
        <div className="flex gap-7 items-end">
          <div className="md:w-[156px] md:h-[156px] w-24 h-24 rounded-[12px] overflow-hidden">
            {logoSource &&
              (typeof logoSource === "string" ? (
                <Image
                  className="block rounded-[12px] object-cover w-full h-full"
                  src={logoSource}
                  alt="Project logo"
                  width={156}
                  height={156}
                />
              ) : (
                logoSource
              ))}
          </div>

          <div className="flex flex-col justify-between gap-3">
            <p className="text-secondary-text capitalize font-medium max-w-[500px] font-roboto">
              {project?.tagline ?? "Your project's tagline"}
            </p>
            <h1 className="md:text-[32px] capitalize text-[24px] font-raleway font-[700] text-white leading-none">
              {project.name ?? "Untitled project"}
            </h1>
          </div>
        </div>
      </div>

      {isOwner && <EditHeaderModal project={project} />}
    </div>
  );
};

export default ProjectHeader;
