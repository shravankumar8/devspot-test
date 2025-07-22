"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedWrapperProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedWrapper({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
}: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedGrid({
  children,
  className = "",
  staggerDelay = 0.1,
}: AnimatedGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGridItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.25, 0, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
