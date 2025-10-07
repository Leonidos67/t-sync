const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;
let isBackendRunning = false;

// Backend configuration
const BACKEND_PORT = 8000;

// Start packaged backend (Node process running backend/dist/index.js)
function startBackend() {
  if (isBackendRunning) return;

  // Resolve backend entry in packaged app, fallback to dev path
  const candidates = [
    path.join(process.resourcesPath, 'backend', 'dist', 'index.js'),
    path.join(__dirname, '../backend/dist/index.js'),
  ];
  const backendEntry = candidates.find(p => {
    try { return fs.existsSync(p); } catch { return false; }
  });

  if (!backendEntry) {
    console.error('Backend entry not found');
    return;
  }

  const env = {
    ...process.env,
    NODE_ENV: 'production',
    DESKTOP_APP: 'true',
    PORT: String(BACKEND_PORT),
  };

  backendProcess = spawn(process.execPath, [backendEntry], {
    env,
    stdio: 'inherit',
  });

  backendProcess.on('spawn', () => {
    isBackendRunning = true;
    console.log(`Backend started on http://localhost:${BACKEND_PORT}`);
  });

  backendProcess.on('exit', (code) => {
    isBackendRunning = false;
    console.log('Backend exited with code', code);
  });
}

// Stop backend process
function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    try { backendProcess.kill(); } catch {}
  }
  isBackendRunning = false;
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false,
    titleBarStyle: 'default'
  });

  // Start backend server
  startBackend();

  // Load the app
  mainWindow.loadURL(`http://localhost:${BACKEND_PORT}`);

  // Set window title with version for visibility
  const appVersion = app.getVersion ? app.getVersion() : '0.0.0';
  try {
    mainWindow.setTitle(`T-Sync Platform v${appVersion}`);
  } catch {}

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Create application menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Workspace',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-workspace');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About T-Sync',
          click: () => {
            // Show about dialog
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About T-Sync',
              message: 'T-Sync Desktop Application',
              detail: 'Version 1.5.0\nA platform for managing training sessions and workouts.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

// Handle app protocol for deep linking (optional)
app.setAsDefaultProtocolClient('tsync');

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// IPC handlers
ipcMain.handle('get-version', async () => {
  try {
    return app.getVersion ? app.getVersion() : '0.0.0';
  } catch {
    return '0.0.0';
  }
});

ipcMain.handle('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.handle('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.handle('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

