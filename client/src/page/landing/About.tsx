import React from "react";
import { Users, Target, Heart, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";

const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  
  const values = [
    {
      icon: Target,
      title: "Цель",
      description: "Помогаем каждому спортсмену достичь своих целей с помощью современных технологий"
    },
    {
      icon: Heart,
      title: "Страсть",
      description: "Мы страстно верим в силу спорта и его способность изменить жизни"
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Создаем сильное сообщество спортсменов, которые поддерживают друг друга"
    },
    {
      icon: Award,
      title: "Превосходство",
      description: "Стремимся к высочайшему качеству во всем, что мы делаем"
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
              <span className="gradient-text">О нас</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Мы создаем будущее спорта с помощью инновационных технологий
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 glass-card hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <value.icon className="w-12 h-12 text-primary mb-4 group-hover:text-primary-glow transition-colors" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-12 glass-card text-center bg-gradient-card border-primary/20">
            <h2 className="text-4xl font-bold mb-4">
              Наша миссия
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Мы стремимся сделать спорт доступным, эффективным и увлекательным для каждого. 
              С помощью AI, сообщества и инновационных технологий мы помогаем спортсменам 
              всех уровней достигать невероятных результатов.
            </p>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;