import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles.css";

type NavLink = {
  id: string;
  label: string;
};

type LandingProps = {
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
};

export const Landing: React.FC<LandingProps> = ({ onToggleTheme, theme }) => {
  return (
    <div className="tsync-landing">
      <Header onToggleTheme={onToggleTheme} theme={theme} />
      <main>
        {/* пустая страница по требованию */}
      </main>
      <Footer />
    </div>
  );
};

export default Landing;


