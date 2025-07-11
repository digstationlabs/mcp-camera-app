/**
 * Electron main process for MCP Camera App GUI
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MCPCameraClient } from '../core/api-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize API client
const client = new MCPCameraClient();

let mainWindow;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, 'preload.js')
    },
    icon: join(__dirname, '../../assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the main HTML file
  mainWindow.loadFile(join(__dirname, 'index.html'));

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

/**
 * IPC handlers for communication with renderer process
 */

// API key management
ipcMain.handle('api:getKey', async () => {
  return client.apiKey;
});

ipcMain.handle('api:setKey', async (event, apiKey) => {
  await client.setApiKey(apiKey);
  return true;
});

ipcMain.handle('api:register', async (event, email) => {
  try {
    const apiKey = await client.registerApiKey(email);
    return { success: true, apiKey };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('api:validate', async () => {
  try {
    return await client.validateApiKey();
  } catch (error) {
    return false;
  }
});

// Camera operations
ipcMain.handle('camera:search', async (event, lat, lng, radius, options) => {
  try {
    const result = await client.searchCameras(lat, lng, radius, options);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('camera:get', async (event, cameraId) => {
  try {
    const result = await client.getCamera(cameraId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('camera:getImageUrl', async (event, cameraId) => {
  try {
    const result = await client.getCameraImageUrl(cameraId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('camera:download', async (event, cameraId) => {
  try {
    // Show save dialog
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `camera_${cameraId}_${new Date().toISOString().split('T')[0]}.jpg`,
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) {
      return { success: false, error: 'Save canceled' };
    }

    const outputPath = await client.downloadCameraImage(cameraId, result.filePath);
    return { success: true, path: outputPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Server info
ipcMain.handle('server:info', async () => {
  try {
    const result = await client.getServerInfo();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

/**
 * App event handlers
 */

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationURL) => {
    navigationEvent.preventDefault();
  });
});