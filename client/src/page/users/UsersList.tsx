import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader, Globe, ArrowUp, Search } from "lucide-react";
import SocialContainer from "@/components/SocialContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/api/use-auth";
import { getFollowingQueryFn, followUserMutationFn, unfollowUserMutationFn, searchUsersQueryFn, getAllPublicUsersQueryFn } from "@/lib/api";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
  username: string;
  name: string;
  profilePicture: string | null;
}

interface FollowingUser {
  username: string;
  name: string;
  profilePicture: string | null;
  userRole?: "coach" | "athlete" | null;
}

const checkUserWebsite = (username: string): boolean => {
  try {
    const websites = JSON.parse(localStorage.getItem('websites') || '{}');
    return !!websites[username];
  } catch {
    return false;
  }
};

const UsersListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [followLoading, setFollowLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { data: currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    getAllPublicUsersQueryFn()
      .then((data) => {
        setUsers(data.users || []);
        setError(null);
      })
      .catch(() => {
        // Fallback для неавторизованных пользователей
        fetch("/api/user/public/all")
          .then((res) => res.json())
          .then((data) => {
            setUsers(data.users || []);
            setError(null);
          })
          .catch(() => setError("Ошибка загрузки пользователей"));
      })
      .finally(() => setLoading(false));
  }, []);

  // Загрузка подписок
  useEffect(() => {
    if (currentUser?.user?.username) {
      getFollowingQueryFn(currentUser.user.username)
        .then((data) => {
          console.log('Following data:', data);
          setFollowing(data.following || []);
        })
        .catch((error) => {
          console.error('Error loading following:', error);
          setFollowing([]);
        });
    }
  }, [currentUser]);

  const handleFollow = async (username: string) => {
    setFollowLoading(username);
    try {
      await followUserMutationFn(username);
      setFollowing(f => [...f, { username, name: '', profilePicture: null }]);
    } finally {
      setFollowLoading(null);
    }
  };

  const handleUnfollow = async (username: string) => {
    setFollowLoading(username);
    try {
      await unfollowUserMutationFn(username);
      setFollowing(f => f.filter(u => u.username !== username));
    } finally {
      setFollowLoading(null);
    }
  };

  // Функция поиска пользователей
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchUsersQueryFn(query);
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced поиск
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  // Отслеживание скролла для показа кнопки "Вернуться наверх"
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300); // Показываем кнопку после прокрутки на 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SocialContainer>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Пользователи</h1>
      </div>
      <div className="relative">
        <div className="bg-secondary rounded-full px-4 h-12 flex items-center hover:bg-secondary/80 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground mr-3" />
          <Input
            type="text"
            placeholder="Найди друга"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 h-full py-0 focus-visible:ring-0 focus:ring-0 outline-none placeholder:text-muted-foreground text-sm"
          />
          {isSearching && (
            <Loader className="w-4 h-4 animate-spin text-muted-foreground ml-2" />
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center text-destructive mt-6 sm:mt-10 text-sm sm:text-base">{error}</div>
      ) : (searchQuery.trim() ? searchResults : users).length === 0 ? (
        <div className="text-center text-muted-foreground">
          {searchQuery.trim() ? `По запросу "${searchQuery}" пользователи не найдены` : "Пользователи не найдены"}
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {(searchQuery.trim() ? searchResults : users)
            .filter(user => user.username !== currentUser?.user?.username)
            .map((user) => (
            <div key={user.username} className="p-3 sm:p-4 border border-border rounded-3xl bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <Link to={`/u/users/${user.username}`} className="flex items-center gap-1.5 sm:gap-2 hover:underline flex-1">
                    <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                      <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                      <AvatarFallback className="text-sm">{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold flex items-center gap-1 text-sm sm:text-base">
                      {user.name}
                    </span>
                  </Link>
                  {checkUserWebsite(user.username) && (
                    <Globe className="w-4 h-4 text-accent flex-shrink-0" />
                  )}
                </div>
                {currentUser?.user && currentUser.user.username !== user.username && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs sm:text-sm ml-4"
                    onClick={() => {
                      const isFollowing = following.some(f => f.username === user.username);
                      if (isFollowing) {
                        handleUnfollow(user.username);
                      } else {
                        handleFollow(user.username);
                      }
                    }}
                    disabled={followLoading === user.username}
                  >
                    {followLoading === user.username ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : following.some(f => f.username === user.username) ? (
                      "Отписаться"
                    ) : (
                      "Подписаться"
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {showScrollButton && (
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 md:bottom-2 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </SocialContainer>
  );
};

export default UsersListPage;