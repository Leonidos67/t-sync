import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader, ArrowUp } from "lucide-react";
import SocialContainer from "@/components/SocialContainer";
import { getAllClubsQueryFn, getAllPublicClubsQueryFn, getUserCreatedClubsQueryFn } from "@/lib/api";
import useAuth from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Club {
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
  createdAt: string;
}

const ClubsPage = () => {
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [myClubsLoading, setMyClubsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { data: currentUser } = useAuth();

  useEffect(() => {
    // Загрузить все клубы
    setLoading(true);
    if (currentUser?.user) {
      // Если пользователь авторизован, используем обычный API
      getAllClubsQueryFn()
        .then((data) => setAllClubs(data.clubs || []))
        .catch(() => setAllClubs([]))
        .finally(() => setLoading(false));
    } else {
      // Если пользователь не авторизован, используем публичный API
      getAllPublicClubsQueryFn()
        .then((data) => setAllClubs(data.clubs || []))
        .catch(() => {
          // Fallback для неавторизованных пользователей
          fetch("/api/user/public/clubs")
            .then((res) => res.json())
            .then((data) => setAllClubs(data.clubs || []))
            .catch(() => setAllClubs([]));
        })
        .finally(() => setLoading(false));
    }

    // Загрузить мои клубы (только для авторизованных пользователей)
    if (currentUser?.user) {
      setMyClubsLoading(true);
      getUserCreatedClubsQueryFn()
        .then((data) => setMyClubs(data.clubs || []))
        .catch(() => setMyClubs([]))
        .finally(() => setMyClubsLoading(false));
    }
  }, [currentUser]);

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
        <h1 className="text-2xl sm:text-3xl font-bold">Клубы</h1>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/u/club-create">
            <Plus className="w-4 h-4 mr-2" />
            Создать клуб
          </Link>
        </Button>
      </div>
      
      <div className="bg-card border border-border rounded-3xl p-4">
        <div className="font-semibold text-base sm:text-lg mb-3">Мои клубы</div>
        {myClubsLoading ? (
          <div className="flex justify-center items-center h-16">
            <Loader className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : myClubs.length === 0 ? (
          <div className="text-muted-foreground text-sm">Вы не создали ни одного клуба</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto py-1">
            {myClubs.map(club => (
              <Link
                key={club._id}
                to={`/u/clubs/${club.username}`}
                className="flex items-center gap-3 p-3 rounded-lg hover-secondary transition-colors flex-shrink-0 border border-border bg-card"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {club.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate max-w-[180px]">{club.name}</div>
                  <div className="text-xs text-muted-foreground">{club.members.length} участников</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      ) : allClubs.length === 0 ? (
        <div className="text-center text-muted-foreground">Клубы не найдены</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allClubs.map(club => (
            <Link
              key={club._id}
              to={`/u/clubs/${club.username}`}
              className="bg-card border border-border rounded-3xl p-4 hover-secondary transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {club.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">{club.name}</div>
                  <div className="text-sm text-muted-foreground">@{club.username}</div>
                </div>
              </div>
              {club.description && (
                <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {club.description}
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={club.creator.profilePicture || ''} alt={club.creator.name} />
                    <AvatarFallback className="text-xs">{club.creator.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span>Создатель: {club.creator.name}</span>
                </div>
                <span>{club.members.length} участников</span>
              </div>
            </Link>
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

export default ClubsPage;

