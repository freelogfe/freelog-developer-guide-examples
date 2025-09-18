import loadEmulator from './data/loader.js';

export async function runGame(config) {


  // 设置全局配置变量
  window.EJS_player = "#game";  // 使用 CSS 选择器
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
    await loadEmulator();

  } catch (error) {
    throw new Error(`Failed to load EmulatorJS: ${error.message}`);
  }
}

window.runGame = runGame;
console.log(window.runGame)