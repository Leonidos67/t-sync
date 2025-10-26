import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SocialContainer from "@/components/SocialContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader, Plus, X, Upload, ArrowUp } from "lucide-react";
import AnimatedTags from "@/components/smoothui/ui/AnimatedTags";
import { useToast } from "@/hooks/use-toast";

type CoachProfile = {
  id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  city: string;
  phone: string;
  email: string;
  telegram: string;
  whatsapp: string;
  experience: string;
  education: string;
  certificates: string;
  workplaces: string;
  specialties: string;
  sports: string[];
  ageGroups: string[];
  skillLevels: string[];
  trainingTypes: string[];
  individualPrice: string;
  groupPrice: string;
  onlinePrice: string;
  packages: string;
  workDays: string[];
  workTime: string;
  homeVisits: boolean;
  onlineTraining: boolean;
  socialLinks: Array<{ type: string; url: string }>;
  achievements: string;
  philosophy: string;
  approach: string;
  studentAchievements: string;
  motivation: string;
};

export default function BoardCreatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Персональная информация
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    city: "",
    profilePicture: "",
    
    // Контактная информация
    phone: "",
    email: "",
    telegram: "",
    whatsapp: "",
    
    // Профессиональная информация
    experience: "",
    education: "",
    certificates: "",
    workplaces: "",
    
    // Специализация
    specialties: "",
    sports: [] as string[],
    ageGroups: [] as string[],
    skillLevels: [] as string[],
    trainingTypes: [] as string[],
    
    // Ценообразование
    individualPrice: "",
    groupPrice: "",
    onlinePrice: "",
    packages: "",
    
    // Расписание
    workDays: [] as string[],
    workTime: "",
    homeVisits: false,
    onlineTraining: false,
    
    // Социальные сети
    socialLinks: [] as Array<{ type: string; url: string }>,
    
    // Дополнительная информация
    achievements: "",
    philosophy: "",
    approach: "",
    studentAchievements: "",
    motivation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSocialLink, setNewSocialLink] = useState({ type: "instagram", url: "" });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Отслеживание скролла для показа кнопки "Вернуться наверх"
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300); // Показываем кнопку после прокрутки на 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Загрузка существующей анкеты для редактирования
  useEffect(() => {
    const profileId = searchParams.get('edit');
    if (profileId) {
      const STORAGE_KEY = "coach_board_profiles_v1";
      const existingProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const profileToEdit = existingProfiles.find((p: CoachProfile) => p.id === profileId);
      
      if (profileToEdit) {
        setIsEditing(true);
        setFormData({
          firstName: profileToEdit.firstName || "",
          lastName: profileToEdit.lastName || "",
          age: profileToEdit.age || "",
          gender: profileToEdit.gender || "",
          city: profileToEdit.city || "",
          profilePicture: profileToEdit.profilePicture || "",
          phone: profileToEdit.phone || "",
          email: profileToEdit.email || "",
          telegram: profileToEdit.telegram || "",
          whatsapp: profileToEdit.whatsapp || "",
          experience: profileToEdit.experience || "",
          education: profileToEdit.education || "",
          certificates: profileToEdit.certificates || "",
          workplaces: profileToEdit.workplaces || "",
          specialties: profileToEdit.specialties || "",
          sports: profileToEdit.sports || [],
          ageGroups: profileToEdit.ageGroups || [],
          skillLevels: profileToEdit.skillLevels || [],
          trainingTypes: profileToEdit.trainingTypes || [],
          individualPrice: profileToEdit.individualPrice || "",
          groupPrice: profileToEdit.groupPrice || "",
          onlinePrice: profileToEdit.onlinePrice || "",
          packages: profileToEdit.packages || "",
          workDays: profileToEdit.workDays || [],
          workTime: profileToEdit.workTime || "",
          homeVisits: profileToEdit.homeVisits || false,
          onlineTraining: profileToEdit.onlineTraining || false,
          socialLinks: profileToEdit.socialLinks || [],
          achievements: profileToEdit.achievements || "",
          philosophy: profileToEdit.philosophy || "",
          approach: profileToEdit.approach || "",
          studentAchievements: profileToEdit.studentAchievements || "",
          motivation: profileToEdit.motivation || "",
        });
      }
    }
  }, [searchParams]);

  // Список доступных видов спорта
  const availableSports = [
    "Футбол", "Баскетбол", "Волейбол", "Теннис", "Бадминтон", "Пинг-понг",
    "Бег", "Плавание", "Велоспорт", "Лыжи", "Сноуборд", "Коньки",
    "Бокс", "Карате", "Дзюдо", "Тхэквондо", "Борьба", "ММА",
    "Йога", "Пилатес", "Стретчинг", "Аэробика", "Кроссфит", "Тяжелая атлетика",
    "Гимнастика", "Акробатика", "Паркур", "Скалолазание", "Триатлон", "Марафон",
    "Гольф", "Бильярд", "Дартс", "Шахматы", "Шашки", "Боулинг",
    "Танцы", "Балет", "Хип-хоп", "Сальса", "Бачата", "Стрит-дэнс",
    "Серфинг", "Виндсерфинг", "Каякинг", "Рафтинг", "Дайвинг", "Фридайвинг"
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink }]
      }));
      setNewSocialLink({ type: "instagram", url: "" });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setImageUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        profilePicture: result
      }));
      setImageUploading(false);
    };
    reader.onerror = () => {
      alert('Ошибка при загрузке изображения');
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    console.log('🔍 BoardCreatePage - Starting validation...');
    const newErrors: Record<string, string> = {};
    
    // Обязательные поля
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Укажите имя";
      console.log('❌ BoardCreatePage - firstName validation failed');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Укажите фамилию";
      console.log('❌ BoardCreatePage - lastName validation failed');
    }
    if (!formData.age.trim()) {
      newErrors.age = "Укажите возраст";
      console.log('❌ BoardCreatePage - age validation failed');
    }
    if (!formData.gender) {
      newErrors.gender = "Укажите пол";
      console.log('❌ BoardCreatePage - gender validation failed');
    }
    if (!formData.city.trim()) {
      newErrors.city = "Укажите город";
      console.log('❌ BoardCreatePage - city validation failed');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Укажите телефон";
      console.log('❌ BoardCreatePage - phone validation failed');
    }
    if (!formData.email.trim()) {
      newErrors.email = "Укажите email";
      console.log('❌ BoardCreatePage - email validation failed');
    }
    if (formData.sports.length === 0) {
      newErrors.sports = "Выберите хотя бы один вид спорта";
      console.log('❌ BoardCreatePage - sports validation failed');
    }
    if (!formData.achievements.trim()) {
      newErrors.achievements = "Укажите достижения";
      console.log('❌ BoardCreatePage - achievements validation failed');
    }
    
    console.log('🔍 BoardCreatePage - Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 BoardCreatePage - Validation result:', isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 BoardCreatePage - Form submitted!');
    console.log('🚀 BoardCreatePage - Form data:', formData);
    
    const isValid = validateForm();
    console.log('🚀 BoardCreatePage - Form validation result:', isValid);
    
    if (!isValid) {
      console.log('❌ BoardCreatePage - Form validation failed');
      return;
    }
    
    console.log('✅ BoardCreatePage - Form validation passed, starting save...');
    setLoading(true);
    try {
      // Получаем текущие анкеты из localStorage
      const STORAGE_KEY = "coach_board_profiles_v1";
      const existingProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      const profileId = searchParams.get('edit');
      let updatedProfiles;
      
      if (isEditing && profileId) {
        // Редактирование существующей анкеты
        updatedProfiles = existingProfiles.map((profile: CoachProfile) => 
          profile.id === profileId 
            ? {
                ...profile,
                name: `${formData.firstName} ${formData.lastName}`,
                profilePicture: formData.profilePicture,
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: formData.age,
                gender: formData.gender,
                city: formData.city,
                phone: formData.phone,
                email: formData.email,
                telegram: formData.telegram,
                whatsapp: formData.whatsapp,
                experience: formData.experience,
                education: formData.education,
                certificates: formData.certificates,
                workplaces: formData.workplaces,
                specialties: formData.specialties,
                sports: formData.sports,
                ageGroups: formData.ageGroups,
                skillLevels: formData.skillLevels,
                trainingTypes: formData.trainingTypes,
                individualPrice: formData.individualPrice,
                groupPrice: formData.groupPrice,
                onlinePrice: formData.onlinePrice,
                packages: formData.packages,
                workDays: formData.workDays,
                workTime: formData.workTime,
                homeVisits: formData.homeVisits,
                onlineTraining: formData.onlineTraining,
                socialLinks: formData.socialLinks,
                achievements: formData.achievements,
                philosophy: formData.philosophy,
                approach: formData.approach,
                studentAchievements: formData.studentAchievements,
                motivation: formData.motivation,
              }
            : profile
        );
      } else {
        // Создание новой анкеты
        const newProfile = {
          id: Date.now().toString(), // Простой ID на основе времени
          name: `${formData.firstName} ${formData.lastName}`,
          username: `coach_${Date.now()}`, // Временный username
          profilePicture: formData.profilePicture,
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          gender: formData.gender,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
          telegram: formData.telegram,
          whatsapp: formData.whatsapp,
          experience: formData.experience,
          education: formData.education,
          certificates: formData.certificates,
          workplaces: formData.workplaces,
          specialties: formData.specialties,
          sports: formData.sports,
          ageGroups: formData.ageGroups,
          skillLevels: formData.skillLevels,
          trainingTypes: formData.trainingTypes,
          individualPrice: formData.individualPrice,
          groupPrice: formData.groupPrice,
          onlinePrice: formData.onlinePrice,
          packages: formData.packages,
          workDays: formData.workDays,
          workTime: formData.workTime,
          homeVisits: formData.homeVisits,
          onlineTraining: formData.onlineTraining,
          socialLinks: formData.socialLinks,
          achievements: formData.achievements,
          philosophy: formData.philosophy,
          approach: formData.approach,
          studentAchievements: formData.studentAchievements,
          motivation: formData.motivation,
        };
        
        // Добавляем новую анкету к существующим
        updatedProfiles = [...existingProfiles, newProfile];
      }
      
      // Сохраняем в localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
      console.log('💾 BoardCreatePage - Saved profiles:', updatedProfiles.length);
      console.log('💾 BoardCreatePage - Updated profiles:', updatedProfiles);
      
      // Небольшая задержка для UX
      await new Promise(r => setTimeout(r, 300));
      
      // Показываем уведомление об успехе
      toast({
        title: isEditing ? "Анкета обновлена!" : "Анкета создана!",
        description: isEditing 
          ? "Ваша анкета тренера успешно обновлена." 
          : "Ваша анкета тренера успешно добавлена на доску.",
      });
      
      // Переходим на страницу доски
      navigate("/u/board", { replace: true });
    } catch (error) {
      console.error('Ошибка при сохранении анкеты:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении анкеты. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialContainer>
      <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/u/board")}
            className="mb-2 inline-flex items-center h-auto rounded-full px-4 py-1 text-sm hover-secondary border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к доске тренеров
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isEditing ? "Редактирование анкеты тренера" : "Создание анкеты тренера"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing 
              ? "Обновите информацию в вашей анкете тренера"
              : "Создайте подробную анкету тренера с полной информацией о ваших услугах, опыте и специализации"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Персональная информация */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Персональная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Ваше имя"
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Ваша фамилия"
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Возраст *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="25"
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Пол *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                      <SelectValue placeholder="Выберите пол" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Мужской</SelectItem>
                      <SelectItem value="female">Женский</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-destructive">{errors.gender}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Город *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Москва"
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Фото профиля</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {imageUploading ? (
                      <Loader className="w-8 h-8 text-muted-foreground animate-spin" />
                    ) : formData.profilePicture ? (
                      <img 
                        src={formData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-picture-upload"
                      disabled={imageUploading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('profile-picture-upload')?.click()}
                      disabled={imageUploading}
                    >
                      {imageUploading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {formData.profilePicture ? 'Изменить фото' : 'Загрузить фото'}
                        </>
                      )}
                    </Button>
                    {formData.profilePicture && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, profilePicture: "" }))}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Контактная информация */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    value={formData.telegram}
                    onChange={(e) => handleInputChange("telegram", e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Профессиональная информация */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Профессиональная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Опыт работы (лет)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Образование</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  placeholder="Спортивный институт, факультет физической культуры..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificates">Сертификаты и лицензии</Label>
                <Textarea
                  id="certificates"
                  value={formData.certificates}
                  onChange={(e) => handleInputChange("certificates", e.target.value)}
                  placeholder="Сертификат тренера по фитнесу, лицензия на проведение групповых занятий..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workplaces">Места работы</Label>
                <Textarea
                  id="workplaces"
                  value={formData.workplaces}
                  onChange={(e) => handleInputChange("workplaces", e.target.value)}
                  placeholder="Фитнес-клуб 'Здоровье', Спортивная школа №1..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Специализация */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Специализация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Виды спорта *</Label>
                <div className="w-full">
                  <AnimatedTags
                    initialTags={availableSports}
                    selectedTags={formData.sports}
                    onChange={(selected) => handleInputChange("sports", selected)}
                    className="w-full"
                  />
                </div>
                {errors.sports && (
                  <p className="text-sm text-destructive">{errors.sports}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Дополнительные специализации</Label>
                <Input
                  id="specialties"
                  value={formData.specialties}
                  onChange={(e) => handleInputChange("specialties", e.target.value)}
                  placeholder="ОФП, функциональные тренировки, реабилитация..."
                  className={errors.specialties ? "border-destructive" : ""}
                />
                {errors.specialties && (
                  <p className="text-sm text-destructive">{errors.specialties}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Возрастные группы</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Дети (6-12)", "Подростки (13-17)", "Взрослые (18-45)", "Пожилые (45+)"].map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={group}
                        checked={formData.ageGroups.includes(group)}
                        onCheckedChange={(checked) => handleArrayChange("ageGroups", group, checked as boolean)}
                      />
                      <Label htmlFor={group} className="text-sm">{group}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Уровень подготовки</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["Начинающие", "Средний", "Продвинутый", "Профессиональный"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={formData.skillLevels.includes(level)}
                        onCheckedChange={(checked) => handleArrayChange("skillLevels", level, checked as boolean)}
                      />
                      <Label htmlFor={level} className="text-sm">{level}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Типы тренировок</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["Индивидуальные", "Групповые", "Онлайн", "Выездные"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={formData.trainingTypes.includes(type)}
                        onCheckedChange={(checked) => handleArrayChange("trainingTypes", type, checked as boolean)}
                      />
                      <Label htmlFor={type} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ценообразование */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Ценообразование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="individualPrice">Индивидуальные тренировки (руб/час)</Label>
                  <Input
                    id="individualPrice"
                    type="number"
                    value={formData.individualPrice}
                    onChange={(e) => handleInputChange("individualPrice", e.target.value)}
                    placeholder="3000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupPrice">Групповые тренировки (руб/час)</Label>
                  <Input
                    id="groupPrice"
                    type="number"
                    value={formData.groupPrice}
                    onChange={(e) => handleInputChange("groupPrice", e.target.value)}
                    placeholder="1500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onlinePrice">Онлайн-консультации (руб/час)</Label>
                  <Input
                    id="onlinePrice"
                    type="number"
                    value={formData.onlinePrice}
                    onChange={(e) => handleInputChange("onlinePrice", e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packages">Пакеты тренировок</Label>
                <Textarea
                  id="packages"
                  value={formData.packages}
                  onChange={(e) => handleInputChange("packages", e.target.value)}
                  placeholder="10 тренировок - 25000 руб, месячный абонемент - 12000 руб..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Расписание */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Расписание и доступность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Дни работы</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.workDays.includes(day)}
                        onCheckedChange={(checked) => handleArrayChange("workDays", day, checked as boolean)}
                      />
                      <Label htmlFor={day} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workTime">Время работы</Label>
                <Input
                  id="workTime"
                  value={formData.workTime}
                  onChange={(e) => handleInputChange("workTime", e.target.value)}
                  placeholder="9:00 - 21:00"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="homeVisits"
                    checked={formData.homeVisits}
                    onCheckedChange={(checked) => handleInputChange("homeVisits", checked as boolean)}
                  />
                  <Label htmlFor="homeVisits">Выезд к клиенту</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onlineTraining"
                    checked={formData.onlineTraining}
                    onCheckedChange={(checked) => handleInputChange("onlineTraining", checked as boolean)}
                  />
                  <Label htmlFor="onlineTraining">Онлайн-тренировки</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Социальные сети */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Социальные сети и портфолио</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-24 text-sm text-muted-foreground capitalize">{link.type}</div>
                    <Input value={link.url} disabled className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Select value={newSocialLink.type} onValueChange={(value) => setNewSocialLink(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vk">VK</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="website">Сайт</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Ссылка"
                  className="flex-1"
                />
                <Button type="button" onClick={addSocialLink}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Дополнительная информация */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="achievements">Достижения *</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange("achievements", e.target.value)}
                  placeholder="Разряды, соревнования, сертификаты, опыт работы..."
                  className={`min-h-[100px] ${errors.achievements ? "border-destructive" : ""}`}
                />
                {errors.achievements && (
                  <p className="text-sm text-destructive">{errors.achievements}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="philosophy">Философия тренировок</Label>
                <Textarea
                  id="philosophy"
                  value={formData.philosophy}
                  onChange={(e) => handleInputChange("philosophy", e.target.value)}
                  placeholder="Мой подход к тренировкам основан на..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="approach">Подход к работе</Label>
                <Textarea
                  id="approach"
                  value={formData.approach}
                  onChange={(e) => handleInputChange("approach", e.target.value)}
                  placeholder="Индивидуальный подход, работа с мотивацией..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentAchievements">Достижения учеников</Label>
                <Textarea
                  id="studentAchievements"
                  value={formData.studentAchievements}
                  onChange={(e) => handleInputChange("studentAchievements", e.target.value)}
                  placeholder="Мои ученики достигли следующих результатов..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Мотивационная цитата</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  placeholder="Вдохновляющая цитата или девиз..."
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/u/board")}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => console.log('🖱️ BoardCreatePage - Submit button clicked!')}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                isEditing ? "Обновить анкету" : "Сохранить анкету"
              )}
            </Button>
          </div>
        </form>

        {/* Кнопка "Вернуться наверх" */}
        {showScrollButton && (
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 md:bottom-2 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        )}
      </div>
    </SocialContainer>
  );
}


