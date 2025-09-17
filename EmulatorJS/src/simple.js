/**
 * @fileoverview Simple EmulatorJS wrapper for npm package
 * This provides a minimal wrapper around the original EmulatorJS implementation
 */

// Import loader module
import loadEmulator from './data/loader.js';

/**
 * Creates and initializes an EmulatorJS instance
 * @param {string|HTMLElement} element - The element ID or DOM element to mount the emulator
 * @param {Object} config - Configuration options for the emulator
 * @param {string} [config.gameUrl=''] - URL to the ROM file
 * @param {string} [config.system=''] - System/core to use (e.g., 'nes', 'snes', 'gba')
 * @param {string} [config.gameName=''] - Name of the game
 * @param {string} [config.dataPath='./data/'] - Path to the EmulatorJS data folder
 * @param {string} [config.biosUrl=''] - URL to the BIOS file (if required)
 * @param {boolean} [config.startOnLoad=true] - Whether to start the game immediately after loading
 * @param {boolean} [config.debug=false] - Enable debug mode
 * @param {boolean} [config.threads=false] - Enable threading support
 * @param {boolean} [config.disableDatabases=true] - Disable databases
 * @param {string} [config.color] - Color configuration
 * @param {number} [config.volume] - Volume level
 * @returns {Promise<Object>} Promise that resolves with the emulator instance
 */
export function createEmulator(element, config = {}) {
  return new Promise(async (resolve, reject) => {
    // Clean up any existing emulator
    if (window.EJS_emulator) {
      try {
        if (typeof window.EJS_emulator.destroy === 'function') {
          window.EJS_emulator.destroy();
        }
      } catch (e) {
        console.warn('Error destroying previous emulator:', e);
      }
      window.EJS_emulator = null;
    }

    // Set up global configuration
    window.EJS_player = typeof element === 'string' ? `#${element}` : element;
    window.EJS_gameUrl = config.gameUrl || '';
    window.EJS_pathtodata = config.dataPath || './data/';
    window.EJS_core = config.system || '';
    window.EJS_gameName = config.gameName || '';
    window.EJS_biosUrl = config.biosUrl || '';
    window.EJS_startOnLoaded = config.startOnLoad !== undefined ? config.startOnLoad : true;
    window.EJS_DEBUG_XX = config.debug || false;
    window.EJS_threads = config.threads || false;
    window.EJS_disableDatabases = config.disableDatabases !== undefined ? config.disableDatabases : true;

    // Add any additional config options
    if (config.color) window.EJS_color = config.color;
    if (config.volume) window.EJS_volume = config.volume;

    try {
      // Load the emulator
      await loadEmulator();
      
      // Wait for the emulator to be created
      const checkEmulator = () => {
        if (window.EJS_emulator) {
          resolve(window.EJS_emulator);
        } else {
          setTimeout(checkEmulator, 100);
        }
      };
      checkEmulator();
    } catch (error) {
      reject(new Error(`Failed to load EmulatorJS: ${error.message}`));
    }
  });
}

/**
 * Destroys the current emulator instance
 */
export function destroyEmulator() {
  if (window.EJS_emulator) {
    try {
      if (typeof window.EJS_emulator.destroy === 'function') {
        window.EJS_emulator.destroy();
      }
    } catch (e) {
      console.warn('Error destroying emulator:', e);
    }
    window.EJS_emulator = null;
  }
  
  // Clean up globals
  window.EJS_player = null;
  window.EJS_gameUrl = null;
  window.EJS_pathtodata = null;
  window.EJS_core = null;
  window.EJS_gameName = null;
  window.EJS_biosUrl = null;
  window.EJS_startOnLoaded = null;
  window.EJS_DEBUG_XX = null;
  window.EJS_threads = null;
  window.EJS_disableDatabases = null;
  window.EJS_color = null;
  window.EJS_volume = null;
}

// Export the functions as the default export
export default { createEmulator, destroyEmulator };