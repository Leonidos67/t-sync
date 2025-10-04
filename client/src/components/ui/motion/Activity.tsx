"use client";

import { motion, useAnimation } from "motion/react";
import type { Variants } from "motion/react";
import * as React from "react";

interface ActivityProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  className?: string;
  isAnimating?: boolean;
}

const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    pathOffset: 0,
    opacity: 1,
  },
  animate: {
    pathLength: [0, 1],
    pathOffset: [1, 0],
    opacity: [0.3, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

const Activity = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  className,
  isAnimating = false,
  ...props
}: ActivityProps) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start(isAnimating ? "animate" : "normal");
  }, [isAnimating, controls]);

  return (
    <div
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
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
        <motion.path
          d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
          variants={pathVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { Activity };
