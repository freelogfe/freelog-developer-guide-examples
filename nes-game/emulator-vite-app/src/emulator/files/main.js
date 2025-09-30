/**
 * Main EmulatorJS Class - Modularized implementation
 * This file contains the core EmulatorJS class structure and imports all modules
 */
import CoreSystem from './core-system.js';
import DOMUtilities from './dom-utilities.js';
import FileHandling from './file-handling.js';
import CoreManagement from './core-management.js';
import EventSystem from './event-system.js';
import Localization from './localization.js';
import UIComponents from './ui-components.js';
import GameStateManager from './game-state-manager.js';
import AudioVideoManager from './audio-video-manager.js';
import InputHandler from './input-handler.js';
import NetplayManager from './netplay-manager.js';
import AdsMonetization from './ads-monetization.js';

export default class EmulatorJS {
    constructor(element, config) {
        // Initialize all modules
        this.systemDetection = new CoreSystem(this);
        this.domUtilities = new DOMUtilities(this);
        this.fileHandling = new FileHandling(this);
        this.coreManagement = new CoreManagement(this);
        this.eventSystem = new EventSystem(this);
        this.localization = new Localization(this);
        this.uiComponents = new UIComponents(this);
        this.gameStateManager = new GameStateManager(this);
        this.audioVideoManager = new AudioVideoManager(this);
        this.inputHandler = new InputHandler(this);
        this.netplayManager = new NetplayManager(this);
        this.adsMonetization = new AdsMonetization(this);

        // Step 1: Initialize core properties (exactly as in original)
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.initControlVars();
        this.debug = (window.EJS_DEBUG_XX === true);
        if (this.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) this.checkForUpdates();
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;

        // Step 2: Initialize button options and basic state
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

        // Step 3: Initialize modules (needed for DOM operations)
        this.systemDetection = new CoreSystem(this);
        this.domUtilities = new DOMUtilities(this);
        this.fileHandling = new FileHandling(this);
        this.coreManagement = new CoreManagement(this);
        this.eventSystem = new EventSystem(this);
        this.localization = new Localization(this);
        this.uiComponents = new UIComponents(this);
        this.gameStateManager = new GameStateManager(this);
        this.audioVideoManager = new AudioVideoManager(this);
        this.inputHandler = new InputHandler(this);
        this.netplayManager = new NetplayManager(this);
        this.adsMonetization = new AdsMonetization(this);

        // Step 4: Set DOM elements
        this.setElements(element);
        this.setColor(this.config.color || "");
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";

        // Step 5: Setup ads if configured
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }

        // Step 6: Initialize device detection and canvas
        this.isMobile = (function () {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        })();

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

        // Step 7: Initialize canvas and capture settings
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

        // Step 8: Bind listeners and initialize system properties
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
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // Step 9: Initialize storage
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
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");

        // Step 10: Initialize game background
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

        // Step 11: Process cheats if provided
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

        // Step 12: Initialize UI components
        this.uiComponents.createContextMenu();
        this.uiComponents.createBottomMenuBar();

        // Step 13: Create start button and handle resize
        this.startButton = this.createStartButton();
        this.handleResize();

        // Step 14: Call ready event
        this.callEvent("ready");
    }

    // Core system methods
    getCores() {
        let rv = {
            "atari5200": ["a5200"],
            "vb": ["beetle_vb"],
            "nds": ["melonds", "desmume", "desmume2015"],
            "arcade": ["fbneo", "fbalpha2012_cps1", "fbalpha2012_cps2"],
            "nes": ["fceumm", "nestopia"],
            "gb": ["gambatte"],
            "coleco": ["gearcoleco"],
            "segaMS": ["smsplus", "genesis_plus_gx", "picodrive"],
            "segaMD": ["genesis_plus_gx", "picodrive"],
            "segaGG": ["genesis_plus_gx"],
            "segaCD": ["genesis_plus_gx", "picodrive"],
            "sega32x": ["picodrive"],
            "sega": ["genesis_plus_gx", "picodrive"],
            "lynx": ["handy"],
            "mame": ["mame2003_plus", "mame2003"],
            "ngp": ["mednafen_ngp"],
            "pce": ["mednafen_pce"],
            "pcfx": ["mednafen_pcfx"],
            "psx": ["pcsx_rearmed", "mednafen_psx_hw"],
            "ws": ["mednafen_wswan"],
            "gba": ["mgba"],
            "n64": ["mupen64plus_next", "parallel_n64"],
            "3do": ["opera"],
            "psp": ["ppsspp"],
            "atari7800": ["prosystem"],
            "snes": ["snes9x"],
            "atari2600": ["stella2014"],
            "jaguar": ["virtualjaguar"],
            "segaSaturn": ["yabause"],
            "amiga": ["puae"],
            "c64": ["vice_x64sc"],
            "c128": ["vice_x128"],
            "pet": ["vice_xpet"],
            "plus4": ["vice_xplus4"],
            "vic20": ["vice_xvic"],
            "dos": ["dosbox_pure"]
        };
        if (this.isSafari && this.isMobile) {
            rv.n64 = rv.n64.reverse();
        }
        return rv;
    }

    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }

    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }

    getCore(generic) {
        const cores = this.getCores();
        const core = this.config.system;
        if (generic) {
            for (const k in cores) {
                if (cores[k].includes(core)) {
                    return k;
                }
            }
            return core;
        }
        const gen = this.getCore(true);
        if (cores[gen] && cores[gen].includes(this.preGetSetting("retroarch_core"))) {
            return this.preGetSetting("retroarch_core");
        }
        if (cores[core]) {
            return cores[core][0];
        }
        return core;
    }

    checkForUpdates() {
        return this.systemDetection.checkForUpdates();
    }

    versionAsInt(ver) {
        return this.systemDetection.versionAsInt(ver);
    }

    // DOM utility methods
    createElement(type) {
        return this.domUtilities.createElement(type);
    }

    addEventListener(element, listener, callback) {
        return this.domUtilities.addEventListener(element, listener, callback);
    }

    removeEventListener(data) {
        return this.domUtilities.removeEventListener(data);
    }

    // File handling methods
    downloadFile(path, progressCB, notWithPath, opts) {
        return this.fileHandling.downloadFile(path, progressCB, notWithPath, opts);
    }

    toData(data, rv) {
        return this.fileHandling.toData(data, rv);
    }

    checkCompression(data, msg, fileCbFunc) {
        return this.fileHandling.checkCompression(data, msg, fileCbFunc);
    }

    getBaseFileName(force) {
        return this.fileHandling.getBaseFileName(force);
    }

    saveInBrowserSupported() {
        return this.fileHandling.saveInBrowserSupported();
    }

    localization(text, log) {
        return this.fileHandling.localization(text, log);
    }

    // Core management methods
    initGameCore(js, wasm, thread) {
        return this.coreManagement.initGameCore(js, wasm, thread);
    }

    startGame() {
        return this.coreManagement.startGame();
    }

    checkStarted() {
        return this.coreManagement.checkStarted();
    }

    checkSupportedOpts() {
        return this.coreManagement.checkSupportedOpts();
    }

    getSavExt() {
        return this.coreManagement.getSavExt();
    }

    restart() {
        return this.coreManagement.restart();
    }

    pause() {
        return this.coreManagement.pause();
    }

    play() {
        return this.coreManagement.play();
    }

    fastForward() {
        return this.coreManagement.fastForward();
    }

    slowMotion() {
        return this.coreManagement.slowMotion();
    }

    rewind() {
        return this.coreManagement.rewind();
    }

    quickSave(slot = "1") {
        return this.coreManagement.quickSave(slot);
    }

    quickLoad(slot = "1") {
        return this.coreManagement.quickLoad(slot);
    }

    getDiskCount() {
        return this.coreManagement.getDiskCount();
    }

    switchDisk(disk) {
        return this.coreManagement.switchDisk(disk);
    }

    getCoreInfo() {
        return this.coreManagement.getCoreInfo();
    }

    getGameManager() {
        return this.coreManagement.getGameManager();
    }

    getModule() {
        return this.coreManagement.getModule();
    }

    isRunning() {
        return this.coreManagement.isRunning();
    }

    getGameState() {
        return this.coreManagement.getGameState();
    }

    setGameOption(option, value) {
        return this.coreManagement.setGameOption(option, value);
    }

    getGameOption(option) {
        return this.coreManagement.getGameOption(option);
    }

    saveGameSettings() {
        return this.coreManagement.saveGameSettings();
    }

    loadGameSettings() {
        return this.coreManagement.loadGameSettings();
    }

    reset() {
        return this.coreManagement.reset();
    }

    hardReset() {
        return this.coreManagement.hardReset();
    }

    // Event system methods
    on(event, func) {
        return this.eventSystem.on(event, func);
    }

    callEvent(event, data) {
        return this.eventSystem.callEvent(event, data);
    }

    off(event, func) {
        return this.eventSystem.off(event, func);
    }

    removeAllListeners(event) {
        return this.eventSystem.removeAllListeners(event);
    }

    listenerCount(event) {
        return this.eventSystem.listenerCount(event);
    }

    eventNames() {
        return this.eventSystem.eventNames();
    }

    hasListeners(event) {
        return this.eventSystem.hasListeners(event);
    }

    waitFor(event) {
        return this.eventSystem.waitFor(event);
    }

    once(event, func) {
        return this.eventSystem.once(event, func);
    }

    onMultiple(events, func) {
        return this.eventSystem.onMultiple(events, func);
    }

    offMultiple(events, func) {
        return this.eventSystem.offMultiple(events, func);
    }

    clear() {
        return this.eventSystem.clear();
    }

    getDebugInfo() {
        return this.eventSystem.getDebugInfo();
    }

    // Audio/Video methods
    setVolume(volume) {
        return this.audioVideoManager.setVolume(volume);
    }

    mute() {
        return this.audioVideoManager.mute();
    }

    unmute() {
        return this.audioVideoManager.unmute();
    }

    getVolume() {
        return this.audioVideoManager.getVolume();
    }

    isMuted() {
        return this.audioVideoManager.isMuted();
    }

    takeScreenshot(source = "canvas", format = "png", upscale = 1) {
        return this.audioVideoManager.takeScreenshot(source, format, upscale);
    }

    startScreenRecording() {
        return this.audioVideoManager.startScreenRecording();
    }

    stopScreenRecording() {
        return this.audioVideoManager.stopScreenRecording();
    }

    screenRecord() {
        return this.audioVideoManager.screenRecord();
    }

    collectScreenRecordingMediaTracks() {
        return this.audioVideoManager.collectScreenRecordingMediaTracks();
    }

    // Game state management methods
    saveSettings() {
        return this.gameStateManager.saveSettings();
    }

    getSettingValue(setting) {
        return this.gameStateManager.getSettingValue(setting);
    }

    setSettingValue(setting, value) {
        return this.gameStateManager.setSettingValue(setting, value);
    }

    getLocalStorageKey() {
        let identifier = (this.config.gameId || 1) + "-" + this.getCore(true);
        if (typeof this.config.gameName === "string") {
            identifier += "-" + this.config.gameName;
        } else if (typeof this.config.gameUrl === "string" && !this.config.gameUrl.toLowerCase().startsWith("blob:")) {
            identifier += "-" + this.config.gameUrl;
        } else if (this.config.gameUrl instanceof File) {
            identifier += "-" + this.config.gameUrl.name;
        }
        return identifier;
    }

    getCoreSettings() {
        return this.gameStateManager.getCoreSettings();
    }

    loadSettings() {
        return this.gameStateManager.loadSettings();
    }

    saveStateToBrowser(state) {
        return this.gameStateManager.saveStateToBrowser(state);
    }

    loadStateFromBrowser() {
        return this.gameStateManager.loadStateFromBrowser();
    }

    // Netplay methods
    createNetplayRoom(playerName = "Player 1") {
        return this.netplayManager.createRoom(playerName);
    }

    joinNetplayRoom(roomId, playerName = "Player 2") {
        return this.netplayManager.joinRoom(roomId, playerName);
    }

    leaveNetplayRoom() {
        return this.netplayManager.leaveRoom();
    }

    getNetplayStatus() {
        return this.netplayManager.getConnectionStatus();
    }

    // Ads methods
    setupAds(ads, width, height) {
        return this.adsMonetization.setupAds(ads, width, height);
    }

    adBlocked(url, del) {
        return this.adsMonetization.adBlocked(url, del);
    }

    checkAdBlock() {
        return this.adsMonetization.checkAdBlock();
    }

    enableAdBlockDetection() {
        return this.adsMonetization.enableAdBlockDetection();
    }

    // Additional UI and utility methods
    buildButtonOptions(buttonUserOpts) {
        let mergedButtonOptions = this.defaultButtonOptions;

        // merge buttonUserOpts with mergedButtonOptions
        if (buttonUserOpts) {
            for (const key in buttonUserOpts) {
                let searchKey = key;
                // If the key is an alias, find the actual key in the default buttons
                if (this.defaultButtonAliases[key]) {
                    // Use the alias to find the actual key
                    // and update the searchKey to the actual key
                    searchKey = this.defaultButtonAliases[key];
                }

                // prevent the contextMenu button from being overridden
                if (searchKey === "contextMenu")
                    continue;

                // Check if the button exists in the default buttons, and update its properties
                if (!mergedButtonOptions[searchKey]) {
                    console.warn(`Button "${searchKey}" is not a valid button.`);
                    continue;
                }

                // if the value is a boolean, set the visible property to the value
                if (typeof buttonUserOpts[searchKey] === "boolean") {
                    mergedButtonOptions[searchKey].visible = buttonUserOpts[searchKey];
                } else if (typeof buttonUserOpts[searchKey] === "object") {
                    // If the value is an object, merge it with the default button properties

                    if (this.defaultButtonOptions[searchKey]) {
                        // copy properties from the button definition if they aren't null
                        for (const prop in buttonUserOpts[searchKey]) {
                            if (buttonUserOpts[searchKey][prop] !== null) {
                                mergedButtonOptions[searchKey][prop] = buttonUserOpts[searchKey][prop];
                            }
                        }
                    } else {
                        // button was not in the default buttons list and is therefore a custom button
                        // verify that the value has a displayName, icon, and callback property
                        if (buttonUserOpts[searchKey].displayName && buttonUserOpts[searchKey].icon && buttonUserOpts[searchKey].callback) {
                            mergedButtonOptions[searchKey] = {
                                visible: true,
                                displayName: buttonUserOpts[searchKey].displayName,
                                icon: buttonUserOpts[searchKey].icon,
                                callback: buttonUserOpts[searchKey].callback,
                                custom: true
                            };
                        } else {
                            console.warn(`Custom button "${searchKey}" is missing required properties`);
                        }
                    }
                } else {
                    // if the value is a string, set the icon property to the value
                    if (typeof buttonUserOpts[searchKey] === "string") {
                        mergedButtonOptions[searchKey].icon = buttonUserOpts[searchKey];
                    } else {
                        // if the value is a function, set the callback property to the value
                        if (typeof buttonUserOpts[searchKey] === "function") {
                            mergedButtonOptions[searchKey].callback = buttonUserOpts[searchKey];
                        }
                    }
                }
            }
        }

        return mergedButtonOptions;
    }

    setElements(element) {
        const game = this.createElement("div");
        const elem = document.querySelector(element);
        elem.innerHTML = "";
        elem.appendChild(game);
        this.game = game;

        this.elements = {
            main: this.game,
            parent: elem
        }
        this.elements.parent.classList.add("ejs_parent");
    }

    setColor(color) {
        if (typeof color !== "string") color = "";
        let getColor = function (color) {
            if (color === "") return "rgb(51, 51, 51)";
            if (color.startsWith("#")) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgb(${r}, ${g}, ${b})`;
            }
            return color;
        };
        this.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
    }

    createStartButton() {
        const button = this.createElement("div");
        button.classList.add("ejs_start_button");
        let border = 0;
        if (typeof this.config.backgroundImg === "string") {
            button.classList.add("ejs_start_button_border");
            border = 1;
        }
        button.innerText = (typeof this.config.startBtnName === "string") ? this.config.startBtnName : this.localization("Start Game");
        if (this.config.alignStartButton == "top") {
            button.style.bottom = "calc(100% - 20px)";
        } else if (this.config.alignStartButton == "center") {
            button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
        }
        this.elements.parent.appendChild(button);
        this.addEventListener(button, "touchstart", () => {
            this.touch = true;
        })
        this.addEventListener(button, "click", this.startButtonClicked.bind(this));
        if (this.config.startOnLoad === true) {
            this.startButtonClicked(button);
        }
        setTimeout(() => {
            this.callEvent("ready");
        }, 20);
        return button;
    }

    startButtonClicked(e) {
        this.callEvent("start-clicked");
        if (e.pointerType === "touch") {
            this.touch = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.textElem = this.createElement("div");
        this.textElem.classList.add("ejs_loading_text");
        if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
        this.textElem.innerText = this.localization("Loading...");
        this.elements.parent.appendChild(this.textElem);
        this.downloadGameCore();
    }

    createText() {
        this.textElem = this.createElement("div");
        this.textElem.classList.add("ejs_loading_text");
        if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
        this.textElem.innerText = this.localization("Loading...");
        this.elements.parent.appendChild(this.textElem);
    }

    displayMessage(message, time) {
        if (!this.msgElem) {
            this.msgElem = this.createElement("div");
            this.msgElem.classList.add("ejs_message");
            this.elements.parent.appendChild(this.msgElem);
        }
        clearTimeout(this.msgTimeout);
        this.msgTimeout = setTimeout(() => {
            this.msgElem.innerText = "";
        }, (typeof time === "number" && time > 0) ? time : 3000)
        this.msgElem.innerText = message;
    }

    downloadGameCore() {
        this.textElem.innerText = this.localization("Download Game Core");
        if (!this.config.threads && this.requiresThreads(this.getCore())) {
            this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
            console.warn("This core requires threads, but EJS_threads is not set!");
            return;
        }
        if (!this.supportsWebgl2 && this.requiresWebGL2(this.getCore())) {
            this.startGameError(this.localization("Outdated graphics driver"));
            return;
        }
        if (this.config.threads && typeof window.SharedArrayBuffer !== "function") {
            this.startGameError(this.localization("Error for site owner") + "\n" + this.localization("Check console"));
            console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
            return;
        }
        const gotCore = (data) => {
            this.defaultCoreOpts = {};
            this.checkCompression(new Uint8Array(data), this.localization("Decompress Game Core")).then((data) => {
                let js, thread, wasm;
                for (let k in data) {
                    if (k.endsWith(".wasm")) {
                        wasm = data[k];
                    } else if (k.endsWith(".worker.js")) {
                        thread = data[k];
                    } else if (k.endsWith(".js")) {
                        js = data[k];
                    } else if (k === "build.json") {
                        this.checkCoreCompatibility(JSON.parse(new TextDecoder().decode(data[k])));
                    } else if (k === "core.json") {
                        let core = JSON.parse(new TextDecoder().decode(data[k]));
                        this.extensions = core.extensions;
                        this.coreName = core.name;
                        this.repository = core.repo;
                        this.defaultCoreOpts = core.options;
                        this.enableMouseLock = core.options.supportsMouse;
                        this.retroarchOpts = core.retroarchOpts;
                        this.saveFileExt = core.save;
                    } else if (k === "license.txt") {
                        this.license = new TextDecoder().decode(data[k]);
                    }
                }

                if (this.saveFileExt === false) {
                    this.elements.bottomBar.saveSavFiles[0].style.display = "none";
                    this.elements.bottomBar.loadSavFiles[0].style.display = "none";
                }
                this.initGameCore(js, wasm, thread);
            });
        }
        const report = "cores/reports/" + this.getCore() + ".json";
        this.downloadFile(report, null, false, { responseType: "text", method: "GET" }).then(async rep => {
            if (rep === -1 || typeof rep === "string" || typeof rep.data === "string") {
                rep = {};
            } else {
                rep = rep.data;
            }
            if (!rep.buildStart) {
                console.warn("Could not fetch core report JSON! Core caching will be disabled!");
                rep.buildStart = Math.random() * 100;
            }
            if (this.webgl2Enabled === null) {
                this.webgl2Enabled = rep.options ? rep.options.defaultWebGL2 : false;
            }
            if (this.requiresWebGL2(this.getCore())) {
                this.webgl2Enabled = true;
            }
            let threads = false;
            if (typeof window.SharedArrayBuffer === "function") {
                const opt = this.preGetSetting("ejs_threads");
                if (opt) {
                    threads = (opt === "enabled");
                } else {
                    threads = this.config.threads;
                }
            }

            let legacy = (this.supportsWebgl2 && this.webgl2Enabled ? "" : "-legacy");
            let filename = this.getCore() + (threads ? "-thread" : "") + legacy + "-wasm.data";
            if (!this.debug) {
                const result = await this.storage.core.get(filename);
                if (result && result.version === rep.buildStart) {
                    gotCore(result.data);
                    return;
                }
            }
            const corePath = "cores/" + filename;
            console.log("File not found, attempting to fetch from emulatorjs cdn.");
            console.error("**THIS METHOD IS A FAILSAFE, AND NOT OFFICIALLY SUPPORTED. USE AT YOUR OWN RISK**");
            let version = this.ejs_version.endsWith("-beta") ? "nightly" : this.ejs_version;
            let res = await this.downloadFile(`https://cdn.emulatorjs.org/${version}/data/${corePath}`, (progress) => {
                this.textElem.innerText = this.localization("Download Game Core") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                if (!this.supportsWebgl2) {
                    this.startGameError(this.localization("Outdated graphics driver"));
                } else {
                    this.startGameError(this.localization("Error downloading core") + " (" + filename + ")");
                }
                return;
            }
            console.warn("File was not found locally, but was found on the emulatorjs cdn.\nIt is recommended to download the stable release from here: https://cdn.emulatorjs.org/releases/");
            gotCore(res.data);
            this.storage.core.put(filename, {
                version: rep.buildStart,
                data: res.data
            });
        });
    }

    startGameError(message) {
        console.log(message);
        this.textElem.innerText = message;
        this.textElem.classList.add("ejs_error_text");
        this.setupSettingsMenu();
        this.gameStateManager.loadSettings();
        this.menu.failedToStart();
        this.handleResize();
        this.failedToStart = true;
    }

    handleResize() {
        // Handle resize logic
    }

    preGetSetting(setting) {
        if (window.localStorage && !this.config.disableLocalStorage) {
            let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (coreSpecific && coreSpecific.settings) {
                    return coreSpecific.settings[setting];
                }
            } catch (e) {
                console.warn("Could not load previous settings", e);
                return null;
            }
        }
        return null;
    }

    setupSettingsMenu() {
        this.settingsMenu = this.createElement("div");
        this.settingsMenu.classList.add("ejs_settings_parent");
        const nested = this.createElement("div");
        nested.classList.add("ejs_settings_transition");
        this.settings = {};
        this.allSettings = {};
        const menus = [];
        let parentMenuCt = 0;

        const createSettingParent = (child, title, parentElement) => {
            const rv = this.createElement("div");
            rv.classList.add("ejs_setting_menu");

            if (child) {
                const menuOption = this.createElement("div");
                menuOption.classList.add("ejs_settings_main_bar");
                const span = this.createElement("span");
                span.innerText = title;

                menuOption.appendChild(span);
            }
        };

        const addToMenu = (text, setting, options, defaultValue, parentElement, restartRequired) => {
            const option = this.createElement("div");
            option.classList.add("ejs_settings_item");
            const label = this.createElement("div");
            label.classList.add("ejs_settings_label");
            label.innerText = this.localization(text);
            option.appendChild(label);
            const select = this.createElement("select");
            select.classList.add("ejs_settings_select");
            if (restartRequired) select.classList.add("ejs_restart_required");
            for (const k in options) {
                const opt = this.createElement("option");
                opt.value = k;
                opt.innerText = this.localization(options[k]);
                if (k === defaultValue) opt.selected = true;
                select.appendChild(opt);
            }
            option.appendChild(select);
            parentElement.appendChild(option);
            this.settings[setting] = defaultValue;
            this.allSettings[setting] = defaultValue;
            select.addEventListener("change", () => {
                this.setSettingValue(setting, select.value);
                if (restartRequired) {
                    select.classList.add("ejs_restart_required");
                }
            });
        };

        const addButton = (text, setting, parentElement, callback) => {
            const button = this.createElement("button");
            button.classList.add("ejs_settings_button");
            button.innerText = this.localization(text);
            button.addEventListener("click", () => {
                if (callback) callback();
            });
            parentElement.appendChild(button);
        };

        const checkForEmptyMenu = (inputOptions) => {
            for (const k in inputOptions) {
                if (inputOptions[k].visible !== false) return false;
            }
            return true;
        };

        const home = createSettingParent(false, "Settings", nested);
        menus.push(home);
        parentMenuCt++;

        // Audio settings
        const audioSettings = createSettingParent(true, "Audio", home);
        addToMenu("Volume", "volume", {}, this.volume, audioSettings, false);

        // Video settings
        const videoSettings = createSettingParent(true, "Video", home);
        addToMenu("WebGL2", "webgl2", {
            "enabled": "Enabled",
            "disabled": "Disabled"
        }, this.webgl2Enabled ? "enabled" : "disabled", videoSettings, true);

        // Input settings
        const inputSettings = createSettingParent(true, "Input", home);
        addToMenu("Virtual Gamepad", "virtual-gamepad", {
            "enabled": "Enabled",
            "disabled": "Disabled"
        }, "enabled", inputSettings, false);

        // Save settings
        if (this.saveInBrowserSupported()) {
            const saveSettings = createSettingParent(true, "Save States", home);
            addToMenu("Save State Slot", "save-state-slot", ["1", "2", "3", "4", "5", "6", "7", "8", "9"], "1", saveSettings, false);
            addToMenu("Save State Location", "save-state-location", {
                "download": "Download",
                "browser": "Keep in Browser"
            }, "download", saveSettings, false);
        }

        // Netplay settings (if enabled)
        if (this.netplayEnabled) {
            const netplaySettings = createSettingParent(true, "Netplay", home);
            addToMenu("Netplay Server", "netplay-server", {}, this.config.netplayUrl, netplaySettings, true);
        }

        if (parentMenuCt === 0) {
            this.on("start", () => {
                this.settingsMenu.style.display = "none";
            });
        }
    }

    updateCheatUI() {
        // Update cheat UI
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

    setupDisksMenu() {
        // Setup disks menu
    }

    updateGamepadLabels() {
        // Update gamepad labels
    }

    createControlSettingMenu() {
        // Create control setting menu
    }

    createCheatsMenu() {
        // Create cheats menu
    }

    createNetplayMenu() {
        // Create netplay menu
    }

    setVirtualGamepad() {
        // Set virtual gamepad
    }

    bindListeners() {
        // Bind event listeners
    }

    closePopup() {
        if (this.currentPopup) {
            this.currentPopup.remove();
            this.currentPopup = null;
        }
    }

    isPopupOpen() {
        return this.cheatMenu && this.cheatMenu.style.display !== "none" ||
               this.netplayMenu && this.netplayMenu.style.display !== "none" ||
               this.controlMenu && this.controlMenu.style.display !== "none" ||
               this.currentPopup !== null;
    }

    isChild(parent, child) {
        if (!parent || !child) return false;
        const adown = parent.nodeType === 9 ? parent.documentElement : parent;
        return parent.compareDocumentPosition && parent.compareDocumentPosition(child) & 16;
    }

    toggleFullscreen(fullscreen) {
        if (fullscreen) {
            if (this.game.requestFullscreen) {
                this.game.requestFullscreen();
            } else if (this.game.webkitRequestFullscreen) {
                this.game.webkitRequestFullscreen();
            } else if (this.game.mozRequestFullScreen) {
                this.game.mozRequestFullScreen();
            } else if (this.game.msRequestFullscreen) {
                this.game.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    openNetplayMenu() {
        console.log("Opening netplay menu");
        // Simplified netplay menu opening
    }

    // Utility functions
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    destory() {
        if (!this.started) return;
        this.callEvent("exit");
    }

    /**
     * Download ROM file
     */
    downloadRom() {
        const supportsExt = (ext) => {
            const core = this.getCore();
            if (!this.extensions) return false;
            return this.extensions.includes(ext);
        };

        return new Promise(resolve => {
            this.textElem.innerText = this.localization("Download Game Data");

            const gotGameData = (data) => {
                if (["arcade", "mame"].includes(this.getCore(true))) {
                    this.fileName = this.getBaseFileName(true);
                    this.gameManager.FS.writeFile(this.fileName, new Uint8Array(data));
                    resolve();
                    return;
                }

                const altName = this.getBaseFileName(true);

                let disableCue = false;
                if (["pcsx_rearmed", "genesis_plus_gx", "picodrive", "mednafen_pce", "smsplus", "vice_x64", "vice_x64sc", "vice_x128", "vice_xvic", "vice_xplus4", "vice_xpet", "puae"].includes(this.getCore()) && this.config.disableCue === undefined) {
                    disableCue = true;
                } else {
                    disableCue = this.config.disableCue;
                }

                let fileNames = [];
                this.checkCompression(new Uint8Array(data), this.localization("Decompress Game Data"), (fileName, fileData) => {
                    if (fileName.includes("/")) {
                        const paths = fileName.split("/");
                        let cp = "";
                        for (let i = 0; i < paths.length - 1; i++) {
                            if (paths[i] === "") continue;
                            cp += `/${paths[i]}`;
                            if (!this.gameManager.FS.analyzePath(cp).exists) {
                                this.gameManager.FS.mkdir(cp);
                            }
                        }
                    }
                    if (fileName.endsWith("/")) {
                        this.gameManager.FS.mkdir(fileName);
                        return;
                    }
                    if (fileName === "!!notCompressedData") {
                        this.gameManager.FS.writeFile(altName, fileData);
                        fileNames.push(altName);
                    } else {
                        this.gameManager.FS.writeFile(`/${fileName}`, fileData);
                        fileNames.push(fileName);
                    }
                }).then(() => {
                    let isoFile = null;
                    let supportedFile = null;
                    let cueFile = null;
                    let selectedCueExt = null;
                    fileNames.forEach(fileName => {
                        const ext = fileName.split(".").pop().toLowerCase();
                        if (supportedFile === null && supportsExt(ext)) {
                            supportedFile = fileName;
                        }
                        if (isoFile === null && ["iso", "cso", "chd", "elf"].includes(ext)) {
                            isoFile = fileName;
                        }
                        if (["cue", "ccd", "toc", "m3u"].includes(ext)) {
                            if (this.getCore(true) === "psx") {
                                if (selectedCueExt !== "m3u") {
                                    if (cueFile === null || ext === "m3u") {
                                        cueFile = fileName;
                                        selectedCueExt = ext;
                                    }
                                }
                            } else {
                                if (!["cue", "ccd"].includes(selectedCueExt)) {
                                    if (cueFile === null || ["cue", "ccd"].includes(ext)) {
                                        cueFile = fileName;
                                        selectedCueExt = ext;
                                    }
                                }
                            }
                        }
                    });
                    if (supportedFile !== null) {
                        this.fileName = supportedFile;
                    } else {
                        this.fileName = fileNames[0];
                    }
                    if (isoFile !== null && (supportsExt("iso") || supportsExt("cso") || supportsExt("chd") || supportsExt("elf"))) {
                        this.fileName = isoFile;
                    } else if (supportsExt("cue") || supportsExt("ccd") || supportsExt("toc") || supportsExt("m3u")) {
                        if (cueFile !== null) {
                            this.fileName = cueFile;
                        } else if (!disableCue) {
                            this.fileName = this.gameManager.createCueFile ? this.gameManager.createCueFile(fileNames) : fileNames[0];
                        }
                    }
                    resolve();
                });
            }
            const downloadFile = async () => {
                const res = await this.downloadFile(this.config.gameUrl, (progress) => {
                    this.textElem.innerText = this.localization("Download Game Data") + progress;
                }, true, { responseType: "arraybuffer", method: "GET" });
                if (res === -1) {
                    this.startGameError(this.localization("Network Error"));
                    return;
                }
                if (this.config.gameUrl instanceof File) {
                    this.config.gameUrl = this.config.gameUrl.name;
                } else if (this.toData(this.config.gameUrl, true)) {
                    this.config.gameUrl = "game";
                }
                gotGameData(res.data);
                const limit = (typeof this.config.cacheLimit === "number") ? this.config.cacheLimit : 1073741824;
                if (parseFloat(res.headers["content-length"]) < limit && this.saveInBrowserSupported() && this.config.gameUrl !== "game") {
                    this.storage.rom.put(this.config.gameUrl, {
                        "content-length": res.headers["content-length"],
                        data: res.data
                    })
                }
            }
            downloadFile();
        });
    }

    /**
     * Download BIOS file
     */
    downloadBios() {
        return new Promise(async resolve => {
            if (!this.config.biosUrl) {
                resolve();
                return;
            }
            this.textElem.innerText = this.localization("Download BIOS");
            const res = await this.downloadFile(this.config.biosUrl, (progress) => {
                this.textElem.innerText = this.localization("Download BIOS") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                this.startGameError(this.localization("Network Error"));
                return;
            }
            const data = new Uint8Array(res.data);
            const fileName = this.config.biosUrl.split("/").pop();
            this.gameManager.FS.writeFile(fileName, data);
            const limit = (typeof this.config.cacheLimit === "number") ? this.config.cacheLimit : 1073741824;
            if (parseFloat(res.headers["content-length"]) < limit && this.saveInBrowserSupported()) {
                this.storage.bios.put(fileName, {
                    "content-length": res.headers["content-length"],
                    data: data
                })
            }
            resolve();
        });
    }

    /**
     * Download start state
     */
    downloadStartState() {
        return new Promise(async resolve => {
            if (!this.config.loadState) {
                resolve();
                return;
            }
            this.textElem.innerText = this.localization("Download Save State");
            const res = await this.downloadFile(this.config.loadState, (progress) => {
                this.textElem.innerText = this.localization("Download Save State") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                this.startGameError(this.localization("Network Error"));
                return;
            }
            const data = new Uint8Array(res.data);
            const fileName = this.config.loadState.split("/").pop();
            this.gameManager.FS.writeFile(fileName, data);
            resolve();
        });
    }

    /**
     * Download game parent
     */
    downloadGameParent() {
        return new Promise(async resolve => {
            if (!this.config.gameParentUrl) {
                resolve();
                return;
            }
            this.textElem.innerText = this.localization("Download Game Parent");
            const res = await this.downloadFile(this.config.gameParentUrl, (progress) => {
                this.textElem.innerText = this.localization("Download Game Parent") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                this.startGameError(this.localization("Network Error"));
                return;
            }
            const data = new Uint8Array(res.data);
            const fileName = this.config.gameParentUrl.split("/").pop();
            this.gameManager.FS.writeFile(fileName, data);
            resolve();
        });
    }

    /**
     * Download game patch
     */
    downloadGamePatch() {
        return new Promise(async resolve => {
            if (!this.config.gamePatchUrl) {
                resolve();
                return;
            }
            this.textElem.innerText = this.localization("Download Game Patch");
            const res = await this.downloadFile(this.config.gamePatchUrl, (progress) => {
                this.textElem.innerText = this.localization("Download Game Patch") + progress;
            }, true, { responseType: "arraybuffer", method: "GET" });
            if (res === -1) {
                this.startGameError(this.localization("Network Error"));
                return;
            }
            const data = new Uint8Array(res.data);
            const fileName = this.config.gamePatchUrl.split("/").pop();
            this.gameManager.FS.writeFile(fileName, data);
            resolve();
        });
    }

    // Initialize default controller variables
    initControlVars() {
        this.defaultControllers = {
            0: {
                0: {
                    "value": "x",
                    "value2": "BUTTON_2"
                },
                1: {
                    "value": "s",
                    "value2": "BUTTON_4"
                },
                2: {
                    "value": "v",
                    "value2": "SELECT"
                },
                3: {
                    "value": "enter",
                    "value2": "START"
                },
                4: {
                    "value": "up arrow",
                    "value2": "DPAD_UP"
                },
                5: {
                    "value": "down arrow",
                    "value2": "DPAD_DOWN"
                },
                6: {
                    "value": "left arrow",
                    "value2": "DPAD_LEFT"
                },
                7: {
                    "value": "right arrow",
                    "value2": "DPAD_RIGHT"
                },
                8: {
                    "value": "z",
                    "value2": "BUTTON_1"
                },
                9: {
                    "value": "a",
                    "value2": "BUTTON_3"
                },
                10: {
                    "value": "q",
                    "value2": "LEFT_TOP_SHOULDER"
                },
                11: {
                    "value": "e",
                    "value2": "RIGHT_TOP_SHOULDER"
                },
                12: {
                    "value": "tab",
                    "value2": "LEFT_BOTTOM_SHOULDER"
                },
                13: {
                    "value": "r",
                    "value2": "RIGHT_BOTTOM_SHOULDER"
                },
                14: {
                    "value": "",
                    "value2": "LEFT_STICK"
                },
                15: {
                    "value": "",
                    "value2": "RIGHT_STICK"
                },
                16: {
                    "value": "h",
                    "value2": "LEFT_STICK_X:+1"
                },
                17: {
                    "value": "f",
                    "value2": "LEFT_STICK_X:-1"
                },
                18: {
                    "value": "g",
                    "value2": "LEFT_STICK_Y:+1"
                },
                19: {
                    "value": "t",
                    "value2": "LEFT_STICK_Y:-1"
                },
                20: {
                    "value": "l",
                    "value2": "RIGHT_STICK_X:+1"
                },
                21: {
                    "value": "j",
                    "value2": "RIGHT_STICK_X:-1"
                },
                22: {
                    "value": "k",
                    "value2": "RIGHT_STICK_Y:+1"
                },
                23: {
                    "value": "i",
                    "value2": "RIGHT_STICK_Y:-1"
                },
                24: {
                    "value": "1"
                },
                25: {
                    "value": "2"
                },
                26: {
                    "value": "3"
                },
                27: {},
                28: {},
                29: {},
            },
            1: {},
            2: {},
            3: {}
        }
        this.keyMap = {
            0: "",
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause/break",
            20: "caps lock",
            27: "escape",
            32: "space",
            33: "page up",
            34: "page down",
            35: "end",
            36: "home",
            37: "left arrow",
            38: "up arrow",
            39: "right arrow",
            40: "down arrow",
            45: "insert",
            46: "delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            91: "left window key",
            92: "right window key",
            93: "select key",
            96: "numpad 0",
            97: "numpad 1",
            98: "numpad 2",
            99: "numpad 3",
            100: "numpad 4",
            101: "numpad 5",
            102: "numpad 6",
            103: "numpad 7",
            104: "numpad 8",
            105: "numpad 9",
            106: "multiply",
            107: "add",
            109: "subtract",
            110: "decimal point",
            111: "divide",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "num lock",
            145: "scroll lock",
            186: "semi-colon",
            187: "equal sign",
            188: "comma",
            189: "dash",
            190: "period",
            191: "forward slash",
            192: "grave accent",
            219: "open bracket",
            220: "back slash",
            221: "close bracket",
            222: "single quote"
        }
    }
}
