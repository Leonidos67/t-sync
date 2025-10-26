import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectOS, getPlatformDownload, type Platform } from '@/lib/platform';

interface DownloadButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
}

export function DownloadButton({ 
  className, 
  variant = 'default', 
  size = 'default',
  showIcon = true 
}: DownloadButtonProps) {
  const [platform, setPlatform] = useState<Platform>('Unknown');
  const [buttonText, setButtonText] = useState('Скачать');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const detectedOS = detectOS();
    setPlatform(detectedOS);
    
    // Set button text based on platform
    if (detectedOS === 'Windows') {
      setButtonText('Скачать для Windows');
    } else if (detectedOS === 'macOS') {
      setButtonText('Скачать для macOS');
    } else if (detectedOS === 'Linux') {
      setButtonText('Скачать для Linux');
    } else {
      setButtonText('Скачать приложение');
    }
  }, []);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/downloads/info');
      const data = await response.json() as { 
        success?: boolean; 
        downloads?: Array<{ 
          filename?: string; 
          platform?: string; 
          sizeFormatted?: string; 
          downloadUrl: string 
        }>; 
      };
      
      if (data?.success && Array.isArray(data.downloads) && data.downloads.length > 0) {
        const download = getPlatformDownload(data.downloads);
        
        const link = document.createElement('a');
        link.href = download.downloadUrl;
        link.download = download.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback based on detected platform
        let fallbackUrl = '/downloads/Aurora-Rise-Platform-Setup.exe';
        if (platform === 'macOS') {
          fallbackUrl = '/downloads/Aurora-Rise-Platform.dmg';
        }
        window.location.href = fallbackUrl;
      }
    } catch (error) {
      console.error('Download error:', error);
      // Fallback based on detected platform
      let fallbackUrl = '/downloads/Aurora-Rise-Platform-Setup.exe';
      if (platform === 'macOS') {
        fallbackUrl = '/downloads/Aurora-Rise-Platform.dmg';
      }
      window.location.href = fallbackUrl;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      className={className}
      variant={variant}
      size={size}
      disabled={isLoading}
    >
      {showIcon && <Download className="w-4 h-4 mr-2" />}
      {isLoading ? 'Загрузка...' : buttonText}
    </Button>
  );
}

