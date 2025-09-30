/**
 * EmulatorJS 模块化入口文件
 * 整合所有模块并提供统一的接口
 */

// 导入所有模块
import { CoreManager } from './CoreManager.js';
import { FileManager } from './FileManager.js';

import { ControlManager } from './ControlManager.js';
import { GamepadManager } from './GamepadManager.js';
import { VirtualGamepad } from './VirtualGamepad.js';
import { UIManager } from './UIManager.js';
import { GameManager } from './GameManager.js';
import { SettingsManager } from './SettingsManager.js';
import { NetplayManager } from './NetplayManager.js';
import { SaveStateManager } from './SaveStateManager.js';
import { StorageManager } from './StorageManager.js';

/**
 * 增强版的 EmulatorJS 主类
 * 通过模块化方式组织所有功能
 */
class EmulatorJSModular {
    constructor(element, config) {
        // 初始化配置
        this.config = config;
        this.ejs_version = "4.2.3";
        this.debug = (window.EJS_DEBUG_XX === true);

        // 初始化各个管理器
        this.coreManager = new CoreManager(this);
        this.fileManager = new FileManager(this);
        this.controlManager = new ControlManager(this);
        this.gamepadManager = new GamepadManager(this);
        this.virtualGamepad = new VirtualGamepad(this);
        this.uiManager = new UIManager(this);
        this.gameManager = new GameManager(this);
        this.settingsManager = new SettingsManager(this);
        this.netplayManager = new NetplayManager(this);
        this.saveStateManager = new SaveStateManager(this);
        this.storageManager = new StorageManager(this);

        // 初始化基本属性
        this.extensions = [];
        this.initControlVars();
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.currentPopup = null;
        this.isFastForward = false;
        this.isSlowMotion = false;
        this.failedToStart = false;
        this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
        this.touch = false;
        this.cheats = [];
        this.started = false;
        this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
        this.muted = false;
        this.paused = true;
        this.missingLang = [];

        // 初始化UI和事件绑定
        this.setElements(element);
        this.setColor(this.config.color || "");
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";

        // 处理广告
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }

        // 检测设备类型
        this.isMobile = this.detectMobileDevice();
        this.hasTouchScreen = this.detectTouchScreen();

        // 初始化画布
        this.canvas = this.createElement("canvas");
        this.canvas.classList.add("ejs_canvas");

        // 视频和截图设置
        this.videoRotation = ([0, 1, 2, 3].includes(this.config.videoRotation)) ? this.config.videoRotation : this.preGetSetting("videoRotation") || 0;
        this.videoRotationChanged = false;
        this.initCaptureSettings();

        // 网络游戏设置
        this.config.netplayUrl = this.config.netplayUrl || "https://netplay.emulatorjs.org";
        this.fullscreen = false;
        this.enableMouseLock = false;

        // WebGL支持检测
        this.supportsWebgl2 = this.detectWebGL2Support();
        this.webgl2Enabled = this.determineWebGL2Enabled();

        // 浏览器检测
        this.isSafari = this.detectSafari();

        // 存储设置
        this.initStorage();

        // 游戏区域设置
        this.setupGameArea();

        // 处理作弊码
        this.initCheats();
        
        // 初始化存档管理
        this.saveStateManager.init();
        
        // 初始化网络游戏
        if (this.netplayEnabled) {
            this.netplayManager.init();
        }

        // 创建开始按钮
        this.createStartButton();

        // 处理窗口大小变化
        this.handleResize();
    }

    // 初始化截图设置
    initCaptureSettings() {
        this.capture = this.capture || {};
        this.capture.photo = this.capture.photo || {};
        this.capture.photo.source = ["canvas", "retroarch"].includes(this.capture.photo.source) ? this.capture.photo.source : "canvas";
        this.capture.photo.format = (typeof this.capture.photo.format === "string") ? this.capture.photo.format : "png";
        this.capture.photo.upscale = (typeof this.capture.photo.upscale === "number") ? this.capture.photo.upscale : 1;
        this.capture.video = this.capture.video || {};
        this.capture.video.format = (typeof this.capture.video.format === "string") ? this.capture.video.format : "detect";
        this.capture.video.upscale = (typeof this.capture.video.upscale === "number") ? this.capture.video.upscale : 1;
        this.capture.video.fps = (typeof this.capture.video.fps === "number") ? this.capture.video.fps : 30;
        this.capture.video.videoBitrate = (typeof this.capture.video.videoBitrate === "number") ? this.capture.video.videoBitrate : 2.5 * 1024 * 1024;
        this.capture.video.audioBitrate = (typeof this.capture.video.audioBitrate === "number") ? this.capture.video.audioBitrate : 192 * 1024;
    }

    // 检测移动设备
    detectMobileDevice() {
        let check = false;
        (function (a) { 
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) 
                check = true; 
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    // 检测触摸屏
    detectTouchScreen() {
        if (window.PointerEvent && ("maxTouchPoints" in navigator)) {
            if (navigator.maxTouchPoints > 0) {
                return true;
            }
        } else {
            if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                return true;
            } else if (window.TouchEvent || ("ontouchstart" in window)) {
                return true;
            }
        }
        return false;
    }

    // 检测WebGL2支持
    detectWebGL2Support() {
        return !!document.createElement("canvas").getContext("webgl2") && (this.config.forceLegacyCores !== true);
    }

    // 确定是否启用WebGL2
    determineWebGL2Enabled() {
        let setting = this.preGetSetting("webgl2Enabled");
        if (setting === "disabled" || !this.supportsWebgl2) {
            return false;
        } else if (setting === "enabled") {
            return true;
        }
        return null;
    }

    // 检测Safari浏览器
    detectSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    // 初始化存储
    initStorage() {
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            }
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            }
        }
        // This is not cache. This is save data
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");
    }

    // 设置游戏区域
    setupGameArea() {
        this.game.classList.add("ejs_game");
        if (typeof this.config.backgroundImg === "string") {
            this.game.classList.add("ejs_game_background");
            if (this.config.backgroundBlur) this.game.classList.add("ejs_game_background_blur");
            this.game.setAttribute("style", `--ejs-background-image: url("${this.config.backgroundImg}"); --ejs-background-color: ${this.config.backgroundColor};`);
            this.on("start", () => {
                this.game.classList.remove("ejs_game_background");
                if (this.config.backgroundBlur) this.game.classList.remove("ejs_game_background_blur");
            })
        } else {
            this.game.setAttribute("style", "--ejs-background-color: " + this.config.backgroundColor + ";");
        }
    }

    // 初始化作弊码
    initCheats() {
        if (Array.isArray(this.config.cheats)) {
            for (let i = 0; i < this.config.cheats.length; i++) {
                const cheat = this.config.cheats[i];
                if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                    this.cheats.push({
                        desc: cheat[0],
                        checked: false,
                        code: cheat[1],
                        is_permanent: true
                    })
                }
            }
        }
    }
    
    // 保存状态
    saveState() {
        return this.saveStateManager.saveState();
    }
    
    // 加载状态
    loadState() {
        return this.saveStateManager.loadState();
    }
    
    // 导出存档
    exportSave() {
        return this.saveStateManager.exportSave();
    }
    
    // 导入存档
    importSave() {
        return this.saveStateManager.importSave();
    }
    
    // 创建房间
    createRoom() {
        return this.netplayManager.createRoom();
    }
    
    // 加入房间
    joinRoom(roomId) {
        return this.netplayManager.joinRoom(roomId);
    }
    
    // 检查是否支持浏览器存储
    saveInBrowserSupported() {
        return this.storageManager.saveInBrowserSupported();
    }
    
    // 保存到浏览器存储
    saveToBrowser(key, data) {
        return this.storageManager.saveToBrowser(key, data);
    }
    
    // 从浏览器存储加载
    loadFromBrowser(key) {
        return this.storageManager.loadFromBrowser(key);
    }
    
    // 从浏览器存储删除
    deleteFromBrowser(key) {
        return this.storageManager.deleteFromBrowser(key);
    }
    
    // 清除浏览器存储
    clearBrowserStorage() {
        return this.storageManager.clearBrowserStorage();
    }
    
    // 获取存储使用情况
    getStorageUsage() {
        return this.storageManager.getStorageUsage();
    }
    
    // 缓存文件
    cacheFile(url, data) {
        return this.storageManager.cacheFile(url, data);
    }
    
    // 获取缓存文件
    getCachedFile(url) {
        return this.storageManager.getCachedFile(url);
    }
    
    // 清除缓存
    clearCache() {
        return this.storageManager.clearCache();
    }

    // 以下方法委托给相应的管理器
    // 核心管理
    getCores() { return this.coreManager.getCores(); }
    requiresThreads(core) { return this.coreManager.requiresThreads(core); }
    requiresWebGL2(core) { return this.coreManager.requiresWebGL2(core); }
    getCore(generic) { return this.coreManager.getCore(generic); }
    
    // 文件管理
    downloadFile(path, progressCB, notWithPath, opts) { return this.fileManager.downloadFile(path, progressCB, notWithPath, opts); }
    toData(data, rv) { return this.fileManager.toData(data, rv); }
    downloadStartState() { return this.fileManager.downloadStartState(); }
    downloadGameFile(assetUrl, type, progressMessage, decompressProgressMessage) { return this.fileManager.downloadGameFile(assetUrl, type, progressMessage, decompressProgressMessage); }
    downloadGamePatch() { return this.fileManager.downloadGamePatch(); }
    downloadGameParent() { return this.fileManager.downloadGameParent(); }
    downloadBios() { return this.fileManager.downloadBios(); }
    downloadRom() { return this.fileManager.downloadRom(); }
    
    // 菜单管理
    createContextMenu() { return this.uiManager.createContextMenu(); }
    createBottomMenuBar() { return this.uiManager.createBottomMenuBar(); }
    createControlSettingMenu() { return this.uiManager.createControlSettingMenu(); }
    createCheatsMenu() { return this.uiManager.createCheatsMenu(); }
    createNetplayMenu() { return this.uiManager.createNetplayMenu(); }
    
    // 虚拟手柄
    setVirtualGamepad() { return this.virtualGamepad.setVirtualGamepad(); }
    
    // 游戏手柄管理
    setupGamepadListeners() { return this.gamepadManager.setupGamepadListeners(); }
    updateGamepadLabels() { return this.gamepadManager.updateGamepadLabels(); }
    
    // 控制管理
    gamepadEvent(e) { return this.gamepadManager.gamepadEvent(e); }
    checkGamepadInputs() { return this.gamepadManager.checkGamepadInputs(); }

    createBottomMenuBarListeners() { return this.uiManager.createBottomMenuBarListeners(); }
    initControlVars() { return this.controlManager.initControlVars(); }
    keyLookup(controllerkey) { return this.controlManager.keyLookup(controllerkey); }
    keyChange(e) { return this.controlManager.keyChange(e); }

    setElements(element) { return this.controlManager.setElements(element); }
    createElement(type) { return this.controlManager.createElement(type); }
    addEventListener(element, listener, callback) { return this.controlManager.addEventListener(element, listener, callback); }
    removeEventListener(data) { return this.controlManager.removeEventListener(data); }
    setColor(color) { return this.settingsManager.setColor(color); }
    setupAds(ads, width, height) { return this.settingsManager.setupAds(ads, width, height); }
    localization(text, log) { return this.settingsManager.localization(text, log); }
    checkCompression(data, msg, fileCbFunc) { return this.settingsManager.checkCompression(data, msg, fileCbFunc); }
    startGameError(message) { return this.settingsManager.startGameError(message); }
    getControlScheme() { return this.settingsManager.getControlScheme(); }
    handleResize() { return this.uiManager.handleResize(); }


    createLink(elem, link, text, useP) { return this.uiManager.createLink(elem, link, text, useP); }
    buildButtonOptions(buttonUserOpts) { return this.uiManager.buildButtonOptions(buttonUserOpts); }
    checkForUpdates() { return this.uiManager.checkForUpdates(); }
    versionAsInt(ver) { return this.uiManager.versionAsInt(ver); }
    preGetSetting(setting) { return this.uiManager.preGetSetting(setting); }
    getSettingValue(setting) { return this.uiManager.getSettingValue(setting); }
    changeSettingOption(setting, value) { return this.uiManager.changeSettingOption(setting, value); }
    saveSettings() { return this.uiManager.saveSettings(); }
    loadSettings() { return this.uiManager.loadSettings(); }
    on(event, func) { return this.uiManager.on(event, func); }
    callEvent(event, data) { return this.uiManager.callEvent(event, data); }
    createPopup(title, buttons, noParent) { return this.uiManager.createPopup(title, buttons, noParent); }
    closePopup() { return this.uiManager.closePopup(); }
    isPopupOpen() { return this.uiManager.isPopupOpen(); }
    isChild(parent, child) { return this.uiManager.isChild(parent, child); }
    createSubPopup() { return this.uiManager.createSubPopup(); }
    displayMessage(message, time) { return this.uiManager.displayMessage(message, time); }
    screenshot(callback) { return this.uiManager.screenshot(callback); }
    screenRecord() { return this.uiManager.screenRecord(); }
    takeScreenshot(source, format, upscale) { return this.uiManager.takeScreenshot(source, format, upscale); }
    toggleFullscreen(fullscreen) { return this.uiManager.toggleFullscreen(fullscreen); }
    openCacheMenu() { return this.uiManager.openCacheMenu(); }
    setupDisksMenu() { return this.uiManager.setupDisksMenu(); }
    setupSettingsMenu() { return this.uiManager.setupSettingsMenu(); }
    loadSettings() { return this.uiManager.loadSettings(); }
    updateCheatUI() { return this.uiManager.updateCheatUI(); }
    createStartButton() { return this.uiManager.createStartButton(); }
    startButtonClicked(e) { return this.uiManager.startButtonClicked(e); }
    createText() { return this.uiManager.createText(); }
    downloadGameCore() { return this.coreManager.downloadGameCore(); }
    initModule(wasmData, threadData) { return this.gameManager.initModule(wasmData, threadData); }
    startGame() { return this.gameManager.startGame(); }
    checkStarted() { return this.gameManager.checkStarted(); }
    bindListeners() { return this.gameManager.bindListeners(); }
    checkSupportedOpts() { return this.gameManager.checkSupportedOpts(); }
    getBaseFileName(force) { return this.uiManager.getBaseFileName(force); }
    saveInBrowserSupported() { return this.uiManager.saveInBrowserSupported(); }
    selectFile() { return this.uiManager.selectFile(); }
    openNetplayMenu() { return this.uiManager.openNetplayMenu(); }
}

// 导出EmulatorJS类
export { EmulatorJSModular as EmulatorJS };
