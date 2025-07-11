#!/usr/bin/env node

/**
 * Release script for MCP Camera App
 * Creates GitHub releases with binaries
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import { join } from 'path';
import chalk from 'chalk';

async function createRelease() {
  console.log(chalk.cyan.bold('🚀 Creating Release\n'));

  // Get version from package.json
  const packageJson = await fs.readJson('package.json');
  const version = packageJson.version;
  const tagName = `v${version}`;

  console.log(chalk.yellow(`📝 Version: ${version}`));

  // Check if executables exist
  const distPath = 'dist/cli';
  if (!await fs.pathExists(distPath)) {
    console.log(chalk.red('❌ No executables found. Run npm run build first.'));
    process.exit(1);
  }

  const files = await fs.readdir(distPath);
  if (files.length === 0) {
    console.log(chalk.red('❌ No executables found in dist/cli/'));
    process.exit(1);
  }

  console.log(chalk.green(`✓ Found ${files.length} executables:`));
  files.forEach(file => {
    console.log(chalk.white(`   • ${file}`));
  });

  // Create release notes
  const releaseNotes = `
# MCP Camera App ${version}

Access 10,000+ cameras across the United States without Claude Desktop or any dependencies.

## Downloads

Choose the version for your operating system:

### Windows
- [mcp-camera-app-win.exe](./mcp-camera-app-win.exe) - Windows 10/11 (x64)

### macOS  
- [mcp-camera-app-macos](./mcp-camera-app-macos) - macOS 10.14+ (Intel/Apple Silicon)

### Linux
- [mcp-camera-app-linux](./mcp-camera-app-linux) - Ubuntu 18.04+ / CentOS 7+ (x64)

## Features

✅ **No Installation Required** - Download and run  
✅ **10,000+ Cameras** - National Parks, Beaches, Weather Stations  
✅ **Interactive CLI** - Easy-to-use menu system  
✅ **Free API Key** - Just enter your email to get started  
✅ **Image Downloads** - Save camera images locally  
✅ **Popular Locations** - Quick access to famous spots  

## Quick Start

1. Download the executable for your platform
2. Run the app: \`./mcp-camera-app\` (or double-click on Windows)
3. Enter your email to get a free API key
4. Start exploring cameras!

## What's New

- Enhanced error handling and user feedback
- Popular location suggestions
- Image download functionality
- Improved coordinate validation
- Better CLI interface with colors and spinners

---

**Need help?** Open an issue or check our [documentation](README.md).
`.trim();

  // Save release notes
  await fs.writeFile('RELEASE_NOTES.md', releaseNotes);
  console.log(chalk.green('✓ Release notes created'));

  console.log(chalk.yellow('\n📋 Manual steps to complete release:'));
  console.log(chalk.white('1. Commit and push all changes'));
  console.log(chalk.white(`2. Create GitHub release with tag: ${tagName}`));
  console.log(chalk.white('3. Upload executables from dist/cli/'));
  console.log(chalk.white('4. Use RELEASE_NOTES.md as the release description'));

  console.log(chalk.cyan('\n🎉 Release preparation complete!'));
}

createRelease().catch(error => {
  console.error(chalk.red('💥 Release failed:'), error.message);
  process.exit(1);
});