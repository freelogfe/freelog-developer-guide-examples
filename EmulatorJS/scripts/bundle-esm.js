import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 获取当前工作目录
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist-bundle');
const dataDir = path.join(rootDir, 'data');

console.log('Bundling EmulatorJS as single ESM file...');

// 清理旧的构建目录
if (fs.existsSync(distDir)) {
  console.log('Cleaning old build directory...');
  fs.rmSync(distDir, { recursive: true });
}

// 创建新的构建目录
console.log('Creating build directory...');
fs.mkdirSync(distDir, { recursive: true });

// 复制 package.json 并修改它以适应 ESM 发布
console.log('Preparing package.json for ESM bundle...');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// 为 ESM 包创建 package.json
const esmPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  type: "module",
  main: "emulatorjs.js",
  module: "emulatorjs.js",
  exports: {
    ".": {
      "import": "./emulatorjs.js",
      "require": "./emulatorjs.cjs"
    },
    "./package.json": "./package.json"
  },
  files: [
    "emulatorjs.js",
    "emulatorjs.cjs",
    "data",
    "README.md",
    "LICENSE"
  ],
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  repository: packageJson.repository,
  bugs: packageJson.bugs,
  homepage: packageJson.homepage,
  sideEffects: false
};

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(esmPackageJson, null, 2));

// 复制文档文件
console.log('Copying documentation files...');
copyDocumentation();

// 创建捆绑的 ESM 文件
console.log('Creating bundled ESM file...');
createBundledFiles();

// 构建和压缩 data 目录
console.log('Building and compressing data directory...');
buildDataDirectory(dataDir, path.join(distDir, 'data'));

console.log('ESM bundle build completed successfully!');
console.log(`Bundle is ready at: ${distDir}`);

/**
 * 复制文档文件
 */
function copyDocumentation() {
  const filesToCopy = ['README.md', 'LICENSE', 'CONTRIBUTING.md'];
  
  filesToCopy.forEach(file => {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file}`);
    }
  });
}

/**
 * 创建捆绑文件
 */
function createBundledFiles() {
  // 创建捆绑的 ESM 文件
  const esmBundle = `/**
 * EmulatorJS - Bundled ESM Version
 * 
 * This is a bundled version of EmulatorJS for easy usage in ESM environments.
 */

// EmulatorJS class for easy integration
export class EmulatorJS {
  /**
   * Create an EmulatorJS instance
   * @param {string|HTMLElement} element - The element ID or DOM element to mount the emulator
   * @param {Object} config - Configuration options for the emulator
   */
  constructor(element, config = {}) {
    this.element = element;
    this.config = config;
    this.emulator = null;
    this.loaded = false;
  }

  /**
   * Initialize and load the emulator
   * @returns {Promise} Promise that resolves when the emulator is loaded
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
    window.EJS_player = typeof this.element === 'string' ? \`#\${this.element}\` : this.element;
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
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = \`\${this.config.dataPath || './data/'}loader.js\`;
      
      script.onload = () => {
        // Wait for the emulator to be created
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
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load EmulatorJS'));
      };
      
      document.head.appendChild(script);
    });
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
   * @returns {Promise} Promise that resolves when the ROM is loaded
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

/**
 * Simple function to create and load an emulator
 * @param {string|HTMLElement} element - The element ID or DOM element to mount the emulator
 * @param {Object} config - Configuration options for the emulator
 * @returns {Promise<EmulatorJS>} Promise that resolves with the EmulatorJS instance
 */
export async function createEmulator(element, config) {
  const emulator = new EmulatorJS(element, config);
  await emulator.load();
  return emulator;
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

// Default export
export default { EmulatorJS, createEmulator, destroyEmulator };
`;

  fs.writeFileSync(path.join(distDir, 'emulatorjs.js'), esmBundle);
  
  // 创建 CommonJS 捆绑文件
  const cjsBundle = `/**
 * EmulatorJS - Bundled CommonJS Version
 * 
 * This is a bundled version of EmulatorJS for easy usage in CommonJS environments.
 */

// EmulatorJS class for easy integration
class EmulatorJS {
  /**
   * Create an EmulatorJS instance
   * @param {string|HTMLElement} element - The element ID or DOM element to mount the emulator
   * @param {Object} config - Configuration options for the emulator
   */
  constructor(element, config = {}) {
    this.element = element;
    this.config = config;
    this.emulator = null;
    this.loaded = false;
  }

  /**
   * Initialize and load the emulator
   * @returns {Promise} Promise that resolves when the emulator is loaded
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
    window.EJS_player = typeof this.element === 'string' ? \`#\${this.element}\` : this.element;
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
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = \`\${this.config.dataPath || './data/'}loader.js\`;
      
      script.onload = () => {
        // Wait for the emulator to be created
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
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load EmulatorJS'));
      };
      
      document.head.appendChild(script);
    });
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
   * @returns {Promise} Promise that resolves when the ROM is loaded
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

/**
 * Simple function to create and load an emulator
 * @param {string|HTMLElement} element - The element ID or DOM element to mount the emulator
 * @param {Object} config - Configuration options for the emulator
 * @returns {Promise<EmulatorJS>} Promise that resolves with the EmulatorJS instance
 */
async function createEmulator(element, config) {
  const emulator = new EmulatorJS(element, config);
  await emulator.load();
  return emulator;
}

/**
 * Destroys the current emulator instance
 */
function destroyEmulator() {
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

// Exports
module.exports = { EmulatorJS, createEmulator, destroyEmulator };
module.exports.default = { EmulatorJS, createEmulator, destroyEmulator };
`;

  fs.writeFileSync(path.join(distDir, 'emulatorjs.cjs'), cjsBundle);
}

/**
 * 构建 data 目录
 * @param {string} src - 源 data 目录
 * @param {string} dest - 目标 data 目录
 */
function buildDataDirectory(src, dest) {
  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true });
  
  // 复制所有文件和目录
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // 复制目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 递归复制目录
 * @param {string} src - 源目录
 * @param {string} dest - 目标目录
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}