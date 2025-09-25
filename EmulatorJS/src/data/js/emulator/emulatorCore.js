/**
 * EmulatorJS - Core Module
 * This is the main module that integrates all other modules and provides the core emulator functionality
 */

import { initEventSystem, bindListeners, on, callEvent, startButtonClicked, handleResize } from './eventHandler.js';
import { getCores, requiresThreads, requiresWebGL2, getCore, createElement, addEventListener, removeEventListener, saveInBrowserSupported, getBaseFileName, versionAsInt, toData, checkForUpdates } from './utils.js';
import { downloadGameCore, downloadRom, downloadFiles, startGame } from './fileDownloader.js';
import { setColor, setupAds, adBlocked, setElements, createStartButton, createText, localization, displayMessage } from './ui.js';
import { setupRecorder, takeScreenshot, toggleRecording, canRecord } from './recorder.js';

// 初始化模拟器
export function initEmulator(config = {}) {
  // 创建模拟器状态对象
  const emulatorState = {
    version: "3.14.2",
    config: config,
    elements: {},
    started: false,
    cdn: "https://cdn.jsdelivr.net/gh/ethanaobrien/emulatorjs@latest/dist/",
    gameManager: null,
    gameCore: null,
    canvas: null,
    canvasContainer: null,
    gameUrl: config.url || "",
    system: config.system || "",
    biosUrl: config.biosUrl || "",
    debug: config.debug || false,
    netplay: config.netplay || false,
    netplayUrl: config.netplayUrl || "",
    netplayPort: config.netplayPort || 8443,
    adConfig: config.adConfig || {},
    adProviders: config.adProviders || [],
    coreOptions: config.coreOptions || {},
    inputConfig: config.inputConfig || {},
    touchGamepad: config.touchGamepad !== undefined ? config.touchGamepad : true,
    gamepad: null,
    gamepadSelection: ["", "", "", ""],
    gamepadLabels: true,
    gamepadStickScale: config.gamepadStickScale || 1,
    gamepadButtonOpacity: config.gamepadButtonOpacity || 0.7,
    romName: config.romName || "",
    autoHideControls: config.autoHideControls !== undefined ? config.autoHideControls : true,
    autoHideControlsTimer: config.autoHideControlsTimer || 3000,
    hideControls: config.hideControls || false,
    saveStates: config.saveStates !== undefined ? config.saveStates : true,
    systemSaveStates: config.systemSaveStates !== undefined ? config.systemSaveStates : true,
    saveStatesData: {},
    saveStateData: null,
    saveStateIndex: 0,
    stateAutoSaving: config.stateAutoSaving !== undefined ? config.stateAutoSaving : true,
    stateAutoSavingTimer: config.stateAutoSavingTimer || 10000,
    stateAutoSavingInterval: null,
    stateName: config.stateName || "",
    fileData: {},
    zipData: {},
    parent: config.parent || document.body,
    noAutoFocus: config.noAutoFocus || false,
    showStartButton: config.showStartButton !== undefined ? config.showStartButton : true,
    noColorChanging: config.noColorChanging || false,
    allowFileDrops: config.allowFileDrops !== undefined ? config.allowFileDrops : true,
    saveStatesInBrowserStorage: config.saveStatesInBrowserStorage !== undefined ? config.saveStatesInBrowserStorage : true,
    gameName: config.gameName || "",
    patchUrl: config.patchUrl || "",
    parentUrl: config.parentUrl || "",
    saveStateUrl: config.saveStateUrl || "",
    saveStateFile: null,
    touch: false,
    textElem: null,
    allowCheats: config.allowCheats !== undefined ? config.allowCheats : true,
    cheats: [],
    cheatOptions: config.cheatOptions || {},
    controlOptions: config.controlOptions || {},
    themeColor: config.themeColor || "#337ab7",
    overrideMaxWidth: config.overrideMaxWidth || false,
    overrideMaxHeight: config.overrideMaxHeight || false,
    maxWidth: config.maxWidth || 1280,
    maxHeight: config.maxHeight || 720,
    pixelPerfect: config.pixelPerfect !== undefined ? config.pixelPerfect : true,
    fullscreen: config.fullscreen !== undefined ? config.fullscreen : false,
    compressSaveStates: config.compressSaveStates !== undefined ? config.compressSaveStates : true,
    saveFilename: config.saveFilename || ""
  };

  // 初始化事件系统
  initEventSystem(emulatorState);
  
  // 初始化录制器
  setupRecorder(emulatorState);
  
  // 检测设备特性
  detectDeviceFeatures(emulatorState);
  
  // 设置存储系统
  setupStorageSystem(emulatorState);
  
  // 设置DOM元素
  setElements(emulatorState);
  
  // 设置主题颜色
  setColor(emulatorState, emulatorState.themeColor);
  
  // 设置广告
  setupAds(emulatorState);
  
  // 创建开始按钮
  if (emulatorState.showStartButton) {
    createStartButton(emulatorState);
  }
  
  // 绑定事件监听器
  bindListeners(emulatorState, localization);
  
  // 检查是否支持录制
  emulatorState.canRecord = canRecord(emulatorState);
  
  // 检查更新
  checkForUpdates(emulatorState);
  
  return emulatorState;
}

// 检测设备特性
function detectDeviceFeatures(emulatorState) {
  emulatorState.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  emulatorState.supportsWebGL = typeof WebGLRenderingContext !== "undefined";
  emulatorState.supportsWebGL2 = typeof WebGL2RenderingContext !== "undefined";
  emulatorState.supportsWorkers = typeof Worker !== "undefined";
  
  // 检测触摸支持
  emulatorState.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 设置存储系统
function setupStorageSystem(emulatorState) {
  // 检查浏览器是否支持存储
  if (!saveInBrowserSupported()) {
    emulatorState.saveStates = false;
    emulatorState.systemSaveStates = false;
    emulatorState.saveStatesInBrowserStorage = false;
  }
  
  // 加载保存的状态
  if (emulatorState.saveStates && emulatorState.saveStatesInBrowserStorage) {
    loadSavedStates(emulatorState);
  }
}

// 加载保存的状态
function loadSavedStates(emulatorState) {
  try {
    const savedStates = localStorage.getItem('ejs_save_states');
    if (savedStates) {
      emulatorState.saveStatesData = JSON.parse(savedStates);
    }
  } catch (e) {
    if (emulatorState.debug) {
      console.error('Failed to load save states:', e);
    }
  }
}

// 保存状态数据
function saveStateData(emulatorState) {
  try {
    if (emulatorState.saveStates && emulatorState.saveStatesInBrowserStorage) {
      localStorage.setItem('ejs_save_states', JSON.stringify(emulatorState.saveStatesData));
    }
  } catch (e) {
    if (emulatorState.debug) {
      console.error('Failed to save state data:', e);
    }
  }
}

// 模拟器主函数
export function createEmulator(config = {}) {
  // 初始化模拟器
  const emulatorState = initEmulator(config);
  
  // 提供公共API
  const publicAPI = {
    // 事件系统API
    on: (event, func) => on(emulatorState, event, func),
    callEvent: (event, data) => callEvent(emulatorState, event, data),
    
    // UI相关API
    setColor: (color) => setColor(emulatorState, color),
    displayMessage: (message, duration = 3000) => displayMessage(emulatorState, message, duration),
    
    // 录制相关API
    takeScreenshot: () => takeScreenshot(emulatorState),
    toggleRecording: () => toggleRecording(emulatorState),
    
    // 核心功能API
    startGame: () => startGame(emulatorState),
    loadGame: (url, system) => loadGame(emulatorState, url, system),
    downloadRom: (url, system) => downloadRom(emulatorState, url, system),
    
    // 获取信息API
    getVersion: () => emulatorState.version,
    getCore: (system) => getCore(system),
    getCores: () => getCores(),
    
    // 控制API
    pause: () => pause(emulatorState),
    resume: () => resume(emulatorState),
    reset: () => reset(emulatorState),
    
    // 清理API
    destroy: () => destroy(emulatorState),
    
    // 状态API
    getState: () => getState(emulatorState),
    setState: (state) => setState(emulatorState, state)
  };
  
  return publicAPI;
}

// 加载游戏
function loadGame(emulatorState, url, system) {
  emulatorState.gameUrl = url;
  emulatorState.system = system;
  
  if (!emulatorState.started) {
    // 如果还没开始，创建文本元素并下载游戏核心
    createText(emulatorState, localization);
    downloadGameCore(emulatorState, emulatorState.textElem, localization);
  } else {
    // 如果已经开始，直接下载ROM
    downloadRom(emulatorState, url, system);
  }
}

// 暂停游戏
function pause(emulatorState) {
  if (emulatorState.gameManager && emulatorState.gameManager.pause) {
    emulatorState.gameManager.pause();
    return true;
  }
  return false;
}

// 恢复游戏
function resume(emulatorState) {
  if (emulatorState.gameManager && emulatorState.gameManager.resume) {
    emulatorState.gameManager.resume();
    return true;
  }
  return false;
}

// 重置游戏
function reset(emulatorState) {
  if (emulatorState.gameManager && emulatorState.gameManager.reset) {
    emulatorState.gameManager.reset();
    return true;
  }
  return false;
}

// 获取模拟器状态
function getState(emulatorState) {
  return {
    started: emulatorState.started,
    game: emulatorState.gameUrl,
    system: emulatorState.system,
    version: emulatorState.version,
    supportsWebGL: emulatorState.supportsWebGL,
    supportsWebGL2: emulatorState.supportsWebGL2,
    isMobile: emulatorState.isMobile
  };
}

// 设置模拟器状态
function setState(emulatorState, newState) {
  if (typeof newState !== 'object') return false;
  
  try {
    // 安全地更新状态
    if (newState.themeColor) {
      setColor(emulatorState, newState.themeColor);
    }
    
    if (newState.fullscreen !== undefined) {
      emulatorState.fullscreen = newState.fullscreen;
      if (emulatorState.canvas) {
        handleResize(emulatorState);
      }
    }
    
    if (newState.hideControls !== undefined) {
      emulatorState.hideControls = newState.hideControls;
    }
    
    return true;
  } catch (e) {
    if (emulatorState.debug) {
      console.error('Failed to setState:', e);
    }
    return false;
  }
}

// 销毁模拟器
export function destroy(emulatorState) {
  // 调用退出事件
  callEvent(emulatorState, "exit");
  
  // 停止自动保存
  if (emulatorState.stateAutoSavingInterval) {
    clearInterval(emulatorState.stateAutoSavingInterval);
  }
  
  // 停止录制
  if (emulatorState.recorder && emulatorState.recorder.isRecording) {
    stopRecording(emulatorState);
  }
  
  // 清理DOM元素
  if (emulatorState.elements && emulatorState.elements.parent) {
    // 移除事件监听器
    removeEventListener(window, "resize", () => handleResize(emulatorState));
    
    // 清空父元素
    while (emulatorState.elements.parent.firstChild) {
      emulatorState.elements.parent.removeChild(emulatorState.elements.parent.firstChild);
    }
  }
  
  // 重置状态
  Object.keys(emulatorState).forEach(key => {
    delete emulatorState[key];
  });
}

// 导出默认函数
export default createEmulator;

// 导出其他常用函数
export { getCores, requiresThreads, requiresWebGL2, getCore };