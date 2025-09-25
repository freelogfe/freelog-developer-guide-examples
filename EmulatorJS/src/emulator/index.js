import { EmulatorJS } from './emulator.js';

// Export the main EmulatorJS function
export default EmulatorJS;

// Also export individual modules for advanced usage
export { initializeEmulator } from './core.js';
export { handleControls } from './controls.js';
export { createUI } from './ui.js';
export { manageSettings } from './settings.js';
export { handleNetworking } from './netplay.js';