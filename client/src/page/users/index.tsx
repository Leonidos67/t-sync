import { useEffect, useState } from "react";
import { getFeedQueryFn, getPublicFeedQueryFn, likeUserPostMutationFn, deleteUserPostMutationFn, getFollowingQueryFn, createUserPostMutationFn, followUserMutationFn, unfollowUserMutationFn, fireUserPostMutationFn, wowUserPostMutationFn, createClubMutationFn } from "@/lib/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/hooks/api/use-auth";
import SocialContainer from "@/components/SocialContainer";
import CreatePostBlock from "@/components/CreatePostBlock";
import AdPost from "@/components/ad-post";
import { ArrowUp, MapPinIcon } from "lucide-react";
import { FaHeart, FaFire, FaRegGrinStars } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";

interface FeedPost {
  _id: string;
  text: string;
  image?: string | null;
  location?: string | null;
  isPublic?: boolean;
  createdAt: string;
  author: {
    username: string;
    name: string;
    profilePicture: string | null;
    userRole?: "coach" | "athlete" | null;
    _id: string;
  };
  likes?: string[];
  fires?: string[];
  wows?: string[];
}

interface FollowingUser {
  username: string;
  name: string;
  profilePicture: string | null;
  userRole?: "coach" | "athlete" | null;
}

const SocialMainPage = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: currentUser } = useAuth();
  const userId = currentUser?.user?._id;
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [visibleFollowingLimit, setVisibleFollowingLimit] = useState<number>(3);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [clubDialogOpen, setClubDialogOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Открывать модалки по query create=*
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'post') {
      setCreateDialogOpen(true);
    } else if (params.get('create') === 'club') {
      setClubDialogOpen(true);
    }
  }, [location.search]);

  // Закрывая модалку — чистим query=create
  useEffect(() => {
    if (!createDialogOpen && !clubDialogOpen) {
      const params = new URLSearchParams(location.search);
      if (params.has('create')) {
        params.delete('create');
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }
    }
  }, [createDialogOpen, clubDialogOpen, location.pathname, location.search, navigate]);

  // Отслеживание скролла для показа кнопки "Вернуться наверх"
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300); // Показываем кнопку после прокрутки на 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<string | null>(null);
  const [feedTab, setFeedTab] = useState<'recommendations' | 'friends' | 'popular'>('recommendations');
  const [clubName, setClubName] = useState("");
  const [clubUsername, setClubUsername] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubLoading, setClubLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // Если пользователь авторизован, используем обычный API
        if (currentUser?.user) {
          const data = await getFeedQueryFn();
          if (isMounted) setPosts(data.posts || []);
        } else {
          // Если пользователь не авторизован, используем публичный API
          const data = await getPublicFeedQueryFn();
          if (isMounted) setPosts(data.posts || []);
        }
      } catch {
        // Fallback для неавторизованных пользователей
        try {
          const res = await fetch("/api/user/public/feed");
          if (res.ok) {
            const json = await res.json();
            if (isMounted) setPosts(json.posts || []);
          } else {
            if (isMounted) setPosts([]);
          }
        } catch {
          if (isMounted) setPosts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }

      if (currentUser?.user?.username) {
        getFollowingQueryFn(currentUser.user.username)
          .then((data) => setFollowing(data.following || []))
          .catch(() => setFollowing([]));
      }
    };

    load();
    return () => { isMounted = false; };
  }, [currentUser]);

  const handleLikePost = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!userId || !post) return;
    const isLiked = post.likes && post.likes.includes(userId);
    await likeUserPostMutationFn(postId);
    setPosts(posts => posts.map(p =>
      p._id === postId
        ? {
            ...p,
            likes: isLiked
              ? (p.likes || []).filter(id => id !== userId)
              : [...(p.likes || []), userId]
          }
        : p
    ));
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    setDeleteLoading(true);
    await deleteUserPostMutationFn(deletePostId);
    setPosts(posts => posts.filter(p => p._id !== deletePostId));
    setDeleteLoading(false);
    setDeleteDialogOpen(false);
    setDeletePostId(null);
  };

  const handleFirePost = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!userId || !post) return;
    const hasFire = post.fires && post.fires.includes(userId);
    await fireUserPostMutationFn(postId);
    setPosts(posts => posts.map(p =>
      p._id === postId
        ? {
            ...p,
            fires: hasFire
              ? (p.fires || []).filter(id => id !== userId)
              : [...(p.fires || []), userId]
          }
        : p
    ));
  };

  const handleWowPost = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!userId || !post) return;
    const hasWow = post.wows && post.wows.includes(userId);
    await wowUserPostMutationFn(postId);
    setPosts(posts => posts.map(p =>
      p._id === postId
        ? {
            ...p,
            wows: hasWow
              ? (p.wows || []).filter(id => id !== userId)
              : [...(p.wows || []), userId]
          }
        : p
    ));
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
    if (!postText.trim() || !currentUser?.user?.username) return;
    setPostLoading(true);
    try {
      await createUserPostMutationFn(currentUser.user.username, { text: postText, image: postImage });
      setPostText("");
      setPostImage(null);
      setCreateDialogOpen(false);
      // Обновить ленту
      setLoading(true);
      if (currentUser?.user) {
        getFeedQueryFn()
          .then((data) => setPosts(data.posts || []))
          .finally(() => setLoading(false));
      } else {
        getPublicFeedQueryFn()
          .then((data) => setPosts(data.posts || []))
          .finally(() => setLoading(false));
      }
    } finally {
      setPostLoading(false);
    }
  };

  const handleCreatePostFromBlock = async (postData: {
    text: string;
    image?: string | null;
    location?: string;
    isPublic: boolean;
  }) => {
    if (!currentUser?.user?.username) return;
    setPostLoading(true);
    try {
      await createUserPostMutationFn(currentUser.user.username, { 
        text: postData.text, 
        image: postData.image,
        location: postData.location,
        isPublic: postData.isPublic
      });
      // Обновить ленту
      setLoading(true);
      if (currentUser?.user) {
        getFeedQueryFn()
          .then((data) => setPosts(data.posts || []))
          .finally(() => setLoading(false));
      } else {
        getPublicFeedQueryFn()
          .then((data) => setPosts(data.posts || []))
          .finally(() => setLoading(false));
      }
    } finally {
      setPostLoading(false);
    }
  };

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

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !clubUsername.trim()) return;
    setClubLoading(true);
    try {
      await createClubMutationFn({
        name: clubName,
        username: clubUsername,
        description: clubDescription
      });
      setClubName("");
      setClubUsername("");
      setClubDescription("");
      setClubDialogOpen(false);
    } finally {
      setClubLoading(false);
    }
  };

  // Функция для вставки рекламы каждый 10-й пост
  const insertAdsIntoFeed = (posts: FeedPost[]) => {
    const postsWithAds: (FeedPost | { type: 'ad'; id: string })[] = [];
    let adCounter = 0;
    
    posts.forEach((post, index) => {
      postsWithAds.push(post);
      
      // Вставляем рекламу каждый 10-й пост (начиная с 9-го индекса, т.е. 10-й пост)
      if ((index + 1) % 10 === 0) {
        postsWithAds.push({ 
          type: 'ad', 
          id: `ad-${adCounter}` 
        });
        adCounter++;
      }
    });
    
    return postsWithAds;
  };

  return (
    <SocialContainer>
            <CreatePostBlock 
              onPostCreate={handleCreatePostFromBlock}
              isLoading={postLoading}
            />
            {/* Навигация под блоком создания поста */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setFeedTab('recommendations')}
                className={`inline-flex items-center h-8 rounded-full px-3 text-sm hover-secondary ${
                  feedTab === 'recommendations' ? 'bg-[hsl(var(--secondary-hover))]' : ''
                }`}
              >
                Рекомендации
              </button>
              <button
                onClick={() => setFeedTab('friends')}
                className={`inline-flex items-center h-8 rounded-full px-3 text-sm hover-secondary ${
                  feedTab === 'friends' ? 'bg-[hsl(var(--secondary-hover))]' : ''
                }`}
              >
                Посты друзей
              </button>
              <button
                onClick={() => setFeedTab('popular')}
                className={`inline-flex items-center h-8 rounded-full px-3 text-sm hover-secondary ${
                  feedTab === 'popular' ? 'bg-[hsl(var(--secondary-hover))]' : ''
                }`}
              >
                Популярное
              </button>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogContent className="max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Создать пост</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="flex flex-col gap-3 sm:gap-4">
                  <textarea
                    className="border rounded p-2 sm:p-3 resize-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Текст поста..."
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    disabled={postLoading}
                  />
                  <input type="file" accept="image/*" onChange={handleImageChange} disabled={postLoading} className="text-sm" />
                  {postImage && <img src={postImage} alt="preview" className="max-h-32 sm:max-h-40 object-contain rounded" />}
                  <DialogFooter>
                    <Button type="submit" disabled={postLoading || !postText.trim()} className="w-full text-sm sm:text-base">
                      {postLoading ? "Публикуем..." : "Опубликовать"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={clubDialogOpen} onOpenChange={setClubDialogOpen}>
              <DialogContent className="max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Создать клуб</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateClub} className="flex flex-col gap-3 sm:gap-4">
                  <input
                    type="text"
                    className="border rounded p-2 sm:p-3 text-sm sm:text-base"
                    placeholder="Название клуба..."
                    value={clubName}
                    onChange={e => setClubName(e.target.value)}
                    disabled={clubLoading}
                    required
                  />
                  <input
                    type="text"
                    className="border rounded p-2 sm:p-3 text-sm sm:text-base"
                    placeholder="Username клуба..."
                    value={clubUsername}
                    onChange={e => setClubUsername(e.target.value)}
                    disabled={clubLoading}
                    required
                  />
                  <textarea
                    className="border rounded p-2 sm:p-3 resize-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Описание клуба (необязательно)..."
                    value={clubDescription}
                    onChange={e => setClubDescription(e.target.value)}
                    disabled={clubLoading}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={clubLoading || !clubName.trim() || !clubUsername.trim()} className="w-full text-sm sm:text-base">
                      {clubLoading ? "Создаём..." : "Создать клуб"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="mt-0 flex flex-col gap-3 sm:gap-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Загрузка...</div>
              ) : posts.length === 0 ? (
                <div className="text-center text-muted-foreground">Постов пока нет</div>
              ) : (
                insertAdsIntoFeed(
                  feedTab === 'friends'
                    ? posts.filter(post => following.some(f => f.username === post.author.username))
                    : feedTab === 'popular'
                      ? [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                      : posts
                ).map((item, index) => {
                  // Если это реклама
                  if ('type' in item && item.type === 'ad') {
                    return <AdPost key={item.id} id={item.id} />;
                  }
                  
                  // Если это обычный пост
                  const post = item as FeedPost;
                  const isOwner = userId && post.author._id === userId;
                  const isLiked = post.likes && userId ? post.likes.includes(userId) : false;
                  const isFired = post.fires && userId ? post.fires.includes(userId) : false;
                  const isWowed = post.wows && userId ? post.wows.includes(userId) : false;
                  const isFollowing = following.some(f => f.username === post.author.username);
                  return (
                    <div key={post._id} className="p-3 sm:p-4 border border-border rounded-3xl bg-card relative">
                      <div className="flex items-start gap-2 sm:gap-3 mb-2">
                        <Link to={`/u/users/${post.author.username}`} className="flex items-center gap-1.5 sm:gap-2 hover:underline">
                          <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                            <AvatarImage src={post.author.profilePicture || ''} alt={post.author.name} />
                            <AvatarFallback className="text-sm">{post.author.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold flex items-center gap-1 text-sm sm:text-base">
                            {post.author.name}
                            {post.author.userRole === "coach" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-sm sm:text-lg cursor-help">🏋️‍♂️</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Тренер</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        </Link>
                        {userId && post.author._id !== userId && (
                          <div className="ml-1 sm:ml-2 flex items-center">
                            {isFollowing ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={followLoading === post.author.username}
                                onClick={() => handleUnfollow(post.author.username)}
                                className="ml-1 text-xs sm:text-sm"
                              >
                                {followLoading === post.author.username ? '...' : 'Отписаться'}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={followLoading === post.author.username}
                                onClick={() => handleFollow(post.author.username)}
                                className="ml-1 text-xs sm:text-sm"
                              >
                                {followLoading === post.author.username ? '...' : 'Подписаться'}
                              </Button>
                            )}
                          </div>
                        )}
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
                                <Link to={`/u/users/${post.author.username}`}>Посмотреть профиль</Link>
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
                      <div className="mb-2 whitespace-pre-line text-sm sm:text-base">{post.text}</div>
                      {post.location && (
                        <div className="mb-2 text-sm text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          {post.location}
                        </div>
                      )}
                      {post.image && <img src={post.image} alt="post" className="max-h-48 sm:max-h-60 object-contain rounded" />}
                      <hr className="my-2 sm:my-3" />
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <button
                            className={`inline-flex items-center h-7 rounded-full px-3 gap-1 transition-colors border ${
                              isLiked
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-transparent text-red-600 hover-secondary'
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
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-transparent text-amber-600 hover-secondary'
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
                                ? 'bg-pink-500 text-white hover:bg-pink-600'
                                : 'bg-transparent text-pink-600 hover-secondary'
                            }`}
                            onClick={() => handleWowPost(post._id)}
                            disabled={!userId}
                          >
                            <FaRegGrinStars size={16} className="" />
                            <span className="hidden sm:inline">WOW!</span>
                            <span className="min-w-3">{post.wows?.length || 0}</span>
                          </button>
                        </div>
                        <span className="ml-auto">{format(new Date(post.createdAt), 'dd.MM', { locale: ru })} в {format(new Date(post.createdAt), 'HH:mm', { locale: ru })}</span>
                      </div>
                    </div>
                  );
                })
              )}
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
          className="fixed bottom-20 md:bottom-2 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </SocialContainer>
  );
};

export default SocialMainPage; 