/**
 * Electron preload script - exposes safe APIs to renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mcpCamera', {
  // API key management
  api: {
    getKey: () => ipcRenderer.invoke('api:getKey'),
    setKey: (apiKey) => ipcRenderer.invoke('api:setKey', apiKey),
    register: (email) => ipcRenderer.invoke('api:register', email),
    validate: () => ipcRenderer.invoke('api:validate')
  },

  // Camera operations
  camera: {
    search: (lat, lng, radius, options) => ipcRenderer.invoke('camera:search', lat, lng, radius, options),
    get: (cameraId) => ipcRenderer.invoke('camera:get', cameraId),
    getImageUrl: (cameraId) => ipcRenderer.invoke('camera:getImageUrl', cameraId),
    download: (cameraId) => ipcRenderer.invoke('camera:download', cameraId)
  },

  // Server info
  server: {
    info: () => ipcRenderer.invoke('server:info')
  }
});