import React from 'react';
import { Link } from 'react-router-dom';
// import { ExternalLink } from 'lucide-react';

interface AdPostProps {
  id: string;
}

const AdPost: React.FC<AdPostProps> = ({ id }) => {
  // Массив шаблонных рекламных постов
  const adTemplates = [
    {
      "title": "Один профиль — все возможности!",
      "description": "Заходите в любой сервис нашей экосистемы без паролей и регистраций. Ваши данные, прогресс и клиенты всегда с вами.",
      "cta": "Начать использовать",
      "icon": "<TrendingUp className=\"w-6 h-6\" />",
      "color": "from-blue-500 to-purple-600",
      "link": "/id/"
    },
    {
      "title": "Доверие начинается с профессионализма!",
      "description": "Когда вас гуглят, первое, что видят — ваш сайт. Простая, стильная и информативная страница повышает доверие и конверсию в заявки.",
      "cta": "Повысить доверие",
      "icon": "<Users className=\"w-6 h-6\" />",
      "color": "from-green-500 to-teal-600",
      "link": "/pragma/"
    },
    {
      "title": "Вы тренер?",
      "description": "Разместите свой профиль на Доске Тренеров, где вас ищут десятки потенциальных подопечных. Заполните анкету один раз и получайте заявки постоянно.",
      "cta": "Разместить анкету",
      "icon": "<Star className=\"w-6 h-6\" />",
      "color": "from-orange-500 to-red-600",
      "link": "/u/board/"
    },
    {
      "title": "Все программы и прогресс учеников — в одном месте",
      "description": "Автоматизируйте рутину: создавайте тренировки, отслеживайте прогресс и получайте отчеты. Полностью бесплатно для тренеров.",
      "cta": "Попробовать бесплатно",
      "icon": "<LayoutDashboard className=\"w-6 h-6\" />",
      "color": "from-purple-500 to-pink-600",
      "link": "/workspace/welcome"
    },
    {
      "title": "Ваша онлайн-визитка за 15 минут",
      "description": "Готовый сайт-портфолио с вашими услугами, отзывами и контактами. Бесплатно и без программирования.",
      "cta": "Создать сайт",
      "icon": "<Globe className=\"w-6 h-6\" />",
      "color": "from-cyan-500 to-blue-600",
      "link": "/pragma"
    },
    {
      "title": "Новые клиенты ищут вас прямо сейчас",
      "description": "Присоединяйтесь к сообществу тренеров, где потенциальные ученики уже ждут своего наставника. Это бесплатно!",
      "cta": "Найти учеников",
      "icon": "<UserPlus className=\"w-6 h-6\" />",
      "color": "from-emerald-500 to-green-600",
      "link": "/u/board"
    },
    {
      "title": "Превратите тренировки в наглядный прогресс",
      "description": "Красивые графики и аналитика для вас и ваших учеников. Мотивируйте цифрами — бесплатно для всех участников.",
      "cta": "Смотреть демо",
      "icon": "<BarChart3 className=\"w-6 h-6\" />",
      "color": "from-violet-500 to-purple-600",
      "link": "/workspace/welcome"
    },
    {
      "title": "Общайтесь, вдохновляйтесь, растите вместе",
      "description": "Присоединяйтесь к самому быстрорастущему сообществу тренеров и спортсменов. Обмен опытом и поддержка коллег.",
      "cta": "Вступить в сообщество",
      "icon": "<MessageCircle className=\"w-6 h-6\" />",
      "color": "from-rose-500 to-red-600",
      "link": "/u/"
    },
    {
      "title": "Автоматизируйте прием заявок и оплат",
      "description": "Настройте автоматическое подтверждение записей и принимайте платежи онлайн. Бесплатно для тренеров-партнеров.",
      "cta": "Настроить автоматизацию",
      "icon": "<CreditCard className=\"w-6 h-6\" />",
      "color": "from-amber-500 to-orange-600",
      "link": "/workspace/welcome"
    },
    {
      "title": "Ваши ученики заслуживают лучшего опыта",
      "description": "Личные кабинеты, мобильные уведомления, трекинг прогресса. Все, что нужно для мотивации и результатов. Бесплатно.",
      "cta": "Улучшить сервис",
      "icon": "<Award className=\"w-6 h-6\" />",
      "color": "from-indigo-500 to-blue-600",
      "link": "/workspace/welcome"
    }
  ];

  // Простая функция для псевдо-случайного выбора на основе ID
  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Выбираем рекламу псевдо-случайно на основе ID для консистентности
  const seed = isNaN(parseInt(id)) ? 0 : parseInt(id);
  const hash = simpleHash(`ad-${seed}-${Date.now().toString().slice(-6)}`);
  const adIndex = hash % adTemplates.length;
  const ad = adTemplates[adIndex] || adTemplates[0];

  // Цветовые схемы для разных реклам
  const colorSchemes = [
    {
      bg: "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20",
      border: "border-orange-200",
      title: "text-orange-900 dark:text-orange-100",
      text: "text-orange-800 dark:text-orange-200",
      accent: "text-orange-600 dark:text-orange-400",
      decor1: "from-orange-200/30 to-yellow-200/30 dark:from-orange-800/20 dark:to-yellow-800/20",
      decor2: "from-orange-200/20 to-yellow-200/20 dark:from-orange-800/10 dark:to-yellow-800/10"
    },
    {
      bg: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      border: "border-blue-200",
      title: "text-blue-900 dark:text-blue-100",
      text: "text-blue-800 dark:text-blue-200",
      accent: "text-blue-600 dark:text-blue-400",
      decor1: "from-blue-200/30 to-indigo-200/30 dark:from-blue-800/20 dark:to-indigo-800/20",
      decor2: "from-blue-200/20 to-indigo-200/20 dark:from-blue-800/10 dark:to-indigo-800/10"
    },
    {
      bg: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      border: "border-green-200",
      title: "text-green-900 dark:text-green-100",
      text: "text-green-800 dark:text-green-200",
      accent: "text-green-600 dark:text-green-400",
      decor1: "from-green-200/30 to-emerald-200/30 dark:from-green-800/20 dark:to-emerald-800/20",
      decor2: "from-green-200/20 to-emerald-200/20 dark:from-green-800/10 dark:to-emerald-800/10"
    },
    {
      bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      border: "border-purple-200",
      title: "text-purple-900 dark:text-purple-100",
      text: "text-purple-800 dark:text-purple-200",
      accent: "text-purple-600 dark:text-purple-400",
      decor1: "from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20",
      decor2: "from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10"
    }
  ];

  const colorScheme = colorSchemes[adIndex % colorSchemes.length];

  return (
    <div className={`p-4 border ${colorScheme.border} rounded-3xl bg-gradient-to-br ${colorScheme.bg} relative overflow-hidden`}>
      {/* Декоративные элементы */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorScheme.decor1} rounded-full -translate-y-16 translate-x-16`}></div>
      <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${colorScheme.decor2} rounded-full translate-y-12 -translate-x-12`}></div>
      
      {/* Реклама */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3 flex-1">
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${colorScheme.title} mb-1`}>
              {ad.title}
            </h3>
            <p className={`${colorScheme.text} text-sm leading-relaxed`}>
              {ad.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <Link 
            to={ad.link}
            className={`px-4 py-2 bg-gradient-to-r ${ad.color} hover:opacity-90 text-white font-semibold rounded-full text-sm transition-all duration-200 transform hover:scale-105 shadow-lg inline-block`}
          >
            {ad.cta}
          </Link>
          {/* <div className={`flex items-center gap-2 text-xs ${colorScheme.accent}`}>
            <ExternalLink className="w-3 h-3" />
            <span>Реклама Aurora Rise</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdPost;
