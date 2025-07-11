#!/bin/bash

# MCP Camera App - Repository Setup Script

echo "🚀 Setting up MCP Camera App repository..."

# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: MCP Camera App with CLI and GUI interfaces

- Complete CLI application with interactive menu
- Electron-based GUI application
- Cross-platform build system
- API client for MCP Camera server
- Popular locations and coordinate validation
- Image download functionality
- Settings and usage tracking
- Complete documentation and README"

echo "✓ Git repository initialized with initial commit"

# Set up remote (you'll need to replace with your actual GitHub URL)
echo ""
echo "📝 Next steps:"
echo "1. Create a new repository on GitHub named 'mcp-camera-app'"
echo "2. Run these commands to connect to GitHub:"
echo ""
echo "   git remote add origin https://github.com/YOURUSERNAME/mcp-camera-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Test the app:"
echo "   npm install"
echo "   npm start"
echo ""
echo "4. Build executables:"
echo "   npm run build:all"
echo ""
echo "🎉 Repository setup complete!"