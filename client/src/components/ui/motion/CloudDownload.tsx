"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import * as React from "react";

interface CloudDownloadProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  className?: string;
  isAnimating?: boolean;
}

const groupVariants: Variants = {
  normal: { y: 0 },
  animate: { y: [0, 3, 0], transition: { repeat: Infinity } },
};

const AnimatedCloudDownload = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  className,
  isAnimating = false,
  ...props
}: CloudDownloadProps) => {
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
          variants={{ normal: { pathLength: 1, opacity: 1 }, animate: { pathLength: 1, opacity: 1 } }}
          animate={controls}
          initial="normal"
          d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"
        />
        <motion.g variants={groupVariants} animate={controls} initial="normal">
          <path d="M12 13v8l-4-4" />
          <path d="m12 21 4-4" />
        </motion.g>
      </svg>
    </div>
  );
};

export { AnimatedCloudDownload };
