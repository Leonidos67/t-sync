@echo off
echo ========================================
echo    Atlass Rise Desktop Installer Builder
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm run install-deps
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Setting up environment...
call npm run setup
if %errorlevel% neq 0 (
    echo ERROR: Failed to setup environment
    pause
    exit /b 1
)

echo.
echo [3/5] Building applications...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build applications
    pause
    exit /b 1
)

echo.
echo [4/5] Creating Windows installer...
cd electron
call npm run build-win
if %errorlevel% neq 0 (
    echo ERROR: Failed to create installer
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [5/6] Copying installer to downloads folder...
call npm run copy-installer
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy installer
    pause
    exit /b 1
)

echo.
echo [6/6] Installer created successfully!
echo.
echo ========================================
echo    BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your installer is ready at:
echo   electron\dist\Atlass Rise Setup 1.0.0.exe
echo   client\public\downloads\Atlass-Rise-Setup-1.0.0.exe
echo.
echo Users can download it from: /downloads/Atlass-Rise-Setup-1.0.0.exe
echo.
pause
