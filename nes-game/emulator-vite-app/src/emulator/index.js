import EmulatorJS from './emulator.js';

// 将 EmulatorJS 挂载到全局对象上
window.EmulatorJS = EmulatorJS;

// 如果在模块环境中，也导出 EmulatorJS
export default EmulatorJS;

import loadEmulator from './loader.js';



/**
 * 运行游戏的便捷函数
 * @param {Object} config - EmulatorJS配置选项
 */
export async function runGame(config) {
  // 设置全局配置变量
  window.EJS_player = config.container;  // 使用 CSS 选择器
  window.EJS_gameName = config.gameName || "";
  window.EJS_biosUrl = config.biosUrl || "";
  window.EJS_gameUrl = config.gameUrl;
  window.EJS_core = config.core || "";
  window.EJS_pathtodata = config.pathtodata || "./data/";
  window.EJS_startOnLoaded = true;
  window.EJS_DEBUG_XX = config.debug || false;
  window.EJS_threads = config.threads || false;
  window.EJS_disableDatabases = config.disableDatabases || true;

  try {
    // Load the emulator
    let controller = await loadEmulator();
    return controller;
  } catch (error) {
    throw new Error(`Failed to load EmulatorJS: ${error.message}`);
  }
}

// 兼容旧版本
window.runGame = runGame;