import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Target,
  Activity,
  Clock
} from "lucide-react";

interface UserStatsProps {
  user: {
    createdAt: string;
    isActive: boolean;
    userRole?: "coach" | "athlete" | null;
  };
}

const UserStats = ({ user }: UserStatsProps) => {
  const daysInSystem = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  
  // Моковые данные для демонстрации
  const stats = {
    projectsCreated: 0,
    postsPublished: 0,
    tasksCompleted: 0,
    achievements: 0,
    weeklyActivity: 75, // Процент активности за неделю
    streak: 0 // Дней подряд
  };

  const achievements = [
    { name: "Первый шаг", description: "Создал аккаунт", earned: true },
    { name: "Активный пользователь", description: "7 дней активности", earned: stats.weeklyActivity >= 70 },
    { name: "Создатель", description: "Создал первый проект", earned: stats.projectsCreated > 0 },
    { name: "Социальный", description: "Опубликовал первый пост", earned: stats.postsPublished > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Основная статистика */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Статистика активности</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.projectsCreated}</div>
              <div className="text-sm text-gray-600">Проектов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.postsPublished}</div>
              <div className="text-sm text-gray-600">Постов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.tasksCompleted}</div>
              <div className="text-sm text-gray-600">Задач</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{daysInSystem}</div>
              <div className="text-sm text-gray-600">Дней в системе</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Еженедельная активность */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Еженедельная активность</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Активность за неделю</span>
              <span className="text-sm font-medium">{stats.weeklyActivity}%</span>
            </div>
            <Progress value={stats.weeklyActivity} className="h-2" />
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Серия: {stats.streak} дней</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Достижения */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Достижения</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.earned 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {achievement.earned ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    achievement.earned ? 'text-green-900' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className={`text-sm ${
                    achievement.earned ? 'text-green-700' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Цели */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Ближайшие цели</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-900">Создать первый проект</div>
                <div className="text-sm text-blue-700">Начните работу с T-Sync Platform</div>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                В процессе
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-purple-900">Опубликовать пост в Tsygram</div>
                <div className="text-sm text-purple-700">Поделитесь своими достижениями</div>
              </div>
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                В процессе
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-900">Создать персональный сайт</div>
                <div className="text-sm text-green-700">Покажите себя в T-Creatium</div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300">
                В процессе
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
