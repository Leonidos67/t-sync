import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    const routes: { [key: string]: string } = {
      "/": "Главная",
      "/roadmap": "Роадмап",
      "/pricing": "Тарифы",
      "/ai": "AI",
      "/about": "О нас",
      "/help": "Справочный центр",
      "/contact": "Контакты",
      "/services": "Сервисы"
    };
    
    return routes[pathname] || "Страница";
  };

  const currentPage = getPageTitle(location.pathname);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link 
        to="/" 
        className="flex items-center space-x-1 hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Главная</span>
      </Link>
      {location.pathname !== "/" && (
        <>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{currentPage}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
