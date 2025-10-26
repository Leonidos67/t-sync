import React from "react";
import { CheckCircle, Circle, Clock, MessageCircle, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";

const RoadmapPage: React.FC = () => {
  const { theme } = useTheme();
  
  const roadmapItems = {
    completed: [
      {
        title: "Просмотр аналитики и отчетов тренировок",
        description: "Возможность просмотра аналитики тренировок.",
        features: [
          "#Aurora Rise Platform",
          "#Новая функция ✨", 
          "#Улучшение 👍"
        ]
      },
      {
        title: "Добавлены drag-окна",
        description: "Добавлена возможность перетаскивать модальные окна для автоматизации вашего взаимодействия в платформе.",
        features: [
          "#Aurora Rise Platform",
          "#Новая функция ✨",
          "#Расширение 🔥"
        ]
      },
      {
        title: "Возможность добавлять участников",
        description: "Добавлена возможность приглашать в рабочую зону других пользователей.",
        features: [
          "#Aurora Rise Platform",
          "#Новая функция ✨",
          "#Расширение 🔥"
        ]
      },
      {
        title: "Создана платформа", 
        description: "Полностью рабочий функционал платформы.",
        features: [
          "#Aurora Rise Platform",
          "#Конечный результат 🤝"
        ]
      },
      {
        title: "Дизайн платформы",
        description: "Учреждение итогового дизайн платформы. Следующий шаг - разработка функционала.",
        features: [
          "#Aurora Rise Platform", 
          "#Дизайн 🎨"
        ]
      },
      {
        title: "Сайт ресурса",
        description: "Информационный сайт ресурса. Последние новости и обновления.",
        features: [
          "#Aurora Rise Platform",
          "#Новая функция ✨", 
          "#Дизайн 🎨"
        ]
      },
      {
        title: "Основа платформы",
        description: "Создание базовой архитектуры и основных компонентов",
        features: [
          "Система аутентификации",
          "Базовый интерфейс пользователя", 
          "API для тренировок",
          "База данных пользователей",
          "Система уведомлений"
        ]
      },
      {
        title: "Функции тренировок",
        description: "Добавление основных возможностей для спортсменов",
        features: [
          "Планировщик тренировок",
          "Отслеживание прогресса",
          "Мобильное приложение", 
          "Календарь тренировок",
          "Система напоминаний"
        ]
      },
      {
        title: "Базовый AI функционал",
        description: "Внедрение первых AI возможностей",
        features: [
          "AI анализ тренировок",
          "Базовые рекомендации", 
          "Система целей",
          "Автоматическое планирование",
          "Персональные советы"
        ]
      }
    ],
    inProgress: [
      {
        title: "Интеграция Garmin Connect",
        description: "Возможность подключить аккаунт Garmin с выгрузкой тренировок.",
        features: [
          "#Aurora Rise Platform",
          "#Новая функция ✨",
          "#Интеграция ⚡️"
        ]
      },
      {
        title: "Выбор шаблона для сайта",
        description: "Возможность выбрать шаблон для сайта.",
        features: [
          "#Pragma Aurora",
          "#Новая функция ✨",
          "#Дизайн 🎨"
        ]
      },
      {
        title: "Создание сервиса Pragma Aurora",
        description: "Возможность создавать сайты о себе.",
        features: [
          "#Pragma Aurora",
          "#Новая функция ✨"
        ]
      },
      {
        title: "Создание сервиса Aurora Volt",
        description: "Социальная сеть спортсменов и тренеров.",
        features: [
          "#Aurora Volt",
          "#Новая функция ✨"
        ]
      }
    ],
    planned: [
      {
        title: "Создание доски тренеров",
        description: "Возможность загрузить свою анкету, и привлечь новых спортсменов в Рабочую Зону",
        features: [
          "#Новая функция ✨",
          "#Aurora Rise Platform", 
          "#Aurora Volt"
        ]
      }
    ],
    underDiscussion: [
      {
        title: "Создание конференций в рамках платформы",
        description: "Встроенная система для проведения онлайн-конференций, вебинаров и мастер-классов. Идеально для тренеров и спортивных организаций.",
        features: [
          "#Новая функция ✨",
          "#Aurora Rise Platform"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <Breadcrumbs />
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Роадмап развития</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Планы развития экосистемы Aurora Rise на 2025-2027г.
            </p>
          </div>

          {/* Роадмап */}
          <div className="space-y-16">
            {/* Сделано */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h2 className="text-2xl font-bold">Сделано</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground border border-border">
                  ({roadmapItems.completed.length})
                </span>
              </div>
              <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
                {roadmapItems.completed.map((item, index) => (
                  <Card
                    key={index}
                    className="min-w-[320px] max-w-[380px] w-full p-6 glass-card hover-lift flex-shrink-0 bg-background/80 backdrop-blur-sm border-border"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* В разработке */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-500 mr-3" />
                  <h2 className="text-2xl font-bold">В разработке</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground border border-border">
                  ({roadmapItems.inProgress.length})
                </span>
              </div>
              <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
                {roadmapItems.inProgress.map((item, index) => (
                  <Card
                    key={index}
                    className="min-w-[320px] max-w-[380px] w-full p-6 glass-card hover-lift flex-shrink-0 bg-background/80 backdrop-blur-sm border-border"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Запланировано */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Circle className="w-6 h-6 text-purple-500 mr-3" />
                  <h2 className="text-2xl font-bold">Запланировано</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground border border-border">
                  ({roadmapItems.planned.length})
                </span>
              </div>
              <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
                {roadmapItems.planned.map((item, index) => (
                  <Card
                    key={index}
                    className="min-w-[320px] max-w-[380px] w-full p-6 glass-card hover-lift flex-shrink-0 bg-background/80 backdrop-blur-sm border-border"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Обсуждается */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-2xl font-bold">Обсуждается</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground border border-border">
                  ({roadmapItems.underDiscussion.length})
                </span>
              </div>
              <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
                {roadmapItems.underDiscussion.map((item, index) => (
                  <Card
                    key={index}
                    className="min-w-[320px] max-w-[380px] w-full p-6 glass-card hover-lift flex-shrink-0 bg-background/80 backdrop-blur-sm border-border"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Секция предложений */}
            <section className="text-center py-12">
              <Card className="p-8 lg:p-12 glass-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Есть предложения?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Ваши идеи помогают сделать наш сервис еще лучше 🙌
                </p>
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                  Предложить идею
                  <Lightbulb className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapPage;