import React from "react";
import { Landing } from "../../../../web/src";
import { useTheme } from "@/context/theme-provider";

export default function LandingProxy() {
  const { theme, toggleTheme } = useTheme();
  return <Landing theme={theme} onToggleTheme={toggleTheme} />;
}


