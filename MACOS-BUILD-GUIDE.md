# Руководство по сборке Aurora Rise Platform для macOS

## 📋 Содержание
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Сборка для macOS](#сборка-для-macos)
- [Сборка для всех платформ](#сборка-для-всех-платформ)
- [Структура проекта](#структура-проекта)
- [Устранение неполадок](#устранение-неполадок)

## 🔧 Требования

### Для сборки на macOS:
- macOS 10.13 или новее
- Node.js 16+ и npm
- Xcode Command Line Tools (для подписи приложения)

### Для сборки на Windows/Linux:
- Node.js 16+ и npm
- Wine (для создания .dmg на не-Mac системах)
- ImageMagick (опционально, для лучшего качества иконок)

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm run install-deps
```

### Создание иконок
```bash
npm run create-icons
```

Эта команда создаст иконки для всех платформ:
- `electron/assets/icon.ico` - для Windows
- `electron/assets/icon.icns` - для macOS
- `electron/assets/icon.png` - исходник

## 🍎 Сборка для macOS

### Способ 1: Используя npm скрипты

```bash
# Только сборка
npm run build-desktop-mac

# Сборка + копирование в downloads
npm run package-mac
```

### Способ 2: Используя shell скрипт

```bash
# Сделать скрипт исполняемым (первый раз)
chmod +x build-mac.sh

# Запустить полную сборку
./build-mac.sh
```

### Что происходит при сборке:

1. **Установка зависимостей** - устанавливаются все необходимые пакеты
2. **Создание иконок** - генерируются иконки для всех платформ
3. **Настройка окружения** - копируются конфигурационные файлы
4. **Сборка приложения** - компилируются frontend и backend
5. **Создание установщика** - electron-builder создает .dmg файл
6. **Копирование** - установщик копируется в `client/public/downloads/`

### Результат:

После успешной сборки вы найдете установщик в:
- `electron/dist/Aurora Rise-1.0.0.dmg` - оригинальный файл
- `client/public/downloads/Aurora-Rise-Platform.dmg` - для веб-загрузки

## 🌍 Сборка для всех платформ

### Используя npm:
```bash
npm run package-all
```

### Используя shell скрипт:
```bash
chmod +x build-all-platforms.sh
./build-all-platforms.sh
```

Это создаст установщики для:
- **Windows**: `Aurora-Rise-Platform-Setup.exe`
- **macOS**: `Aurora-Rise-Platform.dmg`

## 📁 Структура проекта

```
t-sync-beta/
├── backend/               # Backend API (Node.js + Express)
│   ├── src/              # TypeScript исходники
│   └── dist/             # Скомпилированный JavaScript
│
├── client/               # Frontend (React + Vite)
│   ├── src/              # React компоненты
│   ├── dist/             # Production build
│   └── public/
│       └── downloads/    # Установщики для скачивания
│
├── electron/             # Electron оболочка
│   ├── main.js          # Главный процесс
│   ├── preload.js       # Preload скрипт
│   ├── assets/          # Иконки приложения
│   └── dist/            # Собранные установщики
│
└── build-scripts/       # Скрипты сборки
    ├── setup-env.js
    ├── build-all.js
    ├── copy-installer.js
    └── create-icons.js
```

## 🔍 Детали конфигурации

### electron-builder.yml

Конфигурация для macOS:

```yaml
mac:
  target:
    - target: dmg
      arch:
        - x64        # Intel
        - arm64      # Apple Silicon (M1/M2/M3)
  icon: assets/icon.icns
  category: public.app-category.sports
```

### Поддерживаемые архитектуры:
- **x64** - Intel процессоры
- **arm64** - Apple Silicon (M1, M2, M3)

Установщик будет универсальным и работать на обеих архитектурах.

## 🎨 Работа с иконками

### Требования к иконкам:

- **Формат**: PNG с прозрачностью
- **Размер**: 1024x1024 пикселей (минимум 512x512)
- **Расположение**: `electron/assets/icon.png`

### Создание иконок:

```bash
npm run create-icons
```

Скрипт создаст:
1. `.ico` для Windows (multi-resolution)
2. `.icns` для macOS (содержит все размеры)

На macOS используется встроенная утилита `sips` и `iconutil`.
На Windows/Linux используется ImageMagick (если установлен).

## 🔄 Автоматическое определение платформы

Frontend автоматически определяет ОС пользователя и показывает соответствующую кнопку загрузки:

```typescript
// client/src/lib/platform.ts
export function detectOS(): Platform {
  // Определяет: Windows, macOS, Linux или Unknown
}

export function getPlatformDownload(downloads): DownloadInfo {
  // Возвращает подходящий установщик для текущей ОС
}
```

Кнопки загрузки автоматически меняют текст:
- На Windows: "Скачать для Windows"
- На macOS: "Скачать для macOS"
- На Linux: "Скачать для Linux"

## 🛠 Устранение неполадок

### Проблема: "command not found: iconutil"

**Решение**: Установите Xcode Command Line Tools:
```bash
xcode-select --install
```

### Проблема: Иконки не создаются на Windows

**Решение**: Установите ImageMagick:
- Скачайте с https://imagemagick.org/
- Добавьте в PATH
- Перезапустите терминал

### Проблема: electron-builder не может создать .dmg на Windows

**Решение**: 
1. Используйте macOS для создания .dmg файлов
2. Или установите Wine и дополнительные зависимости:
```bash
npm install --save-dev dmg-builder
```

### Проблема: "Permission denied" при запуске .sh скриптов

**Решение**: Сделайте скрипты исполняемыми:
```bash
chmod +x build-mac.sh
chmod +x build-all-platforms.sh
chmod +x create-installer.sh
```

### Проблема: Ошибка при копировании установщика

**Решение**: Убедитесь что electron/dist содержит собранные файлы:
```bash
ls -la electron/dist/
```

## 📦 Распространение

### Загрузка через веб-интерфейс:

После сборки установщики доступны по URL:
- Windows: `https://your-domain.com/downloads/Aurora-Rise-Platform-Setup.exe`
- macOS: `https://your-domain.com/downloads/Aurora-Rise-Platform.dmg`

### API для получения информации о загрузках:

```bash
GET /api/downloads/info
```

Возвращает:
```json
{
  "success": true,
  "downloads": [
    {
      "filename": "Aurora-Rise-Platform-Setup.exe",
      "platform": "Windows",
      "size": 123456789,
      "sizeFormatted": "117.74 MB",
      "downloadUrl": "/downloads/Aurora-Rise-Platform-Setup.exe"
    },
    {
      "filename": "Aurora-Rise-Platform.dmg",
      "platform": "macOS",
      "size": 123456789,
      "sizeFormatted": "117.74 MB",
      "downloadUrl": "/downloads/Aurora-Rise-Platform.dmg"
    }
  ]
}
```

## 🔐 Подпись приложений

### macOS Code Signing:

Для распространения вне App Store нужна подпись:

1. Получите Apple Developer ID
2. Установите сертификат в Keychain
3. Обновите `electron-builder.yml`:

```yaml
mac:
  identity: "Developer ID Application: Your Name (TEAM_ID)"
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: "build/entitlements.mac.plist"
```

### Нотаризация (для macOS 10.15+):

```yaml
afterSign: "scripts/notarize.js"
```

## 📝 Полезные команды

```bash
# Очистка всех build артефактов
npm run clean

# Только компиляция (без установщика)
cd electron && npm run pack

# Просмотр размера bundle
cd client && npm run build -- --report

# Запуск в dev режиме
npm run dev

# Запуск desktop приложения
npm start
```

## 🤝 Поддержка

Если у вас возникли проблемы:
1. Проверьте [Issues](https://github.com/your-repo/issues)
2. Создайте новый Issue с описанием проблемы
3. Свяжитесь с командой разработки

## 📄 Лицензия

MIT License - см. файл `TECHWITHEMMA-LICENSE.md`

---

**Версия документа**: 1.0.0  
**Последнее обновление**: Октябрь 2024

