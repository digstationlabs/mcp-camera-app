#!/usr/bin/env node

/**
 * MCP Camera App - CLI Interface
 * Standalone application to access 10,000+ cameras across the US
 */

import { createInterface } from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { MCPCameraClient } from '../core/api-client.js';
import { POPULAR_LOCATIONS, getLocationsByCategory, validateCoordinates } from '../core/locations.js';

// Initialize API client
const client = new MCPCameraClient();

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// App state
let isFirstRun = true;

/**
 * Display welcome banner
 */
function showBanner() {
  console.clear();
  console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                       MCP CAMERA APP                         ║
║                                                              ║
║        Access 10,000+ Cameras Across the United States      ║
║     National Parks • Forests • Beaches • Weather Stations   ║
╚══════════════════════════════════════════════════════════════╝
`));
}

/**
 * Show main menu
 */
function showMenu() {
  console.log(chalk.yellow('\nChoose an option:'));
  console.log(chalk.green('1.') + ' Search cameras near a location');
  console.log(chalk.green('2.') + ' Get camera details by ID');
  console.log(chalk.green('3.') + ' View camera image');
  console.log(chalk.green('4.') + ' Download camera image');
  console.log(chalk.green('5.') + ' Popular locations');
  console.log(chalk.green('6.') + ' Check API usage');
  console.log(chalk.green('7.') + ' Settings');
  console.log(chalk.red('0.') + ' Exit\n');
}

/**
 * Ask a question and return promise
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(chalk.yellow(question) + ' ', resolve);
  });
}

/**
 * Setup API key for first-time users
 */
async function setupApiKey() {
  console.log(chalk.cyan('\n🔑 Welcome! Let\'s get you set up.\n'));
  console.log('To use MCP Camera App, you need a free API key.');
  console.log('Just enter your email address and we\'ll generate one for you.\n');
  
  const email = await askQuestion('Enter your email address:');
  
  if (!email || !email.includes('@')) {
    console.log(chalk.red('Please enter a valid email address.'));
    return false;
  }
  
  const spinner = ora('Registering API key...').start();
  
  try {
    const apiKey = await client.registerApiKey(email);
    spinner.succeed('API key registered successfully!');
    console.log(chalk.green(`\n✓ Your API key: ${apiKey.substring(0, 20)}...`));
    console.log(chalk.gray('(Your key is saved locally and will be used automatically)\n'));
    return true;
  } catch (error) {
    spinner.fail('Registration failed');
    console.log(chalk.red(`Error: ${error.message}\n`));
    return false;
  }
}

/**
 * Search cameras by location
 */
async function searchCameras() {
  console.log(chalk.cyan('\n📍 Search Cameras by Location\n'));
  
  const lat = await askQuestion('Enter latitude (e.g., 37.7749 for San Francisco):');
  const lng = await askQuestion('Enter longitude (e.g., -122.4194 for San Francisco):');
  const radius = await askQuestion('Enter search radius in miles (10-500, default: 50):') || '50';
  
  // Validate coordinates
  const validation = validateCoordinates(lat, lng);
  if (!validation.valid) {
    console.log(chalk.red(`\n❌ ${validation.error}`));
    return;
  }
  
  // Validate radius
  const radiusNum = parseInt(radius);
  if (isNaN(radiusNum) || radiusNum < 10 || radiusNum > 500) {
    console.log(chalk.red('\n❌ Radius must be between 10 and 500 miles'));
    return;
  }
  
  const spinner = ora('Searching for cameras...').start();
  
  try {
    const result = await client.searchCameras(validation.lat, validation.lng, radiusNum);
    
    if (result && result.content && result.content[0]) {
      spinner.succeed(`Found cameras within ${radiusNum} miles`);
      console.log(chalk.green('\n📋 Search Results:'));
      console.log(result.content[0].text);
    } else {
      spinner.warn('No cameras found in this area');
    }
  } catch (error) {
    spinner.fail('Search failed');
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

/**
 * Get camera details
 */
async function getCameraDetails() {
  console.log(chalk.cyan('\n📹 Get Camera Details\n'));
  
  const cameraId = await askQuestion('Enter camera ID:');
  
  if (!cameraId.trim()) {
    console.log(chalk.red('\n❌ Camera ID is required'));
    return;
  }
  
  const spinner = ora('Fetching camera details...').start();
  
  try {
    const result = await client.getCamera(cameraId.trim());
    
    if (result && result.content && result.content[0]) {
      spinner.succeed('Camera details retrieved');
      console.log(chalk.green('\n📋 Camera Information:'));
      console.log(result.content[0].text);
    } else {
      spinner.warn('Camera not found');
    }
  } catch (error) {
    spinner.fail('Failed to get camera details');
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

/**
 * View camera image URL
 */
async function viewCameraImage() {
  console.log(chalk.cyan('\n🖼️  View Camera Image\n'));
  
  const cameraId = await askQuestion('Enter camera ID:');
  
  if (!cameraId.trim()) {
    console.log(chalk.red('\n❌ Camera ID is required'));
    return;
  }
  
  const spinner = ora('Getting image URL...').start();
  
  try {
    const result = await client.getCameraImageUrl(cameraId.trim());
    
    if (result && result.content && result.content[0]) {
      spinner.succeed('Image URL retrieved');
      console.log(chalk.green('\n🔗 Image URL:'));
      console.log(result.content[0].text);
      console.log(chalk.gray('\n💡 Tip: Copy this URL and paste it in your browser to view the image'));
    } else {
      spinner.warn('No image available');
    }
  } catch (error) {
    spinner.fail('Failed to get image URL');
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

/**
 * Download camera image
 */
async function downloadCameraImage() {
  console.log(chalk.cyan('\n💾 Download Camera Image\n'));
  
  const cameraId = await askQuestion('Enter camera ID:');
  const filename = await askQuestion('Enter filename (default: camera.jpg):') || 'camera.jpg';
  
  if (!cameraId.trim()) {
    console.log(chalk.red('\n❌ Camera ID is required'));
    return;
  }
  
  const spinner = ora('Downloading image...').start();
  
  try {
    const outputPath = await client.downloadCameraImage(cameraId.trim(), filename);
    spinner.succeed('Image downloaded successfully');
    console.log(chalk.green(`\n✓ Image saved as: ${outputPath}`));
  } catch (error) {
    spinner.fail('Download failed');
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

/**
 * Show popular locations
 */
function showPopularLocations() {
  console.log(chalk.cyan('\n🌟 Popular Camera Locations\n'));
  
  POPULAR_LOCATIONS.forEach((location, index) => {
    console.log(chalk.yellow(`${index + 1}. ${location.name}`));
    console.log(chalk.gray(`   ${location.description}`));
    console.log(chalk.white(`   📍 ${location.lat}, ${location.lng} (${location.radius} mile radius)`));
    console.log(chalk.blue(`   🏷️  ${location.category}\n`));
  });
  
  console.log(chalk.gray('💡 Copy the coordinates to use in "Search cameras near a location"'));
}

/**
 * Check API usage
 */
async function checkAPIUsage() {
  console.log(chalk.cyan('\n📊 API Usage Status\n'));
  
  const spinner = ora('Checking your API usage...').start();
  
  try {
    const result = await client.getServerInfo();
    
    if (result && result.content && result.content[0]) {
      spinner.succeed('Usage information retrieved');
      console.log(chalk.green('\n📋 Usage Information:'));
      console.log(result.content[0].text);
    } else {
      spinner.warn('Could not retrieve usage information');
    }
  } catch (error) {
    spinner.fail('Failed to check usage');
    console.log(chalk.red(`\n❌ Error: ${error.message}`));
  }
}

/**
 * Settings menu
 */
async function showSettings() {
  console.log(chalk.cyan('\n⚙️  Settings\n'));
  console.log(chalk.green('1.') + ' View current API key');
  console.log(chalk.green('2.') + ' Change API key');
  console.log(chalk.green('3.') + ' Change API server URL');
  console.log(chalk.green('0.') + ' Back to main menu\n');
  
  const choice = await askQuestion('Enter your choice:');
  
  switch (choice) {
    case '1':
      console.log(chalk.yellow(`\nCurrent API key: ${client.apiKey ? client.apiKey.substring(0, 20) + '...' : 'Not set'}`));
      console.log(chalk.yellow(`API server: ${client.apiUrl}`));
      break;
    case '2':
      const newKey = await askQuestion('Enter new API key:');
      if (newKey.trim()) {
        await client.setApiKey(newKey.trim());
        console.log(chalk.green('\n✓ API key updated'));
      }
      break;
    case '3':
      const newUrl = await askQuestion('Enter new API server URL:');
      if (newUrl.trim()) {
        client.apiUrl = newUrl.trim();
        await client.saveConfig();
        console.log(chalk.green('\n✓ API server updated'));
      }
      break;
  }
}

/**
 * Main application loop
 */
async function main() {
  showBanner();
  
  // Check if API key is set
  if (!client.apiKey) {
    const success = await setupApiKey();
    if (!success) {
      console.log(chalk.red('Setup failed. Please try again.'));
      rl.close();
      process.exit(1);
    }
    isFirstRun = false;
  }
  
  // Validate API key if not first run
  if (!isFirstRun) {
    const spinner = ora('Validating API key...').start();
    const isValid = await client.validateApiKey();
    if (isValid) {
      spinner.succeed('API key validated');
    } else {
      spinner.fail('Invalid API key');
      console.log(chalk.red('Please check your API key in settings.'));
    }
  }
  
  while (true) {
    showMenu();
    const choice = await askQuestion('Enter your choice:');
    
    switch (choice) {
      case '1':
        await searchCameras();
        break;
      case '2':
        await getCameraDetails();
        break;
      case '3':
        await viewCameraImage();
        break;
      case '4':
        await downloadCameraImage();
        break;
      case '5':
        showPopularLocations();
        break;
      case '6':
        await checkAPIUsage();
        break;
      case '7':
        await showSettings();
        break;
      case '0':
        console.log(chalk.green('\n👋 Thanks for using MCP Camera App!'));
        rl.close();
        process.exit(0);
        break;
      default:
        console.log(chalk.red('\n❌ Invalid choice. Please try again.'));
    }
    
    await askQuestion(chalk.gray('\nPress Enter to continue...'));
    showBanner();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Goodbye!'));
  rl.close();
  process.exit(0);
});

// Start the application
main().catch((error) => {
  console.error(chalk.red('\n💥 Fatal error:'), error.message);
  rl.close();
  process.exit(1);
});