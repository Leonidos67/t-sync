import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, ArrowLeft, Settings, Cog, MousePointer, Layout, Link as LinkIcon, Palette, Trash2, Globe, Phone, Mail, CheckCircle, User } from "lucide-react";
import SocialHeader from "@/components/social-header";
import { getClubByUsernameQueryFn, deleteClubMutationFn, updateClubActionButtonMutationFn, updateClubAppearanceMutationFn, uploadClubAvatarMutationFn, removeClubAvatarMutationFn } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/api/use-auth";
import { useState, useEffect } from "react";

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
  createdAt: string;
}

const ClubSettings = () => {
  const { username } = useParams<{ username: string }>();
  const { data: currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appearance');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Состояние для кнопки быстрого действия
  const [showActionButton, setShowActionButton] = useState(true);
  const [actionType, setActionType] = useState('website');
  const [actionValue, setActionValue] = useState('');
  const [buttonText, setButtonText] = useState('Перейти');
  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Состояние для настроек внешнего вида
  const [showCreator, setShowCreator] = useState(true);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const { data: clubData, isLoading, error } = useQuery({
    queryKey: ['club', username],
    queryFn: () => getClubByUsernameQueryFn(username || ''),
    enabled: !!username,
  });

  // Загружаем существующие настройки кнопки действия при загрузке данных клуба
  useEffect(() => {
    if (clubData?.club?.actionButton) {
      const actionButton = clubData.club.actionButton;
      setShowActionButton(actionButton.show);
      setActionType(actionButton.type);
      setActionValue(actionButton.value);
      setButtonText(actionButton.text);
    }
    
    // Загружаем настройки внешнего вида
    if (clubData?.club) {
      setShowCreator(clubData.club.showCreator !== false);
    }
  }, [clubData]);

  const deleteClubMutation = useMutation({
    mutationFn: deleteClubMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      navigate('/u/clubs');
    },
    onError: () => {
      setIsDeleting(false);
    }
  });

  const updateActionButtonMutation = useMutation({
    mutationFn: updateClubActionButtonMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', username] });
      setShowSuccessDialog(true);
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Ошибка при сохранении:', error);
      alert('Ошибка при сохранении настроек');
      setIsSaving(false);
    }
  });

  const updateAppearanceMutation = useMutation({
    mutationFn: updateClubAppearanceMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', username] });
      setIsSavingAppearance(false);
    },
    onError: (error) => {
      console.error('Ошибка при сохранении настроек внешнего вида:', error);
      alert('Ошибка при сохранении настроек внешнего вида');
      setIsSavingAppearance(false);
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadClubAvatarMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', username] });
      setIsUploadingAvatar(false);
    },
    onError: (error) => {
      console.error('Ошибка при загрузке аватарки:', error);
      alert('Ошибка при загрузке аватарки');
      setIsUploadingAvatar(false);
    }
  });

  const removeAvatarMutation = useMutation({
    mutationFn: removeClubAvatarMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', username] });
      setIsUploadingAvatar(false);
    },
    onError: (error) => {
      console.error('Ошибка при удалении аватарки:', error);
      alert('Ошибка при удалении аватарки');
      setIsUploadingAvatar(false);
    }
  });

  const handleDeleteClub = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteClub = () => {
    if (clubData?.club?._id) {
      setIsDeleting(true);
      deleteClubMutation.mutate(clubData.club._id);
      setShowDeleteDialog(false);
    }
  };

  // Валидация в зависимости от типа действия
  const validateActionValue = (value: string, type: string) => {
    setValidationError('');
    
    if (!value.trim()) {
      setValidationError('Поле обязательно для заполнения');
      return false;
    }

    switch (type) {
      case 'website': {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(value)) {
          setValidationError('Введите корректную ссылку (начинающуюся с http:// или https://)');
          return false;
        }
        break;
      }
      case 'phone': {
        const phonePattern = /^[+]?[0-9\s\-()]{10,}$/;
        if (!phonePattern.test(value)) {
          setValidationError('Введите корректный номер телефона');
          return false;
        }
        break;
      }
      case 'email': {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          setValidationError('Введите корректный email адрес');
          return false;
        }
        break;
      }
    }
    
    return true;
  };

  const handleActionValueChange = (value: string) => {
    setActionValue(value);
    if (actionType) {
      validateActionValue(value, actionType);
    }
  };

  const handleSaveActionButton = async () => {
    // Если кнопка отключена, сохраняем только это состояние
    if (!showActionButton) {
      if (!clubData?.club?._id) {
        alert('Ошибка: ID клуба не найден');
        return;
      }

      setIsSaving(true);
      updateActionButtonMutation.mutate({
        clubId: clubData.club._id,
        showActionButton: false,
        actionType: 'website',
        actionValue: '',
        buttonText: 'Перейти'
      });
      return;
    }

    // Если кнопка включена, проверяем обязательные поля
    if (!actionValue.trim()) {
      setValidationError('Поле обязательно для заполнения');
      return;
    }

    if (!validateActionValue(actionValue, actionType)) {
      return;
    }

    if (!clubData?.club?._id) {
      alert('Ошибка: ID клуба не найден');
      return;
    }

    setIsSaving(true);
    updateActionButtonMutation.mutate({
      clubId: clubData.club._id,
      showActionButton,
      actionType,
      actionValue,
      buttonText
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (5MB максимум)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    if (!clubData?.club?._id) {
      alert('Ошибка: ID клуба не найден');
      return;
    }

    setIsUploadingAvatar(true);
    uploadAvatarMutation.mutate({
      clubId: clubData.club._id,
      avatar: file
    });
  };

  const handleRemoveAvatar = () => {
    if (!clubData?.club?._id) {
      alert('Ошибка: ID клуба не найден');
      return;
    }

    setIsUploadingAvatar(true);
    removeAvatarMutation.mutate({
      clubId: clubData.club._id
    });
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
          <h1 className="text-2xl font-bold mb-2">Загрузка настроек клуба</h1>
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
  
  // Если пользователь не создатель, перенаправляем на страницу клуба
  if (!isCreator) {
    return (
      <div className="tsygram-dark bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Доступ запрещен</h1>
          <p>Только создатель клуба может управлять настройками</p>
          <Link to={`/u/clubs/${username}`}>
            <Button className="mt-4">Вернуться к клубу</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tsygram-dark bg-background text-foreground">
      <SocialHeader />
      <div className="min-h-svh flex justify-center px-4 sm:px-2 lg:px-8">
        <div className="w-full max-w-7xl flex gap-2">
          
          {/* Левая часть: Меню настроек */}
          <aside className="hidden lg:flex flex-col w-80 py-4 sm:py-8 gap-4 sm:gap-6 min-h-svh sticky top-0">
            {/* Кнопка назад */}
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="inline-flex items-center h-auto rounded-full px-4 py-1 text-sm hover-secondary border border-border"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к клубу
            </Button>

            {/* Меню настроек */}
            <div className="bg-card border border-border rounded-3xl p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Настройки
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full justify-start rounded-2xl hover-secondary ${
                    activeTab === 'appearance' 
                      ? 'bg-[hsl(var(--secondary-hover))] text-foreground' 
                      : ''
                  }`}
                >
                  <Palette className="w-4 h-4 mr-3" />
                  Внешний вид
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('general')}
                  className={`w-full justify-start rounded-2xl hover-secondary ${
                    activeTab === 'general' 
                      ? 'bg-[hsl(var(--secondary-hover))] text-foreground' 
                      : ''
                  }`}
                >
                  <Cog className="w-4 h-4 mr-3" />
                  Общие
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('action-button')}
                  className={`w-full justify-start rounded-2xl hover-secondary ${
                    activeTab === 'action-button' 
                      ? 'bg-[hsl(var(--secondary-hover))] text-foreground' 
                      : ''
                  }`}
                >
                  <MousePointer className="w-4 h-4 mr-3" />
                  Кнопка быстрого действия
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('sections')}
                  className={`w-full justify-start rounded-2xl hover-secondary ${
                    activeTab === 'sections' 
                      ? 'bg-[hsl(var(--secondary-hover))] text-foreground' 
                      : ''
                  }`}
                >
                  <Layout className="w-4 h-4 mr-3" />
                  Разделы
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('links')}
                  className={`w-full justify-start rounded-2xl hover-secondary ${
                    activeTab === 'links' 
                      ? 'bg-[hsl(var(--secondary-hover))] text-foreground' 
                      : ''
                  }`}
                >
                  <LinkIcon className="w-4 h-4 mr-3" />
                  Ссылки
                </Button>
                
                {/* Кнопка удаления */}
                <Button
                  variant="ghost"
                  onClick={handleDeleteClub}
                  disabled={isDeleting}
                  className="w-full justify-start rounded-2xl  border border-red-800 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  {isDeleting ? "Удаляем..." : "Удалить"}
                </Button>
              </div>
            </div>
          </aside>
          
          {/* Центральная часть: настройки клуба */}
          <main className="flex-1 flex flex-col items-center lg:items-start lg:ml-2 py-4 sm:py-6">
            <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-4">
              <div className="mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold">Настройки клуба</h1>
                <p className="text-muted-foreground mt-2">
                  Управление настройками клуба {club.name} (@{club.username})
                </p>
              </div>

              {/* Контент в зависимости от выбранной вкладки */}
              {activeTab === 'appearance' && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Внешний вид</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Аватарка клуба */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Аватарка клуба
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {club.avatar ? (
                            <img 
                              src={`http://localhost:3000/uploads/${club.avatar.split('/').pop()}`} 
                              alt={club.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                              {club.name[0].toUpperCase()}
                            </div>
                          )}
                          {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                              <Loader className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {club.avatar 
                              ? 'Загружена пользовательская аватарка' 
                              : 'Аватарка генерируется автоматически на основе первой буквы названия'
                            }
                          </p>
                          <div className="mt-2 flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              disabled={isUploadingAvatar}
                              className="hidden"
                              id="avatar-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isUploadingAvatar}
                              onClick={() => document.getElementById('avatar-upload')?.click()}
                            >
                              {isUploadingAvatar ? 'Загружаем...' : 'Загрузить аватарку'}
                            </Button>
                            {club.avatar && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isUploadingAvatar}
                                onClick={handleRemoveAvatar}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {isUploadingAvatar ? 'Удаляем...' : 'Вернуть исходную'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Отображение создателя клуба */}
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-creator" className="text-base font-medium">
                            Отображать создателя клуба
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Показывать информацию о создателе клуба на странице
                          </p>
                        </div>
                        <Switch
                          id="show-creator"
                          checked={showCreator}
                          onCheckedChange={setShowCreator}
                        />
                      </div>
                    </div>

                    {/* Кнопка сохранения */}
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => {
                          if (!clubData?.club?._id) {
                            alert('Ошибка: ID клуба не найден');
                            return;
                          }

                          setIsSavingAppearance(true);
                          updateAppearanceMutation.mutate({
                            clubId: clubData.club._id,
                            showCreator
                          });
                        }}
                        disabled={isSavingAppearance}
                        className="px-8"
                      >
                        {isSavingAppearance ? "Сохраняем..." : "Сохранить"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'general' && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Общие настройки</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      <p>Общие настройки клуба</p>
                      <p className="text-sm mt-2">Функциональность в разработке</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'action-button' && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Кнопка быстрого действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Переключатель отображения кнопки */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-action-button" className="text-base font-medium">
                        Отображать кнопку действия
                      </Label>
                      <Switch
                        id="show-action-button"
                        checked={showActionButton}
                        onCheckedChange={(checked) => {
                          setShowActionButton(checked);
                          // Сбрасываем ошибки валидации при выключении
                          if (!checked) {
                            setValidationError('');
                          }
                        }}
                      />
                    </div>

                    {/* Настройки кнопки */}
                    {showActionButton && (
                      <div className="space-y-4 border-t pt-4">
                        {/* Тип действия */}
                        <div className="space-y-2">
                          <Label htmlFor="action-type" className="text-sm font-medium">
                            Тип действия
                          </Label>
                          <Select value={actionType} onValueChange={setActionType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип действия" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Открыть сайт
                                </div>
                              </SelectItem>
                              <SelectItem value="phone">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  Позвонить
                                </div>
                              </SelectItem>
                              <SelectItem value="email">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  Написать на почту
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Поле ввода в зависимости от типа действия */}
                        <div className="space-y-2">
                          <Label htmlFor="action-value" className="text-sm font-medium">
                            {actionType === 'website' && 'Ссылка на сайт'}
                            {actionType === 'phone' && 'Номер телефона'}
                            {actionType === 'email' && 'Email адрес'}
                          </Label>
                          <Input
                            id="action-value"
                            type={actionType === 'email' ? 'email' : 'text'}
                            placeholder={
                              actionType === 'website' ? 'https://example.com' :
                              actionType === 'phone' ? '+7 (999) 123-45-67' :
                              'example@email.com'
                            }
                            value={actionValue}
                            onChange={(e) => handleActionValueChange(e.target.value)}
                            className={validationError ? 'border-red-500' : ''}
                          />
                          {validationError && (
                            <p className="text-sm text-red-500">{validationError}</p>
                          )}
                        </div>

                        {/* Текст на кнопке */}
                        <div className="space-y-2">
                          <Label htmlFor="button-text" className="text-sm font-medium">
                            Текст на кнопке
                          </Label>
                          <Select value={buttonText} onValueChange={setButtonText}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите текст кнопки" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Перейти">Перейти</SelectItem>
                              <SelectItem value="Подробнее">Подробнее</SelectItem>
                              <SelectItem value="Открыть">Открыть</SelectItem>
                              <SelectItem value="Задать вопрос">Задать вопрос</SelectItem>
                              <SelectItem value="Связаться">Связаться</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                      </div>
                    )}

                    {/* Кнопка сохранения - всегда видна */}
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSaveActionButton}
                        disabled={isSaving || (showActionButton && (!actionValue.trim() || !!validationError))}
                        className="px-8"
                      >
                        {isSaving ? "Сохраняем..." : "Сохранить"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'sections' && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Разделы</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      <p>Управление разделами клуба</p>
                      <p className="text-sm mt-2">Функциональность в разработке</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'links' && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle>Ссылки</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      <p>Управление ссылками клуба</p>
                      <p className="text-sm mt-2">Функциональность в разработке</p>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5" />
              Удаление клуба
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <p>
                Удаление клуба <strong>"{club.name}"</strong> необратимо.
              </p>
              <p className="text-sm text-muted-foreground">
                Все данные будут потеряны:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-4">
                <li>Информация о клубе</li>
                <li>Все участники будут исключены</li>
                <li>История и посты клуба</li>
              </ul>
              <p className="font-medium">
                Вы уверены, что хотите удалить этот клуб?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteClub}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаляем..." : "Удалить клуб"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог успешного сохранения */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              Настройки сохранены
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <p>
                Настройки кнопки быстрого действия для клуба <strong>"{club.name}"</strong> успешно сохранены.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClubSettings;
