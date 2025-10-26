import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";

const PricingPage: React.FC = () => {
  const { theme } = useTheme();
  
  const plans = [
    {
      name: "Starter",
      price: "Бесплатно",
      description: "Для начинающих спортсменов",
      features: [
        "Базовые тренировки",
        "Отслеживание прогресса",
        "Сообщество",
        "Мобильное приложение"
      ],
      limitations: [
        "Ограниченные AI функции",
        "Базовые аналитики"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "₽2,990",
      period: "/месяц",
      description: "Для серьезных спортсменов",
      features: [
        "Все функции Starter",
        "AI тренер",
        "Расширенная аналитика",
        "Персональные планы",
        "Приоритетная поддержка",
        "Интеграция с устройствами"
      ],
      limitations: [],
      popular: true
    },
    {
      name: "Team",
      price: "₽9,990",
      period: "/месяц",
      description: "Для команд и тренеров",
      features: [
        "Все функции Professional",
        "Управление командой",
        "Групповые тренировки",
        "Аналитика команды",
        "Кастомные интеграции",
        "Dedicated менеджер"
      ],
      limitations: [],
      popular: false
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
              <span className="gradient-text">Тарифные планы</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Выберите план, который подходит именно вам
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 glass-card hover-lift relative ${
                  plan.popular ? 'border-primary/50 bg-primary/5' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      Популярный
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center space-x-3 text-muted-foreground">
                      <X className="w-5 h-5" />
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  }`}
                >
                  {plan.name === 'Starter' ? 'Начать бесплатно' : 'Выбрать план'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;