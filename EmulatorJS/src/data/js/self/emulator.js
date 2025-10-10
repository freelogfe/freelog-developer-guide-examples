import { isSafari, isMobile, localization, checkCompression, checkCoreCompatibility, getBaseFileName } from "./utils";
import { getCores, downloadGameCore, initGameCore } from "./core";
import { getDefaultControllers, getKeyMap, createContextMenu, defaultButtonOptions, defaultButtonAliases } from "./controller.js"
import { createBottomMenuBar, createControlSettingMenu, createCheatsMenu, createStartButton } from "./ui.js"
import { setVirtualGamepad } from "./virtualGamepad.js"
import { bindListeners, addEventListener, removeEventListener, on, callEvent } from "./event.js"
import { createNetplayMenu } from "./netPlay.js"
import { screenRecord } from "./screenRecord.js"
import { closePopup, createPopup } from "./pop.js"
import { createText, setElements, setColor } from "./baseUI.js"
import { setupAds, adBlocked } from "./ads.js"
import { setupSettingsMenu, loadSettings, getCoreSettings, preGetSetting, saveSettings, getLocalStorageKey } from "./settings.js";
import { downloadFiles, downloadFile, downloadRom, downloadBios, downloadGameParent, downloadGamePatch, downloadGameFile, downloadStartState } from "./download.js"
export class EmulatorJS {

    requiresThreads(core) {
        const requiresThreads = ["ppsspp", "dosbox_pure"];
        return requiresThreads.includes(core);
    }
    requiresWebGL2(core) {
        const requiresWebGL2 = ["ppsspp"];
        return requiresWebGL2.includes(core);
    }
    getCore(generic) {
        const cores = getCores();
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
    createElement(type) {
        return document.createElement(type);
    }


    toData(data, rv) {
        if (!(data instanceof ArrayBuffer) && !(data instanceof Uint8Array) && !(data instanceof Blob)) return null;
        if (rv) return true;
        return new Promise(async (resolve) => {
            if (data instanceof ArrayBuffer) {
                resolve(new Uint8Array(data));
            } else if (data instanceof Uint8Array) {
                resolve(data);
            } else if (data instanceof Blob) {
                resolve(new Uint8Array(await data.arrayBuffer()));
            }
            resolve();
        })
    }

    versionAsInt(ver) {
        if (ver.endsWith("-beta")) {
            return 99999999;
        }
        let rv = ver.split(".");
        if (rv[rv.length - 1].length === 1) {
            rv[rv.length - 1] = "0" + rv[rv.length - 1];
        }
        return parseInt(rv.join(""));
    }
    constructor(element, config) {
        this.defaultControllers = getDefaultControllers();
        this.keyMap = getKeyMap();
        this.addEventListener = addEventListener;
        this.removeEventListener = removeEventListener;
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
        this.getBaseFileName = getBaseFileName.bind(this);
        this.setupSettingsMenu = setupSettingsMenu.bind(this);
        this.loadSettings = loadSettings.bind(this);
        this.getCoreSettings = getCoreSettings.bind(this);
        this.preGetSetting = preGetSetting.bind(this);
        this.getLocalStorageKey = getLocalStorageKey.bind(this);
        this.saveSettings = saveSettings.bind(this);
        this.on = on.bind(this);
        this.callEvent = callEvent.bind(this);
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
        setElements(element, this);
        setColor(this.config.color || "", this);
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
        createContextMenu(this);
        createBottomMenuBar(this);
        createControlSettingMenu(this);
        createCheatsMenu(this);
        createNetplayMenu(this);
        setVirtualGamepad(this);
        bindListeners(this);
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

        createStartButton(this);
        if (this.config.startOnLoad === true) {
            this.startButtonClicked(button);
        }
        setTimeout(() => {
            this.callEvent("ready");
        }, 20);
        this.handleResize();
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
        createText(this);
        this.downloadGameCore();
    }



    startGameError(message) {
        console.log(message);
        this.textElem.innerText = message;
        this.textElem.classList.add("ejs_error_text");

        this.setupSettingsMenu();
        this.loadSettings();

        this.menu.failedToStart();
        this.handleResize();
        this.failedToStart = true;
    }


    saveInBrowserSupported() {
        return !!window.indexedDB && (typeof this.config.gameName === "string" || !this.config.gameUrl.startsWith("blob:"));
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
            this.textElem.remove();
            this.textElem = null;
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
    createLink(elem, link, text, useP) {
        const elm = this.createElement("a");
        elm.href = link;
        elm.target = "_blank";
        elm.innerText = this.localization(text);
        if (useP) {
            const p = this.createElement("p");
            p.appendChild(elm);
            elem.appendChild(p);
        } else {
            elem.appendChild(elm);
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
    isPopupOpen() {
        return this.cheatMenu.style.display !== "none" || this.netplayMenu.style.display !== "none" || this.controlMenu.style.display !== "none" || this.currentPopup !== null;
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
    setupDisksMenu() {
        this.disksMenu = this.createElement("div");
        this.disksMenu.classList.add("ejs_settings_parent");
        const nested = this.createElement("div");
        nested.classList.add("ejs_settings_transition");
        this.disks = {};

        const home = this.createElement("div");
        home.style.overflow = "auto";
        const menus = [];
        this.handleDisksResize = () => {
            let needChange = false;
            if (this.disksMenu.style.display !== "") {
                this.disksMenu.style.opacity = "0";
                this.disksMenu.style.display = "";
                needChange = true;
            }
            let height = this.elements.parent.getBoundingClientRect().height;
            let w2 = this.diskParent.parentElement.getBoundingClientRect().width;
            let disksX = this.diskParent.getBoundingClientRect().x;
            if (w2 > window.innerWidth) disksX += (w2 - window.innerWidth);
            const onTheRight = disksX > (w2 - 15) / 2;
            if (height > 375) height = 375;
            home.style["max-height"] = (height - 95) + "px";
            nested.style["max-height"] = (height - 95) + "px";
            for (let i = 0; i < menus.length; i++) {
                menus[i].style["max-height"] = (height - 95) + "px";
            }
            this.disksMenu.classList.toggle("ejs_settings_center_left", !onTheRight);
            this.disksMenu.classList.toggle("ejs_settings_center_right", onTheRight);
            if (needChange) {
                this.disksMenu.style.display = "none";
                this.disksMenu.style.opacity = "";
            }
        }

        home.classList.add("ejs_setting_menu");
        nested.appendChild(home);
        let funcs = [];
        this.changeDiskOption = (title, newValue) => {
            this.disks[title] = newValue;
            funcs.forEach(e => e(title));
        }
        let allOpts = {};

        // TODO - Why is this duplicated?
        const addToMenu = (title, id, options, defaultOption) => {
            const span = this.createElement("span");
            span.innerText = title;

            const current = this.createElement("div");
            current.innerText = "";
            current.classList.add("ejs_settings_main_bar_selected");
            span.appendChild(current);

            const menu = this.createElement("div");
            menus.push(menu);
            menu.setAttribute("hidden", "");
            menu.classList.add("ejs_parent_option_div");
            const button = this.createElement("button");
            const goToHome = () => {
                const homeSize = this.getElementSize(home);
                nested.style.width = (homeSize.width + 20) + "px";
                nested.style.height = homeSize.height + "px";
                menu.setAttribute("hidden", "");
                home.removeAttribute("hidden");
            }
            this.addEventListener(button, "click", goToHome);

            button.type = "button";
            button.classList.add("ejs_back_button");
            menu.appendChild(button);
            const pageTitle = this.createElement("span");
            pageTitle.innerText = title;
            pageTitle.classList.add("ejs_menu_text_a");
            button.appendChild(pageTitle);

            const optionsMenu = this.createElement("div");
            optionsMenu.classList.add("ejs_setting_menu");

            let buttons = [];
            let opts = options;
            if (Array.isArray(options)) {
                opts = {};
                for (let i = 0; i < options.length; i++) {
                    opts[options[i]] = options[i];
                }
            }
            allOpts[id] = opts;

            funcs.push((title) => {
                if (id !== title) return;
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.toggle("ejs_option_row_selected", buttons[j].getAttribute("ejs_value") === this.disks[id]);
                }
                this.menuOptionChanged(id, this.disks[id]);
                current.innerText = opts[this.disks[id]];
            });

            for (const opt in opts) {
                const optionButton = this.createElement("button");
                buttons.push(optionButton);
                optionButton.setAttribute("ejs_value", opt);
                optionButton.type = "button";
                optionButton.value = opts[opt];
                optionButton.classList.add("ejs_option_row");
                optionButton.classList.add("ejs_button_style");

                this.addEventListener(optionButton, "click", (e) => {
                    this.disks[id] = opt;
                    for (let j = 0; j < buttons.length; j++) {
                        buttons[j].classList.remove("ejs_option_row_selected");
                    }
                    optionButton.classList.add("ejs_option_row_selected");
                    this.menuOptionChanged(id, opt);
                    current.innerText = opts[opt];
                    goToHome();
                })
                if (defaultOption === opt) {
                    optionButton.classList.add("ejs_option_row_selected");
                    this.menuOptionChanged(id, opt);
                    current.innerText = opts[opt];
                }

                const msg = this.createElement("span");
                msg.innerText = opts[opt];
                optionButton.appendChild(msg);

                optionsMenu.appendChild(optionButton);
            }

            home.appendChild(optionsMenu);

            nested.appendChild(menu);
        }

        if (this.gameManager.getDiskCount() > 1) {
            const diskLabels = {};
            let isM3U = false;
            let disks = {};
            if (this.fileName.split(".").pop() === "m3u") {
                disks = this.gameManager.Module.FS.readFile(this.fileName, { encoding: "utf8" }).split("\n");
                isM3U = true;
            }
            for (let i = 0; i < this.gameManager.getDiskCount(); i++) {
                // default if not an m3u loaded rom is "Disk x"
                // if m3u, then use the file name without the extension
                // if m3u, and contains a |, then use the string after the | as the disk label
                if (!isM3U) {
                    diskLabels[i.toString()] = "Disk " + (i + 1);
                } else {
                    // get disk name from m3u
                    const diskLabelValues = disks[i].split("|");
                    // remove the file extension from the disk file name
                    let diskLabel = diskLabelValues[0].replace("." + diskLabelValues[0].split(".").pop(), "");
                    if (diskLabelValues.length >= 2) {
                        // has a label - use that instead
                        diskLabel = diskLabelValues[1];
                    }
                    diskLabels[i.toString()] = diskLabel;
                }
            }
            addToMenu(this.localization("Disk"), "disk", diskLabels, this.gameManager.getCurrentDisk().toString());
        }

        this.disksMenu.appendChild(nested);

        this.diskParent.appendChild(this.disksMenu);
        this.diskParent.style.position = "relative";

        const homeSize = this.getElementSize(home);
        nested.style.width = (homeSize.width + 20) + "px";
        nested.style.height = homeSize.height + "px";

        this.disksMenu.style.display = "none";

        if (this.debug) {
            console.log("Available core options", allOpts);
        }

        if (this.config.defaultOptions) {
            for (const k in this.config.defaultOptions) {
                this.changeDiskOption(k, this.config.defaultOptions[k]);
            }
        }
    }
    getSettingValue(id) {
        return this.allSettings[id] || this.settings[id] || null;
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



    updateCheatUI() {
        if (!this.gameManager) return;
        this.elements.cheatRows.innerHTML = "";

        const addToMenu = (desc, checked, code, is_permanent, i) => {
            const row = this.createElement("div");
            row.classList.add("ejs_cheat_row");
            const input = this.createElement("input");
            input.type = "checkbox";
            input.checked = checked;
            input.value = i;
            input.id = "ejs_cheat_switch_" + i;
            row.appendChild(input);
            const label = this.createElement("label");
            label.for = "ejs_cheat_switch_" + i;
            label.innerText = desc;
            row.appendChild(label);
            label.addEventListener("click", (e) => {
                input.checked = !input.checked;
                this.cheats[i].checked = input.checked;
                this.cheatChanged(input.checked, code, i);
                this.saveSettings();
            })
            if (!is_permanent) {
                const close = this.createElement("a");
                close.classList.add("ejs_cheat_row_button");
                close.innerText = "×";
                row.appendChild(close);
                close.addEventListener("click", (e) => {
                    this.cheatChanged(false, code, i);
                    this.cheats.splice(i, 1);
                    this.updateCheatUI();
                    this.saveSettings();
                })
            }
            this.elements.cheatRows.appendChild(row);
            this.cheatChanged(checked, code, i);
        }
        this.gameManager.resetCheat();
        for (let i = 0; i < this.cheats.length; i++) {
            addToMenu(this.cheats[i].desc, this.cheats[i].checked, this.cheats[i].code, this.cheats[i].is_permanent, i);
        }
    }
    cheatChanged(checked, code, index) {
        if (!this.gameManager) return;
        this.gameManager.setCheat(index, checked, code);
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

    screenshot(callback, source, format, upscale) {
        const imageFormat = format || this.getSettingValue("screenshotFormat") || this.capture.photo.format;
        const imageUpscale = upscale || parseInt(this.getSettingValue("screenshotUpscale") || this.capture.photo.upscale);
        const screenshotSource = source || this.getSettingValue("screenshotSource") || this.capture.photo.source;
        const videoRotation = parseInt(this.getSettingValue("videoRotation") || 0);
        const aspectRatio = this.gameManager.getVideoDimensions("aspect") || 1.333333;
        const gameWidth = this.gameManager.getVideoDimensions("width") || 256;
        const gameHeight = this.gameManager.getVideoDimensions("height") || 224;
        const videoTurned = (videoRotation === 1 || videoRotation === 3);
        let width = this.canvas.width;
        let height = this.canvas.height;
        let scaleHeight = imageUpscale;
        let scaleWidth = imageUpscale;
        let scale = 1;

        if (screenshotSource === "retroarch") {
            if (width >= height) {
                width = height * aspectRatio;
            } else if (width < height) {
                height = width / aspectRatio;
            }
            this.gameManager.screenshot().then(screenshot => {
                const blob = new Blob([screenshot], { type: "image/png" });
                if (imageUpscale === 0) {
                    callback(blob, "png");
                } else if (imageUpscale > 1) {
                    scale = imageUpscale;
                    const img = new Image();
                    const screenshotUrl = URL.createObjectURL(blob);
                    img.src = screenshotUrl;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = width * scale;
                        canvas.height = height * scale;
                        const ctx = canvas.getContext("2d", { alpha: false });
                        ctx.imageSmoothingEnabled = false;
                        ctx.scale(scaleWidth, scaleHeight);
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => {
                            callback(blob, imageFormat);
                            img.remove();
                            URL.revokeObjectURL(screenshotUrl);
                            canvas.remove();
                        }, "image/" + imageFormat, 1);
                    }
                }
            });
        } else if (screenshotSource === "canvas") {
            if (width >= height && !videoTurned) {
                width = height * aspectRatio;
            } else if (width < height && !videoTurned) {
                height = width / aspectRatio;
            } else if (width >= height && videoTurned) {
                width = height * (1 / aspectRatio);
            } else if (width < height && videoTurned) {
                width = height / (1 / aspectRatio);
            }
            if (imageUpscale === 0) {
                scale = gameHeight / height;
                scaleHeight = scale;
                scaleWidth = scale;
            } else if (imageUpscale > 1) {
                scale = imageUpscale;
            }
            const captureCanvas = document.createElement("canvas");
            captureCanvas.width = width * scale;
            captureCanvas.height = height * scale;
            captureCanvas.style.display = "none";
            const captureCtx = captureCanvas.getContext("2d", { alpha: false });
            captureCtx.imageSmoothingEnabled = false;
            captureCtx.scale(scale, scale);
            const imageAspect = this.canvas.width / this.canvas.height;
            const canvasAspect = width / height;
            let offsetX = 0;
            let offsetY = 0;

            if (imageAspect > canvasAspect) {
                offsetX = (this.canvas.width - width) / -2;
            } else if (imageAspect < canvasAspect) {
                offsetY = (this.canvas.height - height) / -2;
            }
            const drawNextFrame = () => {
                captureCtx.drawImage(this.canvas, offsetX, offsetY, this.canvas.width, this.canvas.height);
                captureCanvas.toBlob((blob) => {
                    callback(blob, imageFormat);
                    captureCanvas.remove();
                }, "image/" + imageFormat, 1);
            };
            requestAnimationFrame(drawNextFrame);
        }
    }

    async takeScreenshot(source, format, upscale) {
        return new Promise((resolve) => {
            this.screenshot((blob, format) => {
                resolve({ blob, format });
            }, source, format, upscale);
        });
    }

    collectScreenRecordingMediaTracks(canvasEl, fps) {
        let videoTrack = null;
        const videoTracks = canvasEl.captureStream(fps).getVideoTracks();
        if (videoTracks.length !== 0) {
            videoTrack = videoTracks[0];
        } else {
            console.error("Unable to capture video stream");
            return null;
        }

        let audioTrack = null;
        if (this.Module.AL && this.Module.AL.currentCtx && this.Module.AL.currentCtx.audioCtx) {
            const alContext = this.Module.AL.currentCtx;
            const audioContext = alContext.audioCtx;

            const gainNodes = [];
            for (let sourceIdx in alContext.sources) {
                gainNodes.push(alContext.sources[sourceIdx].gain);
            }

            const merger = audioContext.createChannelMerger(gainNodes.length);
            gainNodes.forEach(node => node.connect(merger));

            const destination = audioContext.createMediaStreamDestination();
            merger.connect(destination);

            const audioTracks = destination.stream.getAudioTracks();
            if (audioTracks.length !== 0) {
                audioTrack = audioTracks[0];
            }
        }

        const stream = new MediaStream();
        if (videoTrack && videoTrack.readyState === "live") {
            stream.addTrack(videoTrack);
        }
        if (audioTrack && audioTrack.readyState === "live") {
            stream.addTrack(audioTrack);
        }
        return stream;
    }

    /**
     * Load a new ROM without destroying the emulator instance
     * @param {string} romPath - Path to the ROM file
     */
    async loadROM(romPath) {
        try {
            // Reset game state
            this.reset();

            // Load new ROM
            const gameData = await this.downloadFile(romPath);
            if (gameData === -1) {
                throw new Error("Failed to download ROM file");
            }

            // Update game manager with new ROM
            if (this.gameManager) {
                this.gameManager.loadROM(romPath);
            }

            console.log("ROM loaded successfully:", romPath);
        } catch (error) {
            console.error("Error loading ROM:", error);
            throw error;
        }
    }

    /**
     * Reset the emulator state
     */
    reset() {
        // Reset internal state variables
        this.started = false;
        this.paused = true;

        // Clear any existing game data if needed
        if (this.gameManager) {
            // Perform any necessary cleanup in the game manager
            if (this.gameManager.reset) {
                this.gameManager.reset();
            }
        }

        console.log("Emulator state reset");
    }
}

window.EmulatorJS = EmulatorJS;