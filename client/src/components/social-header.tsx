import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogo from "@/components/logo/social-logo";
import { Input } from "@/components/ui/input";
import { Bell, Settings as SettingsIcon, Plus, Search, Home, Building, Users2, User } from "lucide-react";
// import ServicesMenu from "@/components/services-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/hooks/api/use-auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { searchUsersQueryFn, searchClubsQueryFn } from "@/lib/api";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MobileCreateModal from "@/components/mobile-create-modal";

interface SearchUser {
  _id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  userRole?: "coach" | "athlete" | null;
}

interface SearchClub {
  _id: string;
  name: string;
  username: string;
  description: string;
  creator: {
    _id: string;
    username: string;
    name: string;
    profilePicture: string | null;
    userRole?: "coach" | "athlete" | null;
  };
  members: Array<{
    _id: string;
    username: string;
    name: string;
    profilePicture: string | null;
  }>;
}


// Компонент для анимированной кнопки/ссылки
interface AnimatedMenuItemProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  style?: React.CSSProperties;
}

const AnimatedMenuItem = ({ to, children, className = "", onClick, style }: AnimatedMenuItemProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <Link
      to={to}
      className={`relative transition-all duration-150 active:transition-none ${className} ${
        isPressed ? "scale-95 translate-y-0.5" : "scale-100"
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={onClick}
      style={style}
    >
      {children}
    </Link>
  );
};


// Нижнее мобильное меню
function MobileBottomMenu() {
  const location = useLocation();
  const { data: currentUser } = useAuth();
  const user = currentUser?.user;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Лента */}
          <Link
            to="/u/"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-[20%] ${
              location.pathname === "/u/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Лента</span>
          </Link>

          {/* Клубы */}
          <Link
            to="/u/clubs"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-[20%] ${
              location.pathname === "/u/clubs" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Building className="w-5 h-5" />
            <span className="text-xs font-medium">Клубы</span>
          </Link>

          {/* Создать */}
          <button
            onClick={handleCreateClick}
            className="flex flex-col items-center gap-1 p-4 rounded-xl transition-colors bg-primary text-primary-foreground hover:bg-primary/90 w-[20%]"
          >
            <Plus className="w-5 h-5" />
            {/* <span className="text-xs font-medium">Создать</span> */}
          </button>

          {/* Пользователи */}
          <Link
            to="/u/users"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-[20%] ${
              location.pathname === "/u/users" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Users2 className="w-5 h-5" />
            <span className="text-xs font-medium">Друзья</span>
          </Link>

          {/* Мой аккаунт */}
          <Link
            to={user ? `/u/users/${user.username}` : "/u/settings"}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-[20%] ${
              location.pathname === `/u/users/${user?.username}` ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Профиль</span>
          </Link>
        </div>
      </div>
      
      {/* Модальное окно создания */}
      <MobileCreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        isAuthenticated={!!user}
      />
    </div>
  );
}

const SocialHeader = () => {
  const { data: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const user = currentUser?.user;
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [clubSearchResults, setClubSearchResults] = useState<SearchClub[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'users' | 'clubs'>('users');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setClubSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      if (searchType === 'users') {
        const data = await searchUsersQueryFn(query);
        setSearchResults(data.users || []);
        setClubSearchResults([]);
      } else {
        const data = await searchClubsQueryFn(query);
        setClubSearchResults(data.clubs || []);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setClubSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchType]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (search.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(search);
      }, 300);
    } else {
      setSearchResults([]);
      setClubSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, searchType, handleSearch]);

  const handleSearchInputFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearchInputBlur = () => {
    // Не закрываем окно при потере фокуса, чтобы пользователь мог кликнуть на результат
  };

  const handleUserClick = () => {
    setIsSearchOpen(false);
    setSearch("");
    setSearchResults([]);
    setClubSearchResults([]);
  };

  // Закрытие при клике вне поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchResults([]);
        setClubSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isSearchOpen]);

  return (
    <>
    <header className="w-full bg-background px-2 sm:px-4 py-2 flex items-center gap-2 sm:gap-2 sticky top-0 z-50 text-foreground">
      
      {/* Иконка поворота и логотип */}
      <div className="flex items-center gap-2 relative">
        <Link to="/u/" className="flex items-center gap-0 sm:gap-1 hover:opacity-80 transition-opacity">
          <SocialLogo url={null} />
          <span className=" sm:flex ml-1 sm:ml-2 items-center gap-1 sm:gap-2 self-center font-medium text-sm sm:text-base">Volt</span>
        </Link>
      </div>
      
      {/* Кнопка Создать с меню */}
      <div className="ml-2 sm:ml-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:inline-flex items-center gap-2 px-3 sm:px-4 h-9 sm:h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm pr-2">Создать</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60 p-1.5 bg-secondary rounded-3xl border border-border shadow-sm pb-4">
            {user ? (
              <>
                <DropdownMenuItem
                  onSelect={() => navigate('/u/?create=post')}
                  className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
                >
                  Создать пост
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => navigate('/u/?create=contest')}
                  className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
                >
                  Создать конкурс
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => navigate('/u/?create=club')}
                  className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
                >
                  Создать клуб
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => navigate('/u/?create=coach-announcement')}
                  className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
                >
                  Объявление на Доске Тренеров
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Войдите в аккаунт
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Чтобы создавать посты, клубы и другие материалы
                </p>
                <button
                  onClick={() => navigate('/volt-login')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm"
                >
                  Войти в аккаунт
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Горизонтальное меню */}
      <nav className="hidden lg:flex items-center gap-1.5 sm:gap-2 ml-2 bg-secondary rounded-full h-9 sm:h-11">
        {/* Создать с выпадающим меню */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary cursor-pointer">
              <Plus className="w-4 h-4 mr-1" />
              Создать
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60 p-1 bg-secondary rounded-3xl border border-border shadow-sm">
            <DropdownMenuItem
              onSelect={() => navigate('/u/?create=post')}
              className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
            >
              Создать пост
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => navigate('/u/?create=contest')}
              className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
            >
              Создать конкурс
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => navigate('/u/?create=coach-announcement')}
              className="inline-flex items-center h-9 rounded-full px-3 text-sm cursor-pointer hover:bg-[hsl(var(--secondary-hover))] focus:bg-[hsl(var(--secondary-hover))] data-[highlighted]:bg-[hsl(var(--secondary-hover))]"
            >
              Объявление на Доске Тренеров
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        
        <AnimatedMenuItem
          to="/u/"
          isActive={location.pathname === "/u/"}
          className={`inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary ${
            location.pathname === "/u/" ? "bg-[hsl(var(--secondary-hover))]" : ""
          }`}
        >
          Лента
        </AnimatedMenuItem>
        {user && (
          <AnimatedMenuItem
            to={`/u/users/${user.username}`}
            isActive={location.pathname === `/u/users/${user.username}`}
            className={`inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary ${
              location.pathname === `/u/users/${user.username}` ? "bg-[hsl(var(--secondary-hover))]" : ""
            }`}
          >
            Мой аккаунт
          </AnimatedMenuItem>
        )}
        <AnimatedMenuItem
          to="/u/users"
          isActive={location.pathname === "/u/users"}
          className={`inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary ${
            location.pathname === "/u/users" ? "bg-[hsl(var(--secondary-hover))]" : ""
          }`}
        >
          Пользователи
        </AnimatedMenuItem>
        <AnimatedMenuItem
          to="/u/clubs"
          isActive={location.pathname === "/u/clubs"}
          className={`inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary ${
            location.pathname === "/u/clubs" ? "bg-[hsl(var(--secondary-hover))]" : ""
          }`}
        >
          Клубы
        </AnimatedMenuItem>
        <AnimatedMenuItem
          to="/u/board"
          isActive={location.pathname === "/u/board"}
          className={`inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary ${
            location.pathname === "/u/board" ? "bg-[hsl(var(--secondary-hover))]" : ""
          }`}
        >
          Доска тренеров
        </AnimatedMenuItem>
        {/* <AnimatedMenuItem
          to="/u/settings"
          isActive={location.pathname === "/u/settings"}
          className={`inline-flex items-center h-full rounded-full px-3 text-sm hover-secondary ${
            location.pathname === "/u/settings" ? "bg-[hsl(var(--secondary-hover))]" : ""
          }`}
        >
          Настройки
        </AnimatedMenuItem> */}
      </nav>
      
      {/* Контейнер поиска заполняет оставшееся пространство */}
      <div ref={searchContainerRef} className="flex-1 min-w-0 mx-0 sm:mx-2 relative">
        <div className="bg-secondary rounded-full px-3 h-9 sm:h-11 flex items-center hover-secondary transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={handleSearchInputFocus}
            onBlur={handleSearchInputBlur}
            className="w-full bg-transparent border-0 h-full py-0 focus-visible:ring-0 focus:ring-0 outline-none placeholder:text-muted-foreground text-sm sm:text-base"
          />
        </div>
        
        {/* Выпадающий список результатов */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="max-h-80 sm:max-h-96 overflow-y-auto">
              {/* Заголовок */}
              <div className="p-3 sm:p-4 border-b border-border">
                <div className="flex gap-1 mb-2">
                  <button
                    onClick={() => setSearchType('users')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      searchType === 'users' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    Люди
                  </button>
                  <button
                    onClick={() => setSearchType('clubs')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      searchType === 'clubs' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    Клубы
                  </button>
                </div>
                
                {/* Разделитель */}
                <div className="border-t border-border mb-2"></div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Поиск людей и клубов</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Начните вводить имя для поиска</p>
              </div>
              
              {isSearching ? (
                <div className="p-3 sm:p-4 text-left text-muted-foreground text-sm">
                  Поиск...
                </div>
              ) : searchType === 'users' ? (
                // Результаты поиска пользователей
                searchResults.length === 0 && search.trim() ? (
                  <div className="p-3 sm:p-4 text-left text-muted-foreground text-sm">
                    Пользователи не найдены
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-1 sm:p-2">
                    {searchResults.map((user) => (
                      <Link
                        key={user._id}
                        to={`/u/users/${user.username}`}
                        onClick={handleUserClick}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover-secondary transition-colors"
                      >
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                          <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                          <AvatarFallback className="text-sm">{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="font-semibold truncate text-sm sm:text-base">{user.name}</span>
                            {user.userRole === "coach" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-xs sm:text-sm cursor-help">🏋️‍♂️</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Тренер</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground font-mono">@{user.username}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null
              ) : (
                // Результаты поиска клубов
                clubSearchResults.length === 0 && search.trim() ? (
                  <div className="p-3 sm:p-4 text-left text-muted-foreground text-sm">
                    Клубы не найдены
                  </div>
                ) : clubSearchResults.length > 0 ? (
                  <div className="p-1 sm:p-2">
                    {clubSearchResults.map((club) => (
                      <Link
                        key={club._id}
                        to={`/u/clubs/${club.username}`}
                        onClick={handleUserClick}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover-secondary transition-colors"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {club.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-sm sm:text-base">{club.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground font-mono">@{club.username}</div>
                          {club.description && (
                            <div className="text-xs text-muted-foreground truncate mt-1">{club.description}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-secondary rounded-full px-1.5 py-1">
          <button className="relative p-1.5 sm:p-2 rounded-full hover-secondary" aria-label="Уведомления">
            <Bell className="w-4 h-4 sm:w-4 sm:h-4 text-muted-foreground" />
          </button>
          <Link to="/id?tab=settings" className="relative p-1.5 sm:p-2 rounded-full hover-secondary" aria-label="Настройки">
            <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </Link>
          {user && (
            <Link to={`/u/users/${user.username}`} className="flex items-center p-0 -mr-1 sm:-mr-1">
              <Avatar className="w-7 h-7 sm:w-9 sm:h-9">
                <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                <AvatarFallback className="text-xs sm:text-sm">{user.name?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
    
    {/* Нижнее мобильное меню */}
    <MobileBottomMenu />
    </>
  );
};

export { MobileBottomMenu };
export default SocialHeader;