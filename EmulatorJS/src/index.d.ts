/**
 * EmulatorJS - JavaScript Emulator Frontend
 * 
 * TypeScript definitions for the EmulatorJS npm package.
 */

export as namespace EmulatorJS;

/**
 * Configuration options for the EmulatorJS
 */
export interface EmulatorConfig {
  /** URL to the ROM file */
  gameUrl?: string;
  
  /** System/core to use (e.g., 'nes', 'snes', 'gba') */
  system?: string;
  
  /** Name of the game */
  gameName?: string;
  
  /** Path to the EmulatorJS data folder */
  dataPath?: string;
  
  /** URL to the BIOS file (if required) */
  biosUrl?: string;
  
  /** Whether to start the game immediately after loading */
  startOnLoad?: boolean;
  
  /** Enable debug mode */
  debug?: boolean;
  
  /** Enable threading support */
  threads?: boolean;
  
  /** Disable databases */
  disableDatabases?: boolean;
  
  /** Color configuration */
  color?: string;
  
  /** Volume level */
  volume?: number;
}

/**
 * EmulatorJS class for easy integration
 */
export class EmulatorJS {
  /**
   * Create an EmulatorJS instance
   * @param element The element ID or DOM element to mount the emulator
   * @param config Configuration options for the emulator
   */
  constructor(element: string | HTMLElement, config?: EmulatorConfig);
  
  /**
   * Initialize and load the emulator
   * @returns Promise that resolves when the emulator is loaded
   */
  load(): Promise<any>;
  
  /**
   * Destroy the emulator instance
   */
  destroy(): void;
  
  /**
   * Load a new ROM/game
   * @param url URL to the ROM file
   * @returns Promise that resolves when the ROM is loaded
   */
  loadROM(url: string): Promise<void>;
  
  /**
   * Add event listener
   * @param event Event name
   * @param callback Event callback
   */
  on(event: string, callback: Function): void;
}

/**
 * Simple function to create and load an emulator
 * @param element The element ID or DOM element to mount the emulator
 * @param config Configuration options for the emulator
 * @returns Promise that resolves with the EmulatorJS instance
 */
export function createEmulator(element: string | HTMLElement, config?: EmulatorConfig): Promise<EmulatorJS>;

/**
 * Destroys the current emulator instance
 */
export function destroyEmulator(): void;

/**
 * Emulator Manager for handling EmulatorJS instances
 */
export class EmulatorManager {
  constructor();
  
  /**
   * Destroy the current EmulatorJS instance
   */
  destroy(): void;
  
  /**
   * Run a new game
   * @param config Configuration for the game
   */
  runGame(config: EmulatorConfig): Promise<any>;
  
  /**
   * Clear page elements
   */
  clearPage(): void;
}

/**
 * Global instance of EmulatorManager
 */
export const emulatorManager: EmulatorManager;

// Default export
export default EmulatorJS;