/**
 * Core API client for MCP Camera server
 */

import fetch from 'node-fetch';
import fs from 'fs-extra';
import { join } from 'path';
import { homedir } from 'os';

export class MCPCameraClient {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'https://api-dev.mcp.camera/api/v1/mcp';
    this.apiKey = options.apiKey || null;
    this.configPath = join(homedir(), '.mcp-camera');
    this.configFile = join(this.configPath, 'config.json');
    
    // Load saved configuration
    this.loadConfig();
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      await fs.ensureDir(this.configPath);
      if (await fs.pathExists(this.configFile)) {
        const config = await fs.readJson(this.configFile);
        this.apiKey = this.apiKey || config.apiKey;
        this.apiUrl = config.apiUrl || this.apiUrl;
      }
    } catch (error) {
      // Config file doesn't exist or is invalid - that's ok
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfig() {
    try {
      await fs.ensureDir(this.configPath);
      await fs.writeJson(this.configFile, {
        apiKey: this.apiKey,
        apiUrl: this.apiUrl,
        lastUpdated: new Date().toISOString()
      }, { spaces: 2 });
    } catch (error) {
      console.warn('Could not save configuration:', error.message);
    }
  }

  /**
   * Set API key and save to config
   */
  async setApiKey(apiKey) {
    this.apiKey = apiKey;
    await this.saveConfig();
  }

  /**
   * Register a new API key with email
   */
  async registerApiKey(email) {
    try {
      // This would call the registration endpoint
      // For now, we'll simulate it
      const apiKey = `mcp_live_${Math.random().toString(36).substring(2)}${Date.now()}`;
      await this.setApiKey(apiKey);
      return apiKey;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Make API call to MCP server
   */
  async call(toolName, args = {}) {
    if (!this.apiKey) {
      throw new Error('API key not set. Please register first.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message || 'Unknown API error');
      }

      return result.result;
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to MCP Camera server. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Get server info and usage stats
   */
  async getServerInfo() {
    return this.call('hello_mcp_camera');
  }

  /**
   * Search cameras within radius
   */
  async searchCameras(lat, lng, radius, options = {}) {
    return this.call('list_cameras_in_radius', {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius: parseInt(radius),
      ...options
    });
  }

  /**
   * Get camera details
   */
  async getCamera(cameraId) {
    return this.call('get_camera', { cameraId });
  }

  /**
   * Get camera image URL
   */
  async getCameraImageUrl(cameraId) {
    return this.call('get_camera_image_url', { cameraId });
  }

  /**
   * Download camera image
   */
  async downloadCameraImage(cameraId, outputPath) {
    const result = await this.getCameraImageUrl(cameraId);
    
    // Extract URL from result
    let imageUrl;
    if (result.content && result.content[0] && result.content[0].text) {
      const text = result.content[0].text;
      const urlMatch = text.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        imageUrl = urlMatch[0];
      }
    }

    if (!imageUrl) {
      throw new Error('No image URL found in response');
    }

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const buffer = await response.buffer();
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  }

  /**
   * Check if API key is valid
   */
  async validateApiKey() {
    try {
      await this.getServerInfo();
      return true;
    } catch (error) {
      return false;
    }
  }
}