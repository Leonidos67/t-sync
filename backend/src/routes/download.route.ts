import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Получение информации о доступных загрузках
router.get("/info", (req: Request, res: Response): void => {
  try {
    const downloadsPath = path.join(__dirname, "../../../client/public/downloads");
    
    if (!fs.existsSync(downloadsPath)) {
      res.json({
        success: false,
        message: "Downloads folder not found"
      });
      return;
    }

    const files = fs.readdirSync(downloadsPath);
    const installerFiles = files.filter(file => {
      const lower = file.toLowerCase();
      return lower.endsWith('.exe') || lower.endsWith('.dmg') || lower.endsWith('.zip') || lower.endsWith('.appimage');
    });
    
    // Map files to descriptor objects
    const downloadInfo = installerFiles.map(file => {
      const filePath = path.join(downloadsPath, file);
      const stats = fs.statSync(filePath);
      const lower = file.toLowerCase();
      
      // Determine platform
      let platform = 'Unknown';
      if (lower.endsWith('.exe')) platform = 'Windows';
      else if (lower.endsWith('.dmg')) platform = 'macOS';
      else if (lower.endsWith('.appimage')) platform = 'Linux';
      else if (lower.endsWith('.zip')) platform = 'Archive';
      
      return {
        filename: file,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        lastModified: stats.mtime,
        downloadUrl: `/downloads/${file}`,
        platform,
        isExe: lower.endsWith('.exe'),
        isDmg: lower.endsWith('.dmg')
      };
    });

    // Sort: Windows first, then macOS, then others
    downloadInfo.sort((a, b) => {
      if (a.isExe && !b.isExe) return -1;
      if (!a.isExe && b.isExe) return 1;
      if (a.isDmg && !b.isDmg) return -1;
      if (!a.isDmg && b.isDmg) return 1;
      return 0;
    });

    res.json({
      success: true,
      downloads: downloadInfo
    });
  } catch (error) {
    console.error('Error getting download info:', error);
    res.status(500).json({
      success: false,
      message: "Error getting download information"
    });
  }
});

// Функция для форматирования размера файла
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;

