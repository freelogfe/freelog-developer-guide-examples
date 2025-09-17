/**
 * @fileoverview EmulatorJS - JavaScript Emulator Frontend
 * 
 * This is the main entry point for the EmulatorJS npm package.
 * It provides a simple API to embed and control retro game emulators in web applications.
 */

// Re-export from simple.js for backward compatibility
export { createEmulator, destroyEmulator } from './simple.js';

// Import and export manager
export { EmulatorManager, emulatorManager } from './manager.js';

// Import loader module
import loadEmulator from './data/loader.js';

/**
 * Configuration options for the EmulatorJS
 * @typedef {Object} EmulatorConfig
 * @property {string} [gameUrl] - URL to the ROM file
 * @property {string} [system] - System/core to use (e.g., 'nes', 'snes', 'gba')
 * @property {string} [gameName] - Name of the game
 * @property {string} [dataPath] - Path to the EmulatorJS data folder
 * @property {string} [biosUrl] - URL to the BIOS file (if required)
 * @property {boolean} [startOnLoad=true] - Whether to start the game immediately after loading
 * @property {boolean} [debug=false] - Enable debug mode
 * @property {boolean} [threads=false] - Enable threading support
 * @property {boolean} [disableDatabases=true] - Disable databases
 * @property {string} [color] - Color configuration
 * @property {number} [volume] - Volume level
 */

/**
 * EmulatorJS class for easy integration
 */
export class EmulatorJS {
  /**
   * Create an EmulatorJS instance
   * @param {string|HTMLElement} element - The element ID or DOM element to mount the emulator
   * @param {EmulatorConfig} config - Configuration options for the emulator
   */
  constructor(element, config = {}) {
    this.element = element;
    this.config = config;
    this.emulator = null;
    this.loaded = false;
  }

  /**
   * Initialize and load the emulator
   * @returns {Promise<any>} Promise that resolves when the emulator is loaded
   */
  async load() {
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
    window.EJS_player = typeof this.element === 'string' ? `#${this.element}` : this.element;
    window.EJS_gameUrl = this.config.gameUrl || '';
    window.EJS_pathtodata = this.config.dataPath || './data/';
    window.EJS_core = this.config.system || '';
    window.EJS_gameName = this.config.gameName || '';
    window.EJS_biosUrl = this.config.biosUrl || '';
    window.EJS_startOnLoaded = this.config.startOnLoad !== undefined ? this.config.startOnLoad : true;
    window.EJS_DEBUG_XX = this.config.debug || false;
    window.EJS_threads = this.config.threads || false;
    window.EJS_disableDatabases = this.config.disableDatabases !== undefined ? this.config.disableDatabases : true;

    // Add any additional config options
    if (this.config.color) window.EJS_color = this.config.color;
    if (this.config.volume) window.EJS_volume = this.config.volume;

    // Load the emulator
    try {
      await loadEmulator();
      
      // Wait for the emulator to be created
      return new Promise((resolve, reject) => {
        const checkEmulator = () => {
          if (window.EJS_emulator) {
            this.emulator = window.EJS_emulator;
            this.loaded = true;
            resolve(this.emulator);
          } else {
            setTimeout(checkEmulator, 100);
          }
        };
        checkEmulator();
      });
    } catch (error) {
      throw new Error(`Failed to load EmulatorJS: ${error.message}`);
    }
  }

  /**
   * Destroy the emulator instance
   */
  destroy() {
    if (this.emulator && typeof this.emulator.destroy === 'function') {
      this.emulator.destroy();
    }
    
    // Clean up globals
    window.EJS_emulator = null;
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
    
    this.emulator = null;
    this.loaded = false;
  }

  /**
   * Load a new ROM/game
   * @param {string} url - URL to the ROM file
   * @returns {Promise<void>} Promise that resolves when the ROM is loaded
   */
  async loadROM(url) {
    if (!this.loaded) {
      throw new Error('Emulator not loaded. Call load() first.');
    }

    if (this.emulator && typeof this.emulator.loadROM === 'function') {
      return this.emulator.loadROM(url);
    } else {
      throw new Error('loadROM not supported by this emulator version');
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.loaded) {
      throw new Error('Emulator not loaded. Call load() first.');
    }

    if (this.emulator && typeof this.emulator.on === 'function') {
      this.emulator.on(event, callback);
    }
  }
}

// Default export
export default EmulatorJS;