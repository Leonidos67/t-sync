import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Grip } from "@/components/ui/motion/Grip";
import { Link } from "react-router-dom";

const ServicesMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="group"
      >
        <Grip width={16} height={16} stroke="currentColor" className="w-4 h-4 mr-2 text-foreground" />
        Сервисы
      </Button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-50 max-h-96 scrollbar">
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-medium text-sm text-foreground">Наши сервисы</span>
            </div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3" asChild>
                <Link to="/id" onClick={() => setOpen(false)} className="flex items-center gap-3 w-full min-w-0">
                  <div className="flex-shrink-0">
                    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="40" fill="#4F46E5" stroke="#3730A3" strokeWidth="2"/>
                      <g>
                        <circle cx="60" cy="100" r="15" fill="#10B981" stroke="#047857" strokeWidth="1.5"/>
                        <text x="60" y="105" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S1</text>
                      </g>
                      <g>
                        <circle cx="140" cy="100" r="15" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5"/>
                        <text x="140" y="105" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S2</text>
                      </g>
                      <g>
                        <circle cx="100" cy="60" r="15" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
                        <text x="100" y="65" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S3</text>
                      </g>
                      <g>
                        <circle cx="100" cy="140" r="15" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.5"/>
                        <text x="100" y="145" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S4</text>
                      </g>
                      <line x1="85" y1="100" x2="115" y2="100" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
                      <line x1="100" y1="85" x2="100" y2="115" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3"/>
                      <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ID</text>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">T-Sync ID</span>
                    <span className="text-xs text-muted-foreground truncate">Единый профиль и настройки аккаунта</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3" asChild>
                <Link to="/workspace/welcome" target="_blank" onClick={() => setOpen(false)} className="flex items-center gap-3 w-full min-w-0">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="32" height="32">
                      <circle cx="60" cy="60" r="54" fill="#0b2b3a"/>
                      <polyline points="32,78 48,64 64,70 82,50 96,36" fill="none" stroke="#4dd0e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="96" cy="36" r="7" fill="#4dd0e1"/>
                      <path d="M60 42 a6 6 0 1 1 0.1 0" fill="#fff"/>
                      <path d="M60 48 v10 M60 58 l-8 10 M60 58 l8 10" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">T-Sync Platform</span>
                    <span className="text-xs text-muted-foreground truncate">Управление проектами, задачами и командой</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3" asChild>
                <Link to="/u/" target="_blank" onClick={() => setOpen(false)} className="flex items-center gap-3 w-full min-w-0">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="32" height="32">
                      <circle cx="60" cy="60" r="54" fill="#0f9d58"/>
                      <g transform="translate(60,60)" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle r="28"/>
                        <path d="M-24 0 q20 -12 48 0" />
                        <path d="M-18 -18 q14 8 36 0" />
                        <path d="M-6 18 q6 -12 18 -18" />
                      </g>
                      <path d="M14 84 q22 -30 46 -10 q18 16 46 -14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">Tsygram</span>
                    <span className="text-xs text-muted-foreground truncate">Социальная сеть для спортсменов и тренеров</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3" asChild>
                <Link to="/creatium" target="_blank" onClick={() => setOpen(false)} className="flex items-center gap-3 w-full min-w-0">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="32" height="32">
                      <circle cx="60" cy="60" r="54" fill="#0b2b3a"/>
                      <path d="M46 32 q-10 10 0 20 q10 10 0 20 q-10 10 0 20" stroke="#4dd0e1" strokeWidth="6" fill="none" strokeLinecap="round"/>
                      <path d="M74 32 q10 10 0 20 q-10 10 0 20 q10 10 0 20" stroke="#4dd0e1" strokeWidth="6" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">T-Creatium</span>
                    <span className="text-xs text-muted-foreground truncate">Создание персональных сайтов и портфолио</span>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesMenu;


