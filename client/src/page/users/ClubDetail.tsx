import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader, AlertCircle, Users, Calendar, User, ArrowLeft, UserPlus, UserMinus, Settings, Globe, Phone, Mail, MapPinIcon } from "lucide-react";
import SocialHeader from "@/components/social-header";
import { getClubByUsernameQueryFn, joinClubMutationFn, leaveClubMutationFn, getClubPostsQueryFn, createClubPostMutationFn, deleteUserPostMutationFn, likeUserPostMutationFn, fireUserPostMutationFn, wowUserPostMutationFn } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import useAuth from "@/hooks/api/use-auth";
import { useState, useEffect } from "react";
import CreateClubPostBlock from "@/components/CreateClubPostBlock";
import { FaHeart, FaFire, FaRegGrinStars } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";

interface Club {
  _id: string;
  name: string;
  username: string;
  description: string;
  avatar: string | null;
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
  actionButton: {
    show: boolean;
    type: 'website' | 'phone' | 'email';
    value: string;
    text: string;
  };
  showCreator?: boolean;
  createdAt: string;
}

interface ClubPost {
  _id: string;
  text: string;
  image?: string | null;
  location?: string | null;
  isPublic?: boolean;
  createdAt: string;
  author: string;
  likes?: string[];
  fires?: string[];
  wows?: string[];
}

const ClubDetail = () => {
  const { username } = useParams<{ username: string }>();
  const { data: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [postLoading, setPostLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { data: clubData, isLoading, error } = useQuery({
    queryKey: ['club', username],
    queryFn: () => getClubByUsernameQueryFn(username || ''),
    enabled: !!username,
  });

  // Запрос постов клуба
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['club-posts', username],
    queryFn: () => getClubPostsQueryFn(username || ''),
    enabled: !!username,
  });

  // Обновляем состояние постов при получении данных
  useEffect(() => {
    if (postsData?.posts) {
      setPosts(postsData.posts);
    }
  }, [postsData]);

  const joinClubMutation = useMutation({
    mutationFn: joinClubMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', username] });
      setIsJoining(false);
    },
    onError: () => {
      setIsJoining(false);
    }
  });

  const leaveClubMutation = useMutation({
    mutationFn: leaveClubMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', username] });
      setIsJoining(false);
    },
    onError: () => {
      setIsJoining(false);
    }
  });

  const handleJoinClub = () => {
    if (clubData?.club?._id) {
      setIsJoining(true);
      joinClubMutation.mutate(clubData.club._id);
    }
  };

  const handleLeaveClub = () => {
    if (clubData?.club?._id) {
      setIsJoining(true);
      leaveClubMutation.mutate(clubData.club._id);
    }
  };

  // Обработка кнопки действия
  const handleActionButtonClick = () => {
    if (!club.actionButton?.value) {
      alert('Действие не настроено');
      return;
    }

    switch (club.actionButton.type) {
      case 'website':
        window.open(club.actionButton.value, '_blank', 'noopener,noreferrer');
        break;
      case 'phone':
        window.location.href = `tel:${club.actionButton.value}`;
        break;
      case 'email':
        window.location.href = `mailto:${club.actionButton.value}`;
        break;
      default:
        alert('Неизвестный тип действия');
    }
  };

  // Обработчики для постов
  const handleCreatePost = async (postData: {
    text: string;
    image?: string | null;
    location?: string;
    isPublic: boolean;
  }) => {
    if (!username) return;
    setPostLoading(true);
    try {
      await createClubPostMutationFn(username, postData);
      // Обновить посты
      const data = await getClubPostsQueryFn(username);
      setPosts(data.posts || []);
    } finally {
      setPostLoading(false);
    }
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

  const handleLikePost = async (postId: string) => {
    const userId = currentUser?.user?._id;
    if (!userId) return;
    const res = await likeUserPostMutationFn(postId);
    setPosts(posts => posts.map(p => p._id === postId ? { 
      ...p, 
      likes: res.likesCount ? [...(p.likes || []), userId] : (p.likes || []).filter(id => id !== userId) 
    } : p));
  };

  const handleFirePost = async (postId: string) => {
    const userId = currentUser?.user?._id;
    if (!userId) return;
    const res = await fireUserPostMutationFn(postId);
    setPosts(posts => posts.map(p => p._id === postId ? {
      ...p,
      fires: res.fired ? [...(p.fires || []), userId] : (p.fires || []).filter(id => id !== userId)
    } : p));
  };

  const handleWowPost = async (postId: string) => {
    const userId = currentUser?.user?._id;
    if (!userId) return;
    const res = await wowUserPostMutationFn(postId);
    setPosts(posts => posts.map(p => p._id === postId ? {
      ...p,
      wows: res.wowed ? [...(p.wows || []), userId] : (p.wows || []).filter(id => id !== userId)
    } : p));
  };

  if (!username) {
    return (
      <div className="tsygram-dark bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ошибка</h1>
          <p>Имя пользователя клуба не указано</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="tsygram-dark bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
          <h1 className="text-2xl font-bold mb-2">Загрузка клуба</h1>
          <p className="text-muted-foreground">Пожалуйста, подождите...</p>
        </div>
      </div>
    );
  }

  if (error || !clubData?.club) {
    return (
      <div className="tsygram-dark bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Клуб не найден</h1>
          <p>Клуб с именем @{username} не существует</p>
        </div>
      </div>
    );
  }

  const club: Club = clubData.club;
  
  // Проверяем, является ли пользователь создателем клуба
  const isCreator = currentUser?.user?._id === club.creator._id;
  
  // Проверяем, является ли пользователь участником клуба
  const isMember = club.members.some(member => member._id === currentUser?.user?._id);

  return (
    <div className="tsygram-dark bg-background text-foreground">
      <SocialHeader />
      <div className="min-h-svh flex justify-center px-4 sm:px-2 lg:px-8 pb-16 md:pb-0">
        <div className="w-full max-w-7xl flex gap-2">
          
          {/* Левая часть: Информация о клубе */}
          <aside className="hidden lg:flex flex-col w-80 py-4 sm:py-8 gap-4 sm:gap-6 min-h-svh sticky top-0">
            {/* Кнопка назад */}
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="inline-flex items-center h-auto rounded-full px-4 py-1 text-sm hover-secondary border border-border"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>

            {/* Аватарка и название клуба */}
            <div className="bg-card border border-border rounded-3xl p-4">
              <div className="flex flex-col items-center text-center">
                {club.avatar ? (
                  <img 
                    src={`http://localhost:3000/uploads/${club.avatar.split('/').pop()}`} 
                    alt={club.name}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl mb-3">
                    {club.name[0].toUpperCase()}
                  </div>
                )}
                <h1 className="text-xl font-bold mb-1">{club.name}</h1>
                <div className="text-sm text-muted-foreground mb-3">@{club.username}</div>
                {club.description && (
                  <p className="text-sm text-muted-foreground mb-3">{club.description}</p>
                )}
                <Badge variant="secondary" className="text-xs mb-3">
                  {club.members.length} участников
                </Badge>
                
                {/* Кнопка присоединения/покидания клуба */}
                {currentUser?.user && !isCreator && (
                  <div className="w-full rounded-3xl">
                    {isMember ? (
                      <Button
                        onClick={handleLeaveClub}
                        disabled={isJoining}
                        variant="outline"
                        className="w-full rounded-3xl"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        {isJoining ? "Покидаем..." : "Покинуть клуб"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleJoinClub}
                        disabled={isJoining}
                        className="w-full rounded-3xl"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isJoining ? "Присоединяемся..." : "Присоединиться к клубу"}
                      </Button>
                    )}
                  </div>
                )}
                
                 {/* Настройки клуба - только для создателя */}
                 {isCreator && (
                   <div className="w-full rounded-3xl">
                     <Link to={`/u/clubs/${club.username}/settings`} className="block w-full">
                       <Button
                         variant="outline"
                         className="w-full rounded-3xl"
                       >
                         <Settings className="w-4 h-4 mr-2" />
                         Настройки клуба
                       </Button>
                     </Link>
                   </div>
                 )}

                 {/* Кнопка действия клуба */}
                 {club.actionButton?.show && club.actionButton?.value && (
                   <div className="w-full rounded-3xl mt-3">
                     <Button
                       onClick={handleActionButtonClick}
                       className="w-full rounded-3xl"
                     >
                       {club.actionButton.type === 'website' && <Globe className="w-4 h-4 mr-2" />}
                       {club.actionButton.type === 'phone' && <Phone className="w-4 h-4 mr-2" />}
                       {club.actionButton.type === 'email' && <Mail className="w-4 h-4 mr-2" />}
                       {club.actionButton.text}
                     </Button>
                   </div>
                 )}
                
              </div>
            </div>

            {/* Создатель клуба */}
            {(club.showCreator !== false) && (
              <div className="bg-card border border-border rounded-3xl p-4">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Создатель клуба
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={club.creator.profilePicture || ''} alt={club.creator.name} />
                    <AvatarFallback>{club.creator.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{club.creator.name}</div>
                    <div className="text-xs text-muted-foreground truncate">@{club.creator.username}</div>
                    {club.creator.userRole && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {club.creator.userRole === "coach" ? "Тренер" : "Спортсмен"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Участники клуба */}
            <div className="bg-card border border-border rounded-3xl p-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Участники ({club.members.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {club.members.map((member) => (
                  <Link
                    key={member._id}
                    to={`/u/users/${member.username}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover-secondary transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.profilePicture || ''} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{member.name}</div>
                      <div className="text-xs text-muted-foreground truncate">@{member.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Дата создания */}
            <div className="bg-card border border-border rounded-3xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>Создан {format(new Date(club.createdAt), 'd MMM yyyy', { locale: ru })}</span>
              </div>
            </div>
          </aside>
          
          {/* Центральная часть: посты клуба */}
          <main className="flex-1 flex flex-col items-center lg:items-start lg:ml-2 py-4 sm:py-6">
            <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-4">
              <div className="mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold">Посты клуба {club.name}</h1>
              </div>

              {/* Форма создания поста - только для участников клуба */}
              {isMember && (
                <CreateClubPostBlock
                  onPostCreate={handleCreatePost}
                  isLoading={postLoading}
                  clubName={club.name}
                  clubAvatar={club.avatar}
                />
              )}

              {/* Посты клуба */}
              {postsLoading ? (
                <Card className="rounded-3xl">
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      <Loader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                      <p>Загружаем посты...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : posts.length === 0 ? (
                <Card className="rounded-3xl">
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      <p>Пока нет постов от клуба {club.name}</p>
                      {!isMember && (
                        <p className="text-sm mt-2">Присоединитесь к клубу, чтобы создавать посты</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => {
                    const userId = currentUser?.user?._id;
                    const isLiked = post.likes && userId ? post.likes.includes(userId) : false;
                    const isFired = post.fires && userId ? post.fires.includes(userId) : false;
                    const isWowed = post.wows && userId ? post.wows.includes(userId) : false;
                    
                    return (
                      <Card key={post._id} className="rounded-3xl">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={club.avatar || ''} alt={club.name} />
                                <AvatarFallback>{club.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-semibold">{club.name}</span>
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
                                    <Link to={`/u/clubs/${club.username}`}>Посмотреть клуб</Link>
                                  </DropdownMenuItem>
                                  {isCreator && (
                                    <>
                                      <DropdownMenuItem>Редактировать</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => { setDeleteDialogOpen(true); setDeletePostId(post._id); }}>Удалить</DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="mb-3 whitespace-pre-line">{post.text}</div>
                          {post.location && (
                            <div className="mb-3 text-sm text-muted-foreground flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {post.location}
                            </div>
                          )}
                          {post.image && <img src={post.image} alt="post" className="max-h-60 object-contain rounded mb-3" />}
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
                                <FaHeart size={16} />
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
                                <FaFire size={16} />
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
                                <FaRegGrinStars size={16} />
                                <span className="hidden sm:inline">WOW!</span>
                                <span className="min-w-3">{post.wows?.length || 0}</span>
                              </button>
                            </div>
                            <span>{format(new Date(post.createdAt), 'dd.MM', { locale: ru })} в {format(new Date(post.createdAt), 'HH:mm', { locale: ru })}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Диалог подтверждения удаления поста */}
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
      
      {/* Нижнее мобильное меню */}
    </div>
  );
};

export default ClubDetail;
