import React from "react";
import { Trophy, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";

const ServicesPage: React.FC = () => {
  const { theme } = useTheme();
  
  const services = [
    {
      icon: Trophy,
      title: "Aurora Rise Platform",
      description: "Комплексная платформа для ведения тренировочного процесса",
      features: [
        "Планирование тренировок",
        "Отслеживание прогресса",
        "AI-тренер",
        "Мобильное приложение"
      ],
      price: "От ₽2,990/месяц"
    },
    {
      icon: Users,
      title: "Pragma Aurora Rise",
      description: "Создание профессионального сайта-визитки для спортсмена",
      features: [
        "Готовые шаблоны",
        "Интеграция с соцсетями",
        "SEO оптимизация",
        "Аналитика посещений"
      ],
      price: "От ₽1,990/месяц"
    },
    {
      icon: Zap,
      title: "Aurora Volt",
      description: "Социальная сеть для спортсменов",
      features: [
        "Сообщество единомышленников",
        "Групповые тренировки",
        "Система достижений",
        "Мотивационные челленджи"
      ],
      price: "Бесплатно"
    },
    {
      icon: Shield,
      title: "Aurora Rise ID",
      description: "Единый аккаунт для всей экосистемы Aurora Rise",
      features: [
        "Единый вход",
        "Синхронизация данных",
        "Приоритетная поддержка",
        "Эксклюзивные функции"
      ],
      price: "Включено в подписку"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <Breadcrumbs />
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Наши сервисы</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Полная экосистема для вашего спортивного развития
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-8 glass-card hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <service.icon className="w-12 h-12 text-primary mb-4 group-hover:text-primary-glow transition-colors" />
                <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">{service.price}</span>
                  <Button variant="outline" size="sm">
                    Узнать больше
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-12 glass-card text-center bg-gradient-card border-primary/20">
            <h2 className="text-4xl font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Выберите подходящий сервис и начните свой путь к спортивным достижениям
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg">
              Начать бесплатно
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;