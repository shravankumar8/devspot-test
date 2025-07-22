"use client";

import { DevspotIcon } from "@/components/icons/Logo";
import Search from "@/components/icons/Search";
import Notifications from "@/components/page-components/dashboard/notifications";
import Hamburger from "@/components/ui/hamburger";
import { useAuthStore } from "@/state";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AuthButtons from "./AuthButtons";
import UserAvatar from "./UserAvatar";

const MobileNav = () => {
  const { user } = useAuthStore();
  const [openSearch, setOpenSearch] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenSearch(false);
      }
    };

    if (openSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSearch, setOpenSearch]);

  const url = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}`;

  return (
    <nav className="flex md:hidden top-0 left-0 right-0 gap-4 items-center fixed justify-between dark:bg-secondary-bg overflow-hidden px-4 sm:px-5 py-2 h-16 border-b-[.5px] border-b-[#424248] z-50">
      {!openSearch && (
        <div className="flex gap-3 items-center">
          <Hamburger />

          <Link href={url} className="flex items-center gap-2">
            <DevspotIcon className="md:hidden" />
            <img src="/beta.svg" className="w-[40px]" />
          </Link>

          <Search onClick={() => setOpenSearch(true)} />
        </div>
      )}

      <div
        ref={containerRef}
        className={`flex items-center border focus-within:dark:border-secondary-text transition-all duration-200 ease-in-out gap-2 dark:border-slate-100 rounded-xl dark:bg-tertiary-bg h-[40px] ${
          openSearch
            ? "w-full py-2 px-3 visible"
            : "w-0 overflow-hidden p-0 invisible"
        }`}
      >
        <Search />

        <input
          placeholder="Search for hackathons, companies, developers, events and discussions"
          className="bg-transparent outline-0 placeholder:text-xs placeholder:text-secondary-text text-white font-roboto font-normal py-3 w-full rounded-md text-xs"
          type="text"
        />

        <X
          className="w-3 h-3 text-secondary-text"
          onClick={() => setOpenSearch(false)}
        />
      </div>

      {!openSearch && (
        <>
          {user && (
            <div className="flex items-center gap-3">
              <Notifications />
              <UserAvatar user={user!} />
            </div>
          )}

          {!user && <AuthButtons />}
        </>
      )}
    </nav>
  );
};

export default MobileNav;
