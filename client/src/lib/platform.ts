/**
 * Platform detection utilities
 */

export type Platform = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

/**
 * Detect the user's operating system
 */
export function detectOS(): Platform {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'Unknown';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || '';

  // macOS detection
  if (
    platform.includes('mac') ||
    userAgent.includes('mac') ||
    platform.includes('iphone') ||
    platform.includes('ipad')
  ) {
    return 'macOS';
  }

  // Windows detection
  if (platform.includes('win') || userAgent.includes('windows')) {
    return 'Windows';
  }

  // Linux detection
  if (
    platform.includes('linux') ||
    userAgent.includes('linux') ||
    userAgent.includes('x11')
  ) {
    return 'Linux';
  }

  return 'Unknown';
}

/**
 * Get download information for the current platform
 */
export interface DownloadInfo {
  platform: Platform;
  filename: string;
  size?: string;
  sizeFormatted?: string;
  downloadUrl: string;
  buttonText: string;
  icon: string;
}

/**
 * Get the appropriate download for the current platform
 */
export function getPlatformDownload(
  downloads: Array<{ filename?: string; platform?: string; downloadUrl: string; sizeFormatted?: string }>
): DownloadInfo {
  const currentOS = detectOS();

  // Find matching download for current platform
  let download = downloads.find((d) => {
    const platform = d.platform || '';
    return platform === currentOS;
  });

  // Fallback to first available if no match
  if (!download && downloads.length > 0) {
    download = downloads[0];
  }

  // Default values if no downloads available
  if (!download) {
    return {
      platform: currentOS,
      filename: 'Aurora-Rise-Platform-Setup.exe',
      downloadUrl: '/downloads/Aurora-Rise-Platform-Setup.exe',
      buttonText: `Скачать для ${currentOS}`,
      icon: '💻',
    };
  }

  // Determine button text and icon based on platform
  let buttonText = 'Скачать';
  let icon = '💻';

  if (download.platform === 'Windows' || download.filename?.endsWith('.exe')) {
    buttonText = 'Скачать для Windows';
    icon = '🪟';
  } else if (download.platform === 'macOS' || download.filename?.endsWith('.dmg')) {
    buttonText = 'Скачать для macOS';
    icon = '🍎';
  } else if (download.platform === 'Linux' || download.filename?.endsWith('.AppImage')) {
    buttonText = 'Скачать для Linux';
    icon = '🐧';
  }

  return {
    platform: currentOS,
    filename: download.filename || '',
    sizeFormatted: download.sizeFormatted,
    downloadUrl: download.downloadUrl,
    buttonText,
    icon,
  };
}

/**
 * Get all available platforms
 */
export function getAvailablePlatforms(
  downloads: Array<{ platform?: string; filename?: string }>
): Platform[] {
  const platforms = new Set<Platform>();

  downloads.forEach((d) => {
    if (d.platform === 'Windows' || d.filename?.endsWith('.exe')) {
      platforms.add('Windows');
    } else if (d.platform === 'macOS' || d.filename?.endsWith('.dmg')) {
      platforms.add('macOS');
    } else if (d.platform === 'Linux' || d.filename?.endsWith('.AppImage')) {
      platforms.add('Linux');
    }
  });

  return Array.from(platforms);
}

