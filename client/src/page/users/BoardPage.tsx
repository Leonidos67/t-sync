import React, { useEffect, useMemo, useState } from "react";
import SocialContainer from "@/components/SocialContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/api/use-auth";
import { Link } from "react-router-dom";
import { getFollowingQueryFn } from "@/lib/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader, Search, Plus } from "lucide-react";

type CoachProfile = {
  id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  
  // Персональная информация
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  city: string;
  
  // Контактная информация
  phone: string;
  email: string;
  telegram: string;
  whatsapp: string;
  
  // Профессиональная информация
  experience: string;
  education: string;
  certificates: string;
  workplaces: string;
  
  // Специализация
  specialties: string;
  sports: string[];
  ageGroups: string[];
  skillLevels: string[];
  trainingTypes: string[];
  
  // Ценообразование
  individualPrice: string;
  groupPrice: string;
  onlinePrice: string;
  packages: string;
  
  // Расписание
  workDays: string[];
  workTime: string;
  homeVisits: boolean;
  onlineTraining: boolean;
  
  // Социальные сети
  socialLinks: Array<{ type: string; url: string }>;
  
  // Дополнительная информация
  achievements: string;
  philosophy: string;
  approach: string;
  studentAchievements: string;
  motivation: string;
};

const STORAGE_KEY = "coach_board_profiles_v1";

export default function BoardPage() {
  const { data: currentUser } = useAuth();
  const authedUser = currentUser?.user;
  
  console.log('📋 BoardPage - Component rendered');

  const [profiles, setProfiles] = useState<CoachProfile[]>([]);
  const [achievements, setAchievements] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState<Array<{ username: string; name: string; profilePicture: string | null }>>([]);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

  useEffect(() => {
    const loadProfiles = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        console.log('📋 BoardPage - Raw localStorage data:', raw);
        if (raw) {
          const parsed = JSON.parse(raw);
          setProfiles(parsed);
          console.log('📋 BoardPage - Loaded profiles:', parsed.length);
        } else {
          console.log('📋 BoardPage - No data in localStorage');
          setProfiles([]);
        }
      } catch (error) {
        console.error('❌ BoardPage - Error loading profiles:', error);
        setProfiles([]);
      }
    };
    
    loadProfiles();
    
    // Обновляем профили при фокусе на окне (когда пользователь возвращается на страницу)
    const handleFocus = () => {
      console.log('📋 BoardPage - Window focused, reloading profiles');
      loadProfiles();
    };
    
    // Также обновляем при изменении localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        console.log('📋 BoardPage - localStorage changed, reloading profiles');
        loadProfiles();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    
    // Принудительно обновляем данные каждые 2 секунды для отладки
    const interval = setInterval(() => {
      console.log('📋 BoardPage - Periodic reload');
      loadProfiles();
    }, 2000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  useEffect(() => {
    if (!authedUser?.username) return;
    setIsLoadingFollowing(true);
    getFollowingQueryFn(authedUser.username)
      .then((data) => setFollowing(data.following || []))
      .catch(() => setFollowing([]))
      .finally(() => setIsLoadingFollowing(false));
  }, [authedUser]);

  // creation moved to /u/board/create

  const filtered = useMemo(() => {
    console.log('🔍 BoardPage - Filtering profiles:', profiles.length);
    const q = search.trim().toLowerCase();
    if (!q) {
      console.log('🔍 BoardPage - No search query, returning all profiles:', profiles.length);
      return profiles;
    }
    const filtered = profiles.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.achievements.toLowerCase().includes(q) ||
      p.specialties.toLowerCase().includes(q) ||
      p.sports.some(sport => sport.toLowerCase().includes(q)) ||
      p.experience.toLowerCase().includes(q) ||
      p.education.toLowerCase().includes(q) ||
      p.certificates.toLowerCase().includes(q) ||
      p.workplaces.toLowerCase().includes(q) ||
      p.philosophy.toLowerCase().includes(q) ||
      p.approach.toLowerCase().includes(q) ||
      p.studentAchievements.toLowerCase().includes(q) ||
      p.motivation.toLowerCase().includes(q) ||
      p.ageGroups.some(group => group.toLowerCase().includes(q)) ||
      p.skillLevels.some(level => level.toLowerCase().includes(q)) ||
      p.trainingTypes.some(type => type.toLowerCase().includes(q))
    );
    console.log('🔍 BoardPage - Filtered results:', filtered.length);
    return filtered;
  }, [profiles, search]);

  return (
    <SocialContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Доска тренеров</h1>
        <div className="flex gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/u/board/create">
              <Plus className="w-4 h-4 mr-2" />
              Создать анкету
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setProfiles([]);
              console.log('🗑️ BoardPage - Cleared localStorage');
            }}
          >
            Очистить
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const raw = localStorage.getItem(STORAGE_KEY);
              console.log('🔄 BoardPage - Manual reload, raw data:', raw);
              if (raw) {
                try {
                  const parsed = JSON.parse(raw);
                  setProfiles(parsed);
                  console.log('🔄 BoardPage - Manual reload success:', parsed.length);
                } catch (error) {
                  console.error('🔄 BoardPage - Manual reload error:', error);
                }
              }
            }}
          >
            Обновить
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="bg-secondary rounded-full px-4 h-12 flex items-center hover:bg-secondary/80 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground mr-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск анкеты"
            className="w-full bg-transparent border-0 h-full py-0 focus-visible:ring-0 focus:ring-0 outline-none placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Пока нет анкет
            {profiles.length > 0 && (
              <div className="text-xs mt-2 text-muted-foreground">
                Всего анкет: {profiles.length}, но они не проходят фильтр поиска
              </div>
            )}
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="p-4 sm:p-6 border border-border rounded-3xl bg-card relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              {p.profilePicture && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10"
                  style={{ backgroundImage: `url(${p.profilePicture})` }}
                />
              )}
              <div className="relative">
                {/* Заголовок карточки */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={p.profilePicture || ''} alt={p.name} />
                    <AvatarFallback className="text-lg">{p.firstName?.[0]}{p.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">{p.firstName} {p.lastName}</h3>
                      <div className="text-sm text-muted-foreground">@{p.username}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{p.age} лет</span>
                      <span>•</span>
                      <span>{p.city}</span>
                      {p.experience && (
                        <>
                          <span>•</span>
                          <span>{p.experience} лет опыта</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Виды спорта */}
                {p.sports.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Виды спорта</div>
                    <div className="flex flex-wrap gap-1">
                      {p.sports.map((sport, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Дополнительные специализации */}
                {p.specialties && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Дополнительные специализации</div>
                    <div className="text-sm">{p.specialties}</div>
                  </div>
                )}

                {/* Возрастные группы и уровни */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.ageGroups.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.ageGroups.map((group, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {group}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.skillLevels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.skillLevels.map((level, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {level}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.trainingTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.trainingTypes.map((type, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Цены */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {p.individualPrice && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Индивидуально:</span>
                      <span className="font-medium ml-1">{p.individualPrice} ₽/час</span>
                    </div>
                  )}
                  {p.groupPrice && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Группа:</span>
                      <span className="font-medium ml-1">{p.groupPrice} ₽/час</span>
                    </div>
                  )}
                  {p.onlinePrice && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Онлайн:</span>
                      <span className="font-medium ml-1">{p.onlinePrice} ₽/час</span>
                    </div>
                  )}
                </div>

                {/* Достижения */}
                {p.achievements && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Достижения</div>
                    <div className="text-sm whitespace-pre-line line-clamp-3">{p.achievements}</div>
                  </div>
                )}

                {/* Философия */}
                {p.philosophy && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Философия</div>
                    <div className="text-sm line-clamp-2">{p.philosophy}</div>
                  </div>
                )}

                {/* Контакты */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="text-sm text-blue-600 hover:underline">
                      📞 {p.phone}
                    </a>
                  )}
                  {p.telegram && (
                    <a href={`https://t.me/${p.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      📱 {p.telegram}
                    </a>
                  )}
                  {p.whatsapp && (
                    <a href={`https://wa.me/${p.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                      💬 WhatsApp
                    </a>
                  )}
                </div>

                {/* Социальные сети */}
                {p.socialLinks.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {p.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.type === 'instagram' && '📷 Instagram'}
                        {link.type === 'youtube' && '🎥 YouTube'}
                        {link.type === 'vk' && '📘 VK'}
                        {link.type === 'telegram' && '✈️ Telegram'}
                        {link.type === 'website' && '🌐 Сайт'}
                      </a>
                    ))}
                  </div>
                )}

                {/* Расписание */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {p.workDays.length > 0 && (
                    <span>📅 {p.workDays.join(', ')}</span>
                  )}
                  {p.workTime && (
                    <span>🕐 {p.workTime}</span>
                  )}
                  {p.homeVisits && (
                    <span>🏠 Выезд к клиенту</span>
                  )}
                  {p.onlineTraining && (
                    <span>💻 Онлайн-тренировки</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SocialContainer>
  );
}


