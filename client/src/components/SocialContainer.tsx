import React, { useEffect, useState } from "react";
import SocialHeader from "@/components/social-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getFollowingQueryFn } from "@/lib/api";

type FollowingUser = {
  username: string;
  name: string;
  profilePicture: string | null;
  userRole?: "coach" | "athlete" | null;
};

type SocialContainerProps = {
  children: React.ReactNode;
};

const SocialContainer = ({ children }: SocialContainerProps) => {
  const { data: currentUser } = useAuth();
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [visibleFollowingLimit, setVisibleFollowingLimit] = useState<number>(3);

  useEffect(() => {
    const username = currentUser?.user?.username;
    if (!username) {
      setFollowing([]); // Очищаем подписки для неавторизованных пользователей
      return;
    }
    getFollowingQueryFn(username)
      .then((data) => setFollowing(data.following || []))
      .catch(() => setFollowing([]));
  }, [currentUser?.user?.username]);

  return (
    <div className="tsygram-dark bg-background text-foreground">
      <SocialHeader />
      <div className="min-h-svh flex justify-center px-4 sm:px-2 lg:px-8 pb-16 md:pb-0">
        <div className="w-full max-w-7xl flex gap-2">
          {/* Левая часть: профиль и подписки */}
          <aside className="hidden lg:flex flex-col w-80 py-4 sm:py-8 gap-4 sm:gap-6 min-h-svh sticky top-0">
            {currentUser?.user ? (
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentUser.user.profilePicture || ''} alt={currentUser.user.name} />
                  <AvatarFallback className="text-2xl">{currentUser.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-xl">{currentUser.user.name}</div>
                  <Link to={`/u/users/${currentUser.user.username}`} className="inline-flex mt-1">
                    <Button size="sm" variant="outline">Открыть профиль</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-4">
                <div className="font-semibold text-base sm:text-lg mb-2">Гость Aurora Volt</div>
                <div className="text-sm text-muted-foreground mb-3">Войдите, чтобы видеть ваш профиль и подписки.</div>
                <Link to="/volt-login" className="inline-flex">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Войти</Button>
                </Link>
              </div>
            )}

            <div className="bg-card border border-border rounded-3xl p-4">
              <div className="font-semibold text-base sm:text-lg mb-2">Мои подписки</div>
              {!currentUser?.user ? (
                <div className="text-muted-foreground text-sm">Войдите, чтобы видеть подписки.</div>
              ) : following.length === 0 ? (
                <div className="text-muted-foreground text-sm">Вы ни на кого не подписаны.</div>
              ) : (
                <div className="flex flex-col gap-2 sm:gap-3">
                  {following.slice(0, visibleFollowingLimit).map(user => (
                    <div key={user.username} className="flex items-center gap-1.5 sm:gap-2 group">
                      <Link to={`/u/users/${user.username}`} className="flex items-center gap-1.5 sm:gap-2 hover:underline flex-1 min-w-0">
                        <img src={user.profilePicture || ''} alt={user.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                        <span className="font-semibold truncate flex items-center gap-1 text-sm sm:text-base">
                          {user.name}
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
                        </span>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full hover-secondary ml-1">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="8" r="2"/>
                              <circle cx="12" cy="16" r="2"/>
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/u/users/${user.username}`}>Посмотреть профиль</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  {following.length > visibleFollowingLimit && (
                    <button
                      onClick={() => setVisibleFollowingLimit(prev => (prev === 3 ? 10 : following.length))}
                      className="mt-1 text-xs sm:text-sm text-primary hover:underline self-start"
                    >
                      Показать еще
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Правая колонка: контент страниц /u */}
          <main className="flex-1 flex flex-col items-center lg:items-start lg:ml-2 py-4 sm:py-8">
            <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SocialContainer;


