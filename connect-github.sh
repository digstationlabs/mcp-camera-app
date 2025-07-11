#!/bin/bash

# Connect to the GitHub repository

echo "🔗 Connecting to GitHub repository..."

# Add the remote
git remote add origin https://github.com/digstationlabs/mcp-camera-app.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Repository connected and pushed to GitHub!"
echo ""
echo "🌐 Your repository is now live at:"
echo "   https://github.com/digstationlabs/mcp-camera-app"
echo ""
echo "🚀 Next steps:"
echo "1. Set up GitHub releases for binary distribution"
echo "2. Add repository topics/tags for discoverability"
echo "3. Configure GitHub Actions for automated builds"
echo "4. Test the app and build executables"
echo ""
echo "💡 To build executables:"
echo "   npm install -g pkg"
echo "   npm run build:all"