const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Creating application icons for all platforms...\n');

const assetsPath = path.join(__dirname, '..', 'electron', 'assets');
const sourcePng = path.join(assetsPath, 'icon.png');

// Проверка наличия исходной иконки
if (!fs.existsSync(sourcePng)) {
  console.error('❌ Source icon.png not found at:', sourcePng);
  process.exit(1);
}

// Создание .ico для Windows (если еще нет)
const icoPath = path.join(assetsPath, 'icon.ico');
if (!fs.existsSync(icoPath)) {
  console.log('📝 Creating Windows icon (.ico)...');
  
  try {
    // Пытаемся использовать ImageMagick если установлен
    execSync(`magick convert "${sourcePng}" -define icon:auto-resize=256,128,64,48,32,16 "${icoPath}"`, { stdio: 'ignore' });
    console.log('✅ Windows icon created successfully');
  } catch (e) {
    console.log('⚠️  ImageMagick not found. Copying PNG as fallback.');
    console.log('   For better results, install ImageMagick: https://imagemagick.org/');
    // Копируем PNG как fallback
    fs.copyFileSync(sourcePng, icoPath);
  }
} else {
  console.log('✅ Windows icon already exists');
}

// Создание .icns для macOS
const icnsPath = path.join(assetsPath, 'icon.icns');
console.log('\n📝 Creating macOS icon (.icns)...');

try {
  // Создаем временную папку для иконок
  const iconsetPath = path.join(assetsPath, 'icon.iconset');
  if (fs.existsSync(iconsetPath)) {
    fs.rmSync(iconsetPath, { recursive: true, force: true });
  }
  fs.mkdirSync(iconsetPath);

  // Размеры иконок для macOS
  const sizes = [
    { size: 16, scale: 1 },
    { size: 16, scale: 2 },
    { size: 32, scale: 1 },
    { size: 32, scale: 2 },
    { size: 128, scale: 1 },
    { size: 128, scale: 2 },
    { size: 256, scale: 1 },
    { size: 256, scale: 2 },
    { size: 512, scale: 1 },
    { size: 512, scale: 2 }
  ];

  // Проверяем доступность инструментов конвертации
  let hasSips = false;
  let hasImageMagick = false;

  try {
    execSync('sips --version', { stdio: 'ignore' });
    hasSips = true;
  } catch (e) {}

  try {
    execSync('magick --version', { stdio: 'ignore' });
    hasImageMagick = true;
  } catch (e) {}

  if (hasSips) {
    console.log('Using macOS sips for icon conversion...');
    // Используем sips (встроено в macOS)
    sizes.forEach(({ size, scale }) => {
      const actualSize = size * scale;
      const filename = scale === 1 ? `icon_${size}x${size}.png` : `icon_${size}x${size}@2x.png`;
      const outputPath = path.join(iconsetPath, filename);
      execSync(`sips -z ${actualSize} ${actualSize} "${sourcePng}" --out "${outputPath}"`, { stdio: 'ignore' });
    });

    // Конвертируем iconset в icns
    execSync(`iconutil -c icns "${iconsetPath}" -o "${icnsPath}"`, { stdio: 'ignore' });
    console.log('✅ macOS icon created successfully using sips');
  } else if (hasImageMagick) {
    console.log('Using ImageMagick for icon conversion...');
    // Используем ImageMagick
    sizes.forEach(({ size, scale }) => {
      const actualSize = size * scale;
      const filename = scale === 1 ? `icon_${size}x${size}.png` : `icon_${size}x${size}@2x.png`;
      const outputPath = path.join(iconsetPath, filename);
      execSync(`magick convert "${sourcePng}" -resize ${actualSize}x${actualSize} "${outputPath}"`, { stdio: 'ignore' });
    });

    // На Windows/Linux нужен отдельный инструмент для создания icns
    try {
      execSync(`png2icns "${icnsPath}" "${iconsetPath}"/*.png`, { stdio: 'ignore' });
      console.log('✅ macOS icon created successfully using ImageMagick + png2icns');
    } catch (e) {
      console.log('⚠️  png2icns not found, copying largest PNG as fallback');
      fs.copyFileSync(sourcePng, icnsPath);
    }
  } else {
    console.log('⚠️  No icon conversion tools found (sips or ImageMagick)');
    console.log('   Creating basic .icns by copying PNG (may not work perfectly)');
    
    // Простой fallback - копируем PNG
    // Это не идеально, но лучше чем ничего
    fs.copyFileSync(sourcePng, icnsPath);
  }

  // Удаляем временную папку
  if (fs.existsSync(iconsetPath)) {
    fs.rmSync(iconsetPath, { recursive: true, force: true });
  }

} catch (error) {
  console.error('⚠️  Error creating macOS icon:', error.message);
  console.log('   Using PNG as fallback');
  fs.copyFileSync(sourcePng, icnsPath);
}

console.log('\n✅ Icon creation completed!');
console.log('📁 Icons location:', assetsPath);
console.log('   - icon.png (source)');
console.log('   - icon.ico (Windows)');
console.log('   - icon.icns (macOS)');
console.log('\n💡 Note: For best results on non-macOS systems, install:');
console.log('   - ImageMagick: https://imagemagick.org/');
console.log('   - png2icns: npm install -g png2icns');

