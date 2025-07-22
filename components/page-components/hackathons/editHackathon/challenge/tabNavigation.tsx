import { HackathonChallenges } from "@/types/entities";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { EditChallengePayload } from "./types";

interface ChallengeTabNavigationProps {
  challenges: EditChallengePayload[];
  activeTab: number;
  onTabChange: (tabId: number) => void;
}

export const ChallengeTabNavigation = ({
  challenges,
  activeTab,
  onTabChange,
}: ChallengeTabNavigationProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Auto-scroll to active tab when it changes
  useEffect(() => {
    const activeIndex = challenges.findIndex((c) => c.id === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];
    const container = scrollContainerRef.current;

    if (activeTabElement && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      // Check if tab is out of view
      const isOutOfView =
        tabRect.left < containerRect.left ||
        tabRect.right > containerRect.right;

      if (isOutOfView) {
        // Calculate scroll position to center the tab
        const containerWidth = container.offsetWidth;
        const tabCenter =
          activeTabElement.offsetLeft + activeTabElement.offsetWidth / 2;
        const scrollPosition = tabCenter - containerWidth / 2;

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    }
  }, [activeTab, challenges]);

  return (
    <div className="w-full overflow-x-auto" ref={scrollContainerRef}>
      <div className="flex gap-12 min-w-max relative">
        {challenges.map((challenge, index) => (
          <button
            key={challenge.id}
            ref={(el: HTMLButtonElement | null) => {
              tabRefs.current[index] = el;
            }}
            disabled={!challenge?.id}
            onClick={() => onTabChange(challenge?.id ?? 1)}
            className="py-2 whitespace-nowrap text-sm text-white font-medium transition-colors relative"
          >
            {truncateText(challenge?.challenge_name ?? "")}
            {activeTab === challenge.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-main-primary"
                layoutId="activeTab"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
