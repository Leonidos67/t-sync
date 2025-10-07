#!/bin/bash

echo "========================================"
echo "   Atlass Rise Desktop Installer Builder"
echo "========================================"
echo

echo "[1/5] Installing dependencies..."
npm run install-deps
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "[2/5] Setting up environment..."
npm run setup
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to setup environment"
    exit 1
fi

echo
echo "[3/5] Building applications..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build applications"
    exit 1
fi

echo
echo "[4/5] Creating Windows installer..."
cd electron
npm run build-win
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create installer"
    cd ..
    exit 1
fi
cd ..

echo
echo "[5/6] Copying installer to downloads folder..."
npm run copy-installer
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to copy installer"
    exit 1
fi

echo
echo "[6/6] Installer created successfully!"
echo
echo "========================================"
echo "    BUILD COMPLETED SUCCESSFULLY!"
echo "========================================"
echo
echo "Your installer is ready at:"
echo "  electron/dist/Atlass Rise Setup 1.0.0.exe"
echo "  client/public/downloads/Atlass-Rise-Setup-1.0.0.exe"
echo
echo "Users can download it from: /downloads/Atlass-Rise-Setup-1.0.0.exe"
echo
