"use client";

import * as React from "react";
import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";

interface ClipboardCopyProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  className?: string;
  isAnimating?: boolean;
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const ClipboardCopy = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  className,
  isAnimating = false,
  ...props
}: ClipboardCopyProps) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start(isAnimating ? "animate" : "normal");
  }, [isAnimating, controls]);

  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        className="size-4"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v4" />
        <path d="M21 14H11" />
        <motion.path
          variants={{
            normal: { translateX: "0%" },
            animate: { translateX: "-2px" },
          }}
          transition={defaultTransition}
          animate={controls}
          initial="normal"
          d="m15 10-4 4 4 4"
        />
      </svg>
    </div>
  );
};

export { ClipboardCopy };
