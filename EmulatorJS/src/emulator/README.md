# EmulatorJS - Refactored Functional Approach

This directory contains a refactored version of EmulatorJS that follows a functional programming approach instead of the original class-based implementation. The code has been split into multiple modules for better organization and maintainability.

## Structure

- `emulator.js` - Main entry point and initialization
- `core.js` - Core emulator functionality
- `controls.js` - Gamepad and keyboard input handling
- `ui.js` - User interface components
- `settings.js` - Configuration and settings management
- `netplay.js` - Multiplayer networking functionality
- `index.js` - Module exports

## Usage

```javascript
import EmulatorJS from './emulator';

const emulator = EmulatorJS('#game', {
  gameUrl: 'path/to/rom.zip',
  system: 'nes',
  // ... other config options
});
```

## Benefits of Refactoring

1. **Modularity**: Code is now split into separate modules based on functionality
2. **Maintainability**: Smaller, focused files are easier to understand and modify
3. **Functional Approach**: Using functions instead of classes can be more intuitive for some developers
4. **Tree Shaking**: Unused functions can be eliminated during build process

## Compatibility

This refactored version maintains API compatibility with the original class-based implementation while providing a cleaner internal structure.