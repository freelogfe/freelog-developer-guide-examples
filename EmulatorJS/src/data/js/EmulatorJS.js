/**
 * EmulatorJS - Main Emulator Class
 * 主模拟器类，整合所有模块
 */

// 导入所有模块
import { EmulatorCore } from './modules/EmulatorCore.js';
import { GameDownloader } from './modules/GameDownloader.js';
import { UIManager } from './modules/UIManager.js';
import { ScreenCapture } from './modules/ScreenCapture.js';
import { CheatsManager } from './modules/CheatsManager.js';
import { InputManager } from './modules/InputManager.js';
import { VirtualGamepad } from './modules/VirtualGamepad.js';
import { SettingsManager } from './modules/SettingsManager.js';


/**
 * EmulatorJS 主类
 */
class EmulatorJS {
    constructor(element, config) {
        // 初始化核心
        this.core = new EmulatorCore(this, element, config);
        
        // 初始化所有模块
        this.gameDownloader = new GameDownloader(this);
        this.uiManager = new UIManager(this);
        this.screenCapture = new ScreenCapture(this);
        this.cheatsManager = new CheatsManager(this);
        this.inputManager = new InputManager(this);
        this.virtualGamepad = new VirtualGamepad(this);
        this.settingsManager = new SettingsManager(this);
        
        // 暴露核心属性以保持向后兼容性
        this.config = this.core.config;
        this.game = this.core.game;
        this.canvas = this.core.canvas;
        this.textElem = this.core.textElem;
        this.Module = this.core.Module;
        this.localization = this.core.localization;
        
        // 初始化所有模块
        this.initModules();
    }
    
    initModules() {
        // 初始化各个模块
        this.uiManager.init();
        this.inputManager.init();
        this.virtualGamepad.init();
        this.cheatsManager.init();
        this.settingsManager.init();
        this.screenCapture.init();
        this.gameDownloader.init();
        
        // 初始化核心功能
        this.core.init();
        
        // 设置模块间的引用
        this.setupModuleReferences();
    }
    
    setupModuleReferences() {
        // 让各模块能够访问其他模块
        this.core.gameDownloader = this.gameDownloader;
        this.core.uiManager = this.uiManager;
        this.core.screenCapture = this.screenCapture;
        this.core.cheatsManager = this.cheatsManager;
        this.core.inputManager = this.inputManager;
        this.core.virtualGamepad = this.virtualGamepad;
        this.core.settingsManager = this.settingsManager;
    }
    
    // 向后兼容的方法 - 委托给相应的模块或核心
    start() {
        return this.core.start();
    }
    
    stop() {
        return this.core.stop();
    }
    
    pause(value) {
        return this.core.pause(value);
    }
    
    play() {
        return this.core.play();
    }
    
    reset() {
        return this.core.reset();
    }
    
    saveState(slot) {
        return this.core.saveState(slot);
    }
    
    loadState(slot) {
        return this.core.loadState(slot);
    }
    
    takeScreenshot() {
        return this.screenCapture.takeScreenshot();
    }
    
    startRecording() {
        return this.screenCapture.startRecording();
    }
    
    stopRecording() {
        return this.screenCapture.stopRecording();
    }
    
    showSettings() {
        return this.settingsManager.showSettingsMenu();
    }
    
    showCheats() {
        return this.cheatsManager.showCheatsMenu();
    }
    
    toggleVirtualGamepad() {
        return this.virtualGamepad.toggle();
    }
    
    set(key, value) {
        return this.settingsManager.setSetting(key, value);
    }
    
    get(key) {
        return this.settingsManager.getSetting(key);
    }
    
    on(event, callback) {
        return this.core.on(event, callback);
    }
    
    off(event, callback) {
        return this.core.off(event, callback);
    }
    
    callEvent(event, data) {
        return this.core.callEvent(event, data);
    }
    
    isPopupOpen() {
        return this.core.isPopupOpen();
    }
    
    closePopup() {
        return this.core.closePopup();
    }
    
    startGameError(message) {
        return this.uiManager.startGameError(message);
    }
    
    showLoadingMessage(message) {
        return this.uiManager.showLoadingMessage(message);
    }
    
    hideLoadingMessage() {
        return this.uiManager.hideLoadingMessage();
    }
    
    getBaseFileName() {
        return this.core.getBaseFileName();
    }
    
    getCore() {
        return this.core.getCore();
    }
    
    supportsExt(ext) {
        return this.core.supportsExt(ext);
    }
    
    hasTouchScreen() {
        return this.core.hasTouchScreen();
    }
    
    isSafari() {
        return this.core.isSafari();
    }
    
    createElement(type) {
        return this.core.createElement(type);
    }
    
    addEventListener(element, listener, callback) {
        return this.core.addEventListener(element, listener, callback);
    }
    
    removeEventListener(data) {
        return this.core.removeEventListener(data);
    }
    
    // 清理方法
    cleanup() {
        // 清理所有模块
        this.screenCapture.cleanup();
        this.virtualGamepad.cleanup();
        this.inputManager.cleanup();
        this.settingsManager.cleanup();
        this.uiManager.cleanup();
        this.cheatsManager.cleanup();
        
        // 清理核心
        this.core.cleanup();
    }
    
    // 调试方法
    debug() {
        return this.core.debug;
    }
    
    // 广告拦截（向后兼容）
    adBlocked(url, del) {
        return this.core.adBlocked(url, del);
    }
}

// 导出主类
export { EmulatorJS };

// 设置全局变量（向后兼容）
window.EJS = EmulatorJS;
