import { ConnectedAccount } from "@/types/profile";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type Platform = keyof {
  [K in ConnectedAccount as keyof K]: never;
};

interface Stat {
  label: string;
  value: number;
}

interface StatCard {
  platform: Platform;
  url: string;
  stats: Stat[];
}

function transformAccount(account: ConnectedAccount): StatCard {
  const platform = Object.keys(account)[0] as Platform;
  const data = (account as Record<Platform, any>)[platform];

  const { url, ...rest } = data;

  const stats = Object.entries(rest).flatMap(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).map(([subKey, subValue]) => ({
        label: `${key} - ${subKey}`,
        value: Number(subValue),
      }));
    }
    return [{ label: key, value: Number(value) }];
  });

  return {
    platform,
    url,
    stats,
  };
}

const formatNumber = (num: number | undefined) => {
  if (!num) return 0;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return num / 1_000 + "K";
  return num.toString();
};

interface StatCardProps {
  data: ConnectedAccount;
}

const logoLibrary: Partial<Record<Platform, string>> = {
  github: "/github_logo.svg",
  dribble: "/dribble.png",
  gitlab: "/gitlab-logo.png",
  spotify: "/spotify.png",
  stack_overflow: "/Stack.png",
  linkedin_oidc: "/linkedin-logo.png",
};

const StatCard = (props: StatCardProps) => {
  const statCard = transformAccount(props.data);

  const { platform, stats, url } = statCard;
  const logo = logoLibrary[platform];

  const [itemsToShow, setItemsToShow] = useState(4);

  const updateItemsToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width < 430) setItemsToShow(2);
    else if (width >= 430 && width < 768) setItemsToShow(3);
    else if (width >= 768 && width < 1024) setItemsToShow(4);
    else if (width >= 1024 && width < 1200) setItemsToShow(2);
    else if (width >= 1200 && width < 2050) setItemsToShow(3);
    else if (width >= 2050) setItemsToShow(4);
  }, []);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [updateItemsToShow]);

  const statsToBeRendered = useMemo(
    () => stats.slice(0, itemsToShow),
    [stats, itemsToShow]
  );

  if (platform == "spotify" || platform == 'linkedin_oidc') return null;

  return (
    <a
      href={url}
      target="__blank"
      rel="noopener noreferrer"
      className="bg-devspot-gray-200 border border-devspot-gray-300 w-full h-[60px] rounded-xl flex gap-1 sm:gap-3 overflow-hidden"
    >
      <div className="flex items-center justify-center bg-[#1B1B22] h-[60px] w-[42px]">
        <Image
          width={24}
          height={24}
          src={logo!}
          alt={platform}
          className="h-6 w-6 object-cover"
        />
      </div>

      <div className="flex items-center justify-center gap-2 w-[80%] h-[60px] overflow-scroll">
        {statsToBeRendered.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <div className="flex flex-col items-center gap-0 flex-shrink-0 min-w-[50px]">
              <span className="text-white font-roboto text-sm font-medium leading-6 text-center">
                {formatNumber(stat.value)}
              </span>
              <span className="text-devspot-gray-400 font-roboto text-[0.625rem] font-medium leading-3 text-center">
                {stat.label}
              </span>
            </div>

            {index < statsToBeRendered.length - 1 && (
              <div className="bg-devspot-gray-300 w-0.5 h-11 flex-shrink-0"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </a>
  );
};

export default StatCard;
