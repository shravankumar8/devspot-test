"use client";

import { useAuthStore } from "@/state";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ProfileButton() {
  const { user } = useAuthStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative w-8 h-8 flex items-center justify-center"
          aria-label="Notifications"
        ></button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full border-none p-0"
        side="left"
        align="start"
      >
        <div className="w-[472px] bg-secondary-bg border border-[#2b2b31] rounded-[12px] !z-50 p-4 !font-roboto flex flex-col gap-3 shadow-[0_0_6px_rgba(19,19,26,0.25)]"></div>
      </PopoverContent>
    </Popover>
  );
}
