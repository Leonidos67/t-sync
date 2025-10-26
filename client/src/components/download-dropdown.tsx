import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { detectOS } from '@/lib/platform';

// Platform Icons
const WindowsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
    <path d="M12.5 0C11.5 0 11 1.5 11 2.5c0 .5 0 1 .5 1.5-.5.5-1 1.5-1 2.5 0 1.5 1 2.5 2 2.5s2-1 2-2.5c0-1-.5-2-1-2.5.5-.5.5-1 .5-1.5C14 1.5 13.5 0 12.5 0zm-1 9c-3 0-5.5 2-6.5 4.5-.5 1.5-.5 3 0 4 .5 1 1.5 1.5 2.5 1.5 1 0 1.5-.5 2-1.5.5 1 1 1.5 2 1.5s1.5-.5 2-1.5c.5 1 1 1.5 2 1.5s2-.5 2.5-1.5c.5-1 .5-2.5 0-4C17 11 14.5 9 11.5 9zm-1 3c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1zm3 0c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1zm-4.5 3c0 .5.5 1 1 1h3c.5 0 1-.5 1-1 0-.5-.5-1-1-1h-3c-.5 0-1 .5-1 1zm-4 5c-.5.5-1 1-1 2s.5 2 1.5 2c.5 0 1 0 1.5-.5l1-1.5c0-.5.5-1 .5-1.5 0-.5-.5-1-1-1-.5 0-1 0-1.5.5l-1 1zm11 0l-1-1c-.5-.5-1-.5-1.5-.5-.5 0-1 .5-1 1 0 .5.5 1 .5 1.5l1 1.5c.5.5 1 .5 1.5.5 1 0 1.5-1 1.5-2s-.5-1.5-1-2z"/>
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
  const [userRealOS, setUserRealOS] = useState<string>('Unknown'); // Real user OS (fixed)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const detectedOS = detectOS();
    setCurrentOS(detectedOS);
    setUserRealOS(detectedOS); // Store the real OS once
    
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
  const currentDownload = downloads.find(d => d.platform === currentOS) || downloads[0];
  const mainButtonText = `${buttonText} для ${currentDownload.platform}`;

  const handleMainButtonClick = () => {
    handleDownload(currentDownload.downloadUrl, currentDownload.filename || `Aurora-Rise-${currentDownload.platform}`);
  };

  const handlePlatformSelect = (item: DownloadItem) => {
    // Update current OS to selected platform
    setCurrentOS(item.platform);
    // Optionally auto-download after selection
    // handleDownload(item.downloadUrl, item.filename || `Aurora-Rise-${item.platform}`);
  };

  // Get icon for current platform
  const getCurrentIcon = () => {
    switch (currentDownload.icon) {
      case 'windows':
        return <WindowsIcon />;
      case 'apple':
        return <AppleIcon />;
      case 'linux':
        return <LinuxIcon />;
      default:
        return <WindowsIcon />;
    }
  };

  return (
    <div className={`inline-flex items-stretch ${className?.includes('w-full') ? 'w-full' : ''} ${className}`}>
      {/* Main Download Button */}
      <button
        disabled={isLoading}
        onClick={handleMainButtonClick}
        className={`
          inline-flex items-center justify-center rounded-l-lg px-4 py-2 flex-1
          text-sm font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${size === 'lg' ? 'h-12 px-6 text-lg' : size === 'sm' ? 'h-9 px-3 text-xs' : 'h-10 px-4'}
          ${variant === 'default' ? 'bg-foreground text-background hover:bg-foreground/90' : ''}
          ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : ''}
        `}
      >
        {showIcon && (
          <div className="mr-2 flex items-center justify-center">
            {getCurrentIcon()}
          </div>
        )}
        {isLoading ? 'Загрузка...' : mainButtonText}
      </button>

      {/* Vertical Divider */}
      <div className={`
        w-[1px] 
        ${variant === 'default' ? 'bg-background/20' : 'bg-border'}
      `} />

      {/* Dropdown Trigger Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={isLoading}
            className={`
              inline-flex items-center justify-center rounded-r-lg px-2
              text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              disabled:pointer-events-none disabled:opacity-50
              ${size === 'lg' ? 'h-12' : size === 'sm' ? 'h-9' : 'h-10'}
              ${variant === 'default' ? 'bg-foreground text-background hover:bg-foreground/90' : ''}
              ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground border-l-0' : ''}
            `}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto"> 
          {downloads.map((item) => (
            <DropdownMenuItem
              key={item.platform}
              className="cursor-pointer flex items-center gap-3"
              onClick={() => handlePlatformSelect(item)}
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
                  {item.platform === userRealOS && ' (Ваша ОС)'}
                </span>
              </div>
              {item.platform === currentOS && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

