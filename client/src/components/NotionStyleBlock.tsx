import React from 'react';
import { ArrowRight, List, FolderOpen, Target, Calendar, Zap, BarChart3, TrendingUp, Trophy, FileText, ArrowUpRight } from 'lucide-react';

const NotionStyleBlock: React.FC = () => {
  const features = [
    {
      icon: FolderOpen,
      text: "Организация рабочего пространства"
    },
    {
      icon: List,
      text: "Планирование тренировок"
    },
    {
      icon: Target,
      text: "Превращение заметок в задачи"
    },
    {
      icon: Calendar,
      text: "Автоматическое составление тренировочного плана"
    },
    {
      icon: Zap,
      text: "Получение персональных рекомендаций по нагрузкам"
    },
    {
      icon: BarChart3,
      text: "Анализ эффективности каждой поездки"
    },
    {
      icon: TrendingUp,
      text: "Предсказание прогресса на основе данных"
    },
    {
      icon: Trophy,
      text: "Фиксация личных рекордов"
    },
    {
      icon: FileText,
      text: "Перейти в справочный центр",
      isSpecial: true
    }
  ];

  return (
    <section className="py-20 px-3">
      <div className="container mx-auto">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
          {/* Left Side - Text */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-4">
              Позвольте Aurora AI взять на себя всю рутинную работу
            </h2>
            <p className="text-lg text-muted-foreground mb-2 leading-relaxed">
              Выберите вариант использования, чтобы увидеть, как искусственный интеллект выполняет работу за вас.
            </p>
            <a 
              href="/ai/" 
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-lg font-medium underline decoration-primary underline-offset-4 hover:underline-offset-2"
            >
              Узнать больше
              <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2">
              {/* Face 1 - Yellow circle with checklist */}
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center relative z-10">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Face 2 - White background with pencil */}
              <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center relative z-9 -ml-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              
              {/* Face 3 - Blue circle with hexagon */}
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center relative z-8 -ml-2">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              
              {/* Face 4 - White background with flower */}
              <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center relative z-7 -ml-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              </div>
              
              {/* Face 5 - Red circle with book */}
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center relative z-6 -ml-2">
                <div className="w-4 h-5 bg-white rounded-sm"></div>
              </div>
              
              {/* Face 6 - White background with hat */}
              <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center relative z-5 -ml-2">
                <div className="w-6 h-2 bg-amber-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            feature.isSpecial ? (
              // Special item - Documentation link
              <a
                key={index}
                href="/help"
                className="bg-white dark:bg-white border border-gray-300 dark:border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black dark:text-black leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-600 transition-colors">
                      {feature.text}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-black dark:text-gray-500 group-hover:text-black dark:group-hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                </div>
              </a>
            ) : (
              // Regular items
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
                      {feature.text}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotionStyleBlock;