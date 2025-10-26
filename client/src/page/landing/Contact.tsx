import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTheme } from "@/context/theme-provider";

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@aurora-rise.com",
      description: "Напишите нам в любое время"
    },
    {
      icon: Phone,
      title: "Телефон",
      value: "+7 (999) 123-45-67",
      description: "Пн-Пт с 9:00 до 18:00"
    },
    {
      icon: MapPin,
      title: "Адрес",
      value: "Москва, ул. Спортивная, 1",
      description: "Наш офис в центре города"
    },
    {
      icon: Clock,
      title: "Время работы",
      value: "24/7",
      description: "Поддержка работает круглосуточно"
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
              <span className="gradient-text">Контакты</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Свяжитесь с нами любым удобным способом
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Свяжитесь с нами</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тема</label>
                  <Input placeholder="Тема сообщения" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <Textarea 
                    placeholder="Ваше сообщение..." 
                    rows={6}
                  />
                </div>
                <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  Отправить сообщение
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Контактная информация</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 glass-card hover-lift">
                    <div className="flex items-start space-x-4">
                      <info.icon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-lg font-medium mb-1">{info.value}</p>
                        <p className="text-muted-foreground text-sm">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;