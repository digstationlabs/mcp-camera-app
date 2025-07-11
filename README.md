# MCP Camera App 📷

> Standalone application to access 10,000+ cameras across the United States

Access live cameras from National Parks, Forests, Beaches, Weather Stations, and FAA locations without needing Claude Desktop or any AI tools.

## 🚀 Quick Start

### Download & Run (No Installation Required)

1. **Download for your platform:**
   - [Windows (mcp-camera-app.exe)](https://github.com/digstationlabs/mcp-camera-app/releases)
   - [macOS (mcp-camera-app)](https://github.com/digstationlabs/mcp-camera-app/releases)
   - [Linux (mcp-camera-app)](https://github.com/digstationlabs/mcp-camera-app/releases)

2. **Run the application:**
   ```bash
   # Windows
   mcp-camera-app.exe
   
   # macOS/Linux
   ./mcp-camera-app
   ```

3. **Enter your email to get an API key and start exploring!**

## 🎯 Features

### CLI Interface
- **Interactive Menu System** - Navigate with simple number choices
- **Camera Search** - Find cameras by location (latitude/longitude/radius)
- **Camera Details** - Get comprehensive information about any camera
- **Live Images** - View current camera images
- **Popular Locations** - Quick access to famous spots
- **API Usage Tracking** - Monitor your usage and limits

### GUI Interface (Optional)
- **Interactive Map** - Visual camera locations
- **Image Viewer** - Built-in photo viewer with zoom/pan
- **Favorites** - Save your favorite camera locations
- **Auto-Refresh** - Automatically update camera feeds
- **Dark/Light Mode** - Choose your preferred theme

## 🗺️ Available Camera Sources

- **National Park Service (NPS)** - Yosemite, Yellowstone, Grand Canyon, and more
- **U.S. Forest Service (USFS)** - Forest and wilderness cameras
- **Federal Aviation Administration (FAA)** - Weather and airport cameras
- **Beach Cameras** - Coastal and beach monitoring
- **Fire Monitoring** - Wildfire and safety cameras
- **Weather Stations** - NOAA and local weather cams

## 📱 Usage Examples

### Search Cameras Near San Francisco
```
Enter latitude: 37.7749
Enter longitude: -122.4194  
Enter radius: 50 miles

Found 15 cameras:
1. Golden Gate Bridge North (cam_ggb_001) - Active
2. Alcatraz Island View (cam_alc_002) - Active
3. Bay Bridge East (cam_bb_003) - Active
...
```

### Popular Locations
- **Yosemite Valley**: 37.7456, -119.5936
- **Yellowstone**: 44.4280, -110.5885
- **Grand Canyon**: 36.1069, -112.1129
- **Miami Beach**: 25.7907, -80.1300
- **NYC Times Square**: 40.7589, -73.9851

## 🛠️ Development

### Prerequisites
- Node.js 18+ (for development only)
- Git

### Setup
```bash
git clone https://github.com/digstationlabs/mcp-camera-app.git
cd mcp-camera-app
npm install
```

### Run Locally
```bash
# CLI version
npm start

# GUI version  
npm run start:gui

# Development mode
npm run dev
```

### Build Executables
```bash
# Build all platforms
npm run build:all

# Build specific platform
npm run build:cli    # CLI executables
npm run build:gui    # GUI installers
```

## 🔑 API Key Management

- **Automatic Registration** - Enter your email to get an API key
- **Usage Limits** - 1000 API calls per month for free users
- **No Account Required** - Just an email address
- **Secure Storage** - Keys stored locally on your device

## 🌟 Why Use MCP Camera App?

### vs. Web Interfaces
- **Offline Capable** - Save images and favorites locally
- **No Ads** - Clean, distraction-free interface
- **Better Performance** - Native application speed
- **Privacy** - No tracking or analytics

### vs. Individual Camera Sites
- **Unified Access** - One app for all camera sources
- **Smart Search** - Find cameras by location, not website
- **Consistent Interface** - Same experience across all cameras
- **Batch Operations** - Save multiple images at once

## 📋 System Requirements

### Minimum Requirements
- **Windows**: Windows 10 or later
- **macOS**: macOS 10.14 (Mojave) or later  
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 512MB available memory
- **Storage**: 100MB free space
- **Internet**: Active internet connection

### Recommended
- **RAM**: 1GB+ for smooth GUI experience
- **Storage**: 1GB+ for image caching
- **Network**: Broadband connection for fast image loading

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/digstationlabs/mcp-camera-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/digstationlabs/mcp-camera-app/discussions)
- **Email**: support@mcp.camera

## 🔗 Related Projects

- [MCP Camera Server](https://github.com/digstationlabs/mcp-camera) - The backend API
- [Claude Desktop MCP Guide](https://docs.mcp.camera/claude-desktop) - Use with Claude Desktop

---

**Made with ❤️ by the MCP Camera Team**