import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { FaHeart, FaFire, FaRegGrinStars } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/api/use-auth";
import { getFollowersQueryFn, followUserMutationFn, unfollowUserMutationFn } from "@/lib/api";
import { logoutMutationFn } from "@/lib/api";
import { getUserPostsQueryFn, createUserPostMutationFn, deleteUserPostMutationFn, likeUserPostMutationFn, wowUserPostMutationFn } from "@/lib/api";
import { fireUserPostMutationFn } from "@/lib/api";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import SocialHeader from "@/components/social-header";
import { getFollowingQueryFn } from "@/lib/api";
import { ArrowUp } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useMutation } from "@tanstack/react-query";

interface PublicUser {
  name: string;
  username: string;
  profilePicture: string | null;
  userRole?: "coach" | "athlete" | null;
  email?: string;
}

interface FollowerUser {
  username: string;
  name: string;
  profilePicture: string | null;
  userRole?: "coach" | "athlete" | null;
}

interface Post {
  _id: string;
  text: string;
  image?: string | null;
  createdAt: string;
  author: string;
  likes?: string[];
  fires?: string[];
  wows?: string[];
}

const fetchPublicUser = async (username: string): Promise<PublicUser> => {
  const res = await fetch(`/api/user/public/${username}`);
  if (!res.ok) throw new Error("Пользователь не найден");
  return res.json();
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: currentUser } = useAuth();
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [following, setFollowing] = useState<FollowerUser[]>([]);

  const logoutMutation = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      navigate("/u/", { replace: true });
      // ensure all auth-bound UI resets
      window.location.reload();
    },
  });

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetchPublicUser(username)
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.message || "Ошибка");
        setUser(null);
      })
      .finally(() => setLoading(false));

    // Получить подписчиков
    getFollowersQueryFn(username)
      .then((data) => {
        setFollowers(data.followers || []);
        if (currentUser?.user && data.followers) {
          setIsFollowing(data.followers.some((f: FollowerUser) => f.username === currentUser.user.username));
        }
      })
      .catch(() => setFollowers([]));

    // Получить подписки текущего пользователя для правого блока
    if (currentUser?.user?.username) {
      getFollowingQueryFn(currentUser.user.username)
        .then((data) => setFollowing(data.following || []))
        .catch(() => setFollowing([]));
    }

  }, [username, currentUser]);

  // Получение постов
  useEffect(() => {
    if (!username) return;
    getUserPostsQueryFn(username)
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]));
  }, [username]);

  // Отслеживание скролла для показа кнопки "Вернуться наверх"
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300); // Показываем кнопку после прокрутки на 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFollow = async () => {
    if (!username) return;
    setFollowLoading(true);
    try {
      await followUserMutationFn(username);
      setIsFollowing(true);
      // Обновить список подписчиков
      const data = await getFollowersQueryFn(username);
      setFollowers(data.followers || []);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!username) return;
    setFollowLoading(true);
    try {
      await unfollowUserMutationFn(username);
      setIsFollowing(false);
      // Обновить список подписчиков
      const data = await getFollowersQueryFn(username);
      setFollowers(data.followers || []);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    setPostLoading(true);
    try {
      await createUserPostMutationFn(username!, { text: postText, image: postImage });
      setPostText("");
      setPostImage(null);
      // Обновить ленту
      const data = await getUserPostsQueryFn(username!);
      setPosts(data.posts || []);
    } finally {
      setPostLoading(false);
    }
  };

  const userId = currentUser?.user?._id;

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    setDeleteLoading(true);
    await deleteUserPostMutationFn(deletePostId);
    setPosts(posts => posts.filter(p => p._id !== deletePostId));
    setDeleteLoading(false);
    setDeleteDialogOpen(false);
    setDeletePostId(null);
  };

  const handleLikePost = async (postId: string) => {
    const res = await likeUserPostMutationFn(postId);
    // Обновить посты (лайки)
    setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: res.likesCount ? [...(p.likes || []), userId!] : (p.likes || []).filter(id => id !== userId) } : p));
  };

  const handleFirePost = async (postId: string) => {
    const res = await fireUserPostMutationFn(postId);
    setPosts(posts => posts.map(p => p._id === postId ? {
      ...p,
      fires: res.fired ? [...(p.fires || []), userId!] : (p.fires || []).filter(id => id !== userId)
    } : p));
  };

  const handleWowPost = async (postId: string) => {
    const res = await wowUserPostMutationFn(postId);
    setPosts(posts => posts.map(p => p._id === postId ? {
      ...p,
      wows: res.wowed ? [...(p.wows || []), userId!] : (p.wows || []).filter(id => id !== userId)
    } : p));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin w-8 h-8" /></div>;
  }
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }
  if (!user) return null;

  return (
    <>
      <SocialHeader />
      <div className="tsygram-dark min-h-svh bg-background flex justify-center px-4 sm:px-6 lg:px-8 pb-16 md:pb-0">
        <div className="w-full max-w-7xl flex gap-3">
          {/* Левая часть: Мои подписки */}
          <aside className="hidden lg:flex flex-col w-80 py-4 sm:py-8 gap-4 sm:gap-6 min-h-svh sticky top-0">
            {/* Данные пользователя */}
            {currentUser?.user && (
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={currentUser.user.profilePicture || ''} alt={currentUser.user.name} />
                  <AvatarFallback className="text-lg">{currentUser.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-base">{currentUser.user.name}</div>
                  <div className="text-sm text-muted-foreground">@{currentUser.user.username}</div>
                </div>
              </div>
            )}
            
            {/* Блок подписок с фоном */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="font-semibold text-base sm:text-lg mb-2">Мои подписки</div>
              {following.length === 0 ? (
                <div className="text-muted-foreground text-sm">Вы ни на кого не подписаны.</div>
              ) : (
                <div className="flex flex-col gap-2 sm:gap-3">
                  {following.map(user => (
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
                </div>
              )}
            </div>
          </aside>
          
          {/* Центральная часть: профиль */}
          <main className="flex-1 flex flex-col items-center py-4 sm:py-8">
            {/* Весь старый JSX профиля */}
            <div className="w-full flex flex-col gap-4 sm:gap-6 max-w-4xl">
            <Card className="p-0">
              <div className="flex flex-col items-center gap-2 pt-6 sm:pt-8">
                <div className="text-base sm:text-lg font-semibold mb-2 text-center">👋 Привет! Я пользуюсь Aurora.</div>
              </div>
              <div className="flex flex-col items-center gap-3 sm:gap-4 px-4 sm:px-8 pb-6 sm:pb-8">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mt-2">
                  <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                  <AvatarFallback className="text-lg sm:text-xl">{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-center">
                  {user.name}
                  {user.userRole === "coach" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-xl sm:text-2xl cursor-help">🏋️‍♂️</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Этот эмодзи присваивается только тренерам</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="text-primary font-mono text-base sm:text-lg">@{user.username}</div>
                {user.email && <div className="text-muted-foreground text-sm sm:text-base">{user.email}</div>}
                {currentUser?.user?.username === user.username && (
                  <>
                    <div className="flex gap-2 mt-4">
                      <Button className="text-sm sm:text-base">Редактировать профиль</Button>
                      <Button
                        variant="outline"
                        className="text-sm sm:text-base"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? "Выход..." : "Выйти"}
                      </Button>
                    </div>
                    
                    <form onSubmit={handleCreatePost} className="w-full flex flex-col gap-2 mt-4 sm:mt-6 p-3 sm:p-4 border border-border rounded bg-card">
                      <textarea
                        className="border border-border rounded p-2 sm:p-3 resize-none text-sm sm:text-base bg-background text-foreground placeholder:text-muted-foreground"
                        rows={3}
                        placeholder="Что нового?"
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                        disabled={postLoading}
                      />
                      <input type="file" accept="image/*" onChange={handleImageChange} disabled={postLoading} className="text-sm text-foreground" />
                      {postImage && <img src={postImage} alt="preview" className="max-h-32 sm:max-h-40 object-contain rounded" />}
                      <Button type="submit" disabled={postLoading || !postText.trim()} className="self-end text-sm sm:text-base">Опубликовать</Button>
                    </form>
                  </>
                )}
                {currentUser?.user && currentUser.user.username !== user.username && (
                  isFollowing ? (
                    <Button variant="outline" className="mt-4 text-sm sm:text-base" onClick={handleUnfollow} disabled={followLoading}>
                      Отписаться
                    </Button>
                  ) : (
                    <Button className="mt-4 text-sm sm:text-base" onClick={handleFollow} disabled={followLoading}>
                      Подписаться
                    </Button>
                  )
                )}
                <div className="mt-4 sm:mt-6 w-full">
                  <div className="font-semibold mb-2 text-sm sm:text-base">Подписчики: {followers.length}</div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {followers.length === 0 && <span className="text-muted-foreground text-sm sm:text-base">Нет подписчиков</span>}
                    {followers.map((f) => (
                      <Link key={f.username} to={`/u/users/${f.username}`} className="flex items-center gap-1.5 sm:gap-2 hover:underline">
                        <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                          <AvatarImage src={f.profilePicture || ''} alt={f.name} />
                          <AvatarFallback className="text-xs sm:text-sm">{f.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                          @{f.username}
                          {f.userRole === "coach" && (
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
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="mt-8 w-full max-w-2xl">
            <div className="font-semibold mb-2">Посты:</div>
            {posts.length === 0 && <div className="text-muted-foreground">Нет постов</div>}
            <div className="flex flex-col gap-4">
              {posts.map(post => {
                const isOwner = currentUser?.user?._id && post.author === currentUser.user._id;
                const isLiked = post.likes && userId ? post.likes.includes(userId) : false;
                const isFired = post.fires && userId ? post.fires.includes(userId) : false;
                const isWowed = post.wows && userId ? post.wows.includes(userId) : false;
                return (
                  <div key={post._id} className="p-4 border border-border rounded bg-card relative">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.profilePicture || ''} alt={user?.name} />
                          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold flex items-center gap-1">
                          {user?.name}
                          {user?.userRole === "coach" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="text-lg cursor-help">🏋️‍♂️</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Тренер</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      </div>
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-full hover-secondary">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="2"/>
                                <circle cx="12" cy="16" r="2"/>
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/u/users/${user?.username}`}>Посмотреть профиль</Link>
                            </DropdownMenuItem>
                            {isOwner && (
                              <>
                                <DropdownMenuItem>Редактировать</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setDeleteDialogOpen(true); setDeletePostId(post._id); }}>Удалить</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mb-2 whitespace-pre-line">{post.text}</div>
                    {post.image && <img src={post.image} alt="post" className="max-h-60 object-contain rounded" />}
                    <hr className="my-3" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <button
                          className={`inline-flex items-center h-7 rounded-full px-3 gap-1 transition-colors border ${
                            isLiked
                              ? 'bg-red-500 border-red-600 text-white hover:bg-red-600'
                              : 'bg-transparent border-red-500 text-red-600 hover-secondary'
                          }`}
                          onClick={() => handleLikePost(post._id)}
                          disabled={!userId}
                        >
                          <FaHeart size={16} className="" />
                          <span className="min-w-3">{post.likes?.length || 0}</span>
                        </button>
                        <button
                          className={`inline-flex items-center h-7 rounded-full px-3 gap-1 transition-colors border ${
                            isFired
                              ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600'
                              : 'bg-transparent border-amber-500 text-amber-600 hover-secondary'
                          }`}
                          onClick={() => handleFirePost(post._id)}
                          disabled={!userId}
                        >
                          <FaFire size={16} className="" />
                          <span className="min-w-3">{post.fires?.length || 0}</span>
                        </button>
                        <button
                          className={`inline-flex items-center h-7 rounded-full px-3 gap-1 transition-colors border ${
                            isWowed
                              ? 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600'
                              : 'bg-transparent border-pink-500 text-pink-600 hover-secondary'
                          }`}
                          onClick={() => handleWowPost(post._id)}
                          disabled={!userId}
                        >
                          <FaRegGrinStars size={16} className="" />
                          <span className="hidden sm:inline">WOW!</span>
                          <span className="min-w-3">{post.wows?.length || 0}</span>
                        </button>
                      </div>
                      <span>{format(new Date(post.createdAt), 'dd.MM', { locale: ru })} в {format(new Date(post.createdAt), 'HH:mm', { locale: ru })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        isLoading={deleteLoading}
        onClose={() => { setDeleteDialogOpen(false); setDeletePostId(null); }}
        onConfirm={handleDeletePost}
        title="Вы уверены, что хотите удалить этот пост?"
        description="Это действие невозможно отменить. После удаления восстановить пост будет невозможно."
        confirmText="Удалить"
        cancelText="Отменить"
      />
      
      {/* Кнопка "Вернуться наверх" */}
      {showScrollButton && (
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 md:bottom-2 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
      
      {/* Нижнее мобильное меню */}
    </>
  );
};

export default UserProfile; 