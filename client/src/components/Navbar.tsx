import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Sun, Moon, ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";
import { DownloadDropdown } from "./download-dropdown";
import Logo from "@/components/logo";
import SocialLogo from "@/components/logo/social-logo";
import PragmaLogo from "@/components/logo/pragma-logo";
import IdLogo from "@/components/logo/id-logo";

const navItems = [
  { name: "Тарифы", path: "/pricing" },
  { name: "Роадмап", path: "/roadmap" },
  { name: "AI", path: "/ai" },
  // { name: "О нас", path: "/about" },
  // { name: "Контакты", path: "/contact" },
  { name: "Справочный центр", path: "/help", external: true },
];

const servicesCategories = [
  {
    title: "Наши сервисы",
    items: [
      {
        title: "Aurora Rise",
        description: "Ведение тренировочного процесса",
        path: "/services#platform",
        isLogo: true,
      },
      {
        title: "Volt",
        description: "Социальная сеть для спортсменов",
        path: "/services#volt",
        isVolt: true,
      },
      {
        title: "Pragma",
        description: "Создание сайта-визитки",
        path: "/services#pragma",
        isPragma: true,
      },
      {
        title: "Aurora ID",
        description: "Единый аккаунт экосистемы Aurora",
        path: "/services#id",
        isId: true,
      },
      // {
      //   title: "Все сервисы",
      //   path: "/services",
      //   isSpecial: true,
      // },
    ],
  },
  {
    title: "Быстрое начало",
    items: [
      {
        title: "Создать рабочее пространство",
        description: "Начните работу с командой",
        path: "/workspace/create",
        icon: "🏢",
      },
      {
        title: "Создать проект",
        description: "Новый спортивный проект",
        path: "/projects/create",
        icon: "📋",
      },
      {
        title: "Добавить спортсмена",
        description: "Пригласите нового участника",
        path: "/members/add",
        icon: "👤",
      },
      {
        title: "Запланировать тренировку",
        description: "Создайте новую задачу",
        path: "/tasks/create",
        icon: "📅",
      },
      {
        title: "Просмотр статистики",
        description: "Анализ прогресса команды",
        path: "/analytics",
        icon: "📊",
      },
      {
        title: "Шаблоны тренировок",
        description: "Готовые решения",
        path: "/templates",
        icon: "📝",
      },
      {
        title: "Настройки профиля",
        description: "Управление аккаунтом",
        path: "/settings",
        icon: "⚙️",
      },
      {
        title: "Документация",
        description: "Руководство пользователя",
        path: "/docs",
        icon: "📖",
      },
    ],
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const auroraRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Функция для переключения меню по клику
  const toggleAuroraMenu = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isServicesOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      // Блокируем скролл
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Восстанавливаем скролл при закрытии
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isServicesOpen]);

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
            <div ref={auroraRef} className="relative">
              <Button 
                variant="ghost" 
                className={`flex items-center gap-1 transition-colors ${
                  isServicesOpen
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={toggleAuroraMenu}
              >
                Aurora
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isServicesOpen ? "rotate-180" : "rotate-0"
                  }`} 
                />
              </Button>
            </div>
            
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`group relative ${
                    isActive(item.path)
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-colors`}
                >
                  {item.name}
                  {item.external && (
                    <ArrowUpRight className="w-3 h-3 ml-1 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button className="bg-foreground text-background hover:bg-foreground/90 transition-colors">
              Мой аккаунт
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border animate-fade-in">
            <div className="px-2 py-1 text-sm font-medium text-muted-foreground">Aurora</div>
            {servicesCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {category.title}
                </div>
                {category.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70 mt-1">{item.description}</div>
                  </Link>
                ))}
              </div>
            ))}
            <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer flex items-center justify-between px-4 py-2 text-primary hover:bg-accent rounded-lg transition-colors border-t border-border mt-2 pt-3"
            >
              <span className="font-medium">Все сервисы</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start group relative ${
                    isActive(item.path)
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                  {item.external && (
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </Button>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{theme === 'dark' ? 'Светлая тема' : 'Темная тема'}</span>
                </button>
              </div>
              <DownloadDropdown 
                size="lg" 
                className="w-full"
                buttonText="Скачать"
              />
              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                Войти
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Aurora Dropdown Menu - Full Screen */}
    {isServicesOpen && (
      <div 
        className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur-md shadow-lg"
      >
        <div className="h-full flex flex-col">

          {/* Services Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column - Основные платформы */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center lg:text-left">
                    {servicesCategories[0].title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border hover:shadow-lg rounded-lg">
                    {servicesCategories[0].items.map((service, serviceIndex) => (
                      <Link
                        key={serviceIndex}
                        to={service.path}
                        onClick={() => setIsServicesOpen(false)}
                        className={`group p-4 transition-all duration-300 block ${
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (service as any).isSpecial
                            ? 'bg-foreground dark:bg-foreground text-background dark:text-background'
                            : ''
                        }`}
                      >
                        <div className="flex flex-col items-center text-center gap-3">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(service as any).isSpecial ? (
                            <>
                              <div className="flex flex-col items-center justify-center gap-1 min-h-[4rem]">
                                <h4 className="text-lg font-bold text-background dark:text-background transition-colors flex items-center gap-1">
                                  {service.title}
                                </h4>
                                <ArrowUpRight className="w-12 h-12 text-background dark:text-background opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </div>
                            </>
                          ) : (
                            <>
                               <div className="flex items-center justify-center w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                 {(service as any).isLogo ? (
                                   <div className="scale-[2]">
                                     <Logo url={null} />
                                   </div>
                                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                 ) : (service as any).isVolt ? (
                                   <div className="scale-[2]">
                                     <SocialLogo url={null} />
                                   </div>
                                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                 ) : (service as any).isPragma ? (
                                   <div className="scale-[2]">
                                     <PragmaLogo url={null} />
                                   </div>
                                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                 ) : (service as any).isId ? (
                                   <div className="scale-[2]">
                                     <IdLogo url={null} />
                                   </div>
                                 ) : (
                                   <div className="text-5xl">
                                     {('icon' in service) ? (service.icon as React.ReactNode) : null}
                                   </div>
                            )}
                          </div>
                               <div className="relative">
                                 <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              {service.title}
                            </h4>
                                 {service.description && (
                                   <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                              {service.description}
                                     <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                                   </div>
                                 )}
                          </div>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Быстрое начало */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-foreground mb-2 text-center lg:text-left">
                      {servicesCategories[1].title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {servicesCategories[1].items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          onClick={() => setIsServicesOpen(false)}
                          className="group p-4 transition-all duration-300 block hover:bg-accent/50 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 flex-shrink-0 text-3xl group-hover:scale-110 transition-transform duration-300">
                              {('icon' in item) ? (item.icon as React.ReactNode) : null}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Hero Content */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20 h-full flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                      Уже доступно!
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6 text-center leading-relaxed">
                      Попробуйте настольное приложение Aurora Rise Platform для более быстрого взаимодействия.{" "}
                      <a
                         href="/"
                         className="group text-sm hover:text-sky-500 transition-all duration-300 underline-offset-4 hover:underline decoration-sky-400 inline-flex items-center"
                       >
                         Узнать больше
                         <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                       </a>
                    </p>
                    
                    {/* Image */}
                    <div className="relative rounded-t-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 aspect-video">
                      <img 
                        src="https://ultima.storytale.io/img/come-together/1x/19.webp" 
                        alt="Aurora Services" 
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute rounded-b-3xl inset-0 bg-gradient-to-br from-primary/30 to-transparent flex items-center justify-center text-4xl opacity-50" style={{display: 'none'}}>
                        🚀
                      </div>
                    </div>
                    
                    <div className="flex justify-center rounded-b-3xl bg-primary px-4 md:px-0">
                      <DownloadDropdown 
                      size="lg" 
                        className="text-primary-foreground hover:bg-primary/90 transition-colors w-full md:w-auto"
                        buttonText="Скачать"
                      />
                    </div>
                    
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;