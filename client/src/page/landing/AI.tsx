import React from "react";
import { Brain, Zap, Target, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";
import SiriOrb from "@/components/smoothui/ui/SiriOrb";
import { motion } from "motion/react";
import { useState } from "react";

const AIPage: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: "AI Тренер",
      description: "Персональный искусственный интеллект, который создает индивидуальные планы тренировок"
    },
    {
      icon: Target,
      title: "Умные цели",
      description: "AI анализирует ваши возможности и ставит реалистичные, достижимые цели"
    },
    {
      icon: BarChart3,
      title: "Предиктивная аналитика",
      description: "Предсказывает результаты и корректирует планы на основе вашего прогресса"
    },
    {
      icon: Zap,
      title: "Мгновенная адаптация",
      description: "Планы автоматически корректируются в зависимости от вашего состояния и результатов"
    }
  ];

  const roadmapSteps = [
    {
      phase: "Фаза 1",
      title: "Базовый AI Тренер",
      description: "Персональные планы тренировок и базовые рекомендации",
      status: "active",
      features: ["Индивидуальные тренировки", "Базовая аналитика", "Цели и прогресс"]
    },
    {
      phase: "Фаза 2",
      title: "Продвинутая аналитика",
      description: "Глубокая аналитика результатов и предсказание прогресса",
      status: "active",
      features: ["Предиктивная аналитика", "Сравнение с целями", "Автоматические корректировки"]
    },
    {
      phase: "Фаза 3",
      title: "AI Сообщество",
      description: "Социальные функции и групповые тренировки с AI",
      status: "upcoming",
      features: ["Групповые челленджи", "Социальные сравнения", "Совместные тренировки"]
    },
    {
      phase: "Фаза 4",
      title: "Экосистема AI",
      description: "Полная интеграция со всеми сервисами Aurora Rise",
      status: "upcoming",
      features: ["Межсервисная аналитика", "Умные уведомления", "Автономная оптимизация"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <Breadcrumbs />
          
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Текстовая часть */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="gradient-text">Aurora Ai</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mb-6">
                  Силы искусственного интеллекта, которые работают для вас. Помогает вести тренировочный процесс, делать заметки, анализировать результаты и многое другое.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                    Начать использовать
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Узнать больше
                  </Button>
                </div>
              </div>

              {/* SiriOrb компонент */}
              <div className="flex-shrink-0 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative siri-orb-container"
                >
                  <SiriOrb size="220px" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Основные возможности */}
          <section className="mb-20">
            <div className="border-t border-border rounded-t-[50px] -mx-4 pt-12">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Что умеет Aurora Ai?</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Мощные инструменты на базе AI для вашего спортивного развития
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                    <Card
                      key={index}
                      className="p-6 glass-card hover-lift group cursor-pointer h-full flex flex-col"
                    >
                      <CardContent className="p-0 flex flex-col h-full">
                        <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:text-primary-glow transition-colors" />
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground flex-1">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Дорожная карта развития */}
          <section className="mb-20">
            <div className={`min-h-screen w-full relative rounded-[50px] overflow-hidden ${
              theme === 'dark' 
                ? 'bg-black' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
            }`}>
              {/* Vercel Grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px),
                    linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              />
              
              {/* Your Content/Components */}
              <div className="relative z-10 py-16 px-4">
                <div className="container mx-auto">
                  <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      История развития
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${
                      theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'
                    }`}>
                      Поэтапное внедрение возможностей искусственного интеллекта
                    </p>
                  </div>

                  <div className="relative">
                    {/* Вертикальная линия для десктопа */}
                    <div className={`hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-b from-primary/20 to-primary/10' 
                        : 'bg-gradient-to-b from-primary/30 to-primary/10'
                    }`}></div>
                    
                    <div className="space-y-8 lg:space-y-12">
                      {roadmapSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8"
                        >
                          {/* Четные фазы (0, 2) - слева */}
                          {index % 2 === 0 ? (
                            <>
                              <div className="flex-1 lg:text-right lg:pr-8">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                                  step.status === 'active' 
                                    ? 'bg-primary/20 text-primary' 
                                    : theme === 'dark' 
                                      ? 'bg-muted text-muted-foreground' 
                                      : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {step.phase}
                                </div>
                                <h3 className={`text-xl font-semibold mb-2 ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {step.title}
                                </h3>
                                <p className={`mb-4 ${
                                  theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'
                                }`}>
                                  {step.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 justify-end">
                                  {step.features.map((feature, featureIndex) => (
                                    <span
                                      key={featureIndex}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Центральная точка */}
                              <div className="flex-shrink-0 relative">
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  step.status === 'active' 
                                    ? 'bg-primary border-primary/30' 
                                    : theme === 'dark'
                                      ? 'bg-muted border-muted-foreground/30'
                                      : 'bg-gray-300 border-gray-400/30'
                                }`}></div>
                                {step.status === 'active' && (
                                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                                )}
                              </div>

                              {/* Пустое место для симметрии */}
                              <div className="flex-1 lg:block hidden"></div>
                            </>
                          ) : (
                            <>
                              {/* Пустое место для симметрии */}
                              <div className="flex-1 lg:block hidden"></div>

                              {/* Центральная точка */}
                              <div className="flex-shrink-0 relative">
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  step.status === 'active' 
                                    ? 'bg-primary border-primary/30' 
                                    : theme === 'dark'
                                      ? 'bg-muted border-muted-foreground/30'
                                      : 'bg-gray-300 border-gray-400/30'
                                }`}></div>
                                {step.status === 'active' && (
                                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                                )}
                              </div>

                              {/* Нечетные фазы (1, 3) - справа */}
                              <div className="flex-1 lg:text-left lg:pl-8">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                                  step.status === 'active' 
                                    ? 'bg-primary/20 text-primary' 
                                    : theme === 'dark' 
                                      ? 'bg-muted text-muted-foreground' 
                                      : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {step.phase}
                                </div>
                                <h3 className={`text-xl font-semibold mb-2 ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {step.title}
                                </h3>
                                <p className={`mb-4 ${
                                  theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'
                                }`}>
                                  {step.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2">
                                  {step.features.map((feature, featureIndex) => (
                                    <span
                                      key={featureIndex}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIPage;