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
    const installerFiles = files.filter(file => file.toLowerCase().endsWith('.exe') || file.toLowerCase().endsWith('.zip'));
    
    // Map files to descriptor objects
    const downloadInfo = installerFiles.map(file => {
      const filePath = path.join(downloadsPath, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        lastModified: stats.mtime,
        downloadUrl: `/downloads/${file}`,
        isExe: file.toLowerCase().endsWith('.exe')
      };
    });

    // Prefer .exe first
    downloadInfo.sort((a, b) => (a.isExe === b.isExe ? 0 : a.isExe ? -1 : 1));

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

