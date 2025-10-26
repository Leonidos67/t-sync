import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronUp, Plus } from "lucide-react";
import CardSwap from "@/components/ui/CardSwap";

const Pragma: React.FC = () => {
  const navigate = useNavigate();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [completedSteps] = useState(0);

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <div className="mx-auto px-0 py-0 h-full">
        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 bg-card/50 p-3 flex flex-col">
            <div className="text-base font-semibold mb-3">Pragma Aurora</div>
            <nav className="flex flex-col gap-1">
              <Link to="/pragma" className="px-2 py-1 rounded bg-accent text-accent-foreground">Главная</Link>
              <Link to="/pragma/create" className="px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors">Мои сайты</Link>
              <Link to="#" className="px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors">Аналитика</Link>
            </nav>
            {/* Guide section at bottom */}
            <div className="mt-auto bg-[#111] rounded-2xl p-2 mb-[5px]">
              <Button
                variant="ghost"
                className="w-full justify-between text-left rounded-2xl"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
              >
                <span>Ваш прогресс</span>
                <ChevronUp className={`h-4 w-4 transition-transform ${isGuideOpen ? 'rotate-180' : ''}`} />
              </Button>
              {/* Expandable items with animation */}
              <div
                className={`transition-all duration-300 overflow-hidden ${isGuideOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
              >
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-2 py-1 text-sm text-muted-foreground">Пункт 1</div>
                  <div className="px-2 py-1 text-sm text-muted-foreground">Пункт 2</div>
                  <div className="px-2 py-1 text-sm text-muted-foreground">Пункт 3</div>
                </div>
              </div>
              {/* Progress bar always visible under items */}
              <div className="mt-2 flex items-center gap-2 p-2 rounded">
                <span className="text-xs text-muted-foreground w-8">{completedSteps}/3</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(completedSteps / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Content area */}
          <main className="flex-1 pr-[15px] pt-[15px] pb-[15px] bg-card/50 overflow-visible">
            {/* Parent block with border and 15px padding, full viewport height */}
            <div className="border rounded-2xl bg-[#111] shadow-sm p-[15px] h-[calc(100vh-30px)] overflow-visible">
              
              {/* New section with text and CardSwap */}
              <div className="flex flex-row items-stretch gap-8 mb-8 p-6 bg-[#0a0a0a] rounded-xl border border-white/10 overflow-visible">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Создайте свой персональный сайт</h2>
                  <p className="text-muted-foreground mb-4">
                    Pragma Aurora позволяет легко создать профессиональный персональный сайт. 
                    Покажите свои достижения, навыки и работы в красивом и современном формате.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Персональный профиль с фотографией и описанием</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Интеграция с социальными сетями</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Настройка цен и услуг</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Адаптивный дизайн для всех устройств</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <div className="relative overflow-visible" style={{ height: '220px', width: '330px', zIndex: 10 }}>
                    <CardSwap
                      cardDistance={30}
                      verticalDistance={35}
                      delay={5000}
                      pauseOnHover={false}
                      width={330}
                      height={220}
                      onCardClick={() => {}}
                    >
                      <div className="card bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white">
                        <h3 className="text-lg font-bold mb-1">Персональный сайт</h3>
                        <p className="text-xs opacity-90">Создайте уникальную страницу для себя</p>
                      </div>
                      <div className="card bg-gradient-to-br from-blue-500 to-cyan-400 p-4 text-white">
                        <h3 className="text-lg font-bold mb-1">Профессиональный профиль</h3>
                        <p className="text-xs opacity-90">Покажите свои достижения и навыки</p>
                      </div>
                      <div className="card bg-gradient-to-br from-emerald-500 to-lime-400 p-4 text-white">
                        <h3 className="text-lg font-bold mb-1">Портфолио</h3>
                        <p className="text-xs opacity-90">Демонстрируйте свои работы</p>
                      </div>
                    </CardSwap>
                  </div>
                </div>
              </div>

              {/* Original content section */}
              <div className="flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg mb-4">Похоже, сайта пока нет.</p>
                  <div className="relative max-w-md mx-auto rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src="/src/assets/none_web.jpg" 
                      alt="Создайте свой персональный сайт" 
                      className="w-full h-auto"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, #111 100%)'
                      }}
                    />
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 rounded-b-lg"
                      style={{
                        background: 'linear-gradient(to top, #111 0%, rgba(17,17,17,0.85) 60%, transparent 100%)'
                      }}
                    />
                  </div>
                  <Button className="mt-4" onClick={() => navigate('/pragma/create')}>
                    <Plus className="h-4 w-4" />
                    Создать сайт
                  </Button>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Pragma;
