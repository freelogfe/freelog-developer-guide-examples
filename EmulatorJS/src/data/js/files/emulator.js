/**
 * EmulatorJS Main Emulator Class
 * 整合所有模块的主模拟器类
 */

import { EmulatorCore } from './core.js';
import { FileManager } from './file-manager.js';
import { UIManager } from './ui-manager.js';
import { InputManager } from './input-manager.js';
import { GameManager } from './game-manager.js';

export class EmulatorJS extends EmulatorCore {
    constructor(element, config) {
        super();

        // 初始化基础属性
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.debug = (window.EJS_DEBUG_XX === true);
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;
        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts);
        this.config.settingsLanguage = window.EJS_settingsLanguage || false;
        this.currentPopup = null;
        this.isFastForward = false;
        this.isSlowMotion = false;
        this.failedToStart = false;
        this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
        this.touch = false;
        this.cheats = [];
        this.started = false;
        this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
        if (this.config.defaultControllers) this.defaultControllers = this.config.defaultControllers;
        this.muted = false;
        this.paused = true;
        this.missingLang = [];

        // 初始化模块
        this.fileManager = new FileManager(this);
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);
        this.gameManager = new GameManager(this);

        // 将downloadFile方法绑定到this上，供compression.js使用
        this.downloadFile = this.fileManager.downloadFile.bind(this.fileManager);

        // 初始化控制器变量
        this.inputManager.initControlVars();

        // 设置元素
        this.uiManager.setElements(element);
        this.setColor(this.config.color || "");

        // 初始化存储
        this.initStorageLegacy();

        // 如果是调试模式或本地开发，检查更新
        if (this.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) this.checkForUpdates();

        // 创建开始按钮
        this.uiManager.createStartButton();
    }

    /**
     * 初始化存储 (兼容原版方式)
     */
    initStorageLegacy() {
        // 使用与原版相同的方式初始化存储
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

    /**
     * 开始游戏错误处理
     */
    startGameError(message) {
        console.log(message);
        if (this.uiManager.textElem) {
            this.uiManager.textElem.innerText = message;
            this.uiManager.textElem.classList.add("ejs_error_text");
        } else {
            // 如果textElem不存在，创建一个
            this.uiManager.createText();
            this.uiManager.textElem.innerText = message;
            this.uiManager.textElem.classList.add("ejs_error_text");
        }

        this.setupSettingsMenu();
        this.loadSettings();

        this.menu.failedToStart();
    }

    /**
     * 初始化模块
     */
    initModule(wasmData, threadData) {
        this.Module = window.EJS_Runtime({
            wasmBinary: wasmData,
            workerFile: threadData,
            getSavExt: () => {
                if (this.saveFileExt) {
                    return "." + this.saveFileExt;
                }
                return ".srm";
            }
        }).then(module => {
            this.Module = module;
            // 创建 EJS_GameManager 实例
            this.gameManager.gameManager = new window.EJS_GameManager(this.Module, this);
            this.downloadFiles();
        }).catch(e => {
            console.warn(e);
            this.startGameError(this.localization("Failed to start game"));
        });
    }

    /**
     * 下载文件
     */
    downloadFiles() {
        // 下载游戏相关文件
        Promise.all([
            this.fileManager.downloadBios(),
            this.fileManager.downloadRom(),
            this.fileManager.downloadGamePatch(),
            this.fileManager.downloadGameParent(),
            this.fileManager.downloadStartState()
        ]).then(() => {
            this.gameManager.startGame();
        }).catch((error) => {
            console.error("Failed to download files:", error);
            this.startGameError(this.localization("Failed to download game files"));
        });
    }

    /**
     * 开始游戏
     */
    startGame() {
        this.started = true;
        this.paused = false;
        this.emit("start");
        this.inputManager.initInputSystem();
    }

    /**
     * 检查开始状态
     */
    checkStarted() {
        if (this.Module && this.Module.audioContext && this.Module.audioContext.state === "suspended") {
            this.Module.audioContext.resume();
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        if (this.gameManager && this.gameManager.gameManager) {
            const dimensions = this.gameManager.getVideoDimensions();
            this.game.style.width = dimensions.width + "px";
            this.game.style.height = dimensions.height + "px";
        }
    }

    /**
     * 切换全屏
     */
    toggleFullscreen(fullscreen) {
        if (fullscreen === undefined) {
            fullscreen = !document.fullscreenElement;
        }
        
        if (fullscreen) {
            if (this.elements.parent.requestFullscreen) {
                this.elements.parent.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    /**
     * 截图
     */
    screenshot(callback, source, format, upscale) {
        if (this.gameManager && this.gameManager.gameManager) {
            this.gameManager.screenshot();
            if (callback) callback();
        }
    }

    /**
     * 异步截图
     */
    async takeScreenshot(source, format, upscale) {
        return new Promise((resolve) => {
            this.screenshot(resolve, source, format, upscale);
        });
    }

    /**
     * 收集屏幕录制媒体轨道
     */
    collectScreenRecordingMediaTracks(canvasEl, fps) {
        const stream = canvasEl.captureStream(fps);
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = this.Module.audioContext.createMediaStreamDestination().stream.getAudioTracks()[0];
        return { videoTrack, audioTrack };
    }

    /**
     * 加载ROM
     */
    loadROM(romPath) {
        if (this.gameManager && this.gameManager.gameManager) {
            this.gameManager.loadROM(romPath);
        }
    }

    /**
     * 重置
     */
    reset() {
        if (this.gameManager && this.gameManager.gameManager) {
            this.gameManager.reset();
        }
    }

    /**
     * 检查支持的选项
     */
    checkSupportedOpts() {
        const supported = {
            saveStates: this.gameManager.supportsStates(),
            netplay: this.netplayEnabled
        };
        return supported;
    }

    /**
     * 设置磁盘菜单
     */
    setupDisksMenu() {
        if (this.gameManager) {
            this.gameManager.setupDisksMenu();
        }
    }

    /**
     * 设置设置菜单
     */
    setupSettingsMenu() {
        // 设置菜单逻辑
    }

    /**
     * 加载设置
     */
    loadSettings() {
        // 加载设置逻辑
    }

    /**
     * 更新作弊UI
     */
    updateCheatUI() {
        // 更新作弊UI逻辑
    }

    /**
     * 事件系统
     */
    on(event, func) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) this.functions[event] = [];
        this.functions[event].push(func);
    }

    emit(event, data) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return 0;
        this.functions[event].forEach(e => e(data));
        return this.functions[event].length;
    }

    /**
     * 切换暂停
     */
    togglePause() {
        this.paused = !this.paused;
        if (this.gameManager && this.gameManager.gameManager) {
            this.gameManager.toggleMainLoop(this.paused);
        }
        this.emit("pause", this.paused);
    }

    /**
     * 切换静音
     */
    toggleMute() {
        this.muted = !this.muted;
        if (this.Module && this.Module.audioContext) {
            this.Module.audioContext.volume = this.muted ? 0 : this.volume;
        }
        this.emit("mute", this.muted);
    }

    /**
     * 快速保存
     */
    quickSave(slot = 0) {
        if (this.gameManager) {
            this.gameManager.quickSave(slot);
        }
    }

    /**
     * 快速加载
     */
    quickLoad(slot = 0) {
        if (this.gameManager) {
            this.gameManager.quickLoad(slot);
        }
    }

    /**
     * 显示设置
     */
    showSettings() {
        this.uiManager.showSettings();
    }

    /**
     * 显示上下文菜单
     */
    showContextMenu() {
        this.uiManager.showContextMenu();
    }

    /**
     * 广告被阻止
     */
    adBlocked(url, del) {
        if (this.uiManager) {
            this.uiManager.adBlocked(url, del);
        }
    }

    /**
     * 销毁模拟器
     */
    destroy() {
        if (this.inputManager) {
            this.inputManager.stopInputSystem();
        }
        if (this.eventListeners) {
            this.removeEventListener(this.eventListeners);
        }
        if (this.elements && this.elements.parent) {
            this.elements.parent.innerHTML = "";
        }
    }
}

// 将EmulatorJS类暴露到全局
window.EmulatorJS = EmulatorJS;
