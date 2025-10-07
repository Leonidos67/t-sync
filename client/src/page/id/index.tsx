import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  // Globe,
  // Clock,
  Trash2,
  User,
  // Search,
  Megaphone,
  ExternalLink,
  Edit3,
  Link2,
  Lock,
  // Download
} from "lucide-react";
import { Grip } from "@/components/ui/motion/Grip";
import useAuth from "@/hooks/api/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { updatePersonalDataMutationFn, logoutMutationFn, updateNotificationSettingsMutationFn, changePasswordMutationFn } from "@/lib/api";
import IdLogo from "@/components/logo/id-logo";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
// import LogoutDialog from "@/components/asidebar/logout-dialog";

const IdPage = () => {
  const { data: authData, isLoading } = useAuth();
  const navigate = useNavigate();
  const user = authData?.user;
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState('general');
  // const [showHints, setShowHints] = useState(false);
  const [appearance, setAppearance] = useState(theme);
  const [personalData, setPersonalData] = useState({
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    city: ''
  });
  // Состояние уведомлений
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tasks: true,
    newTasks: true,
    taskUpdates: true,
    projectUpdates: true,
  });
  const [originalNotifications, setOriginalNotifications] = useState({
    email: true,
    push: true,
    tasks: true,
    newTasks: true,
    taskUpdates: true,
    projectUpdates: true,
  });
  const [isNotificationsChanged, setIsNotificationsChanged] = useState(false);
  const [originalPersonalData, setOriginalPersonalData] = useState({
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    city: ''
  });
  const [isPersonalDataChanged, setIsPersonalDataChanged] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [cacheProgress, setCacheProgress] = useState(0);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheData, setCacheData] = useState({
    size: 0, // в байтах
    fileCount: 0,
    lastCleared: null as Date | null
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showBirthdayPrompt, setShowBirthdayPrompt] = useState(true);
  // Обработка deep-link параметров (?tab=&settingsTab=)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const settingsParam = searchParams.get('settingsTab');
    if (tabParam === 'settings') {
      setActiveTab('settings');
    }
    if (settingsParam) {
      setSettingsTab(settingsParam);
    }
  }, [searchParams]);
  // Эффект для проверки даты рождения
  useEffect(() => {
    if (user) {
      const userBirthDate = (user as Record<string, unknown>).birthDate as string;
      // Если дата рождения заполнена, скрываем блок
      if (userBirthDate && userBirthDate.trim() !== '') {
        setShowBirthdayPrompt(false);
      } else {
        setShowBirthdayPrompt(true);
      }
    }
  }, [user]);
  const handleCloseBirthdayPrompt = () => {
    setShowBirthdayPrompt(false);
  };

  // Мутация для обновления личных данных
  const updatePersonalDataMutation = useMutation({
    mutationFn: updatePersonalDataMutationFn,
    onSuccess: (data) => {
      console.log('Данные успешно сохранены:', data);
      setOriginalPersonalData(personalData);
      setIsPersonalDataChanged(false);
      setDisplayName(data.user.name);
      toast({
        title: "Уведомление",
        description: "Личные данные успешно сохранены!",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error('Ошибка при сохранении данных:', error);
      toast({
        title: "Уведомление",
        description: "Ошибка при сохранении данных",
        variant: "destructive",
      });
    }
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const slidingBgRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { open: isLogoutConfirmOpen, onOpenDialog: openLogoutConfirm, onCloseDialog: closeLogoutConfirm } = useConfirmDialog();

  // Мутация для выхода из системы
  const logoutMutation = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["authUser"],
      });
      navigate("/");
      closeLogoutConfirm();
    },
    onError: (error) => {
      console.error('Ошибка при выходе из системы:', error);
      // В случае ошибки все равно очищаем localStorage и перенаправляем
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/");
    }
  });

  const tabs = useMemo(() => [
    { id: 'profile', label: 'Основная информация' },
    // { id: 'security', label: 'Подключенные аккаунты' },
    { id: 'activity', label: 'Профили' },
    { id: 'settings', label: 'Настройки' }
  ], []);

  const settingsTabs = useMemo(() => [
    { id: 'general', label: 'Общие', icon: Settings },
    { id: 'location', label: 'Личные данные', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Megaphone },
    { id: 'security', label: 'Безопасность', icon: Lock },
    // { id: 'search', label: 'Результаты поиска', icon: Search },
    { id: 'cache', label: 'Очистка кеша', icon: Trash2 }
  ], []);

  // Закрытие модального окна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsServicesModalOpen(false);
      }
    };

    if (isServicesModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesModalOpen]);

  // Обновление позиции sliding background
  useEffect(() => {
    const targetTab = hoveredTab || activeTab;
    const tabIndex = tabs.findIndex(tab => tab.id === targetTab);
    const tabElement = tabsRef.current[tabIndex];
    
    if (tabElement && slidingBgRef.current) {
      const tabRect = tabElement.getBoundingClientRect();
      const containerRect = tabElement.parentElement?.getBoundingClientRect();
      
      if (containerRect) {
        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;
        
        slidingBgRef.current.style.left = `${left}px`;
        slidingBgRef.current.style.width = `${width}px`;
      }
    }
  }, [activeTab, hoveredTab, tabs]);

  // Синхронизация appearance с текущей темой
  useEffect(() => {
    setAppearance(theme);
  }, [theme]);

  // Инициализация личных данных из профиля пользователя
  useEffect(() => {
    if (user) {
      const userData = {
        phoneNumber: (user as Record<string, unknown>).phoneNumber as string || '',
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        gender: (user as Record<string, unknown>).gender as string || '',
        birthDate: (user as Record<string, unknown>).birthDate as string || '',
        city: (user as Record<string, unknown>).city as string || ''
      };
      setPersonalData(userData);
      setOriginalPersonalData(userData);
      setDisplayName(user.name || '');

      // Инициализация настроек уведомлений
      const userNotificationSettings = (user as Record<string, unknown>).notificationSettings as Record<string, boolean> || {};
      const notificationData = {
        email: userNotificationSettings.email ?? true,
        push: userNotificationSettings.push ?? true,
        tasks: userNotificationSettings.tasks ?? true,
        newTasks: userNotificationSettings.newTasks ?? true,
        taskUpdates: userNotificationSettings.taskUpdates ?? true,
        projectUpdates: userNotificationSettings.projectUpdates ?? true,
      };
      setNotifications(notificationData);
      setOriginalNotifications(notificationData);
    }
  }, [user]);

  // Отслеживание изменений в личных данных
  useEffect(() => {
    const hasChanges = Object.keys(personalData).some(
      key => personalData[key as keyof typeof personalData] !== originalPersonalData[key as keyof typeof originalPersonalData]
    );
    setIsPersonalDataChanged(hasChanges);
  }, [personalData, originalPersonalData]);

  // Обновление отображаемого имени при изменении personalData
  useEffect(() => {
    const fullName = `${personalData.firstName} ${personalData.lastName}`.trim();
    console.log('Обновление displayName:', { firstName: personalData.firstName, lastName: personalData.lastName, fullName });
    if (fullName) {
      setDisplayName(fullName);
    }
  }, [personalData.firstName, personalData.lastName]);

  // Отслеживание изменений уведомлений
  useEffect(() => {
    const changed =
      notifications.email !== originalNotifications.email ||
      notifications.push !== originalNotifications.push ||
      notifications.tasks !== originalNotifications.tasks ||
      notifications.newTasks !== originalNotifications.newTasks ||
      notifications.taskUpdates !== originalNotifications.taskUpdates ||
      notifications.projectUpdates !== originalNotifications.projectUpdates;
    setIsNotificationsChanged(changed);
  }, [notifications, originalNotifications]);

  const toggleNotification = (key: 'email' | 'push' | 'tasks' | 'newTasks' | 'taskUpdates' | 'projectUpdates', value?: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: typeof value === 'boolean' ? value : !prev[key],
    }));
  };

  // Мутация для обновления настроек уведомлений
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: updateNotificationSettingsMutationFn,
    onSuccess: (data) => {
      console.log('Настройки уведомлений успешно сохранены:', data);
      setOriginalNotifications(notifications);
      setIsNotificationsChanged(false);
      toast({
        title: "Уведомление",
        description: "Настройки уведомлений успешно сохранены!",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error('Ошибка при сохранении настроек уведомлений:', error);
      toast({
        title: "Уведомление",
        description: "Ошибка при сохранении настроек уведомлений",
        variant: "destructive",
      });
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePasswordMutationFn,
    onSuccess: (data) => {
      toast({
        title: "Успешно",
        description: data.message || "Пароль успешно изменён",
        variant: "success",
      });
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: unknown) => {
      const description = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Не удалось изменить пароль";
      toast({
        title: "Ошибка",
        description,
        variant: "destructive",
      });
    },
  });

  const handleSaveNotifications = () => {
    updateNotificationSettingsMutation.mutate(notifications);
  };

  // Инициализируем данные о кеше
  useEffect(() => {
    const updateCacheData = () => {
      const size = calculateCacheSize();
      const fileCount = calculateCacheFileCount();
      const lastCleared = localStorage.getItem('lastCacheCleared');
      
      setCacheData({
        size,
        fileCount,
        lastCleared: lastCleared ? new Date(lastCleared) : null
      });
    };

    // Обновляем данные при загрузке
    updateCacheData();

    // Обновляем данные каждые 30 секунд
    const interval = setInterval(updateCacheData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAppearanceChange = (value: string) => {
    const themeValue = value as 'light' | 'dark';
    setAppearance(themeValue);
    setTheme(themeValue);
  };

  const handlePersonalDataChange = (field: string, value: string) => {
    console.log('Изменение поля:', field, 'новое значение:', value);
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePersonalData = () => {
    const payload: Partial<typeof personalData> = {};
    (Object.keys(personalData) as Array<keyof typeof personalData>).forEach((key) => {
      if (personalData[key] !== originalPersonalData[key]) {
        payload[key] = personalData[key];
      }
    });
    // Если нет изменений, не отправляем запрос
    if (Object.keys(payload).length === 0) {
      toast({ title: "Нет изменений", description: "Измените хотя бы одно поле", variant: "default" });
      return;
    }
    updatePersonalDataMutation.mutate(payload);
  };

  const handleEditProfile = () => {
    setActiveTab('settings');
    setSettingsTab('location');
  };

  // Функция для вычисления размера кеша
  const calculateCacheSize = () => {
    try {
      let totalSize = 0;
      
      // Получаем размер localStorage
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          const value = localStorage[key];
          // Учитываем размер ключа + значение + накладные расходы (примерно 2 байта на символ в UTF-16)
          totalSize += (key.length + value.length) * 2;
        }
      }
      
      // Получаем размер sessionStorage
      for (const key in sessionStorage) {
        if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
          const value = sessionStorage[key];
          totalSize += (key.length + value.length) * 2;
        }
      }
      
      // Получаем размер IndexedDB (если доступен)
      if ('indexedDB' in window) {
        // Примерная оценка размера IndexedDB на основе количества баз данных
        const dbCount = 3; // Примерное количество баз данных приложения
        totalSize += dbCount * 50000; // ~50KB на базу данных
      }
      
      // Получаем размер Service Worker кеша (если доступен)
      if ('caches' in window) {
        totalSize += 100000; // ~100KB для кеша Service Worker
      }
      
      // Добавляем размер cookies (примерно)
      const cookieSize = document.cookie.length * 2;
      totalSize += cookieSize;
      
      return totalSize;
    } catch {
      // Fallback значение на основе реальных данных
      return 150000; // ~150KB
    }
  };

  // Функция для подсчета файлов в кеше
  const calculateCacheFileCount = () => {
    try {
      let fileCount = 0;
      
      // Подсчитываем ключи в localStorage
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          fileCount++;
        }
      }
      
      // Подсчитываем ключи в sessionStorage
      for (const key in sessionStorage) {
        if (Object.prototype.hasOwnProperty.call(sessionStorage, key)) {
          fileCount++;
        }
      }
      
      // Подсчитываем cookies
      if (document.cookie) {
        const cookieCount = document.cookie.split(';').length;
        fileCount += cookieCount;
      }
      
      // Добавляем файлы из IndexedDB (если доступен)
      if ('indexedDB' in window) {
        fileCount += 5; // Примерное количество объектов в IndexedDB
      }
      
      // Добавляем файлы из Service Worker кеша (если доступен)
      if ('caches' in window) {
        fileCount += 3; // Примерное количество кешированных ресурсов
      }
      
      // Добавляем файлы из кеша приложения (статические ресурсы)
      fileCount += 10; // CSS, JS, изображения и другие статические файлы
      
      return fileCount;
    } catch {
      return 15; // Fallback значение
    }
  };

  const handleClearCache = () => {
    setIsClearingCache(true);
    setCacheProgress(0);
    
    // Симуляция процесса очистки кеша
    const interval = setInterval(() => {
      setCacheProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsClearingCache(false);
          
          // Очищаем кеш после завершения
          try {
            localStorage.clear();
            sessionStorage.clear();
            // Сохраняем дату последней очистки
            localStorage.setItem('lastCacheCleared', new Date().toISOString());
          } catch (error) {
            console.warn('Не удалось очистить кеш:', error);
          }
          
          // Обновляем данные о кеше
          const newSize = calculateCacheSize();
          const newFileCount = calculateCacheFileCount();
          setCacheData({
            size: newSize,
            fileCount: newFileCount,
            lastCleared: new Date()
          });
          
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Основная информация</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Имя:</span>
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <span className="font-medium text-foreground">@{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-foreground">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Роль:</span>
                    <span className="font-medium text-foreground">
                      {user.userRole === "coach" ? "Тренер" : 
                       user.userRole === "athlete" ? "Спортсмен" : "Пользователь"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">На Atlass с:</span>
                    <span className="font-medium text-foreground">{format(new Date(user.createdAt), 'MMMM yyyy', { locale: ru })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        );
      case 'activity':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Профили</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Аккаунт пользователя */}
                <div 
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setActiveTab('settings');
                    setSettingsTab('location');
                  }}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                    <AvatarFallback className="text-lg">{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-foreground truncate">{user.name}</h3>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>

                {/* Кнопка добавления аккаунта */}
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border cursor-not-allowed opacity-50">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">Добавить аккаунт</span>
                    <p className="text-xs text-muted-foreground">Подключить дополнительный профиль</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'security':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link2 className="w-5 h-5" />
                <span>Подключенные аккаунты</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-8">
                <div className="space-y-4">
                  {/* Google аккаунт */}
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-foreground font-medium">Google</span>
                        <p className="text-muted-foreground text-sm">Подключен для входа в систему</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 dark:text-green-400">Подключен</span>
                      <Button variant="outline" size="sm" disabled>
                        Отключить
                      </Button>
                    </div>
                  </div>

                  {/* Telegram аккаунт */}
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-foreground font-medium">Telegram</span>
                        <p className="text-muted-foreground text-sm">Не подключен</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Подключить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <div className="flex flex-row sm:flex-row">
            {/* Левая боковая панель навигации */}
            <div className="w-1/8 sm:w-64 bg-card rounded-lg mb-0 sm:mb-0 mr-4 sm:mr-6">
              <nav className="space-y-2 flex-col sm:flex-col overflow-x-auto sm:overflow-x-visible">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsTab(tab.id)}
                      className={`w-full flex items-center justify-start space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        settingsTab === tab.id
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Правая область контента */}
            <div className="flex-1 bg-card border border-border rounded-lg p-6 scrollbar overflow-y-auto">
                {settingsTab === 'general' && (
                  <div className="space-y-4">
                    {/* Единый профиль */}
                    <div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-not-allowed opacity-50">
                        <div>
                          <span className="text-foreground font-medium">Единый профиль</span>
                          <p className="text-muted-foreground text-sm mt-1">Ваш профиль синхронизирован между всеми сервисами Atlass</p>
                        </div>
                        <Switch
                          checked={true}
                          disabled
                          className="opacity-50"
                        />
                      </div>
                    </div>

                    {/* Язык интерфейса
                    <div>
                      <h3 className="text-foreground text-lg mb-4">Язык интерфейса</h3>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-foreground" />
                          <span className="text-foreground">Русский</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div> */}

                    {/* Внешний вид */}
                    <div>
                      <div className="p-3 rounded-lg hover:bg-muted">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-foreground font-medium">Внешний вид</span>
                            <p className="text-muted-foreground text-sm mt-1">Выберите тему оформления приложения</p>
                          </div>
                        </div>
                        <RadioGroup value={appearance} onValueChange={handleAppearanceChange} className="space-y-2">
                          <div 
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleAppearanceChange('light')}
                          >
                            <div className="flex items-center space-x-3">
                              <Sun className="w-4 h-4 text-foreground" />
                              <span className="text-foreground text-sm">Всегда светлый</span>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                            <RadioGroupItem 
                              value="light" 
                              id="light" 
                            />
                          </div>
                          </div>
                          <div 
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleAppearanceChange('dark')}
                          >
                            <div className="flex items-center space-x-3">
                              <Moon className="w-4 h-4 text-foreground" />
                              <span className="text-foreground text-sm">Всегда тёмный</span>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                            <RadioGroupItem 
                              value="dark" 
                              id="dark" 
                            />
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* История в подсказках */}
                    <div>
                      <h3 className="text-foreground text-lg font-bold mb-6">Другие настройки</h3>
                      <div className="space-y-3">
                        {/*<div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-foreground" />
                            <span className="text-foreground">Показывать подсказки</span>
                          </div>
                          <Switch
                            checked={showHints}
                            onCheckedChange={setShowHints}
                          />
                        </div>*/}
                         <div 
                           className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                           onClick={() => setSettingsTab('security')}
                         >
                           <div className="flex items-center space-x-3">
                             <Lock className="w-5 h-5 text-foreground" />
                             <span className="text-foreground">Безопасность</span>
                           </div>
                           <ExternalLink className="w-4 h-4 text-muted-foreground" />
                         </div>
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                          onClick={() => setSettingsTab('cache')}
                        >
                          <div className="flex items-center space-x-3">
                            <Trash2 className="w-5 h-5 text-foreground" />
                            <span className="text-foreground">Очистить кеш</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Выход из аккаунта */
                    }
                    <div className="pt-4 border-t border-border">
                      <div>
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                          onClick={() => openLogoutConfirm()}
                        >
                          <div className="flex items-center space-x-3">
                            <LogOut className="w-5 h-5 text-foreground" />
                            <span className="text-foreground">Выйти из аккаунта</span>
                          </div>
                        </div>
                      </div>
                      {/* Удаление аккаунта
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-destructive/10 cursor-pointer">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        <span className="text-destructive font-medium">Удалить аккаунт</span>
                      </div> */}
                    </div>
                  </div>
                )}

                {settingsTab === 'location' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground text-lg font-bold">Личные данные</h3>
                      <Button 
                        onClick={handleSavePersonalData}
                        disabled={!isPersonalDataChanged || updatePersonalDataMutation.isPending}
                        size="sm"
                      >
                        {updatePersonalDataMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                      </Button>
                    </div>
                    <div className="space-y-6">
                      {/* Номер телефона */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Номер телефона</label>
                        <Input
                          type="tel"
                          value={personalData.phoneNumber}
                          onChange={(e) => handlePersonalDataChange('phoneNumber', e.target.value)}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>

                      {/* Электронная почта */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Электронная почта</label>
                        <Input
                          type="email"
                          value={personalData.email}
                          onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                          placeholder="example@email.com"
                        />
                      </div>

                      {/* Имя и Фамилия */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Имя и фамилия</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={personalData.firstName}
                            onChange={(e) => handlePersonalDataChange('firstName', e.target.value)}
                            placeholder="Ваше имя"
                          />
                          <Input
                            value={personalData.lastName}
                            onChange={(e) => handlePersonalDataChange('lastName', e.target.value)}
                            placeholder="Ваша фамилия"
                          />
                        </div>
                      </div>

                      {/* Пол */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Пол</label>
                        <Select value={personalData.gender} onValueChange={(value) => handlePersonalDataChange('gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ваш пол" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Мужской</SelectItem>
                            <SelectItem value="female">Женский</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Дата рождения */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Дата рождения</label>
                        <Input
                          type="date"
                          value={personalData.birthDate}
                          onChange={(e) => handlePersonalDataChange('birthDate', e.target.value)}
                        />
                      </div>

                      {/* Населенный пункт */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Населенный пункт</label>
                        <Input
                          value={personalData.city}
                          onChange={(e) => handlePersonalDataChange('city', e.target.value)}
                          placeholder="Введите населенный пункт"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'notifications' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground text-lg font-bold">Уведомления</h3>
                      <Button 
                        onClick={handleSaveNotifications}
                        disabled={!isNotificationsChanged || updateNotificationSettingsMutation.isPending}
                        size="sm"
                      >
                        {updateNotificationSettingsMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleNotification('email')}
                      >
                        <div>
                          <span className="text-foreground font-medium">Email уведомления</span>
                          <p className="text-muted-foreground text-sm mt-1">Получать уведомления на электронную почту</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={notifications.email}
                            onCheckedChange={(v) => toggleNotification('email', v)}
                          />
                        </div>
                      </div>
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleNotification('push')}
                      >
                        <div>
                          <span className="text-foreground font-medium">Push уведомления</span>
                          <p className="text-muted-foreground text-sm mt-1">Получать push-уведомления в браузере</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={notifications.push}
                            onCheckedChange={(v) => toggleNotification('push', v)}
                          />
                        </div>
                      </div>
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleNotification('tasks')}
                      >
                        <div>
                          <span className="text-foreground font-medium">Уведомления о задачах</span>
                          <p className="text-muted-foreground text-sm mt-1">Уведомления о новых задачах и дедлайнах</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={notifications.tasks}
                            onCheckedChange={(v) => toggleNotification('tasks', v)}
                          />
                        </div>
                      </div>
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleNotification('newTasks')}
                      >
                        <div>
                          <span className="text-foreground font-medium">Новые задачи</span>
                          <p className="text-muted-foreground text-sm mt-1">Уведомления о новых задачах в проектах</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={notifications.newTasks}
                            onCheckedChange={(v) => toggleNotification('newTasks', v)}
                          />
                        </div>
                      </div>
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleNotification('taskUpdates')}
                      >
                        <div>
                          <span className="text-foreground font-medium">Обновления задач</span>
                          <p className="text-muted-foreground text-sm mt-1">Уведомления об изменениях в задачах</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={notifications.taskUpdates}
                            onCheckedChange={(v) => toggleNotification('taskUpdates', v)}
                          />
                        </div>
                      </div>
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => toggleNotification('projectUpdates')}
                      >
                        <div>
                          <span className="text-foreground font-medium">Обновления проектов</span>
                          <p className="text-muted-foreground text-sm mt-1">Уведомления об изменениях в проектах</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={notifications.projectUpdates}
                            onCheckedChange={(v) => toggleNotification('projectUpdates', v)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                  {settingsTab === 'security' && (
                    <div className="space-y-8">
                      {!showChangePassword && (
                        <div className="space-y-4">
                          <div 
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                            onClick={() => setShowChangePassword(!showChangePassword)}
                          >
                            <div>
                              <span className="text-foreground font-medium">Изменить пароль</span>
                              <p className="text-muted-foreground text-sm mt-1">Обновить пароль для вашего аккаунта</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-not-allowed opacity-50">
                            <div>
                              <span className="text-foreground font-medium">Двухфакторная аутентификация</span>
                              <p className="text-muted-foreground text-sm mt-1">Дополнительная защита вашего аккаунта</p>
                            </div>
                            <Badge variant="outline">Не настроена</Badge>
                          </div>
                        </div>
                      )}

                      {/* Форма смены пароля */}
                      {showChangePassword && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-foreground">Смена пароля</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowChangePassword(false);
                                setPasswordData({
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: ''
                                });
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Текущий пароль</label>
                              <Input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Введите текущий пароль"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Новый пароль</label>
                              <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Введите новый пароль"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">Подтвердите новый пароль</label>
                              <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Подтвердите новый пароль"
                              />
                            </div>
                            
                            <div className="flex space-x-3 pt-2">
                              <Button
                                onClick={() => {
                                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                                    toast({
                                      title: "Ошибка",
                                      description: "Пароли не совпадают",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  if (passwordData.newPassword.length < 6) {
                                    toast({
                                      title: "Ошибка",
                                      description: "Пароль должен содержать минимум 6 символов",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  changePasswordMutation.mutate({
                                    currentPassword: passwordData.currentPassword,
                                    newPassword: passwordData.newPassword,
                                  });
                                }}
                                disabled={
                                  !passwordData.currentPassword ||
                                  !passwordData.newPassword ||
                                  !passwordData.confirmPassword ||
                                  changePasswordMutation.isPending
                                }
                              >
                                Изменить пароль
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowChangePassword(false);
                                  setPasswordData({
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                  });
                                }}
                              >
                                Отменить
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {settingsTab === 'search' && (
                  <div className="space-y-8">
                    <h3 className="text-foreground text-lg font-bold mb-4">Настройки поиска</h3>
                    <p className="text-muted-foreground">Здесь будут настройки результатов поиска</p>
                  </div>
                )}

                  {settingsTab === 'cache' && (
                    <div className="space-y-8">
                      <div className="space-y-6">
                        {/* Прогресс бар */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Прогресс очистки</span>
                            <span className="text-sm text-muted-foreground">{Math.round(cacheProgress)}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${
                            cacheProgress === 100 ? 'bg-green-200 dark:bg-green-900/30' : 'bg-muted'
                          }`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                                cacheProgress === 100 
                                  ? 'bg-green-500' 
                                  : 'bg-primary'
                              }`}
                              style={{ width: `${cacheProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Информация о кеше */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Размер кеша</span>
                            <span className="text-sm font-medium text-foreground">
                              {cacheData.size > 0 ? `${(cacheData.size / 1024 / 1024).toFixed(1)} МБ` : '0 МБ'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Файлов в кеше</span>
                            <span className="text-sm font-medium text-foreground">{cacheData.fileCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Последняя очистка</span>
                            <span className="text-sm font-medium text-foreground">
                              {cacheData.lastCleared 
                                ? format(cacheData.lastCleared, 'dd.MM.yyyy HH:mm', { locale: ru })
                                : 'Никогда'
                              }
                            </span>
                          </div>
                        </div>

                        {/* Кнопка запуска */}
                        <Button 
                          onClick={handleClearCache}
                          disabled={isClearingCache}
                          className="w-full"
                        >
                          {isClearingCache ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Очистка... {Math.round(cacheProgress)}%
                            </>
                          ) : (
                            'Запустить очистку'
                          )}
                        </Button>

                        {/* Сообщение о завершении */}
                        {cacheProgress === 100 && !isClearingCache && (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Очистка кеша завершена успешно!
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const ServicesModal = () => (
    <div className="relative" ref={modalRef}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsServicesModalOpen(!isServicesModalOpen)}
        className="group"
      >
        <Grip 
          width={16} 
          height={16} 
          stroke="currentColor" 
          className="w-4 h-4 mr-2 text-foreground" 
        />
        Сервисы
      </Button>
      
      {isServicesModalOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-50 max-h-96 scrollbar">
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-medium text-sm text-foreground">Наши сервисы</span>
            </div>
            <div className="space-y-1">
              {/* Atlass ID */}
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-2 px-3"
                asChild
              >
                <Link 
                  to="/id/"
                  onClick={() => setIsServicesModalOpen(false)}
                  className="flex items-center gap-3 w-full min-w-0"
                >
                  <div className="flex-shrink-0">
                  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle id="eco-system-core" cx="100" cy="100" r="40" fill="#4F46E5" stroke="#3730A3" stroke-width="2"/>
                    <g id="service-orbit-1">
                      <circle id="service-1" cx="60" cy="100" r="15" fill="#10B981" stroke="#047857" stroke-width="1.5"/>
                      <text id="service-1-text" x="60" y="105" text-anchor="middle" fill="white" font-size="8" font-weight="bold">S1</text>
                    </g>
                    <g id="service-orbit-2">
                      <circle id="service-2" cx="140" cy="100" r="15" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/>
                      <text id="service-2-text" x="140" y="105" text-anchor="middle" fill="white" font-size="8" font-weight="bold">S2</text>
                    </g>
                    <g id="service-orbit-3">
                      <circle id="service-3" cx="100" cy="60" r="15" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
                      <text id="service-3-text" x="100" y="65" text-anchor="middle" fill="white" font-size="8" font-weight="bold">S3</text>
                    </g>
                    <g id="service-orbit-4">
                      <circle id="service-4" cx="100" cy="140" r="15" fill="#8B5CF6" stroke="#7C3AED" stroke-width="1.5"/>
                      <text id="service-4-text" x="100" y="145" text-anchor="middle" fill="white" font-size="8" font-weight="bold">S4</text>
                    </g>
                    <line id="connection-1" x1="85" y1="100" x2="115" y2="100" stroke="#6B7280" stroke-width="1" stroke-dasharray="2,2"/>
                    <line id="connection-2" x1="100" y1="85" x2="100" y2="115" stroke="#6B7280" stroke-width="1" stroke-dasharray="2,2"/>
                    <circle id="outer-orbit" cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="3,3"/>
                    <text id="core-text" x="100" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold">ID</text>
                  </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">Atlass ID</span>
                    <span className="text-xs text-muted-foreground truncate">Единый профиль и настройки аккаунта</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>
  
              {/* Atlass Rise */}
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-2 px-3"
                asChild
              >
                <Link 
                  target="_blank"
                  to="/workspace/welcome" 
                  onClick={() => setIsServicesModalOpen(false)}
                  className="flex items-center gap-3 w-full min-w-0"
                >
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="32" height="32">
                      <circle cx="60" cy="60" r="54" fill="#0b2b3a"/>
                      <polyline points="32,78 48,64 64,70 82,50 96,36" fill="none" stroke="#4dd0e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="96" cy="36" r="7" fill="#4dd0e1"/>
                      <path d="M60 42 a6 6 0 1 1 0.1 0" fill="#fff"/>
                      <path d="M60 48 v10 M60 58 l-8 10 M60 58 l8 10" 
                            stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">Atlass Rise</span>
                    <span className="text-xs text-muted-foreground truncate">Управление проектами, задачами и командой</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>
  
              {/* Atlass Volt */}
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-2 px-3"
                asChild
              >
                <Link 
                  target="_blank"
                  to="/u/" 
                  onClick={() => setIsServicesModalOpen(false)}
                  className="flex items-center gap-3 w-full min-w-0"
                >
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="32" height="32">
                      <circle cx="60" cy="60" r="54" fill="#0f9d58"/>
                      <g transform="translate(60,60)" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle r="28"/>
                        <path d="M-24 0 q20 -12 48 0" />
                        <path d="M-18 -18 q14 8 36 0" />
                        <path d="M-6 18 q6 -12 18 -18" />
                      </g>
                      <path d="M14 84 q22 -30 46 -10 q18 16 46 -14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">Atlass Volt</span>
                    <span className="text-xs text-muted-foreground truncate">Социальная сеть для спортсменов и тренеров</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>
  
              {/* Pragma Atlass */}
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto py-2 px-3"
                asChild
              >
                <Link 
                  target="_blank"
                  to="/creatium" 
                  onClick={() => setIsServicesModalOpen(false)}
                  className="flex items-center gap-3 w-full min-w-0"
                >
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="32" height="32">
                      <circle cx="60" cy="60" r="54" fill="#0b2b3a"/>
                      <path d="M46 32 q-10 10 0 20 q10 10 0 20 q-10 10 0 20" 
                            stroke="#4dd0e1" strokeWidth="6" fill="none" strokeLinecap="round"/>
                      <path d="M74 32 q10 10 0 20 q-10 10 0 20 q10 10 0 20" 
                            stroke="#4dd0e1" strokeWidth="6" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">Pragma Atlass</span>
                    <span className="text-xs text-muted-foreground truncate">Создание персональных сайтов и портфолио</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <IdLogo url="/id" />
              <a href="/id/" className="text-xl font-semibold text-foreground">Atlass ID</a>
              <ServicesModal />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scrollbar overflow-y-auto">
        {/* Профиль пользователя - в самом начале */}
        <div className="mb-4">
          <Avatar className="text-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
            <AvatarImage src={user.profilePicture || ''} alt={user.name} />
            <AvatarFallback className="text-2xl sm:text-3xl">{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex text-center items-center justify-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl text-center sm:text-3xl font-bold text-foreground">{displayName || user.name}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditProfile}
              className="p-2 h-auto hover:bg-muted"
            >
              <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
          {/* <div className="flex justify-center mb-2">
            {user.userRole === "coach" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                🏋️‍♂️ Тренер
              </Badge>
            )}
            {user.userRole === "athlete" && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                🏃‍♂️ Спортсмен
              </Badge>
            )}
          </div> */}
          <Link
            to={`/u/users/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit mx-auto text-lg text-muted-foreground mb-6"
          >
            <span className="underline-offset-4 hover:underline hover:text-foreground">@{user.username}</span>
          </Link>

          {/* Секция с градиентным фоном */}
          {showBirthdayPrompt && (
            <div className="w-full relative rounded-lg overflow-hidden mb-4">
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: `radial-gradient(circle at 40% 40%, #E9D5FF 0%, #C4B5FD 20%, #A78BFA 40%, #8B5CF6 60%, #6D28D9 80%, #581C87 100%)`,
                }}
              />
              
              <div className="relative z-10 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Когда вас поздравить?</h3>
                    <p className="text-white/90 text-sm mb-2">
                      Добавьте дату день рождения - подготовим бонусы
                    </p>
                    <Button 
                      size="sm"
                      className=""
                      onClick={handleEditProfile}
                    >
                      Добавить
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-auto"
                    onClick={handleCloseBirthdayPrompt}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Sliding background tabs */}
          <div className="w-full bg-muted rounded-lg p-1">
            <div className="relative flex justify-start w-auto overflow-x-auto scrollbar">
              <div 
                ref={slidingBgRef}
                className="absolute top-0.5 bottom-0.5 bg-background rounded-md shadow-sm transition-all duration-300 ease-out"
              />
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => tabsRef.current[index] = el}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Контент вкладок */}
        <div className={`mt-4 ${activeTab === 'settings' ? '' : 'max-h-96 scrollbar overflow-y-auto'}`}>
          {renderTabContent()}
        </div>
      </div>

    <ConfirmDialog
      isOpen={isLogoutConfirmOpen}
      isLoading={logoutMutation.isPending}
      onClose={closeLogoutConfirm}
      onConfirm={handleLogout}
      title="Вы уверены, что хотите выйти из системы?"
      description="На этом ваша текущая сессия завершится, и вам нужно будет снова войти в систему чтобы получить доступ к своей учетной записи."
      confirmText="Выйти"
      cancelText="Отменить"
    />

    {/* Header logout dialog removed */}

    </div>
  );
};

export default IdPage;
