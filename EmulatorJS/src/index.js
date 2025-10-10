


/**
 * EmulatorJS - Main Index File
 */

// 导入加载器模块
import loadEmulator from './data/loader.js';

/**
 * 运行游戏的便捷函数
 * @param {Object} config - EmulatorJS配置选项
 */
export async function runGame(config) {
  console.log('[EmulatorJS] Starting runGame with config:', config);

  // 设置全局配置变量
  window.EJS_player = config.container;  // 使用 CSS 选择器
  window.EJS_gameName = config.gameName || "";
  window.EJS_biosUrl = config.biosUrl || "";
  window.EJS_gameUrl = config.gameUrl;
  window.EJS_core = config.core || "";
  window.EJS_pathtodata = config.pathtodata || "./src/data/";
  window.EJS_startOnLoaded = true;
  window.EJS_DEBUG_XX = config.debug || false;
  window.EJS_threads = config.threads || false;
  window.EJS_disableDatabases = config.disableDatabases || true;
  // 设置核心文件路径
  window.EJS_corePath = config.corePath || "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/cores/";
  // 添加onGameStart回调到全局配置
  window.EJS_onGameStart = config.onGameStart;

  console.log('[EmulatorJS] Global config set:', {
    container: window.EJS_player,
    gameName: window.EJS_gameName,
    gameUrl: window.EJS_gameUrl,
    core: window.EJS_core,
    pathtodata: window.EJS_pathtodata,
    onGameStart: window.EJS_onGameStart
  });

  // Load the emulator
  console.log('[EmulatorJS] Calling loadEmulator...');
  const emulator = await loadEmulator();
  return emulator;
}

// 兼容旧版本
window.runGame = runGame;