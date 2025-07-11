#!/usr/bin/env node

/**
 * Build script for MCP Camera App
 * Creates cross-platform executables
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import { join } from 'path';
import chalk from 'chalk';

const platforms = [
  { target: 'node18-win-x64', name: 'Windows', ext: '.exe' },
  { target: 'node18-macos-x64', name: 'macOS', ext: '' },
  { target: 'node18-linux-x64', name: 'Linux', ext: '' }
];

async function build() {
  console.log(chalk.cyan.bold('🔨 Building MCP Camera App\n'));

  // Ensure dist directory exists
  await fs.ensureDir('dist/cli');

  console.log(chalk.yellow('📦 Installing dependencies...'));
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(chalk.green('✓ Dependencies installed\n'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to install dependencies'));
    process.exit(1);
  }

  console.log(chalk.yellow('🛠️  Building executables...\n'));

  for (const platform of platforms) {
    console.log(chalk.blue(`Building for ${platform.name}...`));
    
    try {
      const outputName = `mcp-camera-app-${platform.target.split('-')[1]}${platform.ext}`;
      const command = `npx pkg src/cli/index.js --target ${platform.target} --output dist/cli/${outputName}`;
      
      execSync(command, { stdio: 'pipe' });
      
      // Check if file was created
      const outputPath = join('dist/cli', outputName);
      if (await fs.pathExists(outputPath)) {
        const stats = await fs.stat(outputPath);
        const sizeInMB = (stats.size / 1024 / 1024).toFixed(1);
        console.log(chalk.green(`✓ ${platform.name}: ${outputName} (${sizeInMB} MB)`));
      } else {
        console.log(chalk.red(`❌ ${platform.name}: Build failed`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ ${platform.name}: ${error.message}`));
    }
  }

  console.log(chalk.cyan.bold('\n🎉 Build complete!\n'));
  console.log(chalk.yellow('📁 Executables are in the dist/cli/ directory:'));
  
  try {
    const files = await fs.readdir('dist/cli');
    files.forEach(file => {
      console.log(chalk.white(`   • ${file}`));
    });
  } catch (error) {
    console.log(chalk.red('Could not list output files'));
  }

  console.log(chalk.gray('\n💡 These executables can be distributed without Node.js'));
}

build().catch(error => {
  console.error(chalk.red('💥 Build failed:'), error.message);
  process.exit(1);
});