import { useState, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { detectOS } from '@/lib/platform';

// Platform Icons
const WindowsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0,3.41L9.96,2.14L9.98,11.81L0.03,11.83Zm9.96,8.61,0,9.67L0,20.42l0-8.39ZM11.03,2L24,0V11.79H11.03Zm0,10L24,12.03V24L11.03,21.96Z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const LinuxIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.738-.503 2.638-.04.379-.017.754.045 1.122.08.473.222.914.377 1.321.353 1.045.785 2.036 1.33 2.986.218.38.445.74.688 1.077.219.303.489.556.764.78.28.225.578.413.891.534.36.14.736.217 1.107.217.433 0 .857-.087 1.231-.232.445-.173.878-.459 1.26-.802.427-.384.794-.84 1.084-1.325.336-.566.579-1.188.733-1.839.233-.991.316-2.037.276-3.077-.024-.638-.073-1.276-.15-1.91-.075-.634-.168-1.266-.296-1.893-.162-.792-.37-1.577-.63-2.344l-.11-.331c-.083-.25-.174-.5-.276-.742-.102-.242-.213-.477-.336-.703-.247-.452-.517-.88-.806-1.29-.324-.458-.668-.896-1.029-1.312-.361-.415-.739-.81-1.13-1.183-.392-.373-.799-.723-1.219-1.052-.42-.329-.854-.637-1.297-.922-.443-.286-.9-.549-1.365-.79-.465-.24-.941-.457-1.423-.65-.482-.192-.971-.36-1.465-.502-.494-.142-.994-.257-1.497-.344-.503-.087-1.009-.148-1.517-.183C12.88.008 12.69 0 12.504 0z"/>
  </svg>
);

interface DownloadDropdownProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  buttonText?: string;
}

interface DownloadItem {
  platform: string;
  filename: string;
  downloadUrl: string;
  icon: string;
  available: boolean;
}

export function DownloadDropdown({ 
  className, 
  variant = 'default', 
  size = 'lg',
  showIcon = true,
  buttonText = 'Скачать'
}: DownloadDropdownProps) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    { platform: 'Windows', filename: '', downloadUrl: '/downloads/Aurora-Rise-Platform-Setup.exe', icon: 'windows', available: false },
    { platform: 'macOS', filename: '', downloadUrl: '/downloads/Aurora-Rise-Platform.dmg', icon: 'apple', available: false },
    { platform: 'Linux', filename: '', downloadUrl: '/downloads/Aurora-Rise-Platform.AppImage', icon: 'linux', available: false },
  ]);
  const [currentOS, setCurrentOS] = useState<string>('Unknown');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const detectedOS = detectOS();
    setCurrentOS(detectedOS);
    
    // Fetch available downloads
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch('/api/downloads/info');
      const data = await response.json() as { 
        success?: boolean; 
        downloads?: Array<{ 
          filename?: string; 
          platform?: string; 
          downloadUrl: string;
          sizeFormatted?: string;
        }>; 
      };
      
      if (data?.success && Array.isArray(data.downloads) && data.downloads.length > 0) {
        setDownloads(prevDownloads => 
          prevDownloads.map(item => {
            const found = data.downloads?.find(d => d.platform === item.platform);
            if (found) {
              return {
                ...item,
                filename: found.filename || item.filename,
                downloadUrl: found.downloadUrl,
                available: true,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
      // Keep default download URLs as fallback
    }
  };

  const handleDownload = async (downloadUrl: string, filename: string) => {
    setIsLoading(true);
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      window.location.href = downloadUrl;
    } finally {
      setIsLoading(false);
    }
  };

  // Get current OS download for main button
  const currentDownload = downloads.find(d => d.platform === currentOS);
  const mainButtonText = currentDownload 
    ? `${buttonText} для ${currentOS}`
    : buttonText;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className={className}
          variant={variant}
          size={size}
          disabled={isLoading}
        >
          {showIcon && (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91v-6.84l10 .15z"/>
            </svg>
          )}
          {isLoading ? 'Загрузка...' : mainButtonText}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Выберите платформу</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {downloads.map((item) => (
          <DropdownMenuItem
            key={item.platform}
            className="cursor-pointer flex items-center gap-3"
            onClick={() => handleDownload(item.downloadUrl, item.filename || `Aurora-Rise-${item.platform}`)}
            disabled={item.platform === 'Linux'}
          >
            <div className="flex items-center justify-center w-5 h-5">
              {item.icon === 'windows' && <WindowsIcon />}
              {item.icon === 'apple' && <AppleIcon />}
              {item.icon === 'linux' && <LinuxIcon />}
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-medium">
                {item.platform}
                {item.platform === currentOS && ' (Ваша ОС)'}
              </span>
              {item.platform === 'Linux' && (
                <span className="text-xs text-muted-foreground">Скоро доступно</span>
              )}
            </div>
            <Download className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

