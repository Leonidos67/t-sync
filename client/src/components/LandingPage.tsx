import React, { useState } from "react";
import { ArrowRight, Zap, Users, Trophy, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Waitlist1 } from "./aceternity/Waitlist1";
import PhotoGallery from "./PhotoGallery";
import NotionStyleBlock from "./NotionStyleBlock";
import { AUTH_ROUTES } from "@/routes/common/routePaths";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";

interface LandingPageProps {
  theme?: string;
  onToggleTheme?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Массив фото для галереи (пока placeholder'ы, потом замените на реальные фото)
  const photos = [
    "https://i.ibb.co/Df5qCHGT/image-Photoroom-5.png",
    "https://i.ibb.co/3yS0wqkN/image-Photoroom-4.png",
    "https://i.ibb.co/kVw9zpXL/image-Photoroom-2.png",
    "https://i.ibb.co/6JXs1S77/image-Photoroom.png",
    "https://i.ibb.co/dw3FcYRS/image-Photoroom-1.png",
    "https://i.ibb.co/hxb8KKHf/image-Photoroom-3.png",
    "https://i.ibb.co/Swy2s8Qv/image-Photoroom-6.png"
  ];

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  const handleDownload = () => {
    // Создаем ссылку для скачивания установщика
    const link = document.createElement('a');
    link.href = '/downloads/Aurora-Rise-Platform-Setup.exe';
    link.download = 'Aurora-Rise-Platform-Setup.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openTelegram = () => {
    window.open("https://t.me/your_telegram_channel", "_blank");
  };

  const handleLoginClick = () => {
    if (user && (user as { _id?: string })._id) {
      // Перенаправляем на ID страницу для авторизованных пользователей
      navigate("/id/");
    } else {
      navigate(AUTH_ROUTES.SIGN_IN);
    }
  };

  const features = [
    {
      id: "aurora-rise-platform",
      icon: <Trophy className="size-4" />,
      heading: "Aurora Rise Platform",
      description: "Ведение тренировочного процесса с тренером или самостоятельно",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      url: "/services",
      isDefault: true,
    },
    {
      id: "pragma-aurora-rise",
      icon: <Users className="size-4" />,
      heading: "Pragma Aurora Rise",
      description: "Создание профессионального сайта-визитки для спортсмена",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      url: "/services",
      isDefault: false,
    },
    {
      id: "aurora-rise-volt",
      icon: <Zap className="size-4" />,
      heading: "Aurora Volt",
      description: "Социальная сеть для спортсменов",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      url: "/services",
      isDefault: false,
    },
    {
      id: "aurora-rise-id",
      icon: <Shield className="size-4" />,
      heading: "Aurora Rise ID",
      description: "Единый аккаунт для всей экосистемы Aurora Rise",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      url: "/services",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-md mx-4 relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="text-2xl font-bold text-center mb-2">Успешно!</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-2">
              Спасибо за подписку! Мы отправили подтверждение на вашу почту.
            </p>
            
            {/* Telegram Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                Следите за нами в Telegram
              </p>
              <Button
                onClick={openTelegram}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Открыть Telegram
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <PhotoGallery photos={photos} />
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text uppercase">ПЛАТФОРМА ДЛЯ </span>
            <span className="gradient-text uppercase highlighted-sport">СПОРТСМЕНОВ</span>
            <span className="gradient-text uppercase">,</span>
            <br />
            <span className="gradient-text uppercase">СОЗДАННАЯ </span>
            <span className="gradient-text uppercase highlighted-sport highlighted-sport-second">СПОРТСМЕНАМИ</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Отслеживай каждый рывок, ставь новые рекорды и бросай вызов самому себе. Твой цифровой партнер для роста
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in max-w-md mx-auto">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 transition-colors text-lg h-12 min-h-[48px]"
              onClick={handleDownload}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91v-6.84l10 .15z"/>
              </svg>
              Скачать
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg h-12 min-h-[48px]"
              onClick={handleLoginClick}
            >
              Войти
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Наши сервисы</h2>
            <p className="text-xl text-muted-foreground">
              Всё необходимое для вашего спортивного развития
            </p>
          </div>
          
          {/* Карточки сервисов с одинаковой высотой */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="p-6 glass-card hover-lift group cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Иконка */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  
                  {/* Заголовок и описание */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.heading}
                    </h3>
                    <p className="text-muted-foreground flex-1">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Кнопка */}
                  <Button 
                    variant="ghost" 
                    className="w-full mt-6 group-hover:bg-primary/10 transition-colors justify-between"
                    asChild
                  >
                    <a href={feature.url}>
                      Узнать больше
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notion Style Block */}
      <NotionStyleBlock />

      {/* Waitlist Section */}
      <Waitlist1 />

      <Footer />
    </div>
  );
};

export default LandingPage;