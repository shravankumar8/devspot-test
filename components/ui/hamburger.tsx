import { useSidebarStore } from "@/state/sidebar";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";

type HamburgerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Hamburger: React.FC<HamburgerProps> = () => {
   const { toggleSidebar, isOpen } = useSidebarStore();

  return (
    <div
      id="hamburger-1"
      className="cursor-pointer"
      onClick={() => {
        toggleSidebar();
      }}
    >
      <span
        className={`w-[22px] h-[2px] bg-secondary-text my-1 mx-auto block transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-[4px] rotate-[53deg]" : ""
        }`}
      ></span>
      <span
        className={`w-[22px] h-[2px] bg-secondary-text my-1 mx-auto block transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-0" : ""
        }`}
      ></span>
      <span
        className={`w-[22px] h-[2px] bg-secondary-text my-1 mx-auto block transition-all duration-300 ease-in-out ${
          isOpen ? "-translate-y-[10px] -rotate-[50deg]" : ""
        }`}
      ></span>
    </div>
  );
};

export default Hamburger;
