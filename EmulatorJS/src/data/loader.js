﻿/**
 * EmulatorJS Loader Module
 * This module provides functions to load the EmulatorJS emulator
 */

// 导入拆分后的模块
import EmulatorCore from './js/emulator-modules/core.js';
import EmulatorUI from './js/emulator-modules/ui.js';
import EmulatorControls from './js/emulator-modules/controls-base.js';
import EmulatorSettings from './js/emulator-modules/settings-core.js';
import EmulatorNetplay from './js/emulator-modules/netplay.js';
import EmulatorUtils from './js/emulator-modules/utils.js';

// 创建完整的模拟器类
class EmulatorJS {
  constructor(player, config) {
    // 先初始化基础模块
    this.settings = new EmulatorSettings(this);
    this.utils = new EmulatorUtils(this);
    
    // 初始化功能模块
    this.controls = new EmulatorControls(this);
    this.netplay = new EmulatorNetplay(this);
    
    // 最后初始化核心和UI
    // 根据原文件构造器定义初始化核心模块
    this.core = new EmulatorCore(config);
    // 设置模块引用
    this.core.player = player;
    this.core.utils = this.utils;
    this.core.settings = this.settings;
    this.core.controls = this.controls;
    this.core.netplay = this.netplay;
    
    // 初始化UI（传递完整上下文）
    this.ui = new EmulatorUI(this);
    
    // 确保事件系统兼容
    this.on = this.core.on.bind(this.core);
    this.off = this.core.off.bind(this.core);
    this.callEvent = this.core.callEvent.bind(this.core);
    
    // 保留原有API方法
    this.adBlocked = this.ui.adBlocked.bind(this.ui);
    this.startButtonClicked = this.ui.startButtonClicked.bind(this.ui);
    
    // 代理核心方法
    this.start = this.core.start.bind(this.core);
    this.stop = this.core.stop.bind(this.core);
    this.pause = this.core.pause.bind(this.core);
    this.resume = this.core.resume.bind(this.core);
  }
  
  // 保留静态初始化方法
  static init(config) {
    return new EmulatorJS(null, config);
  }
}
import './js/GameManager.js';
import './js/compression.js';
import './js/gamepad.js';
import './js/shaders.js';
import './js/storage.js';
import './js/nipplejs.js';
import './js/socket.io.min.js'

/**
 * 加载 EmulatorJS 的主函数
 * @returns {Promise<void>}
 */
export async function loadEmulator() {

    const folderPath = (path) => path.substring(0, path.length - path.split("/").pop().length);
    let scriptPath = (typeof window.EJS_pathtodata === "string") ? window.EJS_pathtodata : folderPath((new URL(document.currentScript.src)).pathname);
    if (!scriptPath.endsWith("/")) scriptPath += "/";

    const config = {};
    config.gameUrl = window.EJS_gameUrl;
    config.dataPath = scriptPath;
    config.system = window.EJS_core;
    config.biosUrl = window.EJS_biosUrl;
    config.gameName = window.EJS_gameName;
    config.color = window.EJS_color;
    config.adUrl = window.EJS_AdUrl;
    config.adMode = window.EJS_AdMode;
    config.adTimer = window.EJS_AdTimer;
    config.adSize = window.EJS_AdSize;
    config.alignStartButton = window.EJS_alignStartButton;
    config.VirtualGamepadSettings = window.EJS_VirtualGamepadSettings;
    config.buttonOpts = window.EJS_Buttons;
    config.volume = window.EJS_volume;
    config.defaultControllers = window.EJS_defaultControls;
    config.startOnLoad = window.EJS_startOnLoaded;
    config.fullscreenOnLoad = window.EJS_fullscreenOnLoaded;
    config.filePaths = window.EJS_paths;
    config.loadState = window.EJS_loadStateURL;
    config.cacheLimit = window.EJS_CacheLimit;
    config.cheats = window.EJS_cheats;
    config.defaultOptions = window.EJS_defaultOptions;
    config.gamePatchUrl = window.EJS_gamePatchUrl;
    config.gameParentUrl = window.EJS_gameParentUrl;
    config.netplayUrl = window.EJS_netplayServer;
    config.gameId = window.EJS_gameID;
    config.backgroundImg = window.EJS_backgroundImage;
    config.backgroundBlur = window.EJS_backgroundBlur;
    config.backgroundColor = window.EJS_backgroundColor;
    config.controlScheme = window.EJS_controlScheme;
    config.threads = window.EJS_threads;
    config.disableCue = window.EJS_disableCue;
    config.startBtnName = window.EJS_startButtonName;
    config.softLoad = window.EJS_softLoad;
    config.capture = window.EJS_screenCapture;
    config.externalFiles = window.EJS_externalFiles;
    config.dontExtractBIOS = window.EJS_dontExtractBIOS;
    config.disableDatabases = window.EJS_disableDatabases;
    config.disableLocalStorage = window.EJS_disableLocalStorage;
    config.forceLegacyCores = window.EJS_forceLegacyCores;
    config.noAutoFocus = window.EJS_noAutoFocus;
    config.videoRotation = window.EJS_videoRotation;
    config.hideSettings = window.EJS_hideSettings;
    config.shaders = Object.assign({}, window.EJS_SHADERS, window.EJS_shaders ? window.EJS_shaders : {});



    window.EJS_emulator = new EmulatorJS(window.EJS_player, config);
    window.EJS_adBlocked = (url, del) => window.EJS_emulator.adBlocked(url, del);
    if (typeof window.EJS_ready === "function") {
        window.EJS_emulator.on("ready", window.EJS_ready);
    }
    if (typeof window.EJS_onGameStart === "function") {
        window.EJS_emulator.on("start", window.EJS_onGameStart);
    }
    if (typeof window.EJS_onLoadState === "function") {
        window.EJS_emulator.on("loadState", window.EJS_onLoadState);
    }
    if (typeof window.EJS_onSaveState === "function") {
        window.EJS_emulator.on("saveState", window.EJS_onSaveState);
    }
    if (typeof window.EJS_onLoadSave === "function") {
        window.EJS_emulator.on("loadSave", window.EJS_onLoadSave);
    }
    if (typeof window.EJS_onSaveSave === "function") {
        window.EJS_emulator.on("saveSave", window.EJS_onSaveSave);
    }

    // 如果设置了自动开始游戏，则触发启动按钮点击
    if (window.EJS_startOnLoaded) {
        setTimeout(() => {
            const startButton = document.querySelector('.ejs_start_button');
            if (startButton) {
                startButton.click();
            } else {
                console.log('[EmulatorJS] 自动开始游戏: 未找到启动按钮，尝试直接调用startButtonClicked');
                if (window.EJS_emulator && typeof window.EJS_emulator.startButtonClicked === 'function') {
                    window.EJS_emulator.startButtonClicked();
                }
            }
        }, 100);
    }
}

// 默认导出
export default loadEmulator;