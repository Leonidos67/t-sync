const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-workspace', callback);
  },
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // File operations (if needed)
  openFile: () => ipcRenderer.invoke('dialog-open-file'),
  saveFile: (data) => ipcRenderer.invoke('dialog-save-file', data),
  
  // Notifications
  showNotification: (title, body) => {
    ipcRenderer.invoke('show-notification', { title, body });
  }
});

// Security: Remove node integration
delete window.require;
delete window.exports;
delete window.module;

