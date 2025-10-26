#!/bin/bash

echo "========================================"
echo "   Aurora Rise macOS Installer Builder"
echo "========================================"
echo

echo "[1/6] Installing dependencies..."
npm run install-deps
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "[2/6] Creating icons..."
npm run create-icons
if [ $? -ne 0 ]; then
    echo "WARNING: Failed to create icons, continuing anyway..."
fi

echo
echo "[3/6] Setting up environment..."
npm run setup
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to setup environment"
    exit 1
fi

echo
echo "[4/6] Building applications..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build applications"
    exit 1
fi

echo
echo "[5/6] Creating macOS installer..."
cd electron
npm run build-mac
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create macOS installer"
    cd ..
    exit 1
fi
cd ..

echo
echo "[6/6] Copying installer to downloads folder..."
npm run copy-installer
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to copy installer"
    exit 1
fi

echo
echo "========================================"
echo "    BUILD COMPLETED SUCCESSFULLY!"
echo "========================================"
echo
echo "Your macOS installer is ready at:"
echo "  electron/dist/Aurora Rise-*.dmg"
echo "  client/public/downloads/Aurora-Rise-Platform.dmg"
echo
echo "Users can download it from: /downloads/Aurora-Rise-Platform.dmg"
echo

# List the created files
echo "Created files:"
ls -lh electron/dist/*.dmg 2>/dev/null || echo "  No .dmg files found in electron/dist/"
echo

