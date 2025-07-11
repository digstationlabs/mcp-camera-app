# Contributing to MCP Camera App

We welcome contributions! Here's how you can help improve the MCP Camera App.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/mcp-camera-app.git
   cd mcp-camera-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Test the app**
   ```bash
   npm start          # CLI version
   npm run start:gui  # GUI version
   ```

## 🛠️ Development Workflow

### Setting up for Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test           # Run tests (when available)
   npm run build      # Test build process
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

## 📝 Code Style Guidelines

### JavaScript
- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Follow existing indentation (2 spaces)
- Use descriptive variable names

### File Organization
```
src/
├── cli/          # Command line interface
├── gui/          # Electron GUI
├── core/         # Shared business logic
└── utils/        # Utility functions
```

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep first line under 50 characters
- Add details in body if needed

Examples:
```
Add camera image download functionality
Fix coordinate validation for edge cases
Update README with installation instructions
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Operating system and version**
5. **App version**
6. **Screenshots** (if applicable)

Use the GitHub issue template when available.

## 💡 Feature Requests

We love new ideas! When suggesting features:

1. **Describe the problem** you're trying to solve
2. **Explain your proposed solution**
3. **Consider alternative solutions**
4. **Think about implementation complexity**

## 🧪 Testing

Currently, the app relies on manual testing. We welcome contributions to add automated tests:

- Unit tests for core functionality
- Integration tests for API calls
- GUI automation tests
- CLI interaction tests

## 📚 Documentation

Help improve our documentation:

- README improvements
- Code comments
- API documentation
- User guides
- Developer guides

## 🚀 Release Process

For maintainers:

1. **Update version** in `package.json`
2. **Run build process** 
   ```bash
   npm run build:all
   ```
3. **Test executables** on different platforms
4. **Create release notes**
   ```bash
   npm run release
   ```
5. **Tag release**
   ```bash
   git tag v1.x.x
   git push origin v1.x.x
   ```
6. **Create GitHub release** with binaries

## 📋 Areas for Contribution

### High Priority
- [ ] Add automated tests
- [ ] Improve error handling
- [ ] Add configuration options
- [ ] Performance optimizations
- [ ] Mobile-responsive GUI

### Medium Priority
- [ ] Add camera favorites/bookmarks
- [ ] Implement search filters
- [ ] Add map integration
- [ ] Create installer packages
- [ ] Add dark/light theme toggle

### Low Priority
- [ ] Add camera ratings/reviews
- [ ] Implement offline mode
- [ ] Add camera sharing features
- [ ] Create browser extension
- [ ] Add camera notifications

## 🏗️ Architecture

### CLI App (`src/cli/`)
- Interactive menu system
- Command-line argument parsing
- Progress indicators and loading states
- Error handling and user feedback

### GUI App (`src/gui/`)
- Electron-based desktop application
- HTML/CSS/JavaScript frontend
- IPC communication with main process
- Modal dialogs and responsive design

### Core Logic (`src/core/`)
- API client for MCP Camera server
- Configuration management
- Popular locations data
- Coordinate validation utilities

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a welcoming community

## 📞 Getting Help

- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Email**: Open an issue for direct contact

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- About dialog in the app

Thank you for helping make MCP Camera App better! 🙏