#!/bin/bash

echo "========================================"
echo "  Aurora Rise Multi-Platform Builder"
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
echo "[5/6] Creating installers for all platforms..."
cd electron
npm run build-all
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create installers"
    cd ..
    exit 1
fi
cd ..

echo
echo "[6/6] Copying installers to downloads folder..."
npm run copy-installer
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to copy installers"
    exit 1
fi

echo
echo "========================================"
echo "    BUILD COMPLETED SUCCESSFULLY!"
echo "========================================"
echo
echo "Your installers are ready:"
echo

# List Windows installers
if ls electron/dist/*.exe 1> /dev/null 2>&1; then
    echo "Windows:"
    ls -lh electron/dist/*.exe
    echo
fi

# List macOS installers
if ls electron/dist/*.dmg 1> /dev/null 2>&1; then
    echo "macOS:"
    ls -lh electron/dist/*.dmg
    echo
fi

echo "Download URLs:"
echo "  Windows: /downloads/Aurora-Rise-Platform-Setup.exe"
echo "  macOS:   /downloads/Aurora-Rise-Platform.dmg"
echo

