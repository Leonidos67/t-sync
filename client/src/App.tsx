import { useEffect, useState } from "react";
import AppRoutes from "./routes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { detectOS, getPlatformDownload } from "./lib/platform";

declare global {
  interface Window {
    electronAPI?: {
      getVersion: () => Promise<string>;
    };
  }
}

function App() {
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [downloadButtonText, setDownloadButtonText] = useState('Скачать приложение');
  const isMobile = useIsMobile();

  const setRemindUntil = (date: Date) => {
    try { localStorage.setItem('desktop-app-remind-until', String(date.getTime())); } catch { /* no-op */ }
  };
  const setDismissed = () => {
    try { localStorage.setItem('desktop-app-dismissed', '1'); } catch { /* no-op */ }
  };

  // Update modal is handled elsewhere now

  // Detect OS and set button text
  useEffect(() => {
    const platform = detectOS();
    if (platform === 'Windows') {
      setDownloadButtonText('Скачать для Windows');
    } else if (platform === 'macOS') {
      setDownloadButtonText('Скачать для macOS');
    } else if (platform === 'Linux') {
      setDownloadButtonText('Скачать для Linux');
    } else {
      setDownloadButtonText('Скачать приложение');
    }
  }, []);

  // First-visit Desktop app modal (shown once per browser)
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('desktop-app-dismissed');
      if (dismissed === '1') return; // never show
      const untilStr = localStorage.getItem('desktop-app-remind-until');
      const now = Date.now();
      if (untilStr) {
        const until = parseInt(untilStr, 10);
        if (!Number.isNaN(until) && now < until) return; // wait until reminder time
      }
      setShowDesktopModal(true);
    } catch { /* no-op */ }
  }, []);

  const closeDesktopModal = () => {
    // Default: remind in a week if closed by X
    const next = new Date();
    next.setDate(next.getDate() + 7);
    setRemindUntil(next);
    setShowDesktopModal(false);
  };

  const remindInDays = (days: number) => {
    const next = new Date();
    next.setDate(next.getDate() + days);
    setRemindUntil(next);
    setShowDesktopModal(false);
  };

  const handleDesktopDownload = async () => {
    try {
      const response = await fetch('/api/downloads/info');
      const data = await response.json() as { success?: boolean; downloads?: Array<{ filename?: string; platform?: string; sizeFormatted?: string; downloadUrl: string }>; };
      if (data?.success && Array.isArray(data.downloads) && data.downloads.length > 0) {
        const download = getPlatformDownload(data.downloads);
        
        const link = document.createElement('a');
        link.href = download.downloadUrl;
        link.download = download.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // fallback direct link if API unavailable based on OS
        const platform = detectOS();
        const fallbackUrl = platform === 'macOS' 
          ? '/downloads/Aurora-Rise-Platform.dmg' 
          : '/downloads/Aurora-Rise-Platform-Setup.exe';
        window.location.href = fallbackUrl;
      }
    } catch {
      // fallback based on OS
      const platform = detectOS();
      const fallbackUrl = platform === 'macOS' 
        ? '/downloads/Aurora-Rise-Platform.dmg' 
        : '/downloads/Aurora-Rise-Platform-Setup.exe';
      window.location.href = fallbackUrl;
    }
  };

  return (
    <>
      <AppRoutes />
      {/* Desktop app first-visit modal - BottomSheet on mobile (swipe), Dialog on desktop */}
      {isMobile ? (
        <BottomSheet
          open={showDesktopModal}
          onOpenChange={(open) => { if (!open) closeDesktopModal(); }}
          title="Установите десктопное приложение"
          description="Установите приложение для работы на компьютере"
        >
          <div className="px-4 pb-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-white rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-black" />
              </div>
              <div className="text-sm text-muted-foreground">
                Портативная версия со всеми возможностями веб-платформы. Работает автономно, Windows 10/11.{' '}
                <a href="/downloads/README.md" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:no-underline">
                  Узнать подробнее
                </a>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button onClick={handleDesktopDownload}>
                <Download className="w-4 h-4 mr-2" />
                Скачать для Windows
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    Напомнить позже
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => remindInDays(1)}>Через день</DropdownMenuItem>
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => remindInDays(7)}>Через неделю</DropdownMenuItem>
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => remindInDays(30)}>Через месяц</DropdownMenuItem>
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => { setDismissed(); setShowDesktopModal(false); }}>Никогда</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </BottomSheet>
      ) : (
        <Dialog open={showDesktopModal} onOpenChange={(open) => { if (!open) closeDesktopModal(); }}>
          <DialogContent className="max-w-md w-full" hideCloseButton>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-white to-white rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Установите приложение на Windows</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeDesktopModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Портативная версия со всеми возможностями веб-платформы. Работает автономно, Windows 10/11.{' '}
              <a href="/downloads/README.md" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:no-underline">
                Узнать подробнее
              </a>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button onClick={handleDesktopDownload} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                {downloadButtonText}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto justify-between">
                    Напомнить позже
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => remindInDays(1)}>Через день</DropdownMenuItem>
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => remindInDays(7)}>Через неделю</DropdownMenuItem>
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => remindInDays(30)}>Через месяц</DropdownMenuItem>
                  <DropdownMenuItem className="!cursor-pointer" onClick={() => { setDismissed(); setShowDesktopModal(false); }}>Никогда</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default App;
