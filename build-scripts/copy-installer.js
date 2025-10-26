const fs = require('fs');
const path = require('path');

console.log('📦 Copying installers to downloads folder...\n');

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

const electronPkg = require(path.join(__dirname, '..', 'electron', 'package.json'));
let copiedFiles = [];
let totalSize = 0;

// Функция для копирования файла
function copyInstaller(sourceFile, targetName, platform) {
  const sourcePath = path.join(electronDistPath, sourceFile);
  const targetPath = path.join(downloadsPath, targetName);
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    const stats = fs.statSync(targetPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    
    console.log(`✅ ${platform} installer copied successfully!`);
    console.log(`   📁 Source: ${sourceFile}`);
    console.log(`   📁 Target: ${targetName}`);
    console.log(`   📊 Size: ${fileSizeInMB} MB\n`);
    
    copiedFiles.push({
      platform,
      filename: targetName,
      size: fileSizeInMB + ' MB',
      url: `/downloads/${targetName}`
    });
    
    return true;
  } catch (error) {
    console.error(`⚠️  Failed to copy ${platform} installer:`, error.message);
    return false;
  }
}

// Ищем Windows установщик (.exe)
const windowsInstallers = fs.readdirSync(electronDistPath).filter(file => 
  file.toLowerCase().endsWith('.exe') && (/aurora|t[- ]?sync/i.test(file))
);

if (windowsInstallers.length > 0) {
  // Prefer NSIS installer that contains "Setup" in name
  const installerFile = windowsInstallers.find(f => /setup/i.test(f)) || windowsInstallers[0];
  copyInstaller(installerFile, 'Aurora-Rise-Platform-Setup.exe', 'Windows');
} else {
  console.log('⚠️  No Windows installer (.exe) found');
}

// Ищем macOS установщик (.dmg)
const macInstallers = fs.readdirSync(electronDistPath).filter(file => 
  file.toLowerCase().endsWith('.dmg') && (/aurora|t[- ]?sync/i.test(file))
);

if (macInstallers.length > 0) {
  const installerFile = macInstallers[0];
  copyInstaller(installerFile, 'Aurora-Rise-Platform.dmg', 'macOS');
} else {
  console.log('⚠️  No macOS installer (.dmg) found');
  console.log('   Run "npm run build-desktop-mac" to create macOS installer\n');
}

// Проверяем, что хотя бы один установщик скопирован
if (copiedFiles.length === 0) {
  console.error('❌ No installers found in electron/dist/');
  console.log('Available files:', fs.readdirSync(electronDistPath));
  process.exit(1);
}

// Записываем latest.json с информацией о всех доступных установщиках
try {
  const latestJson = {
    version: electronPkg.version,
    name: 'Aurora Rise Platform',
    publishedAt: new Date().toISOString(),
    notes: 'New desktop build available for multiple platforms.',
    platforms: copiedFiles,
    totalSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
  };
  
  fs.writeFileSync(
    path.join(downloadsPath, 'latest.json'), 
    JSON.stringify(latestJson, null, 2)
  );
  
  console.log('✅ Installation Summary:');
  console.log('═══════════════════════════════════════════════');
  console.log(`📦 Total installers copied: ${copiedFiles.length}`);
  console.log(`📊 Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`📝 Version: ${electronPkg.version}`);
  console.log('');
  console.log('Available downloads:');
  copiedFiles.forEach(file => {
    console.log(`   • ${file.platform}: ${file.url}`);
  });
  console.log('═══════════════════════════════════════════════\n');
  
} catch (error) {
  console.error('❌ Failed to write latest.json:', error.message);
  process.exit(1);
}

