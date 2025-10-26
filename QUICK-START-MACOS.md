# 🍎 Быстрый старт: Сборка для macOS

## Краткая инструкция

### 1️⃣ Установка зависимостей
```bash
npm run install-deps
```

### 2️⃣ Создание иконок
```bash
npm run create-icons
```

### 3️⃣ Сборка для macOS

**На macOS:**
```bash
chmod +x build-mac.sh
./build-mac.sh
```

**На Windows:**
```bash
npm run package-mac
```

### 4️⃣ Готово! 🎉

Ваш установщик находится в:
- `electron/dist/Aurora Rise-1.0.0.dmg`
- `client/public/downloads/Aurora-Rise-Platform.dmg`

## 🌍 Сборка для всех платформ

```bash
# На macOS/Linux:
./build-all-platforms.sh

# На Windows:
npm run package-all
```

Создаст установщики для Windows (.exe) и macOS (.dmg).

## ✨ Что нового

### Добавлена поддержка macOS:
- ✅ Создание .dmg установщика
- ✅ Поддержка Intel (x64) и Apple Silicon (arm64)
- ✅ Автоопределение ОС пользователя
- ✅ Динамические кнопки загрузки
- ✅ Backend API для мультиплатформенных загрузок

### Обновленные компоненты:
- `client/src/lib/platform.ts` - определение платформы
- `client/src/components/download-button.tsx` - универсальная кнопка загрузки
- `backend/src/routes/download.route.ts` - поддержка .dmg файлов
- `build-scripts/copy-installer.js` - копирование всех установщиков

## 📋 Доступные скрипты

```bash
# Только создание иконок
npm run create-icons

# Сборка только для Windows
npm run package          # или npm run build-desktop

# Сборка только для macOS
npm run package-mac      # или npm run build-desktop-mac

# Сборка для всех платформ
npm run package-all      # или npm run build-desktop-all

# Очистка
npm run clean
```

## 🔍 Проверка работы

После сборки проверьте API:
```bash
curl http://localhost:3000/api/downloads/info
```

Должен вернуть информацию о всех доступных установщиках.

## 📱 Автоматическое определение ОС

Frontend автоматически определяет операционную систему пользователя:
- На Windows показывает: "Скачать для Windows" → .exe
- На macOS показывает: "Скачать для macOS" → .dmg
- На Linux показывает: "Скачать для Linux" (если доступно)

## ⚠️ Важно

1. **Для создания .dmg на не-Mac системах** требуется Wine
2. **Для подписи приложений на macOS** требуется Apple Developer ID
3. **Иконки создаются автоматически** из `electron/assets/icon.png`

## 📚 Подробная документация

См. `MACOS-BUILD-GUIDE.md` для полной информации.

