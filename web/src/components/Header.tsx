import React, { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";

type HeaderProps = {
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
};

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, theme }) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!servicesRef.current) return;
      const target = e.target as Node;
      if (!servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" className="logo" aria-label="T‑Sync главная">T‑Sync</a>
        <nav className="main-nav" aria-label="Главное меню">
          <ul className="nav-center">
            <li><a className="nav-link" href="#pricing">Сервисы</a></li>
            <li><a className="nav-link" href="#pricing">Тарифы</a></li>
            <li><a className="nav-link" href="#roadmap">Роадмап</a></li>
            <li><a className="nav-link" href="#ai">Ai</a></li>
            <li><a className="nav-link" href="#ai">Справочный центр</a></li>
          </ul>
        </nav>
        <div className="cta-group">
          <button
            className="btn btn-ghost theme-toggle"
            aria-label="Переключить тему"
            title="Переключить тему"
            onClick={() => onToggleTheme?.()}
          >
            {theme === 'dark' ? (
              <Sun className="theme-icon" />
            ) : (
              <Moon className="theme-icon" />
            )}
          </button>
          <a className="btn btn-account" href="/login">Мой аккаунт</a>
        </div>
      </div>
    </header>
  );
};

export default Header;


