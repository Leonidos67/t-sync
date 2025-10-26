import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WebHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuroraOpen, setIsAuroraOpen] = useState(false);
  const location = useLocation();
  const auroraRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const navItems = [
    { name: "Тарифы", path: "/pricing" },
    { name: "Роадмап", path: "/roadmap" },
    { name: "AI", path: "/ai" },
    { name: "Справочный центр", path: "/help" },
  ];

  const auroraServices = [
    {
      title: "Aurora Rise Platform",
      description: "Ведение тренировочного процесса",
      path: "/services#platform",
      icon: "🏋️‍♂️",
    },
    {
      title: "Pragma Aurora Rise",
      description: "Создание сайта-визитки",
      path: "/services#pragma",
      icon: "🌐",
    },
    {
      title: "Aurora Volt",
      description: "Социальная сеть для спортсменов",
      path: "/services#volt",
      icon: "⚡",
    },
    {
      title: "Aurora Rise ID",
      description: "Единый аккаунт экосистемы",
      path: "/services#id",
      icon: "🆔",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Функции для управления hover состоянием
  const showAuroraMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAuroraOpen(true);
  };

  const hideAuroraMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setIsAuroraOpen(false);
    }, 200);
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <Sparkles className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors" />
              <span className="text-xl font-bold gradient-text">Aurora Rise</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Aurora Dropdown */}
              <div 
                ref={auroraRef} 
                className="relative"
                onMouseEnter={showAuroraMenu}
                onMouseLeave={hideAuroraMenu}
              >
                <button
                  className={cn(
                    "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isAuroraOpen
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span>Aurora</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isAuroraOpen && "rotate-180")} />
                </button>
              </div>

              {/* Other Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Aurora Dropdown Menu - Full Screen */}
      {isAuroraOpen && (
        <div 
          className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur-md shadow-lg"
          onMouseEnter={showAuroraMenu}
          onMouseLeave={hideAuroraMenu}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-border bg-background/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-6">
                <h2 className="text-3xl font-bold text-foreground mb-2">Наши сервисы</h2>
                <p className="text-muted-foreground">Выберите подходящий сервис для ваших потребностей</p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                  {auroraServices.map((service, index) => (
                    <Link
                      key={index}
                      to={service.path}
                      onClick={() => setIsAuroraOpen(false)}
                      className="group p-8 rounded-xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 hover:bg-card"
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* All Services Button */}
                <div className="text-center mt-12">
                  <Link
                    to="/services"
                    onClick={() => setIsAuroraOpen(false)}
                    className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    Все сервисы
                    <ChevronDown className="ml-2 w-5 h-5 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {/* Aurora Services in Mobile */}
              <div className="pb-4 border-b border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Aurora Services</h3>
                <div className="space-y-2">
                  {auroraServices.map((service, index) => (
                    <Link
                      key={index}
                      to={service.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="text-lg">{service.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{service.title}</div>
                        <div className="text-xs text-muted-foreground">{service.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebHeader;

