import { isSafari, isMobile, localization, checkCompression, checkCoreCompatibility, getBaseFileName, createLink } from "./utils.js";
import { getCores, getCore, downloadGameCore, initGameCore } from "./core.js";
import {
    getDefaultControllers, getKeyMap, createControlSettingMenu,
    defaultButtonOptions, defaultButtonAliases, keyLookup, keyChange, setupKeys
} from "./controller.js"
import {
    createBottomMenuBar, createContextMenu,
    createCheatsMenu, createStartButton
} from "./ui.js"
import { setVirtualGamepad } from "./virtualGamepad.js"
import { bindListeners, addEventListener, removeEventListener, on, callEvent } from "./event.js"
import { createNetplayMenu, defineNetplayFunctions } from "./netPlay.js"
import { screenRecord, screenshot, takeScreenshot, collectScreenRecordingMediaTracks } from "./screenRecord.js"
import { closePopup, createPopup, displayMessage, isPopupOpen } from "./popMessage.js"
import { createText, setElements, setColor } from "./baseUI.js"
import { setupAds, adBlocked } from "./ads.js"
import { buildButtonOptions } from "./configs.js"
import { openCacheMenu, setupDisksMenu } from "./cacheDisk.js";
import { createElement, versionAsInt, toData, requiresThreads, requiresWebGL2, saveInBrowserSupported } from "./utils.js"
import { getSettingValue, setupSettingsMenu, loadSettings, getCoreSettings, preGetSetting, saveSettings, getLocalStorageKey } from "./settings.js";
import { downloadFiles, downloadFile, downloadRom, downloadBios, downloadGameParent, downloadGamePatch, downloadGameFile, downloadStartState, abortAllDownloads } from "./download.js"
import { updateCheatUI, cheatChanged } from "./cheat.js"
import { gamepadInit } from "./gamepadInit.js";
export class EmulatorJS {
    constructor(element, config) {
        this.updateCheatUI = updateCheatUI.bind(this);
        this.cheatChanged = cheatChanged.bind(this);
        this.isPopupOpen = isPopupOpen.bind(this);
        this.createBottomMenuBar = createBottomMenuBar.bind(this);
        this.createContextMenu = createContextMenu.bind(this);
        this.createCheatsMenu = createCheatsMenu.bind(this);
        this.createStartButton = createStartButton.bind(this);
        this.createNetplayMenu = createNetplayMenu.bind(this);
        this.defineNetplayFunctions = defineNetplayFunctions.bind(this);
        this.setElements = setElements.bind(this);
        this.setColor = setColor.bind(this);
        this.createText = createText.bind(this);
        this.setVirtualGamepad = setVirtualGamepad.bind(this);
        this.bindListeners = bindListeners.bind(this);
        this.addEventListener = addEventListener.bind(this);
        this.removeEventListener = removeEventListener.bind(this);
        this.on = on.bind(this);
        this.callEvent = callEvent.bind(this);
        this.keyLookup = keyLookup.bind(this);
        this.keyChange = keyChange.bind(this);
        this.setupKeys = setupKeys.bind(this);
        this.saveInBrowserSupported = saveInBrowserSupported.bind(this);
        this.screenshot = screenshot.bind(this);
        this.takeScreenshot = takeScreenshot.bind(this);
        this.collectScreenRecordingMediaTracks = collectScreenRecordingMediaTracks.bind(this);
        this.getCores = getCores.bind(this);
        this.requiresWebGL2 = requiresWebGL2.bind(this);
        this.requiresThreads = requiresThreads.bind(this);
        this.localization = localization.bind(this);
        this.checkCompression = checkCompression.bind(this);
        this.checkCoreCompatibility = checkCoreCompatibility.bind(this);
        this.downloadGameCore = downloadGameCore.bind(this);
        this.initGameCore = initGameCore.bind(this);
        this.closePopup = closePopup.bind(this);
        this.createPopup = createPopup.bind(this);
        this.screenRecord = screenRecord.bind(this);
        this.setupAds = setupAds.bind(this);
        this.adBlocked = adBlocked.bind(this);
        this.downloadFiles = downloadFiles.bind(this);
        this.downloadFile = downloadFile.bind(this);
        this.downloadRom = downloadRom.bind(this);
        this.downloadBios = downloadBios.bind(this);
        this.downloadGameParent = downloadGameParent.bind(this);
        this.downloadGamePatch = downloadGamePatch.bind(this);
        this.downloadGameFile = downloadGameFile.bind(this);
        this.downloadStartState = downloadStartState.bind(this);
        this.abortAllDownloads = abortAllDownloads.bind(this);
        this.getBaseFileName = getBaseFileName.bind(this);
        this.setupSettingsMenu = setupSettingsMenu.bind(this);
        this.loadSettings = loadSettings.bind(this);
        this.getCoreSettings = getCoreSettings.bind(this);
        this.preGetSetting = preGetSetting.bind(this);
        this.getLocalStorageKey = getLocalStorageKey.bind(this);
        this.saveSettings = saveSettings.bind(this);
        this.getSettingValue = getSettingValue.bind(this);
        this.createLink = createLink.bind(this);
        this.displayMessage = displayMessage.bind(this);
        this.openCacheMenu = openCacheMenu.bind(this);
        this.setupDisksMenu = setupDisksMenu.bind(this);
        this.createElement = createElement.bind(this);
        this.versionAsInt = versionAsInt.bind(this);
        this.createControlSettingMenu = createControlSettingMenu.bind(this);
        this.getCore = getCore.bind(this);
        this.toData = toData.bind(this);
        this.buildButtonOptions = buildButtonOptions.bind(this);
        this.gamepadInit = gamepadInit.bind(this);
        this.defaultControllers = getDefaultControllers();
        this.keyMap = getKeyMap();
        this.element = element;
        this.gamepadInit();
        this.init(config)
    }

    init(config) {
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.debug = (window.EJS_DEBUG_XX === true);
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;
        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts, defaultButtonAliases, defaultButtonOptions);
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
        this.setElements(this.element);
        this.setColor(this.config.color || "");
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }

        this.hasTouchScreen = (function () {
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
        })();
        this.canvas = this.createElement("canvas");
        this.canvas.classList.add("ejs_canvas");
        this.videoRotation = ([0, 1, 2, 3].includes(this.config.videoRotation)) ? this.config.videoRotation : this.preGetSetting("videoRotation") || 0;
        this.videoRotationChanged = false;
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
        this.createContextMenu();
        this.createBottomMenuBar();
        this.createControlSettingMenu();
        this.createCheatsMenu();
        this.createNetplayMenu();
        this.setVirtualGamepad();
        this.bindListeners();
        this.config.netplayUrl = this.config.netplayUrl || "https://netplay.emulatorjs.org";
        this.fullscreen = false;
        this.enableMouseLock = false;
        this.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (this.config.forceLegacyCores !== true);
        this.webgl2Enabled = (() => {
            let setting = this.preGetSetting("webgl2Enabled");
            if (setting === "disabled" || !this.supportsWebgl2) {
                return false;
            } else if (setting === "enabled") {
                return true;
            }
            return null;
        })();
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

        const button = this.createStartButton();
        if (this.config.startOnLoad === true) {
            this.startButtonClicked(button);
        }
        setTimeout(() => {
            this.callEvent("ready");
        }, 20);
        this.handleResize();
    }
    startNewGame(newConfig) {
        // 验证新配置
        if (!newConfig || !newConfig.gameUrl) {
            console.error('startNewGame: gameUrl is required');
            return false;
        }

        // 防止重复切换
        if (this.isSwitching) {
            return false;
        }

        // 标记正在切换
        this.isSwitching = true;

        // 终止所有正在进行的下载操作
        try {
            this.abortAllDownloads();
        } catch (e) {
            console.warn("Error aborting downloads:", e);
        }

        // 如果游戏正在运行，先停止当前游戏
        if (this.started) {
            this.stopCurrentGame();
        } else {
            console.log("Game is not running, proceeding directly");
        }

        // 立即清理旧的 textElem，避免快速切换时显示旧的进度
        if (this.textElem) {
            try {
                this.textElem.remove();
            } catch (e) {
                console.warn("Error removing old text element:", e);
            }
            this.textElem = null;
        }
        
        // 等待当前游戏完全停止后再启动新游戏
        setTimeout(() => {

            
        
            
            // 更新配置，不重新初始化整个模拟器
            this.config.gameName = newConfig.gameName || this.getBaseFileName(newConfig.gameUrl);
            this.config.gameUrl = newConfig.gameUrl;
            this.config.system = newConfig.gameCore || this.config.system;
            
            // 重置一些状态
            this.started = false;
            this.paused = true;
            this.failedToStart = false;
            this.isSwitching = false;
            
            // 清理可能存在的旧模块引用
            if (this.Module) {
                console.log("Cleaning up old module reference");
                console.log("Module.AL exists:", !!this.Module.AL);
                console.log("Module.FS exists:", !!this.Module.FS);
                console.log("Module.callMain exists:", !!this.Module.callMain);
                // 不强制清理模块，让垃圾回收自然处理
            } else {
                console.log("No existing module to clean up");
            }
            
            // 如果设置了自动启动，则直接开始游戏
            if (newConfig.autoStart !== false) {
                try {
                    this.createText();
                    if (this.textElem) {
                        console.log("Text element content:", this.textElem.innerText);
                        console.log("Text element classes:", this.textElem.className);
                    }
                    console.log("Starting downloadGameCore...");
                    this.downloadGameCore().then(() => {
                        console.log("✓ downloadGameCore completed successfully");
                    }).catch(error => {
                        console.error("✗ Failed to download game core:", error);
                        console.error("Error stack:", error.stack);
                        console.log("Calling startGameError...");
                        this.startGameError("Failed to download game core: " + error.message);
                    });
                } catch (error) {
                    console.error("✗ Error in downloadGameCore call:", error);
                    console.error("Error stack:", error.stack);
                    console.log("Calling startGameError...");
                    this.startGameError("Error in downloadGameCore: " + error.message);
                }
            } else {
                console.log("Auto-start disabled, waiting for manual start");
            }
        }, 800); // 增加等待时间，确保 GameManager 的 exit 事件处理完成
        
        return true;
    }

    stopCurrentGame() {
        
        try {
            // 触发退出事件
            this.callEvent("exit");
        } catch (e) {
            console.error("✗ Error calling exit event:", e);
            console.error("Error stack:", e.stack);
        }
        
        // 重置状态标志，防止重复操作
        this.started = false;
        this.paused = true;
        
        // 停止当前游戏模块
        if (this.Module) {
            try {
                // 暂停主循环
                if (this.Module.pauseMainLoop) {
                    this.Module.pauseMainLoop();
                } else {
                    console.warn("pauseMainLoop method not found");
                }
                
                // 清理音频上下文
                if (this.Module.AL && this.Module.AL.currentCtx) {
                    this.Module.AL.currentCtx.sources.forEach((ctx, index) => {
                        console.log(`Cleaning audio source ${index}...`);
                        if (ctx.gain && ctx.gain.context) {
                            try {
                                ctx.gain.context.close();
                            } catch (e) {
                                console.warn(`Error closing audio source ${index}:`, e);
                            }
                        }
                    });
                } else {
                    console.warn("No audio context to clean");
                }
            } catch (e) {
                console.error('✗ Error stopping module:', e);
                console.error("Error stack:", e.stack);
            }
        } else {
            console.log("No module to stop");
        }

        // 清理游戏管理器
        if (this.gameManager) {
            try {
                this.gameManager = null;
            } catch (e) {
                console.error('✗ Error cleaning game manager:', e);
                console.error("Error stack:", e.stack);
            }
        } else {
            console.log("No game manager to clean");
        }
        
        // 清理画布
        if (this.canvas && this.canvas.parentNode) {
            try {
                this.canvas.remove();
            } catch (e) {
                console.error('✗ Error removing canvas:', e);
                console.error("Error stack:", e.stack);
            }
        } else {
            console.log("No canvas to remove");
        }
        
        // 重新创建画布
        try {
            this.canvas = this.createElement("canvas");
            this.canvas.classList.add("ejs_canvas");
        } catch (e) {
            console.error('✗ Error creating canvas:', e);
            console.error("Error stack:", e.stack);
        }
        
        // 重新初始化手柄相关设置
        try {
            this.resetGamepadSettings();
        } catch (e) {
            console.error('✗ Error resetting gamepad:', e);
            console.error("Error stack:", e.stack);
        }
        
        // 保存当前模块引用，避免过早清理
        const currentModule = this.Module;
        const currentFileName = this.fileName;
        
        // 不立即清理模块，让它自然清理，避免影响新游戏的启动
        setTimeout(() => {
            console.log("=== Delayed cleanup timeout executed ===");
            if (currentModule && currentFileName) {
                console.log("Cleaning up file system...");
                try {
                    // 清理文件系统（如果存在）
                    if (currentModule.FS) {
                        try {
                            // 只清理游戏文件，避免过度清理
                            currentModule.FS.unlink("/" + currentFileName);
                            console.log("✓ Game file unlinked");
                        } catch (e) {
                            console.warn("Error unlinking game file:", e);
                        }
                    } else {
                        console.log("No file system to clean");
                    }
                } catch (e) {
                    console.warn('Error cleaning up file system:', e);
                }
            } else {
                console.log("No cleanup needed");
            }
        }, 1500); // 大幅增加延迟，避免影响新游戏启动
        
        console.log("=== stopCurrentGame completed ===");
    }

    resetGamepadSettings() {
        // 重新初始化手柄选择
        this.gamepadSelection = this.gamepadSelection || [];
        this.controls = this.controls || [];
        
        // 重新初始化手柄标签
        this.gamepadLabels = this.gamepadLabels || [];
        
        // 重新初始化手柄系统
        this.reinitGamepad();
        
        // 更新手柄标签显示
        this.updateGamepadLabels();
    }

    reinitGamepad() {
        // 清理旧的手柄系统
        if (this.gamepad) {
            try {
                // 移除所有事件监听器
                this.gamepad._events = {};
                // 停止手柄轮询
                if (this.gamepad.stop) {
                    this.gamepad.stop();
                }
            } catch (e) {
                console.warn('Error cleaning up gamepad:', e);
            }
        }
        
        // 重新初始化手柄
        this.gamepadInit();
    }
    // Start button
    startButtonClicked(e) {
        this.callEvent("start-clicked");
        if (e.pointerType === "touch") {
            this.touch = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
            e.target.remove();
        } else {
            e.remove();
        }
        this.createText();
        this.downloadGameCore();
    }
    startGameError(message) {
        console.log(message);
        if (this.textElem) {
            this.textElem.innerText = message;
            this.textElem.classList.add("ejs_error_text");
        }

        this.setupSettingsMenu();
        this.loadSettings();

        if (this.menu) {
            this.menu.failedToStart();
        }
        this.handleResize();
        this.failedToStart = true;
    }

    initModule(wasmData, threadData) {
        if (typeof window.EJS_Runtime !== "function") {
            console.warn("EJS_Runtime is not defined!");
            this.startGameError(this.localization("Error loading EmulatorJS runtime"));
            throw new Error("EJS_Runtime is not defined!");
        }
        window.EJS_Runtime({
            noInitialRun: true,
            onRuntimeInitialized: null,
            arguments: [],
            preRun: [],
            postRun: [],
            canvas: this.canvas,
            callbacks: {},
            parent: this.elements.parent,
            print: (msg) => {
                if (this.debug) {
                    console.log(msg);
                }
            },
            printErr: (msg) => {
                if (this.debug) {
                    console.log(msg);
                }
            },
            totalDependencies: 0,
            locateFile: function (fileName) {
                if (this.debug) console.log(fileName);
                if (fileName.endsWith(".wasm")) {
                    return URL.createObjectURL(new Blob([wasmData], { type: "application/wasm" }));
                } else if (fileName.endsWith(".worker.js")) {
                    return URL.createObjectURL(new Blob([threadData], { type: "application/javascript" }));
                }
            },
            getSavExt: () => {
                if (this.saveFileExt) {
                    return "." + this.saveFileExt;
                }
                return ".srm";
            }
        }).then(module => {
            this.Module = module;
            this.downloadFiles();
        }).catch(e => {
            console.warn(e);
            this.startGameError(this.localization("Failed to start game"));
        });
    }
    startGame() {
        try {
            const args = [];
            if (this.debug) args.push("-v");
            args.push("/" + this.fileName);
            if (this.debug) console.log(args);
            this.Module.callMain(args);
            if (typeof this.config.softLoad === "number" && this.config.softLoad > 0) {
                this.resetTimeout = setTimeout(() => {
                    this.gameManager.restart();
                }, this.config.softLoad * 1000);
            }
            this.Module.resumeMainLoop();
            this.checkSupportedOpts();
            this.setupDisksMenu();
            // hide the disks menu if the disk count is not greater than 1
            if (!(this.gameManager.getDiskCount() > 1)) {
                this.diskParent.style.display = "none";
            }
            this.setupSettingsMenu();
            this.loadSettings();
            this.updateCheatUI();
            this.updateGamepadLabels();
            if (!this.muted) this.setVolume(this.volume);
            if (this.config.noAutoFocus !== true) this.elements.parent.focus();
            if (this.textElem) {
                this.textElem.remove();
                this.textElem = null;
            }
            this.game.classList.remove("ejs_game");
            this.game.classList.add("ejs_canvas_parent");
            this.game.appendChild(this.canvas);
            this.handleResize();
            this.started = true;
            this.paused = false;
            if (this.touch) {
                this.virtualGamepad.style.display = "";
            }
            this.handleResize();
            if (this.config.fullscreenOnLoad) {
                try {
                    this.toggleFullscreen(true);
                } catch (e) {
                    if (this.debug) console.warn("Could not fullscreen on load");
                }
            }
            this.menu.open();
            if (isSafari && isMobile) {
                //Safari is --- funny
                this.checkStarted();
            }
        } catch (e) {
            console.warn("Failed to start game", e);
            this.startGameError(this.localization("Failed to start game"));
            this.callEvent("exit");
            return;
        }
        this.callEvent("start");
    }
    checkStarted() {
        (async () => {
            let sleep = (ms) => new Promise(r => setTimeout(r, ms));
            let state = "suspended";
            let popup;
            while (state === "suspended") {
                if (!this.Module.AL) return;
                this.Module.AL.currentCtx.sources.forEach(ctx => {
                    state = ctx.gain.context.state;
                });
                if (state !== "suspended") break;
                if (!popup) {
                    popup = this.createPopup("", {});
                    const button = this.createElement("button");
                    button.innerText = this.localization("Click to resume Emulator");
                    button.classList.add("ejs_menu_button");
                    button.style.width = "25%";
                    button.style.height = "25%";
                    popup.appendChild(button);
                    popup.style["text-align"] = "center";
                    popup.style["font-size"] = "28px";
                }
                await sleep(10);
            }
            if (popup) this.closePopup();
        })();
    }
    checkSupportedOpts() {
        if (!this.gameManager.supportsStates()) {
            this.elements.bottomBar.saveState[0].style.display = "none";
            this.elements.bottomBar.loadState[0].style.display = "none";
            this.elements.bottomBar.netplay[0].style.display = "none";
            this.elements.contextMenu.save.style.display = "none";
            this.elements.contextMenu.load.style.display = "none";
        }
        if (typeof this.config.gameId !== "number" || !this.config.netplayUrl || this.netplayEnabled === false) {
            this.elements.bottomBar.netplay[0].style.display = "none";
        }
    }
    updateGamepadLabels() {
        for (let i = 0; i < this.gamepadLabels.length; i++) {
            this.gamepadLabels[i].innerHTML = ""
            const def = this.createElement("option");
            def.setAttribute("value", "notconnected");
            def.innerText = "Not Connected";
            this.gamepadLabels[i].appendChild(def);
            for (let j = 0; j < this.gamepad.gamepads.length; j++) {
                const opt = this.createElement("option");
                opt.setAttribute("value", this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index);
                opt.innerText = this.gamepad.gamepads[j].id + "_" + this.gamepad.gamepads[j].index;
                this.gamepadLabels[i].appendChild(opt);
            }
            this.gamepadLabels[i].value = this.gamepadSelection[i] || "notconnected";
        }
    }
    selectFile() {
        return new Promise((resolve, reject) => {
            const file = this.createElement("input");
            file.type = "file";
            this.addEventListener(file, "change", (e) => {
                resolve(e.target.files[0]);
            })
            file.click();
        })
    }

    isChild(first, second) {
        if (!first || !second) return false;
        const adown = first.nodeType === 9 ? first.documentElement : first;

        if (first === second) return true;

        if (adown.contains) {
            return adown.contains(second);
        }

        return first.compareDocumentPosition && first.compareDocumentPosition(second) & 16;
    }
    getControlScheme() {
        if (this.config.controlScheme && typeof this.config.controlScheme === "string") {
            return this.config.controlScheme;
        } else {
            return this.getCore(true);
        }
    }
    gamepadEvent(e) {
        if (!this.started) return;
        const gamepadIndex = this.gamepadSelection.indexOf(this.gamepad.gamepads[e.gamepadIndex].id + "_" + this.gamepad.gamepads[e.gamepadIndex].index);
        if (gamepadIndex < 0) {
            return; // Gamepad not set anywhere
        }
        const value = function (value) {
            if (value > 0.5 || value < -0.5) {
                return (value > 0) ? 1 : -1;
            } else {
                return 0;
            }
        }(e.value || 0);
        if (this.controlPopup.parentElement.parentElement.getAttribute("hidden") === null) {
            if ("buttonup" === e.type || (e.type === "axischanged" && value === 0)) return;
            const num = this.controlPopup.getAttribute("button-num");
            const player = parseInt(this.controlPopup.getAttribute("player-num"));
            if (gamepadIndex !== player) return;
            if (!this.controls[player][num]) {
                this.controls[player][num] = {};
            }
            this.controls[player][num].value2 = e.label;
            this.controlPopup.parentElement.parentElement.setAttribute("hidden", "");
            this.checkGamepadInputs();
            this.saveSettings();
            return;
        }
        if (this.settingsMenu.style.display !== "none" || this.isPopupOpen()) return;
        const special = [16, 17, 18, 19, 20, 21, 22, 23];

        // NES特殊处理：将X键映射到A键，Y键映射到B键
        if ("nes" === this.getControlScheme()) {
            for (let i = 0; i < 4; i++) {
                if (gamepadIndex !== i) continue;
                for (let j = 0; j < 30; j++) {
                    if (!this.controls[i][j] || this.controls[i][j].value2 === undefined) {
                        continue;
                    }
                    const controlValue = this.controls[i][j].value2;

                    // 检查是否是X键(9)或Y键(1)
                    let mappedButton = j;
                    if (j === 9) { // X键映射到A键(8)
                        mappedButton = 8;
                    } else if (j === 1) { // Y键映射到B键(0)
                        mappedButton = 0;
                    }

                    if (["buttonup", "buttondown"].includes(e.type) && (controlValue === e.label || controlValue === e.index)) {
                        // 处理NES的连发功能
                        if (j === 9 || j === 1) {
                            if (e.type === "buttondown") {
                                // 触发一次按键按下
                                this.gameManager.simulateInput(i, mappedButton, (special.includes(mappedButton) ? 0x7fff : 1));

                                // 清除可能存在的旧定时器
                                if (this.controls[i][j].nesRapidFireInterval) {
                                    clearInterval(this.controls[i][j].nesRapidFireInterval);
                                }

                                // 设置连发定时器
                                this.controls[i][j].nesRapidFireInterval = setInterval(() => {
                                    this.gameManager.simulateInput(i, mappedButton, (special.includes(mappedButton) ? 0x7fff : 1));
                                    // 短暂延迟后释放按键，模拟点击效果
                                    setTimeout(() => {
                                        this.gameManager.simulateInput(i, mappedButton, 0);
                                    }, 30);
                                }, 100);
                            } else if (e.type === "buttonup") {
                                // 清除连发定时器
                                if (this.controls[i][j].nesRapidFireInterval) {
                                    clearInterval(this.controls[i][j].nesRapidFireInterval);
                                    this.controls[i][j].nesRapidFireInterval = null;
                                }
                                // 触发按键释放
                                this.gameManager.simulateInput(i, mappedButton, 0);
                            }
                        } else {
                            // 非X/Y键的正常处理
                            this.gameManager.simulateInput(i, mappedButton, (e.type === "buttonup" ? 0 : (special.includes(mappedButton) ? 0x7fff : 1)));
                        }
                    }
                }
            }
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (gamepadIndex !== i) continue;
            for (let j = 0; j < 30; j++) {
                if (!this.controls[i][j] || this.controls[i][j].value2 === undefined) {
                    continue;
                }
                const controlValue = this.controls[i][j].value2;

                if (["buttonup", "buttondown"].includes(e.type) && (controlValue === e.label || controlValue === e.index)) {
                    this.gameManager.simulateInput(i, j, (e.type === "buttonup" ? 0 : (special.includes(j) ? 0x7fff : 1)));
                } else if (e.type === "axischanged") {
                    if (typeof controlValue === "string" && controlValue.split(":")[0] === e.axis) {
                        if (special.includes(j)) {
                            if (j === 16 || j === 17) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 16, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 17, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 17, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 16, 0);
                                }
                            } else if (j === 18 || j === 19) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 18, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 19, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 19, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 18, 0);
                                }
                            } else if (j === 20 || j === 21) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 20, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 21, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 21, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 20, 0);
                                }
                            } else if (j === 22 || j === 23) {
                                if (e.value > 0) {
                                    this.gameManager.simulateInput(i, 22, 0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 23, 0);
                                } else {
                                    this.gameManager.simulateInput(i, 23, -0x7fff * e.value);
                                    this.gameManager.simulateInput(i, 22, 0);
                                }
                            }
                        } else if (value === 0 || controlValue === e.label || controlValue === `${e.axis}:${value}`) {
                            this.gameManager.simulateInput(i, j, ((value === 0) ? 0 : 1));
                        }
                    }
                }
            }
        }
    }
    handleResize() {
        if (!this.game.parentElement) {
            return false;
        }
        if (this.virtualGamepad) {
            if (this.virtualGamepad.style.display === "none") {
                this.virtualGamepad.style.opacity = 0;
                this.virtualGamepad.style.display = "";
                setTimeout(() => {
                    this.virtualGamepad.style.display = "none";
                    this.virtualGamepad.style.opacity = "";
                }, 250)
            }
        }
        const positionInfo = this.elements.parent.getBoundingClientRect();
        this.game.parentElement.classList.toggle("ejs_small_screen", positionInfo.width <= 575);
        //This wouldnt work using :not()... strange.
        this.game.parentElement.classList.toggle("ejs_big_screen", positionInfo.width > 575);

        if (!this.handleSettingsResize) return;
        this.handleSettingsResize();
    }
    getElementSize(element) {
        let elem = element.cloneNode(true);
        elem.style.position = "absolute";
        elem.style.opacity = 0;
        elem.removeAttribute("hidden");
        element.parentNode.appendChild(elem);
        const res = elem.getBoundingClientRect();
        elem.remove();
        return {
            "width": res.width,
            "height": res.height
        };
    }
    handleSpecialOptions(option, value) {
        if (option === "shader") {
            this.enableShader(value);
        } else if (option === "disk") {
            this.gameManager.setCurrentDisk(value);
        } else if (option === "virtual-gamepad") {
            this.toggleVirtualGamepad(value !== "disabled");
        } else if (option === "menu-bar-button") {
            this.elements.menuToggle.style.display = "";
            this.elements.menuToggle.style.opacity = value === "visible" ? 0.5 : 0;
        } else if (option === "virtual-gamepad-left-handed-mode") {
            this.toggleVirtualGamepadLeftHanded(value !== "disabled");
        } else if (option === "ff-ratio") {
            if (this.isFastForward) this.gameManager.toggleFastForward(0);
            if (value === "unlimited") {
                this.gameManager.setFastForwardRatio(0);
            } else if (!isNaN(value)) {
                this.gameManager.setFastForwardRatio(parseFloat(value));
            }
            setTimeout(() => {
                if (this.isFastForward) this.gameManager.toggleFastForward(1);
            }, 10)
        } else if (option === "fastForward") {
            if (value === "enabled") {
                this.isFastForward = true;
                this.gameManager.toggleFastForward(1);
            } else if (value === "disabled") {
                this.isFastForward = false;
                this.gameManager.toggleFastForward(0);
            }
        } else if (option === "sm-ratio") {
            if (this.isSlowMotion) this.gameManager.toggleSlowMotion(0);
            this.gameManager.setSlowMotionRatio(parseFloat(value));
            setTimeout(() => {
                if (this.isSlowMotion) this.gameManager.toggleSlowMotion(1);
            }, 10);
        } else if (option === "slowMotion") {
            if (value === "enabled") {
                this.isSlowMotion = true;
                this.gameManager.toggleSlowMotion(1);
            } else if (value === "disabled") {
                this.isSlowMotion = false;
                this.gameManager.toggleSlowMotion(0);
            }
        } else if (option === "rewind-granularity") {
            if (this.rewindEnabled) {
                this.gameManager.setRewindGranularity(parseInt(value));
            }
        } else if (option === "vsync") {
            this.gameManager.setVSync(value === "enabled");
        } else if (option === "videoRotation") {
            value = parseInt(value);
            if (this.videoRotationChanged === true || value !== 0) {
                this.gameManager.setVideoRotation(value);
                this.videoRotationChanged = true;
            } else if (this.videoRotationChanged === true && value === 0) {
                this.gameManager.setVideoRotation(0);
                this.videoRotationChanged = true;
            }
        } else if (option === "save-save-interval") {
            value = parseInt(value);
            if (this.saveSaveInterval && this.saveSaveInterval !== null) {
                clearInterval(this.saveSaveInterval);
                this.saveSaveInterval = null;
            }
            // Disabled
            if (value === 0 || isNaN(value)) return;
            if (this.started) this.gameManager.saveSaveFiles();
            if (this.debug) console.log("Saving every", value * 1000, "miliseconds");
            this.saveSaveInterval = setInterval(() => {
                if (this.started) this.gameManager.saveSaveFiles();
            }, value * 1000);
        } else if (option === "menubarBehavior") {
            this.createBottomMenuBarListeners();
        } else if (option === "keyboardInput") {
            this.gameManager.setKeyboardEnabled(value === "enabled");
        } else if (option === "altKeyboardInput") {
            this.gameManager.setAltKeyEnabled(value === "enabled");
        } else if (option === "lockMouse") {
            this.enableMouseLock = (value === "enabled");
        }
    }
    menuOptionChanged(option, value) {
        this.saveSettings();
        this.allSettings[option] = value;
        if (this.debug) console.log(option, value);
        if (!this.gameManager) return;
        this.handleSpecialOptions(option, value);
        this.gameManager.setVariable(option, value);
        this.saveSettings();
    }
    createSubPopup(hidden) {
        const popup = this.createElement("div");
        popup.classList.add("ejs_popup_container");
        popup.classList.add("ejs_popup_container_box");
        const popupMsg = this.createElement("div");
        popupMsg.innerText = "";
        if (hidden) popup.setAttribute("hidden", "");
        popup.appendChild(popupMsg);
        return [popup, popupMsg];
    }


    enableShader(name) {
        if (!this.gameManager) return;
        try {
            this.Module.FS.unlink("/shader/shader.glslp");
        } catch (e) { }

        if (name === "disabled" || !this.config.shaders[name]) {
            this.gameManager.toggleShader(0);
            return;
        }

        const shaderConfig = this.config.shaders[name];

        if (typeof shaderConfig === "string") {
            this.Module.FS.writeFile("/shader/shader.glslp", shaderConfig, {}, "w+");
        } else {
            const shader = shaderConfig.shader;
            this.Module.FS.writeFile("/shader/shader.glslp", shader.type === "base64" ? atob(shader.value) : shader.value, {}, "w+");
            if (shaderConfig.resources && shaderConfig.resources.length) {
                shaderConfig.resources.forEach(resource => {
                    this.Module.FS.writeFile(`/shader/${resource.name}`, resource.type === "base64" ? atob(resource.value) : resource.value, {}, "w+");
                });
            }
        }

        this.gameManager.toggleShader(1);
    }

}

window.EmulatorJS = EmulatorJS;
