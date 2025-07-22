"use client";

import Search from "@/components/icons/Search";
import Notifications from "@/components/page-components/dashboard/notifications";
import { useAuthStore } from "@/state";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./AuthButtons";
import UserAvatar from "./UserAvatar";

const TabletNav = () => {
  const { user } = useAuthStore();

  const url = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}`;


  return (
    <nav className="hidden md:flex top-0 left-0 right-0 gap-4 items-center fixed justify-between dark:bg-secondary-bg overflow-hidden px-5 py-2 h-16 border-b-[.5px] border-b-[#2B2B31] z-50">
      <div className="flex gap-4 md:gap-[33px] w-full items-center">
        <Link href={url} className="flex items-center gap-2">
          <Image
            src="/devspot_logo.png"
            alt="logo"
            width={130}
            height={32}
            quality={100}
            priority
            className="max-w-fit"
          />
          <img src="/beta.svg" alt="logo"/>
        </Link>

        <div className="flex items-center border focus-within:dark:border-secondary-text transition-all duration-200 ease-in-out max-w-[510px] min-w-[250px] h-[40px] px-4 gap-4 w-full dark:border-slate-100 rounded-xl dark:bg-tertiary-bg">
          <Search />

          <input
            placeholder="Search for hackathons, companies, developers, events and discussions"
            className="bg-transparent outline-0 placeholder:text-[14px] placeholder:text-secondary-text text-white font-roboto font-normal py-3 w-full rounded-md text-[14px]"
            type="text"
          />
        </div>
      </div>

      <div className="flex w-full max-w-md items-center justify-end gap-3">
        {user && (
          <div className="flex items-center gap-3">
            <Notifications />
            <UserAvatar user={user!} />
          </div>
        )}

        {!user && <AuthButtons />}
      </div>
    </nav>
  );
};

export default TabletNav;
