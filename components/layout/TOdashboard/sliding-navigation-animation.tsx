"use client";

import useSideRoute from "@/hooks/useSideRoute";
import { cn } from "@/utils/tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SubNavItemData } from "./TOSideNav";

interface SlidingNavigationProps {
  subNav: SubNavItemData[];
}
export default function SlidingNavigation({ subNav }: SlidingNavigationProps) {
  const router = useRouter();

  const { isRouteActive } = useSideRoute();

  return (
    <>
      {subNav.map((nav) => {
        const isActive = isRouteActive(nav.activeRoutes);

        return (
          <motion.div
            key={nav.label}
            onClick={() => router.push(nav.href)}
            className={cn(
              "relative py-1.5 text-sm cursor-pointer pl-5 flex gap-2 items-center font-semibold hover:bg-primary-bg/35 transition-all duration-200 ease-in-out overflow-hidden",
              isActive ? "text-white" : "text-secondary-text",
              nav.icon ? "border-t border-t-[#2B2B31] py-2" : "mb-2 w-[105%]"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && nav.icon && (
              <div
                className={`h-[28px] left-3 absolute bg-main-primary rounded-tr-lg rounded-br-lg transition-all duration-200 ease-in-out w-[2px]`}
              ></div>
            )}

            {/* Animated background that slides in/out */}
            <AnimatePresence>
              {isActive && !nav.icon && (
                <motion.div
                  className="absolute inset-0 bg-primary-bg transition-all duration-200 ease-in-out"
                  initial={{
                    scaleX: 0,
                    originX: 0,
                  }}
                  animate={{
                    scaleX: 1.2,
                    originX: 0,
                  }}
                  exit={{
                    scaleX: 0,
                    originX: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    transformOrigin: "left center",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex gap-2 items-center">
              {nav.icon && <div className="size-5">{nav.icon}</div>}
              <motion.span
                animate={{
                  color: isActive ? "#ffffff" : "#89898c",
                }}
                transition={{ duration: 0.2 }}
              >
                {nav.label}
              </motion.span>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
