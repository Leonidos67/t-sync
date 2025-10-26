import React from "react";
import { HelpCircle, MessageCircle, Book, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";

const HelpPage: React.FC = () => {
  const { theme } = useTheme();
  
  const helpSections = [
    {
      icon: Book,
      title: "Документация",
      description: "Подробные руководства и инструкции по использованию платформы",
      action: "Читать документацию"
    },
    {
      icon: MessageCircle,
      title: "FAQ",
      description: "Ответы на часто задаваемые вопросы",
      action: "Просмотреть FAQ"
    },
    {
      icon: HelpCircle,
      title: "Поддержка",
      description: "Свяжитесь с нашей командой поддержки",
      action: "Связаться с поддержкой"
    },
    {
      icon: Mail,
      title: "Обратная связь",
      description: "Поделитесь своими идеями и предложениями",
      action: "Отправить отзыв"
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
              <span className="gradient-text">Справочный центр</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Здесь вы найдете всю необходимую информацию для эффективного использования Aurora Rise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {helpSections.map((section, index) => (
              <Card
                key={index}
                className="p-8 glass-card hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <section.icon className="w-12 h-12 text-primary mb-4 group-hover:text-primary-glow transition-colors" />
                <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
                <p className="text-muted-foreground mb-6">{section.description}</p>
                <Button variant="outline" className="w-full">
                  {section.action}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="p-12 glass-card text-center bg-gradient-card border-primary/20">
            <h2 className="text-4xl font-bold mb-4">
              Нужна помощь?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Наша команда поддержки готова помочь вам 24/7
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg">
              Связаться с нами
            </Button>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpPage;