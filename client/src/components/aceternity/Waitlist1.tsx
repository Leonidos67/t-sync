import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme-provider";

const Waitlist1 = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`flex h-full min-h-[50vh] w-full items-center justify-center overflow-hidden py-16 relative ${
      theme === 'dark' ? 'bg-background' : 'bg-white'
    }`}>
      {/* Diagonal Cross Center Fade Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 49%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 49%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
      />
      
      {/* Content */}
      <div className="container relative z-10 flex w-full flex-col items-center justify-center px-4">
        {/* Заголовок с такими же стилями как "Наши сервисы" */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Присоединяйтесь</h2>
          <p className="text-xl text-muted-foreground">
            Будьте первыми, кто узнает о запуске наших новых функций и сервисов
          </p>
        </div>
        
        <div className="mt-8 flex w-full max-w-md items-center gap-3">
          <Input
            className={`h-10 w-full rounded-xl border shadow-lg ring-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black active:outline-0 active:ring-0 ${
              theme === 'dark' 
                ? 'bg-black border-gray-600 text-white' 
                : 'bg-white border-gray-200'
            }`}
            placeholder="Введите ваш email"
          />
          <Button className="h-10 rounded-xl whitespace-nowrap bg-foreground text-background hover:bg-foreground/90 transition-colors">
            Присоединиться
          </Button>
        </div>
        <div className="mt-8 flex items-center gap-2">
          <span className="inline-flex items-center -space-x-2.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Avatar key={index} className={`size-8 border-2 ${
                theme === 'dark' ? 'border-gray-800' : 'border-white'
              }`}>
                <AvatarImage
                  src={`https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/avatar${index + 1}.png`}
                  alt="placeholder"
                />
              </Avatar>
            ))}
          </span>
          <p className="text-muted-foreground/80 tracking-tight">
            20000+ человек уже присоединились
          </p>
        </div>
      </div>
    </section>
  );
};

export { Waitlist1 };