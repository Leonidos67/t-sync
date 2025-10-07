const fs = require('fs');
const path = require('path');

console.log('📦 Copying installer to downloads folder...\n');

const electronDistPath = path.join(__dirname, '..', 'electron', 'dist');
const downloadsPath = path.join(__dirname, '..', 'client', 'public', 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath, { recursive: true });
}

// Проверяем существование папки electron/dist
if (!fs.existsSync(electronDistPath)) {
  console.error('❌ Electron dist folder not found. Please run electron build first.');
  process.exit(1);
}

// Ищем установщик в electron/dist
const installerFiles = fs.readdirSync(electronDistPath).filter(file => 
  file.toLowerCase().endsWith('.exe') && /t[- ]?sync/i.test(file)
);

if (installerFiles.length === 0) {
  console.error('❌ No Atlass Rise installer found in electron/dist/');
  console.log('Available files:', fs.readdirSync(electronDistPath));
  process.exit(1);
}

// Prefer NSIS installer that contains "Setup" in name
const installerFile = installerFiles.find(f => /setup/i.test(f)) || installerFiles[0];
const sourcePath = path.join(electronDistPath, installerFile);
const targetPath = path.join(downloadsPath, 'Atlass-Rise-Platform-Setup.exe');

try {
  // Копируем установщик
  fs.copyFileSync(sourcePath, targetPath);
  
  // Получаем размер файла
  const stats = fs.statSync(targetPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`✅ Installer copied successfully!`);
  console.log(`📁 Source: ${sourcePath}`);
  console.log(`📁 Target: ${targetPath}`);
  console.log(`📊 Size: ${fileSizeInMB} MB`);
  console.log(`🌐 Available at: /downloads/Atlass-Rise-Setup-1.0.0.exe`);

  // Записываем latest.json с текущей версией приложения для проверки обновлений на клиенте
  const electronPkg = require(path.join(__dirname, '..', 'electron', 'package.json'));
  const latestJson = {
    version: electronPkg.version,
    name: 'Atlass-Rise Platform',
    publishedAt: new Date().toISOString(),
    notes: 'New desktop build available.'
  };
  fs.writeFileSync(path.join(downloadsPath, 'latest.json'), JSON.stringify(latestJson, null, 2));
  console.log(`📝 Wrote downloads/latest.json (version ${electronPkg.version})`);
  
} catch (error) {
  console.error('❌ Failed to copy installer:', error.message);
  process.exit(1);
}

